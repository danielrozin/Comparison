/**
 * Stripe Customer Portal for "Manage billing".
 *
 * There is no member login. The page always answers with the same sentence.
 * A one-time link is emailed only when the address is a pro_members row whose
 * Stripe subscription is tagged metadata.app=aversusb or priced with an
 * AversusB price. Canceled and past-due rows are included: the portal is how
 * those customers see invoices or replace a card. The price check is the gate.
 *
 * Tokens are rows in Postgres (`billing_portal_tokens`). Production does not
 * configure Redis, so a Redis key cannot be redeemed.
 *
 * The browser response does not wait for Stripe or for the email. Those run
 * after the response, so a member is not slower than a stranger. This module
 * GETs the subscription and, after the link is redeemed, POSTs a billing
 * portal session for that AversusB customer. It does not create, edit, or
 * archive Products or Prices.
 */

import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { SITE_URL } from "@/lib/utils/constants";
import { BILLING_PORTAL_PATH } from "@/lib/monetization/welcome-email";
import { lookupMember, normalizeMemberEmail, type MemberRecord } from "@/lib/monetization/members";
import { aversusbOwnedPriceIds } from "@/lib/monetization/backfill-pro-members";
import {
  subscriptionBelongsToAversusB,
  type SubscriptionOwnership,
} from "@/lib/monetization/stripe-app";
import { sendOutreachEmail } from "@/lib/services/email";
import {
  BILLING_PORTAL_LINK_LIMIT,
  consumeBillingPortalToken,
  countRecentBillingLinks,
  deleteBillingPortalToken,
  issueBillingPortalToken,
} from "@/lib/monetization/billing-portal-tokens";

export const BILLING_PORTAL_GENERIC_MESSAGE =
  "If we can manage billing for that email, we sent a one-time link. It expires in 15 minutes and works once.";

/**
 * Member and non-member answers both wait at least this long, so a fast
 * database "no" is not obviously faster than a database "yes". Stripe and
 * the email are not part of this wait: they run after the response.
 * Tests set BILLING_PORTAL_MIN_RESPONSE_MS=0.
 */
export const BILLING_PORTAL_RESPONSE_FLOOR_MS = 300;

export type BillingPortalResult =
  | { ok: true; message: string }
  | { ok: false; status: 503; code: "unavailable"; error: string };

export type BillingPortalRedeemResult =
  | { ok: true; url: string }
  | { ok: false; status: 400 | 502 | 503; code: "invalid" | "unavailable" | "stripe_error"; error: string };

const GENERIC: BillingPortalResult = { ok: true, message: BILLING_PORTAL_GENERIC_MESSAGE };

const UNAVAILABLE: BillingPortalResult = {
  ok: false,
  status: 503,
  code: "unavailable",
  error: "We could not look up billing just now. Please try again in a minute.",
};

function responseFloorMs(): number {
  const raw = process.env.BILLING_PORTAL_MIN_RESPONSE_MS;
  if (raw == null || raw === "") return BILLING_PORTAL_RESPONSE_FLOOR_MS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return BILLING_PORTAL_RESPONSE_FLOOR_MS;
  return parsed;
}

async function withResponseFloor<T>(started: number, result: T): Promise<T> {
  const wait = responseFloorMs() - (Date.now() - started);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  return result;
}

const ADDRESS_IN_TEXT = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function scrubAddress(text: string): string {
  const scrubbed = text.replace(ADDRESS_IN_TEXT, "[redacted]");
  return scrubbed.includes("@") ? "details omitted" : scrubbed;
}

function prismaCodeOf(err: unknown): string {
  if (!err || typeof err !== "object" || !("code" in err)) return "";
  const code = (err as { code?: unknown }).code;
  return typeof code === "string" ? code : "";
}

/**
 * The follow-up runs after the HTTP response, so a thrown lock or insert
 * would otherwise vanish. Log and report it without the address: Prisma
 * puts bound parameters on the error, and those must not reach the log.
 */
function reportFollowUpFailure(err: unknown): void {
  const code = prismaCodeOf(err);
  const detail = scrubAddress(err instanceof Error ? err.message : "unknown error").slice(0, 300);
  console.error(`[billing-portal] follow-up failed${code ? ` code=${code}` : ""}: ${detail}`);
  const reported = new Error(`[billing-portal] follow-up failed${code ? ` code=${code}` : ""}`);
  Sentry.captureException(reported, {
    tags: { area: "billing-portal" },
    extra: code ? { prismaCode: code } : undefined,
  });
}

/**
 * Schedule work that must not change how long the HTTP response takes.
 * Inside a Next.js request, `after` runs once the response is flushed.
 * Unit tests have no request store, so the work runs before this returns
 * and the tests can see the email.
 */
async function runAfterResponse(task: () => Promise<void>): Promise<void> {
  const guarded = () =>
    task().catch((err) => {
      reportFollowUpFailure(err);
    });
  try {
    after(guarded);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("outside a request scope")) throw err;
    await guarded();
  }
}

function ownedPrices(): Set<string> {
  return new Set(aversusbOwnedPriceIds().keys());
}

interface StripeSubscription extends SubscriptionOwnership {
  customer?: string | { id?: string } | null;
}

function customerIdOf(customer: StripeSubscription["customer"]): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer.trim() || null;
  return customer.id?.trim() || null;
}

/** GET the subscription. null when Stripe does not confirm it. */
async function readSubscription(subscriptionId: string, secret: string): Promise<StripeSubscription | null> {
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
      { method: "GET", headers: { Authorization: `Bearer ${secret}` } }
    );
    if (!res.ok) return null;
    return (await res.json()) as StripeSubscription;
  } catch (err) {
    console.error("[billing-portal] subscription lookup failed:", err);
    return null;
  }
}

function subscriptionIsOurs(subscription: StripeSubscription, storedCustomer: string): boolean {
  if (!subscriptionBelongsToAversusB(subscription, ownedPrices())) return false;
  const customer = customerIdOf(subscription.customer);
  if (customer && storedCustomer && customer !== storedCustomer) return false;
  return true;
}

/** Any stored member with a Stripe identity. Status is not the gate. */
function memberHasBillingIdentity(member: MemberRecord): boolean {
  return Boolean(member.stripeCustomer && member.stripeSubscription);
}

async function subscriptionIsAversusB(member: MemberRecord): Promise<boolean> {
  const secret = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secret) {
    console.error("[billing-portal] STRIPE_SECRET_KEY is not set");
    return false;
  }
  const subscription = await readSubscription(member.stripeSubscription, secret);
  if (!subscription) return false;
  return subscriptionIsOurs(subscription, member.stripeCustomer);
}

async function sendBillingLink(email: string, stripeCustomerId: string): Promise<void> {
  const issued = await issueBillingPortalToken(email, stripeCustomerId);
  if (!issued) {
    console.info("[billing-portal] link rate limit");
    return;
  }
  const link = `${SITE_URL}/api/billing-portal/redeem?token=${encodeURIComponent(issued.raw)}`;
  const text = [
    "Use this one-time link to update your card, see invoices, or cancel A Versus B.",
    "It expires in 15 minutes and works once.",
    "",
    link,
    "",
    "If you did not ask for this, you can ignore this email.",
  ].join("\n");
  const result = await sendOutreachEmail({
    to: email,
    subject: "Manage your A Versus B billing",
    text,
    html: `<p>Use this one-time link to update your card, see invoices, or cancel A Versus B. It expires in 15 minutes and works once.</p><p><a href="${link}">Manage billing</a></p><p>If you did not ask for this, you can ignore this email.</p>`,
    tags: [{ name: "type", value: "billing_portal" }],
  });
  if (!result.success) {
    console.error("[billing-portal] link email failed:", result.error ?? "unknown");
    await deleteBillingPortalToken(issued.raw);
  }
}

async function deliverBillingLink(email: string, member: MemberRecord): Promise<void> {
  if (!(await subscriptionIsAversusB(member))) return;
  await sendBillingLink(email, member.stripeCustomer);
}

export async function startBillingPortal(emailRaw: string): Promise<BillingPortalResult> {
  const started = Date.now();
  const email = normalizeMemberEmail(emailRaw);
  if (!email) return withResponseFloor(started, GENERIC);

  const lookup = await lookupMember(email);
  if (!lookup.available) return withResponseFloor(started, UNAVAILABLE);

  // Same token-table read for members and strangers, before the response.
  let recent = 0;
  try {
    recent = await countRecentBillingLinks(email);
  } catch (err) {
    console.error("[billing-portal] link count failed:", err);
    return withResponseFloor(started, UNAVAILABLE);
  }

  const member = lookup.member;
  if (member && memberHasBillingIdentity(member) && recent < BILLING_PORTAL_LINK_LIMIT) {
    // Stripe and the email happen after the response so they cannot make
    // a member slower than a stranger.
    await runAfterResponse(() => deliverBillingLink(email, member));
  } else if (member && memberHasBillingIdentity(member)) {
    console.info("[billing-portal] link rate limit");
  }

  return withResponseFloor(started, GENERIC);
}

async function createPortalSession(customerId: string, secret: string): Promise<string | null> {
  const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: customerId,
      return_url: `${SITE_URL}${BILLING_PORTAL_PATH}`,
    }),
  });
  const session = (await res.json()) as { url?: string };
  if (!res.ok || !session.url) return null;
  return session.url;
}

/** Consume a one-time token and open the portal. The token is not reusable. */
export async function redeemBillingPortal(tokenRaw: string): Promise<BillingPortalRedeemResult> {
  const token = tokenRaw.trim();
  if (!token || token.length > 200) {
    return { ok: false, status: 400, code: "invalid", error: "This link is invalid or has expired." };
  }

  let consumed;
  try {
    consumed = await consumeBillingPortalToken(token);
  } catch (err) {
    console.error("[billing-portal] token consume failed:", err);
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "Billing management is not available just now. Request a new link in a minute.",
    };
  }
  if (!consumed) {
    return { ok: false, status: 400, code: "invalid", error: "This link is invalid or has expired." };
  }

  const lookup = await lookupMember(consumed.email);
  if (!lookup.available) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not look up billing just now. Request a new link in a minute.",
    };
  }
  if (
    !lookup.member ||
    !memberHasBillingIdentity(lookup.member) ||
    lookup.member.stripeCustomer !== consumed.stripeCustomerId ||
    !(await subscriptionIsAversusB(lookup.member))
  ) {
    return { ok: false, status: 400, code: "invalid", error: "This link is invalid or has expired." };
  }

  const secret = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secret) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "Billing management is not connected yet. Reply to your welcome email and a founder will help.",
    };
  }

  try {
    const url = await createPortalSession(consumed.stripeCustomerId, secret);
    if (!url) {
      return {
        ok: false,
        status: 502,
        code: "stripe_error",
        error: "Stripe could not open the billing page. Request a new link in a minute.",
      };
    }
    return { ok: true, url };
  } catch (err) {
    console.error("[billing-portal] session create failed:", err);
    return {
      ok: false,
      status: 502,
      code: "stripe_error",
      error: "Stripe could not open the billing page. Request a new link in a minute.",
    };
  }
}

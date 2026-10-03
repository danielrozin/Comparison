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
 * This module GETs the subscription and, after the link is redeemed, POSTs a
 * billing portal session for that AversusB customer. It does not create,
 * edit, or archive Products or Prices.
 */

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
 * "no" is not obviously faster than a Stripe lookup. Tests set
 * BILLING_PORTAL_MIN_RESPONSE_MS=0.
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

export async function startBillingPortal(emailRaw: string): Promise<BillingPortalResult> {
  const started = Date.now();
  const email = normalizeMemberEmail(emailRaw);
  if (!email) return withResponseFloor(started, GENERIC);

  const lookup = await lookupMember(email);
  if (!lookup.available) return withResponseFloor(started, UNAVAILABLE);

  // Same token-table read for members and strangers, before any Stripe call.
  let recent = 0;
  try {
    recent = await countRecentBillingLinks(email);
  } catch (err) {
    console.error("[billing-portal] link count failed:", err);
    return withResponseFloor(started, UNAVAILABLE);
  }

  if (!lookup.member || !memberHasBillingIdentity(lookup.member)) {
    return withResponseFloor(started, GENERIC);
  }
  if (recent >= BILLING_PORTAL_LINK_LIMIT) {
    console.info("[billing-portal] link rate limit");
    return withResponseFloor(started, GENERIC);
  }
  if (!(await subscriptionIsAversusB(lookup.member))) {
    return withResponseFloor(started, GENERIC);
  }

  try {
    await sendBillingLink(email, lookup.member.stripeCustomer);
  } catch (err) {
    console.error("[billing-portal] could not send link:", err);
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

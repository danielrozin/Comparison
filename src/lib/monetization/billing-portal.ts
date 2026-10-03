/**
 * Stripe Customer Portal for "Manage billing".
 *
 * There is no member login. The page used to take an email and return a
 * portal URL, which let anyone who knew a customer email open that
 * customer's portal on the shared Stripe account. The page now always
 * answers with the same sentence. Only an active AversusB member, whose
 * Stripe subscription is tagged metadata.app=aversusb or priced with an
 * AversusB price, is emailed a one-time link. That link is what creates
 * the portal session.
 *
 * This module only GETs the subscription and, after the link is redeemed,
 * POSTs a billing portal session for that AversusB customer. It does not
 * create, edit, or archive Products or Prices.
 */

import crypto from "node:crypto";
import { SITE_URL } from "@/lib/utils/constants";
import { BILLING_PORTAL_PATH } from "@/lib/monetization/welcome-email";
import { lookupMember, normalizeMemberEmail, type MemberRecord } from "@/lib/monetization/members";
import { aversusbOwnedPriceIds } from "@/lib/monetization/backfill-pro-members";
import {
  subscriptionBelongsToAversusB,
  type SubscriptionOwnership,
} from "@/lib/monetization/stripe-app";
import { getRedis } from "@/lib/services/redis";
import { sendOutreachEmail } from "@/lib/services/email";

export const BILLING_PORTAL_GENERIC_MESSAGE =
  "If that email has an active AversusB membership, we sent a one-time link to manage billing. The link expires in 15 minutes and works once.";

const LINK_TTL_SECONDS = 15 * 60;

export type BillingPortalResult =
  | { ok: true; message: string }
  | { ok: false; status: 503; code: "unavailable"; error: string };

export type BillingPortalRedeemResult =
  | { ok: true; url: string }
  | { ok: false; status: 400 | 502 | 503; code: "invalid" | "unavailable" | "stripe_error"; error: string };

const GENERIC: BillingPortalResult = { ok: true, message: BILLING_PORTAL_GENERIC_MESSAGE };

function tokenKey(token: string): string {
  return `monetization:billing-portal-token:${token}`;
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

async function memberMayOpenPortal(member: MemberRecord): Promise<boolean> {
  if (!member.active || !member.stripeCustomer || !member.stripeSubscription) return false;
  const secret = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secret) {
    console.error("[billing-portal] STRIPE_SECRET_KEY is not set");
    return false;
  }
  const subscription = await readSubscription(member.stripeSubscription, secret);
  if (!subscription) return false;
  return subscriptionIsOurs(subscription, member.stripeCustomer);
}

async function issueBillingLink(email: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    console.error("[billing-portal] redis unavailable; not issuing a link");
    return;
  }
  const token = crypto.randomBytes(32).toString("base64url");
  const key = tokenKey(token);
  await redis.set(key, email, { ex: LINK_TTL_SECONDS });
  const link = `${SITE_URL}/api/billing-portal/redeem?token=${encodeURIComponent(token)}`;
  const text = [
    "Use this one-time link to update your card or cancel A Versus B.",
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
    html: `<p>Use this one-time link to update your card or cancel A Versus B. It expires in 15 minutes and works once.</p><p><a href="${link}">Manage billing</a></p><p>If you did not ask for this, you can ignore this email.</p>`,
    tags: [{ name: "type", value: "billing_portal" }],
  });
  if (!result.success) {
    console.error("[billing-portal] link email failed:", result.error ?? "unknown");
    try {
      await redis.del(key);
    } catch {
      // The token expires on its own. The HTTP response stays generic.
    }
  }
}

export async function startBillingPortal(emailRaw: string): Promise<BillingPortalResult> {
  const email = normalizeMemberEmail(emailRaw);
  if (!email) return GENERIC;

  const lookup = await lookupMember(email);
  if (!lookup.available) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not look up billing just now. Please try again in a minute.",
    };
  }
  if (!lookup.member || !(await memberMayOpenPortal(lookup.member))) {
    return GENERIC;
  }

  try {
    await issueBillingLink(email);
  } catch (err) {
    console.error("[billing-portal] could not send link:", err);
  }
  return GENERIC;
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
  const redis = getRedis();
  if (!redis) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "Billing management is not available just now. Request a new link in a minute.",
    };
  }

  const key = tokenKey(token);
  const stored = await redis.get<string>(key);
  const email = typeof stored === "string" ? normalizeMemberEmail(stored) : null;
  if (!email) {
    return { ok: false, status: 400, code: "invalid", error: "This link is invalid or has expired." };
  }
  // One-time: drop the token before calling Stripe so a second click cannot reuse it.
  await redis.del(key);

  const lookup = await lookupMember(email);
  if (!lookup.available) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not look up billing just now. Request a new link in a minute.",
    };
  }
  if (!lookup.member || !(await memberMayOpenPortal(lookup.member))) {
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
    const url = await createPortalSession(lookup.member.stripeCustomer, secret);
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

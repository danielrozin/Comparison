/**
 * Stripe Customer Portal session for "Manage billing" (ROO-49).
 *
 * The welcome email links to /account/billing, which calls this. The portal
 * URL Stripe returns is short-lived, so we create it when the member clicks,
 * not inside the email.
 *
 * This only opens a portal session for an AversusB customer id already stored
 * on the membership hash. It does not create, edit, or archive Products or
 * Prices (the Stripe account is shared with Scan2Remember).
 */

import { SITE_URL } from "@/lib/utils/constants";
import { BILLING_PORTAL_PATH } from "@/lib/monetization/welcome-email";
import { lookupMember, normalizeMemberEmail } from "@/lib/monetization/members";

export type BillingPortalResult =
  | { ok: true; url: string }
  | {
      ok: false;
      status: 400 | 403 | 502 | 503;
      code: "invalid" | "upgrade_required" | "unavailable" | "stripe_error";
      error: string;
      upgradeUrl?: string;
    };

export async function startBillingPortal(emailRaw: string): Promise<BillingPortalResult> {
  const email = normalizeMemberEmail(emailRaw);
  if (!email) {
    return { ok: false, status: 400, code: "invalid", error: "Enter the email you used at checkout." };
  }

  const lookup = await lookupMember(email);
  if (!lookup.available) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not look up that membership just now. Please try again in a minute.",
    };
  }
  if (!lookup.member?.stripeCustomer) {
    return {
      ok: false,
      status: 403,
      code: "upgrade_required",
      error: "No paid membership is on file for that email. Custom comparisons and billing management start on the pricing page.",
      upgradeUrl: "/pricing?src=billing",
    };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "Billing management is not connected yet. Reply to your welcome email and a founder will help.",
    };
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: lookup.member.stripeCustomer,
        return_url: `${SITE_URL}${BILLING_PORTAL_PATH}`,
      }),
    });
    const session = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !session.url) {
      return {
        ok: false,
        status: 502,
        code: "stripe_error",
        error: session.error?.message || "Stripe could not open the billing page. Reply to your welcome email and a founder will help.",
      };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("[billing-portal] session create failed:", err);
    return {
      ok: false,
      status: 502,
      code: "stripe_error",
      error: "Stripe could not open the billing page. Reply to your welcome email and a founder will help.",
    };
  }
}

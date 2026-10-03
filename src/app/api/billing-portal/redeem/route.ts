import { NextRequest, NextResponse } from "next/server";
import { redeemBillingPortal } from "@/lib/monetization/billing-portal";
import { SITE_URL } from "@/lib/utils/constants";
import { BILLING_PORTAL_PATH } from "@/lib/monetization/welcome-email";

/**
 * GET /api/billing-portal/redeem?token=...
 *
 * The one-time link from the billing email. A valid token redirects to a
 * fresh Stripe Customer Portal session. Anything else returns to the
 * billing page without creating a portal session.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const result = await redeemBillingPortal(token);
  if (result.ok) {
    return NextResponse.redirect(result.url);
  }
  const back = new URL(BILLING_PORTAL_PATH, SITE_URL);
  back.searchParams.set("link", result.status === 400 ? "invalid" : "unavailable");
  return NextResponse.redirect(back);
}

import { NextRequest, NextResponse } from "next/server";
import { lookupMember, normalizeMemberEmail } from "@/lib/monetization/members";

/**
 * GET /api/admin/membership?email=buyer@example.com
 *
 * Founder / ops check of a paid plan (ROO-42). O(1) read of Redis hash
 * `monetization:member:{email}`, written by POST /api/stripe/webhook.
 *
 * No user login. Same secrets the rest of ops already uses:
 *   Authorization: Bearer $ADMIN_TOKEN
 *   Authorization: Bearer $CRON_SECRET
 *   x-admin-token: $ADMIN_TOKEN
 *
 * `active` is true only for Stripe status `active` or `trialing`.
 * `customer.subscription.deleted` sets status `canceled` and active false,
 * which is the revoke. A missing email is `{ found: false, active: false }`
 * — that is "not a member", not an error.
 *
 *   curl -H "Authorization: Bearer $ADMIN_TOKEN" \
 *     "https://aversusb.net/api/admin/membership?email=buyer@example.com"
 *
 * The append-only list `monetization:members` is still LPUSH'd on checkout
 * for the purchase log. Do not use it for this check; this route is the lookup.
 */

function configuredSecrets(): string[] {
  return [process.env.ADMIN_TOKEN, process.env.CRON_SECRET].filter(
    (value): value is string => Boolean(value)
  );
}

function isAuthorized(request: NextRequest): boolean {
  const secrets = configuredSecrets();
  if (secrets.length === 0) return false;

  const headerToken = request.headers.get("x-admin-token")?.trim() ?? "";
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  const presented = headerToken || bearer;
  if (!presented) return false;
  return secrets.includes(presented);
}

export async function GET(request: NextRequest) {
  if (configuredSecrets().length === 0) {
    return NextResponse.json({ error: "Membership lookup not configured" }, { status: 503 });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawEmail = request.nextUrl.searchParams.get("email")?.trim() ?? "";
  if (!rawEmail) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  const email = normalizeMemberEmail(rawEmail);
  if (!email) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  try {
    const result = await lookupMember(email);
    if (!result.available) {
      return NextResponse.json({ error: "Membership store unavailable" }, { status: 503 });
    }
    if (!result.member) {
      return NextResponse.json({
        email,
        found: false,
        active: false,
        plan: null,
      });
    }

    const member = result.member;
    return NextResponse.json({
      email: member.email,
      found: true,
      active: member.active,
      plan: member.plan,
      interval: member.interval,
      status: member.status,
      stripeCustomer: member.stripeCustomer,
      stripeSubscription: member.stripeSubscription,
      updatedAt: member.updatedAt,
      src: member.src || null,
    });
  } catch (err) {
    console.error("[membership] lookup failed:", err);
    return NextResponse.json({ error: "Membership store unavailable" }, { status: 503 });
  }
}

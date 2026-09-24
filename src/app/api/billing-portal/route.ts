import { NextRequest, NextResponse } from "next/server";
import { startBillingPortal } from "@/lib/monetization/billing-portal";

/**
 * POST /api/billing-portal
 *
 * Body: { email }
 * Active or canceled members with a Stripe customer id get a Customer Portal
 * URL. Unknown emails get upgradeUrl `/pricing?src=billing`.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid", error: "Invalid request body" },
      { status: 400 }
    );
  }

  const result = await startBillingPortal(body.email ?? "");
  return NextResponse.json(result, { status: result.ok ? 200 : result.status });
}

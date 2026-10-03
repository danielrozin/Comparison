import { NextRequest, NextResponse } from "next/server";
import { startBillingPortal } from "@/lib/monetization/billing-portal";

/**
 * POST /api/billing-portal
 *
 * Body: { email }
 * Always returns the same message for a known member, an unknown email, and
 * a member whose Stripe subscription is not AversusB. The portal URL is not
 * in this response. Active AversusB members get a one-time link by email.
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

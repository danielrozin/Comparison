import { NextResponse } from "next/server";

/**
 * POST /api/v1/stripe/webhook
 *
 * Gone. No Stripe webhook endpoint points here. The previous handler skipped
 * signature verification and could still write `api_keys` rows for any
 * subscription on the shared Stripe account. Returning 410 makes the route
 * inert: the body is not read, and nothing is written.
 */
export async function POST() {
  return NextResponse.json(
    { error: "This webhook endpoint is no longer available." },
    { status: 410 }
  );
}

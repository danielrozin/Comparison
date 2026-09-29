import { NextRequest, NextResponse } from "next/server";
import { configuredAdminSecrets, isAdminAuthorized } from "@/lib/monetization/admin-auth";
import { backfillProMembers } from "@/lib/monetization/backfill-pro-members";

/**
 * POST /api/admin/membership/backfill?dryRun=true
 *
 * Lists completed Stripe Checkout sessions since 2026-09-20 whose price is
 * an AversusB Pro price, and upserts `pro_members`. Defaults to dry-run.
 * Pass `dryRun=false` to write. Stripe is read with GET only.
 *
 *   curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
 *     "https://aversusb.net/api/admin/membership/backfill?dryRun=true"
 */

function dryRunFrom(request: NextRequest): boolean {
  const value = request.nextUrl.searchParams.get("dryRun");
  if (value === "false" || value === "0") return false;
  return true;
}

export async function POST(request: NextRequest) {
  if (configuredAdminSecrets().length === 0) {
    return NextResponse.json({ error: "Membership backfill not configured" }, { status: 503 });
  }
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await backfillProMembers({ dryRun: dryRunFrom(request) });
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}

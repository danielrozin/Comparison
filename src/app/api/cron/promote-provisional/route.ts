import { NextRequest, NextResponse } from "next/server";
import {
  executePromotionRecheck,
  isPromotionRecheckEnabled,
} from "@/lib/generation/promotion-recheck";

export const maxDuration = 120;
export const runtime = "nodejs";

/**
 * GET /api/cron/promote-provisional
 *
 * Every few hours, recheck a small batch of provisional visitor comparisons.
 * Pages that pass the existing quality bar become published (indexable, in
 * the sitemap). Pages that still fail stay noindex, and each slug stops
 * after PROMOTION_RECHECK_MAX_ATTEMPTS (default 5).
 *
 * Auth matches the other crons: Authorization: Bearer $CRON_SECRET when that
 * variable is set. Vercel sends the header for crons automatically.
 *
 * This route does not read GENERATION_FREEZE. The discovery and auto-generate
 * crons stay frozen. Set PROMOTION_RECHECK_ENABLED=true to run this job.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isPromotionRecheckEnabled()) {
    return NextResponse.json({
      status: "disabled",
      reason: "PROMOTION_RECHECK_ENABLED is not true",
    });
  }

  const report = await executePromotionRecheck();
  return NextResponse.json({ status: "ok", ...report });
}

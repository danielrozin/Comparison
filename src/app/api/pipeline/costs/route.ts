import { NextRequest, NextResponse } from "next/server";
import {
  getPipelineMetrics,
  calculateCostProjection,
} from "@/lib/services/api-cost-tracker";

/**
 * GET /api/pipeline/costs
 * Returns API cost data, rate limit statuses, projections, and quality scores.
 *
 * Query params:
 *   ?days=30       — number of daily summaries to return
 *   ?target=50     — custom projection target (comparisons/day)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await getPipelineMetrics();

    // Custom projection target
    const targetParam = request.nextUrl.searchParams.get("target");
    let customProjection = null;
    if (targetParam) {
      const target = parseInt(targetParam, 10);
      if (target > 0 && target <= 1000) {
        customProjection = calculateCostProjection(target);
      }
    }

    return NextResponse.json({
      ...metrics,
      customProjection,
    });
  } catch (error) {
    console.error("Pipeline costs error:", error);
    return NextResponse.json(
      { error: "Failed to get pipeline costs" },
      { status: 500 }
    );
  }
}

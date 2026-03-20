import { NextRequest, NextResponse } from "next/server";
import {
  analyzeGSCOpportunities,
  getGSCStats,
  type GSCOpportunity,
} from "@/lib/services/gsc-service";

/**
 * GET /api/gsc/queries?days=28&type=comparison|blog|all
 * Returns GSC query data with opportunity analysis.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const typeFilter = request.nextUrl.searchParams.get("type") || "all";

  try {
    const [opportunities, stats] = await Promise.all([
      analyzeGSCOpportunities(),
      getGSCStats(),
    ]);

    let filtered: GSCOpportunity[] = opportunities;
    if (typeFilter === "comparison") {
      filtered = opportunities.filter((o) => o.type === "comparison");
    } else if (typeFilter === "blog") {
      filtered = opportunities.filter((o) => o.type === "blog");
    }

    return NextResponse.json({
      queries: filtered,
      stats,
      filter: typeFilter,
      total: filtered.length,
    });
  } catch (err) {
    console.error("GSC queries endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to fetch GSC data" },
      { status: 500 }
    );
  }
}

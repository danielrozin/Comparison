import { NextRequest, NextResponse } from "next/server";
import { getStoredOpportunities } from "@/lib/services/pipeline-service";

/**
 * GET /api/pipeline/opportunities?limit=50&sort=score
 * Returns stored keyword opportunities from Redis.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const sort = searchParams.get("sort") || "score";

    let opportunities = await getStoredOpportunities();

    // Sort
    if (sort === "volume") {
      opportunities.sort((a, b) => b.searchVolume - a.searchVolume);
    } else {
      // Default: sort by opportunityScore
      opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
    }

    // Limit
    opportunities = opportunities.slice(0, limit);

    return NextResponse.json({
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error("Pipeline opportunities error:", error);
    return NextResponse.json(
      { error: "Failed to get opportunities" },
      { status: 500 }
    );
  }
}

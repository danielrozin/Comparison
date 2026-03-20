import { NextRequest, NextResponse } from "next/server";
import { getApifyRunStatus } from "@/lib/services/apify-service";
import { getRedis } from "@/lib/services/redis";
import type { ScrapedComparison } from "@/lib/services/apify-service";

/**
 * GET /api/scraper/results?runId=xxx
 * Returns the status and results for a scraping run.
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

  const runId = request.nextUrl.searchParams.get("runId");
  if (!runId) {
    return NextResponse.json(
      { error: "runId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Check if results are cached in Redis
    const redis = getRedis();
    if (redis) {
      const cached = await redis.get(`scraper:results:${runId}`);
      if (cached) {
        const comparisons =
          typeof cached === "string"
            ? (JSON.parse(cached) as ScrapedComparison[])
            : (cached as ScrapedComparison[]);
        return NextResponse.json({
          status: "completed",
          comparisons,
          gaps: comparisons.length,
        });
      }
    }

    // Simple runs (already completed) won't be in Apify
    if (runId.startsWith("simple-")) {
      return NextResponse.json({
        status: "completed",
        comparisons: [],
        gaps: 0,
        message: "Results expired or not found in cache.",
      });
    }

    // Poll Apify for run status
    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: "APIFY_API_TOKEN is not configured" },
        { status: 400 }
      );
    }

    const result = await getApifyRunStatus(runId);

    if (result.status === "SUCCEEDED" && result.items) {
      return NextResponse.json({
        status: "completed",
        comparisons: result.items,
        gaps: Array.isArray(result.items) ? result.items.length : 0,
      });
    }

    return NextResponse.json({
      status: result.status === "RUNNING" || result.status === "READY" ? "running" : result.status.toLowerCase(),
      comparisons: [],
      gaps: 0,
    });
  } catch (error) {
    console.error("[scraper/results] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get results",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

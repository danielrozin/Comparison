export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { discoverByCategory, discoverFromCompetitors, CATEGORY_SEEDS } from "@/lib/dataforseo/keyword-discovery";

/**
 * GET /api/cron/daily-discovery
 *
 * Daily cron job that:
 * 1. Discovers new keywords from each category
 * 2. Scans competitors for new opportunities
 * 3. Stores discovered keywords in the database
 * 4. Creates content briefs for high-scoring opportunities
 *
 * In production, trigger via Vercel Cron or external scheduler.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startTime = Date.now();
  const results: Record<string, number> = {};

  try {
    // 1. Discover by each category
    const categories = Object.keys(CATEGORY_SEEDS);
    for (const category of categories) {
      try {
        const opportunities = await discoverByCategory(category);
        results[`category_${category}`] = opportunities.length;

        // TODO: Store in database via Prisma
        // await storeKeywordOpportunities(opportunities);
      } catch (err) {
        console.error(`Category discovery failed for ${category}:`, err);
        results[`category_${category}`] = -1;
      }
    }

    // 2. Scan competitors
    try {
      const competitorResults = await discoverFromCompetitors();
      results.competitors = competitorResults.length;

      // TODO: Store in database
      // await storeKeywordOpportunities(competitorResults);
    } catch (err) {
      console.error("Competitor discovery failed:", err);
      results.competitors = -1;
    }

    const duration = Date.now() - startTime;

    // TODO: Log job result to refresh_jobs table
    // await prisma.refreshJob.create({ ... });

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Daily discovery failed", message: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

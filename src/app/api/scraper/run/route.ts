import { NextRequest, NextResponse } from "next/server";
import {
  startScrape,
  scrapeSimple,
  findContentGaps,
} from "@/lib/services/apify-service";
import { getRedis } from "@/lib/services/redis";

/**
 * POST /api/scraper/run
 * Body: { domain: string, mode: "sitemap" | "listing", simple?: boolean }
 *
 * If simple=true, uses direct fetch (no Apify). Otherwise starts an Apify run.
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { domain, mode = "sitemap", simple = false } = body as {
      domain?: string;
      mode?: "sitemap" | "listing";
      simple?: boolean;
    };

    if (!domain) {
      return NextResponse.json(
        { error: "domain is required" },
        { status: 400 }
      );
    }

    // Simple mode: scrape directly without Apify
    if (simple) {
      const comparisons = await scrapeSimple(domain);
      const gaps = await findContentGaps(comparisons);

      const redis = getRedis();
      const runId = `simple-${Date.now()}`;
      if (redis) {
        await redis.set(
          `scraper:results:${runId}`,
          JSON.stringify(comparisons),
          { ex: 86400 * 7 }
        );
      }

      return NextResponse.json({
        runId,
        status: "completed",
        totalComparisons: comparisons.length,
        gaps: gaps.length,
        comparisons,
      });
    }

    // Apify mode: start async run
    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: "APIFY_API_TOKEN is not configured. Use simple=true for basic scraping." },
        { status: 400 }
      );
    }

    const runId = await startScrape(domain, mode);

    return NextResponse.json({
      runId,
      status: "started",
      message: `Apify scrape started for ${domain}. Poll /api/scraper/results?runId=${runId} for results.`,
    });
  } catch (error) {
    console.error("[scraper/run] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to start scrape",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

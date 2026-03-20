import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/services/redis";
import type { ScrapedComparison } from "@/lib/services/apify-service";

/**
 * GET /api/scraper/gaps?limit=50
 * Returns stored content gaps from Redis, sorted by potential value.
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

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitParam || "50", 10) || 50, 1), 500);

  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({
        gaps: [],
        total: 0,
        message: "Redis not configured. Run a scrape with simple=true to get immediate results.",
      });
    }

    const raw = await redis.get("scraper:gaps");
    if (!raw) {
      return NextResponse.json({
        gaps: [],
        total: 0,
        message: "No gaps data found. Run a scrape first via POST /api/scraper/run.",
      });
    }

    const allGaps: ScrapedComparison[] =
      typeof raw === "string" ? JSON.parse(raw) : (raw as ScrapedComparison[]);

    // Sort by domain (diversify sources) then limit
    const sorted = allGaps.sort((a, b) => {
      // Prioritize well-known competitor domains
      const domainOrder: Record<string, number> = {
        "versus.com": 1,
        "g2.com": 2,
        "diffen.com": 3,
      };
      const aOrder = domainOrder[a.domain] || 99;
      const bOrder = domainOrder[b.domain] || 99;
      return aOrder - bOrder;
    });

    const limited = sorted.slice(0, limit);

    return NextResponse.json({
      gaps: limited,
      total: allGaps.length,
      returned: limited.length,
    });
  } catch (error) {
    console.error("[scraper/gaps] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve gaps",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

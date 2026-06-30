import { NextRequest, NextResponse } from "next/server";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

const HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

// GET /api/v1/trending
// Returns the top trending comparisons by view count.
// Short cache (5min) so AI tools and dashboards get fresh engagement signals.

export async function GET(request: NextRequest) {
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10), 100);
  const category = request.nextUrl.searchParams.get("category") ?? undefined;

  const trending = await getTrendingComparisons(limit);

  const results = trending
    .filter((c) => !category || c.category === category)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
      category: c.category,
      viewCount: c.viewCount,
      updatedAt: c.updatedAt,
    }));

  return NextResponse.json(
    {
      total: results.length,
      comparisons: results,
    },
    { headers: HEADERS }
  );
}

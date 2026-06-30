import { NextRequest, NextResponse } from "next/server";
import { searchComparisons } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

const SEARCH_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "X-Robots-Tag": "all",
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [] }, { headers: SEARCH_HEADERS });
  }

  const raw = await searchComparisons(query, limit);

  // Enrich each result with a canonical URL so AI crawlers can follow directly
  const results = raw.map((r) => ({ ...r, url: `${SITE_URL}/compare/${r.slug}` }));

  return NextResponse.json({ query, results }, { headers: SEARCH_HEADERS });
}

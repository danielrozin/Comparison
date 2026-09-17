import { NextRequest, NextResponse } from "next/server";
import { searchComparisons } from "@/lib/services/comparison-service";
import { filterLiveSearchComparisons } from "@/lib/seo/resolve-internal-links";
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

  // Over-fetch slightly so post-filter live-slug drops still fill `limit`.
  const raw = await searchComparisons(query, Math.min(Math.max(limit * 2, limit), 40));

  // ROO-18 / DAN-2581: same live-slug filter as blog CTAs — never emit stale
  // /compare 404s (iphone-vs-android, iphone-15-vs-iphone-se, oneplus-vs-iphone, …)
  // from hub/site search or autocomplete.
  const live = await filterLiveSearchComparisons(raw);
  const results = live.slice(0, limit).map((r) => ({
    ...r,
    url: `${SITE_URL}/compare/${r.slug}`,
  }));

  return NextResponse.json({ query, results }, { headers: SEARCH_HEADERS });
}

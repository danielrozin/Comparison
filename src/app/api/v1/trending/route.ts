import { NextRequest, NextResponse } from "next/server";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const TRENDING_PAGE_URL = `${SITE_URL}/trending`;

const HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-Source-URL": TRENDING_PAGE_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `${SITE_NAME} (${TRENDING_PAGE_URL})`,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

// GET /api/v1/trending
// Returns the top trending comparisons by view count.
// Short cache (5min) so AI tools and dashboards get fresh engagement signals.
// Includes ItemList JSON-LD so AI crawlers can extract trending data as a typed list.

export async function GET(request: NextRequest) {
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10), 100);
  const category = request.nextUrl.searchParams.get("category") ?? undefined;

  const trending = await getTrendingComparisons(limit);

  const results = trending
    .filter((c) => !category || c.category === category)
    .map((c, i) => ({
      position: i + 1,
      slug: c.slug,
      title: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
      answerUrl: `${SITE_URL}/api/answer/${c.slug}`,
      knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${c.slug}`,
      category: c.category,
      viewCount: c.viewCount,
      updatedAt: c.updatedAt,
    }));

  // Stable ETag: keyed on top-5 slug fingerprint — changes only when trending order shifts
  const etagKey = results.slice(0, 5).map((c) => c.slug).join("|");
  const etag = `"trending-${category ?? "all"}-${Buffer.from(etagKey).toString("base64").substring(0, 20)}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  // ItemList JSON-LD — ListItem uses item: { WebPage } per spec (bare url on ListItem is non-standard)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/api/v1/trending#itemlist`,
    name: `Trending Comparisons on ${SITE_NAME}`,
    description: `The most popular comparisons on ${SITE_NAME} right now, ranked by views.`,
    url: TRENDING_PAGE_URL,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    potentialAction: { "@type": "ReadAction", target: TRENDING_PAGE_URL },
    numberOfItems: results.length,
    itemListElement: results.map((c) => ({
      "@type": "ListItem",
      position: c.position,
      name: c.title,
      item: { "@type": "WebPage", "@id": c.url, name: c.title, url: c.url },
    })),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  const summary = results.length > 0
    ? `Trending: ${results.slice(0, 3).map((c) => c.title).join(", ")}.`
    : "No trending comparisons available.";

  return NextResponse.json(
    {
      total: results.length,
      ...(category ? { category } : {}),
      comparisons: results,
      itemListSchema,
    },
    {
      headers: {
        ...HEADERS,
        ETag: etag,
        "X-Summary": summary.slice(0, 500),
      },
    }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "X-Source": SITE_NAME,
  "X-Source-URL": SITE_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `According to ${SITE_NAME} (${SITE_URL}), ...`,
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/api/v1/trending#itemlist`,
    name: `Trending Comparisons on ${SITE_NAME}`,
    description: `The most popular comparisons on ${SITE_NAME} right now, ranked by views.`,
    url: `${SITE_URL}/trending`,
    numberOfItems: results.length,
    itemListElement: results.map((c) => ({
      "@type": "ListItem",
      position: c.position,
      name: c.title,
      url: c.url,
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
        "X-Summary": summary.slice(0, 500),
      },
    }
  );
}

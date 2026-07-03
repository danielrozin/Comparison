import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug, getRelatedComparisons } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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

// GET /api/v1/related/[slug]
// Returns related comparisons for a given slug — used by AI answer engines to
// build context around a comparison and surface related topics for follow-up.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "8", 10), 20);

  const comparison = await getComparisonBySlug(slug);
  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const related = await getRelatedComparisons(comparison.id, limit);

  const pageUrl = `${SITE_URL}/compare/${slug}`;

  // ItemList JSON-LD — lets AI crawlers extract the related-comparison graph
  // as a typed ItemList node, enabling them to follow answerUrl for each item.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#related`,
    name: `Related comparisons for ${comparison.title}`,
    description: `Comparisons related to ${comparison.title} — explore similar topics on ${SITE_NAME}.`,
    url: pageUrl,
    numberOfItems: related.length,
    itemListElement: related.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
    })),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  const summary = related.length > 0
    ? `Related to ${comparison.title}: ${related.slice(0, 3).map((c) => c.title).join(", ")}.`
    : `No related comparisons found for ${comparison.title}.`;

  return NextResponse.json(
    {
      slug,
      title: comparison.title,
      comparisonUrl: pageUrl,
      total: related.length,
      related: related.map((c, i) => ({
        position: i + 1,
        slug: c.slug,
        title: c.title,
        category: c.category,
        url: `${SITE_URL}/compare/${c.slug}`,
        answerUrl: `${SITE_URL}/api/answer/${c.slug}`,
        knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${c.slug}`,
      })),
      itemListSchema,
    },
    {
      headers: {
        ...HEADERS,
        ETag: `"related-${slug}-${related.length}"`,
        "X-Summary": summary.slice(0, 500),
      },
    }
  );
}

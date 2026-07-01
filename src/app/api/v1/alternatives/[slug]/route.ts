import { NextRequest, NextResponse } from "next/server";
import { getAlternativesForEntity } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

// GET /api/v1/alternatives/{slug}
//
// Returns the list of alternatives to an entity as structured JSON with ItemList JSON-LD.
// Designed for AI tools handling "best alternatives to X" queries.
//
// Each alternative includes:
// - name, slug, comparisonSlug, comparisonTitle
// - Direct URL to the comparison page and the alternatives page
// - ItemList JSON-LD with ListItem position, name, url
//
// Query params:
//   limit — max results (default 20, max 50)

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = request.nextUrl;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  const allAlternatives = await getAlternativesForEntity(slug);
  const alternatives = allAlternatives.slice(0, limit);

  const entityName = alternatives[0]
    ? alternatives[0].comparisonTitle
        .replace(/ vs .*/i, "")
        .replace(/ versus .*/i, "")
        .trim()
    : slug.replace(/-/g, " ");

  const alternativesPageUrl = `${SITE_URL}/alternatives/${slug}`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${alternativesPageUrl}#alternatives`,
    name: `Best Alternatives to ${entityName}`,
    description: `Structured list of the best alternatives to ${entityName}, ranked by comparison data from aversusb.net`,
    url: alternativesPageUrl,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((alt, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: alt.name,
      url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
    })),
    author: {
      "@type": "Organization",
      name: "A Versus B",
      url: SITE_URL,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  const summary =
    alternatives.length > 0
      ? `Top ${alternatives.length} alternatives to ${entityName}: ${alternatives
          .slice(0, 3)
          .map((a) => a.name)
          .join(", ")}, and more.`
      : `No alternatives found for ${entityName}.`;

  // ETag based on content fingerprint — enables 304 Not Modified for AI/SEO crawlers
  const etag = `"alt-${slug}-${allAlternatives.length}"`;

  return NextResponse.json(
    {
      entitySlug: slug,
      entityName,
      total: allAlternatives.length,
      limit,
      alternativesPageUrl,
      alternatives: alternatives.map((alt, i) => ({
        position: i + 1,
        name: alt.name,
        slug: alt.slug,
        comparisonSlug: alt.comparisonSlug,
        comparisonTitle: alt.comparisonTitle,
        comparisonUrl: `${SITE_URL}/compare/${alt.comparisonSlug}`,
        answerUrl: `${SITE_URL}/api/answer/${alt.comparisonSlug}`,
      })),
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

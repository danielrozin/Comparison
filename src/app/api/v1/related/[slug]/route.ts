import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug, getRelatedComparisons } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

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

  return NextResponse.json(
    {
      slug,
      title: comparison.title,
      related: related.map((c) => ({
        slug: c.slug,
        title: c.title,
        category: c.category,
        url: `${SITE_URL}/compare/${c.slug}`,
        knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${c.slug}`,
      })),
    },
    { headers: HEADERS }
  );
}

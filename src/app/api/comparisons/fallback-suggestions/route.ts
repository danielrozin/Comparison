import { NextRequest, NextResponse } from "next/server";
import { loadGenerationFallbackSuggestions } from "@/lib/generation/load-fallback-suggestions";
import {
  getComparisonsByCategory,
  getComparisonsForEntity,
  getTrendingComparisons,
  searchComparisons,
} from "@/lib/services/comparison-service";
import { parseComparisonSlug } from "@/lib/utils/slugify";

export const runtime = "nodejs";

const SLUG = /^[a-z0-9-]{3,200}$/;

/**
 * GET /api/comparisons/fallback-suggestions?slug=mailchimp-vs-klaviyo
 *
 * Live comparisons to show when building that pair failed.
 * Read-only. Does not start generation.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim().toLowerCase() ?? "";
  if (!SLUG.test(slug) || !parseComparisonSlug(slug)) {
    return NextResponse.json({ suggestions: [], source: "none" }, { status: 400 });
  }

  const result = await loadGenerationFallbackSuggestions(slug, {
    comparisonsForEntity: comparisonsForEntity,
    comparisonsByCategory: async (category, limit) => {
      const { comparisons } = await getComparisonsByCategory(category, limit);
      return comparisons;
    },
    popularComparisons: async (limit) => {
      const trending = await getTrendingComparisons(limit);
      return trending.map((item) => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
      }));
    },
  });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      "X-Robots-Tag": "noindex",
    },
  });
}

/**
 * Entity links plus a title search. The selector drops rows that do not
 * actually share a side, so a loose search hit cannot become a suggestion.
 */
async function comparisonsForEntity(entitySlug: string) {
  const label = entitySlug.replace(/-/g, " ");
  const [linked, searched] = await Promise.all([
    getComparisonsForEntity(entitySlug),
    searchComparisons(label, 12),
  ]);
  return [
    ...linked,
    ...searched.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
    })),
  ];
}

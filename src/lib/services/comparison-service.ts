/**
 * Comparison Service
 * Handles all comparison CRUD and query operations
 */

import type { ComparisonPageData, RelatedComparison, TrendingComparison } from "@/types";
import { getMockComparison, getMockTrending, getMockRelated, getAllMockSlugs, getMockComparisonsByCategory } from "./mock-data";

// In production, these will query Prisma. For MVP, we use mock data.
// This abstraction layer makes it easy to swap.

export async function getComparisonBySlug(slug: string): Promise<ComparisonPageData | null> {
  return getMockComparison(slug);
}

export async function getTrendingComparisons(limit: number = 10): Promise<TrendingComparison[]> {
  return getMockTrending(limit);
}

export async function getRelatedComparisons(
  comparisonId: string,
  limit: number = 8
): Promise<RelatedComparison[]> {
  return getMockRelated(comparisonId, limit);
}

export async function searchComparisons(query: string, limit: number = 20) {
  const allSlugs = getAllMockSlugs();
  const lower = query.toLowerCase();

  const results: { slug: string; title: string; category: string; viewCount: number }[] = [];

  for (const slug of allSlugs) {
    const comp = getMockComparison(slug);
    if (!comp) continue;

    // Score relevance
    const titleLower = comp.title.toLowerCase();
    const catLower = (comp.category || "").toLowerCase();

    if (
      titleLower.includes(lower) ||
      catLower.includes(lower) ||
      slug.includes(lower.replace(/\s+/g, "-")) ||
      comp.entities.some((e) => e.name.toLowerCase().includes(lower))
    ) {
      results.push({
        slug: comp.slug,
        title: comp.title,
        category: comp.category || "general",
        viewCount: comp.metadata.viewCount,
      });
    }
  }

  // Sort by relevance (title match first, then by views)
  results.sort((a, b) => {
    const aExact = a.title.toLowerCase().includes(lower) ? 1 : 0;
    const bExact = b.title.toLowerCase().includes(lower) ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    return b.viewCount - a.viewCount;
  });

  return results.slice(0, limit);
}

export async function incrementViewCount(comparisonId: string): Promise<void> {
  // TODO: Implement with Prisma
  console.log(`View count incremented for ${comparisonId}`);
}

export async function getComparisonsByCategory(
  category: string,
  limit: number = 20,
  _offset: number = 0
): Promise<{ comparisons: RelatedComparison[]; total: number }> {
  const all = getMockComparisonsByCategory(category);
  return {
    comparisons: all.slice(0, limit),
    total: all.length,
  };
}

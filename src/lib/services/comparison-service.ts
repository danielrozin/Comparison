/**
 * Comparison Service
 * Handles all comparison CRUD and query operations
 */

import type { ComparisonPageData, RelatedComparison, TrendingComparison } from "@/types";
import { getMockComparison, getMockTrending, getMockRelated } from "./mock-data";

// In production, these will query Prisma. For MVP, we use mock data.
// This abstraction layer makes it easy to swap.

export async function getComparisonBySlug(slug: string): Promise<ComparisonPageData | null> {
  // TODO: Replace with Prisma query
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
  // TODO: Implement full-text search with Prisma or search layer
  const trending = await getTrendingComparisons(limit);
  const lower = query.toLowerCase();
  return trending.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower)
  );
}

export async function incrementViewCount(comparisonId: string): Promise<void> {
  // TODO: Implement with Prisma
  console.log(`View count incremented for ${comparisonId}`);
}

export async function getComparisonsByCategory(
  category: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ comparisons: RelatedComparison[]; total: number }> {
  // TODO: Replace with Prisma query
  const related = await getMockRelated("", limit);
  return {
    comparisons: related.filter((r) => !category || r.category === category),
    total: related.length,
  };
}

/**
 * Category hubs list published database rows. Reviewed editorial compares
 * live in the repo and still return 200 when no published row exists, so the
 * hub has to merge them in. Redirect sources fold onto the canonical slug
 * instead of rendering as their own card.
 */
import { listEditorialCompareSitemapEntries } from "@/lib/data/editorial-compares";
import {
  getConsolidatedCompareSlug,
  isRedirectedCompareSlug,
} from "@/lib/redirects/compare-redirects";
import type { SubcategoryDef } from "@/lib/utils/constants";

export type CategoryComparisonRef = {
  slug: string;
  title: string;
  category?: string | null;
};

function canonicalSlug(slug: string): string {
  return getConsolidatedCompareSlug(slug) ?? slug;
}

/**
 * Database rows first, then editorial pages for the same category that the
 * query did not already return. A redirect source becomes its target. A
 * second row for the same target is dropped.
 */
export function mergeEditorialCategoryComparisons(
  category: string,
  rows: CategoryComparisonRef[],
): CategoryComparisonRef[] {
  const wanted = category.toLowerCase();
  const merged: CategoryComparisonRef[] = [];
  const seen = new Set<string>();

  const push = (slug: string, title: string, rowCategory: string | null | undefined) => {
    const canonical = canonicalSlug(slug);
    if (isRedirectedCompareSlug(canonical) || seen.has(canonical)) return;
    seen.add(canonical);
    merged.push({
      slug: canonical,
      title,
      category: rowCategory ?? category,
    });
  };

  for (const row of rows) {
    if (isRedirectedCompareSlug(row.slug)) continue;
    push(row.slug, row.title, row.category);
  }
  for (const entry of listEditorialCompareSitemapEntries()) {
    if (entry.category.toLowerCase() !== wanted) continue;
    push(entry.slug, entry.title, entry.category);
  }
  for (const row of rows) {
    if (!isRedirectedCompareSlug(row.slug)) continue;
    push(row.slug, row.title, row.category);
  }
  return merged;
}

/** How many hub cards the category total should count after the merge. */
export function categoryHubCount(
  dbTotal: number,
  fetched: CategoryComparisonRef[],
  merged: CategoryComparisonRef[],
): number {
  const fetchedCanonical = new Set(fetched.map((row) => canonicalSlug(row.slug)));
  const added = merged.filter((row) => !fetchedCanonical.has(row.slug)).length;
  return dbTotal + added;
}

export function comparisonsForSubcategory<T extends { slug: string; title: string }>(
  comparisons: T[],
  subcat: SubcategoryDef,
): T[] {
  return comparisons.filter((comp) => {
    const lower = `${comp.title} ${comp.slug}`.toLowerCase();
    return subcat.keywords.some((keyword) => lower.includes(keyword.toLowerCase()));
  });
}

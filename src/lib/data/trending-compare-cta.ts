/**
 * ROO-47 — pick the above-fold `/trending` compare targets.
 *
 * The hero CTA must land on a live comparison, not back on `/trending`.
 * Items come from `getTrendingComparisons` (canonical published rows),
 * so this helper only dedupes and orders them. It stays free of
 * server-only imports so tests can call it directly.
 */

export interface TrendingCompareItem {
  slug: string;
  title: string;
}

export interface TrendingCompareCta {
  primarySlug: string | null;
  primaryTitle: string | null;
  chips: { slug: string; label: string }[];
}

export function buildTrendingCompareCta(
  items: readonly TrendingCompareItem[],
  options?: { chipLimit?: number },
): TrendingCompareCta {
  const chipLimit = options?.chipLimit ?? 5;
  const unique: TrendingCompareItem[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const slug = item.slug?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const title = item.title?.trim() || slug.replace(/-/g, " ");
    unique.push({ slug, title });
  }

  const primary = unique[0];
  return {
    primarySlug: primary?.slug ?? null,
    primaryTitle: primary?.title ?? null,
    chips: unique.slice(1, 1 + Math.max(0, chipLimit)).map((item) => ({
      slug: item.slug,
      label: item.title,
    })),
  };
}

/**
 * ROO-132 — above-fold exits for /custom-compare.
 *
 * Ranked rows come from `getTrendingComparisons` (canonical published
 * pages, highest viewCount first). `liveSlugs` is that list after
 * `filterLiveCompareSlugs`, so a slug that would 404 is never linked.
 * This helper only pairs a live slug with its title. It does not invent
 * matchups.
 */

export const CUSTOM_COMPARE_SOURCE_PAGE = "/custom-compare";

/** Same `?src=` the custom-compare upgrade URL already uses. */
export const CUSTOM_COMPARE_PRICING_SRC = "custom-compare";

/** Which control fired `pricing_cta_click`. */
export const CUSTOM_COMPARE_PRICING_PLACEMENT = "custom-compare";

/** Above-fold cap. Fewer is fine when fewer pages are live. */
export const CUSTOM_COMPARE_ESCAPE_LIMIT = 5;

export interface CustomCompareEscape {
  slug: string;
  label: string;
}

export function selectCustomCompareEscapes(
  ranked: readonly { slug: string; title: string }[],
  liveSlugs: readonly string[],
  limit = CUSTOM_COMPARE_ESCAPE_LIMIT,
): CustomCompareEscape[] {
  const cap = Math.min(CUSTOM_COMPARE_ESCAPE_LIMIT, Math.max(0, limit));
  const titleBySlug = new Map<string, string>();
  for (const item of ranked) {
    const slug = item.slug?.trim();
    if (!slug || titleBySlug.has(slug)) continue;
    titleBySlug.set(slug, item.title?.trim() || "");
  }

  const items: CustomCompareEscape[] = [];
  const seen = new Set<string>();
  for (const raw of liveSlugs) {
    const slug = raw.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const title = titleBySlug.get(slug);
    items.push({ slug, label: title || slug.replace(/-/g, " ") });
    if (items.length >= cap) break;
  }
  return items;
}

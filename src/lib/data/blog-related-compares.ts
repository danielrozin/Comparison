/**
 * ROO-9 — Blog → comparison CTA helpers (server).
 *
 * DAN-2581: never invent dead /compare hrefs. Curated candidates are always
 * passed through `filterLiveCompareSlugs` before render. Posts with no live
 * related rail fall back to a soft "Explore comparisons" CTA (/search or /).
 *
 * Client components must import constants from `blog-compare-constants` only.
 */

import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import {
  BLOG_COMPARE_FALLBACKS,
  BLOG_COMPARE_SOFT_HREF,
} from "@/lib/data/blog-compare-constants";

export { BLOG_COMPARE_FALLBACKS, BLOG_COMPARE_SOFT_HREF };

/**
 * Merge stored related slugs with curated fallbacks, then keep only live
 * canonical compare slugs (DAN-2581).
 */
export async function resolveBlogRelatedCompareSlugs(
  blogSlug: string,
  stored: string[] | null | undefined
): Promise<string[]> {
  const curated = BLOG_COMPARE_FALLBACKS[blogSlug] ?? [];
  const merged = [...(stored ?? []), ...curated];
  return filterLiveCompareSlugs(merged);
}

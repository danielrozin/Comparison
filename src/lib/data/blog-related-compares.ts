/**
 * ROO-9 — Blog → comparison CTA helpers.
 *
 * DAN-2581: never invent dead /compare hrefs. Curated candidates are always
 * passed through `filterLiveCompareSlugs` before render. Posts with no live
 * related rail fall back to a soft "Explore comparisons" CTA (/search or /).
 */

import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";

/**
 * Small curated map for top-traffic / high-bounce posts where
 * `relatedComparisonSlugs` is empty or thin. Only candidates known (or likely)
 * to resolve live — runtime filter drops anything dead.
 */
export const BLOG_COMPARE_FALLBACKS: Record<string, string[]> = {
  "how-to-get-a-cashiers-check": ["bank-of-america-vs-chase", "chase-vs-bank-of-america"],
  // nav-apps: maps/waze compares currently 404 live — leave empty; soft CTA only
  "best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared": [
    "google-maps-vs-waze",
    "apple-maps-vs-waze",
  ],
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide": [
    "macbook-air-vs-macbook-pro",
    "mac-vs-windows",
  ],
  "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider": [
    "bmw-vs-mercedes",
    "mercedes-vs-audi",
    "mercedes-vs-lexus",
  ],
  "best-alternatives-to-mercedes-benz-2026": [
    "bmw-vs-mercedes",
    "mercedes-vs-audi",
    "mercedes-vs-lexus",
  ],
  "best-cloud-platforms-2026": ["aws-vs-azure", "aws-vs-azure-vs-gcp"],
  // tanks: abrams compares currently 404 live — candidates filtered out at runtime
  "best-tanks-world-2026-abrams-vs-t-90-vs-leopard": [
    "m1-abrams-vs-t-90",
    "abrams-tank-vs-leopard-2",
  ],
  "us-china-military-comparison-2026-defense-spending-nuclear-naval": [
    "us-military-vs-china-military",
    "usa-vs-china",
    "us-economy-vs-china-economy",
  ],
};

/** Soft explore target when no live compare slugs remain. */
export const BLOG_COMPARE_SOFT_HREF = "/search";

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

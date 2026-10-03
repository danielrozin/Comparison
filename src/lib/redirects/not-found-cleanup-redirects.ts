/**
 * Permanent one-hop 301s for compare URLs that 404 (or 301 into a 404).
 * Every destination was checked as a live 200. Do not point these at a
 * slug that is itself a redirect source — that would be a second hop.
 */
export const NOT_FOUND_CLEANUP_CONSOLIDATIONS: Record<string, string> = {
  "vrbo-vs-airbnb-for-hosts-which-is-more-profitable": "airbnb-vs-vrbo",
  "airbnb-for-hosts-which-is-more-profitable-vs-vrbo": "airbnb-vs-vrbo",
  "chinese-economy-vs-us-economy": "us-economy-vs-china-economy",
  "chinese-vs-american-economy": "us-economy-vs-china-economy",
  "us-vs-china-tech-companies": "china-vs-us-gdp-military-tech-comparison-2026",
  "us-tech-industry-vs-china-tech-industry": "china-vs-us-gdp-military-tech-comparison-2026",
  "japan-vs-china-technology-comparison-2026": "japan-vs-china",
  "iphone-vs-samsung": "iphone-vs-samsung-galaxy",
  "macbook-air-vs-macbook-pro-difference-2026-specs":
    "macbook-air-vs-macbook-pro-differences-2026-specs-battery-performance",
};

/**
 * Redirect sources that were never published catalog pages.
 *
 * They still 301, and they stay in REDIRECTED_COMPARE_SLUGS so the sitemap
 * matches the edge table. The corpus ceiling treats every other redirect
 * source as a retired page and lowers the advertised count. These URLs
 * were always 404s, so they must not shrink CANONICAL_COMPARISON_COUNT_FALLBACK.
 *
 * Add a slug here when a later batch 301s a URL that never had a published
 * row. PR #338 (kindle-vs-kobo and the Thunder aliases) uses this same set.
 */
export const NEVER_PUBLISHED_ALIASES: ReadonlySet<string> = new Set([
  ...Object.keys(NOT_FOUND_CLEANUP_CONSOLIDATIONS),
  // Honda vs Ford. These 404s 301 in compare-404-recovery.generated.ts.
  "ford-vs-honda",
  "honda-motor-vs-ford-motor",
  "ford-motor-vs-honda-motor",
  "honda-motor-company-vs-ford-motor-company",
  "ford-motor-company-vs-honda-motor-company",
  "honda-vs-ford-motor",
  "ford-motor-vs-honda",
]);

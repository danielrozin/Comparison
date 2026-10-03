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
  // 404 aliases for Java vs TypeScript. None was a catalog page.
  "typescript-vs-java",
  "ts-vs-java",
  "java-vs-ts",
  // Honda vs Ford. These 404s 301 in compare-404-recovery.generated.ts.
  "ford-vs-honda",
  "honda-motor-vs-ford-motor",
  "ford-motor-vs-honda-motor",
  "honda-motor-company-vs-ford-motor-company",
  "ford-motor-company-vs-honda-motor-company",
  "honda-vs-ford-motor",
  "ford-motor-vs-honda",
  // 404 aliases for Microsoft Word vs LibreOffice. None was a catalog page.
  "libreoffice-vs-microsoft-word",
  "word-vs-libreoffice",
  "libreoffice-vs-word",
  "ms-word-vs-libreoffice-writer",
  "libreoffice-writer-vs-ms-word",
  "microsoft-word-vs-libreoffice-writer",
  "libreoffice-writer-vs-microsoft-word",
  "ms-word-vs-libreoffice",
  "libreoffice-vs-ms-word",
  "word-vs-libreoffice-writer",
  "libreoffice-writer-vs-word",
  // Coinbase vs Binance. These 404s 301 in compare-404-recovery.generated.ts.
  "binance-vs-coinbase",
  "coinbase-exchange-vs-binance",
  "binance-vs-coinbase-exchange",
  "coinbase-vs-binance-exchange",
  "binance-exchange-vs-coinbase",
  // 404 alias for Venmo vs Zelle. It was never a catalog page.
  "zelle-vs-venmo",
  // PR #338. These 404s 301 in compare-404-recovery.generated.ts. They were
  // never catalog pages, so they stay in the set above and do not shrink the count.
  "thunder-vs-spurs",
  "spurs-vs-thunder",
  "okc-vs-spurs",
  "spurs-vs-okc",
  "okc-thunder-vs-spurs",
  "spurs-vs-okc-thunder",
  "thunder-vs-san-antonio-spurs",
  "san-antonio-spurs-vs-thunder",
  "okc-vs-san-antonio-spurs",
  "san-antonio-spurs-vs-okc",
  "kobo-vs-kindle",
  "amazon-kindle-vs-kobo",
  "kobo-vs-amazon-kindle",
  "amazon-kindle-vs-rakuten-kobo",
  "rakuten-kobo-vs-amazon-kindle",
  "kindle-vs-rakuten-kobo",
  "rakuten-kobo-vs-kindle",
]);

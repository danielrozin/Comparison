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
  // Bing 404 build list (2026-10-19): Apple TV vs Disney+ variants. The
  // target is the editorial pack added in the same PR
  // (editorial-compares/apple-tv-plus-vs-disney-plus.ts), so it is live once merged.
  "apple-tv-vs-disney": "apple-tv-plus-vs-disney-plus",
  "disney-vs-apple-tv": "apple-tv-plus-vs-disney-plus",
  "apple-tv-vs-disney-plus": "apple-tv-plus-vs-disney-plus",
  "disney-plus-vs-apple-tv": "apple-tv-plus-vs-disney-plus",
  "japan-vs-china-technology-comparison-2026": "japan-vs-china",
  "iphone-vs-samsung": "iphone-vs-samsung-galaxy",
  "macbook-air-vs-macbook-pro-difference-2026-specs":
    "macbook-air-vs-macbook-pro-differences-2026-specs-battery-performance",
  // Bing Webmaster 404 report (2026-10-19). Each source returned 404 live on
  // www.aversusb.net; each target names the same two (or three) entities and
  // the same topic, and was checked as 200, index/follow, self-canonical and
  // in the sitemap. Head-term pairs with no live page are NOT redirected here;
  // they are on the build list in the PR.
  "texas-vs-california-economy-comparison-2026": "california-vs-texas",
  "barcelona-vs-real-madrid-total-trophies-2026":
    "real-madrid-vs-barcelona-total-trophies-comparison-2026",
  "real-madrid-vs-barcelona-la-liga-titles-comparison-2026":
    "real-madrid-vs-barcelona-total-trophies-comparison-2026",
  "macbook-air-vs-macbook-pro-weight-comparison-2025-2026":
    "macbook-air-vs-macbook-pro",
  "china-vs-us-economy-comparison-2026": "us-economy-vs-china-economy",
  "china-vs-us-economic-comparison-2026": "us-economy-vs-china-economy",
  "us-vs-china-economy-2026-comparison": "us-economy-vs-china-economy",
  "us-vs-china-economic-comparison-2026": "us-economy-vs-china-economy",
  "china-vs-usa-economy": "us-economy-vs-china-economy",
  "united-airlines-vs-delta-airlines-comparison-2026":
    "delta-vs-united-airlines",
  "united-airlines-vs-delta-air-lines-comparison-2026":
    "delta-vs-united-airlines",
  "delta-vs-united-airlines-which-is-better-2026": "delta-vs-united-airlines",
  "united-vs-delta-airlines-comparison-2026": "delta-vs-united-airlines",
  "american-express-merchant-acceptance-rates-vs-mastercard-2025-2026":
    "american-express-vs-mastercard",
  "american-express-merchant-acceptance-rate-vs-mastercard-2025-2026":
    "american-express-vs-mastercard",
  "mastercard-vs-american-express-merchant-acceptance-comparison-2025-2026":
    "american-express-vs-mastercard",
  "macbook-air-vs-macbook-pro-differences-2026-specs":
    "macbook-air-vs-macbook-pro-differences-2026-specs-battery-performance",
  "macbook-pro-vs-macbook-air-differences-2026": "macbook-air-vs-macbook-pro",
  "macbook-pro-vs-macbook-air-which-is-better-2026":
    "macbook-air-vs-macbook-pro",
  "xbox-series-x-vs-ps5-games-comparison-2026": "ps5-vs-xbox-series-x",
  "wegovy-vs-ozempic-comparison-differences-similarities-2026":
    "ozempic-vs-wegovy",
  "samsung-vs-iphone": "iphone-vs-samsung-galaxy",
  "samsung-s25-vs-s25-ultra": "galaxy-s25-vs-galaxy-s25-ultra",
  "samsung-galaxy-s25-vs-samsung-galaxy-s25-ultra":
    "galaxy-s25-vs-galaxy-s25-ultra",
  "samsung-galaxy-s26-vs-samsung-galaxy-s26-ultra":
    "galaxy-s26-vs-galaxy-s26-ultra",
  "samsung-galaxy-s26-vs-iphone-17-specs-2026": "iphone-17-vs-samsung-s26",
  "iphone-17-vs-samsung-galaxy-s26-specs-2026": "iphone-17-vs-samsung-s26",
  "messi-vs-ronaldo-landscape": "messi-vs-ronaldo",
  "cristiano-ronaldo-vs-lionel-messi-career-stats-achievements-2026":
    "messi-vs-ronaldo",
  "cristiano-ronaldo-vs-lionel-messi-achievements-comparison-2026":
    "messi-vs-ronaldo",
  "macbook-pro-m5-pro-vs-max": "m5-max-vs-m5-pro",
  "macbook-pro-14-vs-16-2026": "macbook-pro-14-vs-macbook-pro-16",
  "ipad-vs-samsung-galaxy-tab": "ipad-vs-samsung-tablet",
  "cursor-vs-github-copilot": "cursor-vs-copilot",
  "compare-bmw-vs-mercedes": "bmw-vs-mercedes",
  "claude-vs-gemini": "claude-vs-google-gemini",
  "ally-hysa-vs-marcus": "ally-bank-vs-marcus-by-goldman-sachs",
  "china-vs-us-military-strength-comparison-2026":
    "us-military-vs-china-military",
  "chase-vs-capital-one-banking": "capital-one-vs-chase",
  "capital-one-bank-vs-chase-bank": "capital-one-vs-chase",
  "charles-schwab-vs-vanguard-account-fees-and-expense-ratios":
    "schwab-vs-vanguard",
  "capture-one-vs-lightroom-price": "capture-one-vs-lightroom",
  "bmw-x5-vs-gle": "mercedes-gle-vs-bmw-x5",
  "bitcoin-vs-ethereum-price-performance": "bitcoin-vs-ethereum",
  "apple-macbook-air-m3-vs-m4": "macbook-air-m3-vs-macbook-air-m4",
  "antivirus-norton-vs-mcafee": "mcafee-vs-norton",
  "dc-comics-vs-marvel-comics-comparison-2026": "marvel-vs-dc",
  "apple-music-vs-youtube-music-vs-spotify":
    "spotify-vs-apple-music-vs-youtube-music",
  "claude-vs-chat-gpt-vs-gemini": "chatgpt-vs-claude-vs-gemini",
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

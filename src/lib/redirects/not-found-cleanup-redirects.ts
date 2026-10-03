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
  "sga-vs-wembanyama": "shai-gilgeous-alexander-vs-victor-wembanyama",
  "wembanyama-vs-sga": "shai-gilgeous-alexander-vs-victor-wembanyama",
  "knicks-vs-sixers": "knicks-vs-76ers",
  "sixers-vs-knicks": "knicks-vs-76ers",
};

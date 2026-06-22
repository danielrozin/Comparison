/**
 * Blog redirects for retired duplicate slugs.
 *
 * Source of truth for 301 redirects from archived blog articles to their
 * canonical successors. Wired into next.config.ts via the redirects() async
 * function so Next.js handles them server-side before route resolution.
 *
 * Origin: DAN-452 — consolidating 91 macbook-pro-weight near-duplicates
 * (cannibalization fix) into a single canonical post. Extended under DAN-453
 * to absorb a second cluster of macbook-weight (no "-pro-") near-duplicates
 * that bypassed the original prefix net. Drift-swept again on 2026-05-07
 * after the cron produced 29 more dupes between merge-gate (DAN-438) and
 * dedup-gate (DAN-520) deploys. Extended under DAN-868 to consolidate the
 * Mercedes-Benz alternatives/competitors cluster (DAN-347 audit P1 #7 —
 * audit said 7 dupes, reality was 75). The arrays below mirror the current
 * archived state in the DB.
 *
 * Extended under DAN-871 to absorb the "US vs China GDP 2026" thin blog
 * cluster (DAN-347 audit P1 #7 — audit said "GDP comparisons", reality
 * = 44 dupes, all 0 views). Canonical target for this cluster is the
 * existing published Comparison row at `/compare/us-vs-china-gdp-comparison-2026`
 * (DAN-608 2-way schema), not a blog post.
 */

export type BlogRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

const MACBOOK_PRO_WEIGHT_CANONICAL =
  "/blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide";

// macbook-pro-weight-* + macbook-pro-14-* + macbook-pro-2024-* +
// macbook-pro-models-weight-* clusters, all collapsed to the canonical.
const MACBOOK_PRO_WEIGHT_DUPES: string[] = [
  "macbook-pro-14-inch-vs-16-inch-weight-2024-2025-2026-specs-compared",
  "macbook-pro-14-inch-vs-16-inch-weight-2024-2026-models-compared",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2025-2026-models",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-models",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-which-is-right-for-yo",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-which-size-is-right",
  "macbook-pro-14-inch-vs-16-inch-weight-size-performance-comparison-2024-2026",
  "macbook-pro-14-inch-vs-16-inch-weight-size-specs-compared-2024-2026",
  "macbook-pro-14-inch-vs-16-inch-weight-size-specs-comparison-2024-2026",
  "macbook-pro-14-inch-vs-16-inch-weight-specs-in-2026-complete-guide",
  "macbook-pro-14-vs-16-inch-weight-comparison-2024-2026-models-explained",
  "macbook-pro-14-vs-16-inch-weight-comparison-2024-2026-which-is-lighter",
  "macbook-pro-14-vs-16-inch-weight-size-comparison-2024-2026-models",
  "macbook-pro-14-vs-16-inch-weight-size-specs-comparison-2024-2026",
  "macbook-pro-14-vs-16-inch-weight-specs-2024-2026",
  "macbook-pro-14-vs-16-inch-weight-specs-2024-2026-comparison",
  "macbook-pro-14-vs-16-inch-weight-specs-comparison-2024-2026",
  "macbook-pro-14-vs-16-inch-weight-specs-which-to-choose-in-2026",
  "macbook-pro-2024-2025-weight-compared-to-previous-models-why-it-matters",
  "macbook-pro-2024-2025-weight-comparison-why-apples-models-got-heavier",
  "macbook-pro-2024-2025-weight-comparison-why-its-heavier-than-previous-models",
  "macbook-pro-2024-2025-weight-comparison-why-newer-models-weigh-more",
  "macbook-pro-2024-weight-compared-to-previous-models-why-did-apple-make-them-heav",
  "macbook-pro-models-weight-2026-complete-specs-guide",
  "macbook-pro-weight-2024-2025-complete-model-comparison-why-it-matters",
  "macbook-pro-weight-2024-2025-how-modern-models-compare-to-previous-generations",
  "macbook-pro-weight-2024-2025-how-new-models-compare-to-previous-generations",
  "macbook-pro-weight-2024-2025-why-new-models-are-heavier-how-they-compare",
  "macbook-pro-weight-2024-2026-complete-model-comparison-guide",
  "macbook-pro-weight-2024-2026-complete-model-comparison-specs",
  "macbook-pro-weight-2024-2026-complete-specs-comparison-guide",
  "macbook-pro-weight-2024-2026-complete-specs-for-all-models",
  "macbook-pro-weight-2024-2026-complete-specs-model-comparison",
  "macbook-pro-weight-2025-2026-all-current-models-compared",
  "macbook-pro-weight-2025-2026-complete-comparison-of-all-current-models",
  "macbook-pro-weight-2025-2026-complete-guide-to-all-models",
  "macbook-pro-weight-2025-2026-complete-model-comparison-guide",
  "macbook-pro-weight-2025-2026-complete-specs-for-all-models",
  "macbook-pro-weight-2025-2026-complete-specs-for-every-model",
  "macbook-pro-weight-2025-2026-complete-specs-model-comparison",
  "macbook-pro-weight-2025-2026-current-models-compared",
  "macbook-pro-weight-2026-a-complete-comparison-of-current-models",
  "macbook-pro-weight-2026-all-current-models-compared",
  "macbook-pro-weight-2026-all-current-models-compared-specs",
  "macbook-pro-weight-2026-all-models-compared-and-specs",
  "macbook-pro-weight-2026-all-models-compared-in-pounds",
  "macbook-pro-weight-2026-all-models-compared-specifications",
  "macbook-pro-weight-2026-complete-guide-to-all-current-models",
  "macbook-pro-weight-2026-complete-guide-to-all-models",
  "macbook-pro-weight-2026-complete-guide-to-current-models",
  "macbook-pro-weight-2026-complete-guide-to-m5-models",
  "macbook-pro-weight-2026-complete-spec-comparison-of-all-models",
  "macbook-pro-weight-2026-complete-specs-for-14-inch-16-inch-models",
  "macbook-pro-weight-2026-complete-specs-for-all-current-models",
  "macbook-pro-weight-2026-m5-and-m5-max-models-compared",
  "macbook-pro-weight-all-2024-2026-models-compared",
  "macbook-pro-weight-by-model-2024-2025-2026-comparison-guide",
  "macbook-pro-weight-by-model-2024-2025-and-2026-comparison-guide",
  "macbook-pro-weight-by-model-2024-2025-and-2026-specs-compared",
  "macbook-pro-weight-by-model-2024-2026-complete-breakdown",
  "macbook-pro-weight-by-model-2024-2026-complete-comparison-guide",
  "macbook-pro-weight-by-model-2024-2026-complete-specifications-guide",
  "macbook-pro-weight-by-model-2024-2026-complete-specs-comparison",
  "macbook-pro-weight-by-model-2024-2026-complete-specs-guide",
  "macbook-pro-weight-by-model-2024-2026-specs-compared",
  "macbook-pro-weight-by-model-2024-2026-specs-comparison",
  "macbook-pro-weight-compared-2024-2026-models-vs-previous-generations",
  "macbook-pro-weight-comparison-2024-2025-2026-models",
  "macbook-pro-weight-comparison-2024-2025-2026-models-analyzed",
  "macbook-pro-weight-comparison-2024-2025-2026-models-explained",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models-analyzed",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models-explained",
  "macbook-pro-weight-comparison-2024-2025-models-vs-previous-generations",
  "macbook-pro-weight-comparison-2024-2025-why-apples-models-got-heavier",
  "macbook-pro-weight-comparison-2024-2026-all-models-analyzed",
  "macbook-pro-weight-comparison-2024-2026-all-models-explained",
  "macbook-pro-weight-comparison-2024-2026-all-models-ranked",
  "macbook-pro-weight-comparison-2024-2026-all-models-spec-guide",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs-guide",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs-portability-guide",
  "macbook-pro-weight-comparison-2024-2026-every-model-analyzed",
  "macbook-pro-weight-comparison-2024-2026-how-new-models-stack-up",
  "macbook-pro-weight-comparison-2024-2026-latest-models-analyzed",
  "macbook-pro-weight-comparison-2024-2026-latest-models-specs",
  "macbook-pro-weight-comparison-2024-2026-models-explained",
  "macbook-pro-weight-comparison-2024-2026-models-guide",
  "macbook-pro-weight-comparison-2024-2026-models-specs",
  "macbook-pro-weight-comparison-2024-2026-which-model-is-lightest",
  "macbook-pro-weight-comparison-2024-2026-which-model-is-right-for-you",
  "macbook-pro-weight-comparison-2024-2026-why-the-latest-models-changed",
  "macbook-pro-weight-comparison-2025-2026-all-current-models",
  "macbook-pro-weight-comparison-2025-2026-all-current-models-analyzed",
  "macbook-pro-weight-comparison-2025-2026-all-current-models-explained",
  "macbook-pro-weight-comparison-2025-2026-all-current-models-specs",
  "macbook-pro-weight-comparison-2025-2026-all-models-analyzed",
  "macbook-pro-weight-comparison-2025-2026-all-models-explained",
  "macbook-pro-weight-comparison-2025-2026-all-models-ranked",
  "macbook-pro-weight-comparison-2025-2026-complete-guide-to-current-models",
  "macbook-pro-weight-comparison-2026-all-current-models",
  "macbook-pro-weight-comparison-2026-all-current-models-analyzed",
  "macbook-pro-weight-comparison-2026-all-current-models-explained",
  "macbook-pro-weight-comparison-2026-all-current-models-specs",
  "macbook-pro-weight-comparison-2026-all-models-analyzed",
  "macbook-pro-weight-comparison-2026-all-models-and-specs",
  "macbook-pro-weight-comparison-2026-m5-pro-vs-m5-max-models",
  "macbook-pro-weight-comparison-all-2024-2026-models-explained",
  "macbook-pro-weight-guide-2024-2026-all-current-models-compared",
  "macbook-pro-weight-guide-2024-2026-all-models-compared",
  "macbook-pro-weight-guide-2024-2026-all-models-compared-in-pounds",
  "macbook-pro-weight-guide-2024-2026-which-model-is-right-for-you",
  "macbook-pro-weight-guide-2026-all-models-compared-in-pounds",
  "macbook-pro-weight-specs-2024-2026-all-models-compared-in-pounds",
];

// DAN-453: macbook-weight-* / macbook-models-weight-* (no "-pro-" segment)
// — second cluster auto-generated after DAN-452 ran. Same intent as the
// canonical, redirected accordingly.
const MACBOOK_WEIGHT_DUPES: string[] = [
  "macbook-models-weight-comparison-2026-which-is-lightest",
  "macbook-models-weight-comparison-2026-which-is-right-for-you",
  "macbook-weight-2026-complete-comparison-of-all-models",
  "macbook-weight-2026-complete-comparison-of-m5-pro-max-air-models",
  "macbook-weight-2026-complete-guide-to-all-models",
  "macbook-weight-2026-complete-guide-to-m5-models",
  "macbook-weight-2026-complete-guide-to-m5-pro-air-models",
  "macbook-weight-2026-complete-guide-to-new-model-specs-comparisons",
  "macbook-weight-2026-complete-guide-to-new-models",
  "macbook-weight-2026-complete-specs-comparison-guide-for-all-models",
  "macbook-weight-2026-complete-specs-for-all-models",
  "macbook-weight-2026-complete-specs-for-m5-models",
  "macbook-weight-2026-complete-specs-for-m5-pro-m5-max-air-models",
  "macbook-weight-2026-full-specs-comparison-of-all-new-models",
  "macbook-weight-2026-how-heavy-are-the-new-m5-models",
  "macbook-weight-2026-how-light-are-apples-new-m5-models",
  "macbook-weight-2026-how-light-are-the-new-m5-models",
  "macbook-weight-2026-m5-models-compared-specs-guide",
  "macbook-weight-comparison-2025-2026-every-model-analyzed",
  "macbook-weight-comparison-2026-air-vs-pro-models",
  "macbook-weight-comparison-2026-all-current-models-ranked-by-portability",
  "macbook-weight-comparison-2026-every-apple-model-ranked",
  // Drift sweep 2026-05-23: 14 additional slugs archived by consolidation script
  "macbook-models-weight-comparison-2025-2026-which-apple-laptop-is-lightest",
  "macbook-pro-weight-2024-2026-complete-guide-to-all-current-models",
  "macbook-pro-weight-2024-2026-complete-guide-to-all-models-in-pounds",
  "macbook-pro-weight-2025-2026-all-models-compared",
  "macbook-pro-weight-2026-all-models-compared-specs",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models-guide",
  "macbook-pro-weight-comparison-2024-2026-all-current-models",
  "macbook-pro-weight-comparison-2024-2026-all-current-models-specs",
  "macbook-pro-weight-comparison-2024-2026-every-model-explained",
  "macbook-pro-weight-comparison-2025-2026-all-models-specs",
  "macbook-weight-comparison-2025-2026-air-vs-pro-models-detailed",
  "macbook-weight-comparison-2025-2026-find-your-perfect-model",
  "macbook-weight-comparison-2025-2026-which-apple-laptop-is-lightest",
  "macbook-weight-comparison-2026-all-models-ranked-by-portability",
];

// DAN-868: Mercedes-Benz alternatives/competitors cluster (DAN-347 audit P1
// #7). Canonical retained = the most descriptive published slug at the time
// of consolidation. Slugs listed mirror the DB rows archived by
// scripts/dan-868-consolidate-mercedes.mjs.
const MERCEDES_CANONICAL =
  "/blog/mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";

const MERCEDES_DUPES: string[] = [
  "alternatives-to-mercedes-top-luxury-car-options-for-every-budget",
  "best-alternatives-to-mercedes-benz-luxury-cars-worth-considering-in-2024",
  "best-mercedes-alternatives-2024-luxury-cars-that-compete-with-every-mercedes-cla",
  "best-alternatives-to-mercedes-luxury-cars-that-compete-with-every-class",
  "best-alternatives-to-mercedes-in-2026-luxury-performance-options",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-performance-options",
  "best-alternatives-to-mercedes-in-2026-complete-buyers-guide",
  "mercedes-benz-competitors-in-2026-the-ultimate-luxury-car-guide",
  "mercedes-benz-competitors-in-2026-the-ultimate-luxury-car-rivals",
  "mercedes-benz-competitors-2026-best-luxury-car-alternatives",
  "mercedes-benz-competitors-2026-top-luxury-car-alternatives-to-consider",
  "mercedes-benz-competitors-in-2026-the-best-luxury-cars-to-consider",
  "mercedes-benz-competitors-in-2026-top-luxury-car-alternatives",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-worth-considering",
  "best-alternatives-to-mercedes-benz-in-2026-complete-buyers-guide",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-sedans-suvs",
  "mercedes-benz-competitors-2026-the-ultimate-luxury-car-rivals-guide",
  "mercedes-benz-competitors-2026-top-luxury-car-rivals-compared",
  "mercedes-benz-competitors-top-luxury-car-rivals-in-2026",
  "best-mercedes-alternatives-in-2026-luxury-performance-competitors",
  "mercedes-benz-competitors-in-2026-top-luxury-car-rivals-compared",
  "mercedes-benz-competitors-top-luxury-car-alternatives-in-2026",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-cars-that-match-or-beat-the-co",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-sedans-suvs-sports-cars",
  "mercedes-benz-competitors-in-2026-the-best-luxury-car-alternatives",
  "mercedes-benz-competitors-2026-top-luxury-car-alternatives-compared",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-value-compared",
  "best-mercedes-alternatives-in-2026-luxury-performance-value",
  "best-mercedes-benz-competitors-in-2026-luxury-cars-worth-considering",
  "mercedes-benz-competitors-in-2026-best-luxury-car-alternatives",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-that-rival-the-three-pointed",
  "mercedes-benz-competitors-in-2026-top-luxury-car-rivals-to-consider",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-brands-worth-considering",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-suvs-to-consider",
  "mercedes-benz-competitors-best-luxury-car-alternatives-in-2026",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-cars-compared",
  "mercedes-benz-alternatives-in-2026-top-luxury-car-options-to-consider",
  "mercedes-benz-competitors-the-best-luxury-cars-to-compare-in-2026",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-sedans-suvs-compared",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-cars-worth-considering",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-cars-worth-considering",
  "mercedes-benz-competitors-in-2026-top-luxury-car-rivals-you-should-consider",
  "top-mercedes-benz-alternatives-in-2026-luxury-cars-worth-considering",
  "top-mercedes-benz-alternatives-in-2026-luxury-sedans-suvs-worth-considering",
  "mercedes-benz-alternatives-2026-top-luxury-affordable-car-options",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-sedans-worth-considering",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-vehicles-worth-considering",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-sedans-suvs-compared",
  "mercedes-benz-competitors-in-2026-the-top-luxury-car-brands-compared",
  "mercedes-benz-competitors-in-2026-the-best-luxury-cars-compared",
  "mercedes-benz-competitors-the-best-luxury-cars-to-consider-in-2026",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-cars-worth-your-money",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-that-compete-save-you-money",
  "mercedes-benz-competitors-top-luxury-car-brands-to-consider-in-2026",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-sedans-performance-cars",
  "top-mercedes-benz-alternatives-in-2026-best-luxury-cars-to-consider",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-car-buyers-guide",
  "top-mercedes-benz-alternatives-in-2026-best-luxury-car-competitors",
  "mercedes-benz-competitors-the-top-luxury-car-rivals-in-2026",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-performance-value",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-car-options-compared",
  "top-mercedes-benz-alternatives-in-2026-luxury-brands-worth-considering",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-to-consider",
  "best-mercedes-benz-alternatives-in-2026-luxury-cars-worth-comparing",
  "best-mercedes-alternatives-in-2026-luxury-performance-options",
  "best-mercedes-benz-alternatives-in-2026-luxury-performance-value",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-brands-compared",
  "mercedes-benz-competitors-in-2026-the-top-luxury-car-rivals-you-should-know",
  "best-alternatives-to-mercedes-in-2026-luxury-sedans-suvs-performance-cars",
  "best-alternatives-to-mercedes-in-2026-luxury-cars-worth-considering",
  "best-mercedes-alternatives-in-2026-luxury-cars-worth-considering",
  "best-alternatives-to-mercedes-benz-in-2026-luxury-sedans-brands-compared",
  "top-alternatives-to-mercedes-benz-in-2026-luxury-performance-competitors",
  "top-mercedes-benz-alternatives-in-2026-luxury-sedans-suvs-compared",
];

const macbookRedirects: BlogRedirect[] = [
  ...MACBOOK_PRO_WEIGHT_DUPES,
  ...MACBOOK_WEIGHT_DUPES,
].map((slug) => ({
  source: `/blog/${slug}`,
  destination: MACBOOK_PRO_WEIGHT_CANONICAL,
  permanent: true,
}));

// DAN-1369 (child of DAN-1365 §C): split the MacBook *Air* weight query
// ("macbook air weight", 2,400 vol / pos 24) out of the MacBook *Pro* hub it
// was cannibalizing. This keeps TWO distinct survivors — the Pro hub above
// (MACBOOK_PRO_WEIGHT_CANONICAL, retitled Pro-specific by
// scripts/dan-1369-consolidate-macbook-air-weight.mjs) and the Air hub below.
//
// Canonical decision (recs caveat #1): the recs doc proposed an "-all-models-
// analyzed" Pro survivor, but that slug is already a 308 dupe folded into
// MACBOOK_PRO_WEIGHT_CANONICAL (live 200, ~190 dupes already point at it).
// Repointing would create a redirect chain, so we KEEP the established Pro
// canonical and only split out the Air cluster here. Single hop, no chains.
//
// Entity verification (recs caveat #2): the four macbook-air-weight-* sources
// render <title> "MacBook Air Weight …" (Air-primary). The two apple-macbook-*
// sources are generic "all models / which is lightest" rankings — folded into
// the Air hub because the Air is the weight/portability leader and the Air
// survivor ("which model is right for you") is the broad decision page.
const MACBOOK_AIR_WEIGHT_CANONICAL =
  "/blog/macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you";

const MACBOOK_AIR_WEIGHT_DUPES: string[] = [
  "macbook-air-weight-2025-2026-complete-specs-for-all-current-models",
  "macbook-air-weight-comparison-2025-2026-all-current-models",
  "macbook-air-weight-comparison-2025-2026-all-current-models-explained",
  "macbook-air-weight-comparison-2025-2026-which-model-should-you-choose",
  "apple-macbook-models-weight-comparison-2025-2026-which-is-lightest",
  "apple-macbook-weight-comparison-2025-2026-all-models-ranked",
];

const macbookAirRedirects: BlogRedirect[] = MACBOOK_AIR_WEIGHT_DUPES.map(
  (slug) => ({
    source: `/blog/${slug}`,
    destination: MACBOOK_AIR_WEIGHT_CANONICAL,
    permanent: true,
  })
);

// DAN-871: "US vs China GDP 2026" thin cluster collapsed onto the
// existing Comparison row, not a blog post — these dupes are spammy
// narrative cron output, the structured comparison page is the canonical.
// NOTE (DAN-1154): the canonical route is /compare/{slug}, NOT /vs/{slug}.
// There is no /vs route — /vs/* only 301-aliases a hardcoded handful of
// slugs in vs-redirects.ts, and this GDP slug is not among them, so a
// /vs/ destination would 404. The live page is /compare/... (HTTP 200,
// self-canonical = /compare/...), so we redirect there single-hop.
const GDP_US_CHINA_CANONICAL = "/compare/us-vs-china-gdp-comparison-2026";

const GDP_US_CHINA_DUPES: string[] = [
  "us-vs-china-gdp-comparison-2026-economic-leaders-face-off",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-face-off",
  "us-vs-china-gdp-comparison-2026-economic-outlook-and-growth-projections",
  "us-vs-china-gdp-comparison-2026-economic-power-growth-and-global-impact",
  "us-vs-china-gdp-comparison-2026-economic-growth-rankings-analysis",
  "us-vs-china-gdp-comparison-2026-latest-economic-data",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-head-to-head",
  "us-vs-china-gdp-comparison-2026-whos-leading-the-global-economy",
  "us-vs-china-gdp-comparison-2026-latest-economic-data-and-analysis",
  "us-vs-china-gdp-comparison-2026-which-economy-leads",
  "us-vs-china-gdp-2026-latest-economic-comparison-analysis",
  "us-vs-china-gdp-comparison-2026-who-has-the-larger-economy",
  "us-vs-china-gdp-comparison-2026-the-latest-economic-data",
  "us-vs-china-gdp-comparison-2026-economic-powers-face-off",
  "us-vs-china-gdp-comparison-2026-economic-powers-explained",
  "us-vs-china-gdp-comparison-2026-economic-power-showdown",
  "us-vs-china-gdp-comparison-2026-economic-power-in-the-modern-era",
  "us-vs-china-gdp-comparison-2026-whos-ahead",
  "us-vs-china-gdp-comparison-2026-latest-economic-data-analysis",
  "us-vs-china-gdp-2026-economic-power-comparison-projections",
  "us-vs-china-gdp-comparison-2026-economic-breakdown-and-outlook",
  "us-vs-china-gdp-comparison-2026-whos-really-ahead",
  "us-vs-china-gdp-comparison-2026-economic-powers-in-focus",
  "us-vs-china-gdp-comparison-2026-economic-superpowers-face-off",
  "us-vs-china-gdp-comparison-2026-nominal-vs-ppp-analysis",
  "us-vs-china-gdp-comparison-2026-economic-powers-ranked",
  "us-vs-china-gdp-comparison-2026-economic-superpowers-head-to-head",
  "us-vs-china-gdp-comparison-2026-latest-economic-figures",
  "us-vs-china-gdp-2026-economic-powerhouses-compared",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-ranked",
  "us-vs-china-gdp-comparison-2026-economic-power-face-off",
  "us-vs-china-gdp-comparison-2026-economic-power-and-projections",
  "us-vs-china-gdp-comparison-2026-economic-power-growth-outlook",
  "us-vs-china-gdp-comparison-2026-economic-outlook-key-metrics",
  "us-vs-china-gdp-comparison-2026-economic-power-and-growth-trends",
  "us-vs-china-nominal-gdp-2026-economic-comparison-projections",
  "us-vs-china-nominal-gdp-2026-economic-comparison-analysis",
  "us-vs-china-nominal-gdp-2026-who-has-the-larger-economy",
  "us-vs-china-nominal-gdp-2026-economic-comparison",
  "us-vs-china-nominal-gdp-2026-which-economy-is-larger",
  "us-vs-china-nominal-gdp-2026-economic-comparison-outlook",
  "us-vs-china-nominal-gdp-2026-latest-economic-comparison",
  "china-vs-usa-gdp-comparison-2026-economic-powerhouses-face-off",
  "china-vs-us-gdp-comparison-2026-economic-power-face-off",
];

const gdpRedirects: BlogRedirect[] = GDP_US_CHINA_DUPES.map((slug) => ({
  source: `/blog/${slug}`,
  destination: GDP_US_CHINA_CANONICAL,
  permanent: true,
}));

const mercedesRedirects: BlogRedirect[] = MERCEDES_DUPES.map((slug) => ({
  source: `/blog/${slug}`,
  destination: MERCEDES_CANONICAL,
  permanent: true,
}));

export const BLOG_REDIRECTS: BlogRedirect[] = [
  ...macbookRedirects,
  ...macbookAirRedirects,
  ...mercedesRedirects,
  ...gdpRedirects,
];

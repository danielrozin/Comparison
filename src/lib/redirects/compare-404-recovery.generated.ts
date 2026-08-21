/**
 * 404 recovery redirects — derived from real traffic, not from slug shapes.
 *
 * PostHog recorded 1,551 pageviews of the 404 page across 703 distinct
 * /compare/* paths in 30 days: 87% direct, 11% from Google, effectively no
 * bots. These are people and crawlers landing on dead URLs.
 *
 * Each entry below was produced by scripts/match-404-redirects.mjs, which
 * matches a dead slug to a live one only when both name the *same two
 * entities* once framing words ("comparison", "2026", "specs", "benchmarks")
 * and naming variants ("mike-tyson" / "ali") are normalised away. Fuzzy
 * near-matches were deliberately excluded: sending someone from
 * "windows-11-vs-windows-10" to "mac-vs-windows" is a worse outcome than the
 * 404, and it tells Google the two pages are equivalent when they are not.
 *
 * Every destination was verified to return 200 after following redirects.
 *
 * Regenerate:
 *   node scripts/match-404-redirects.mjs <404s.tsv>   # then keep confidence=exact
 */

export const RECOVERY_CONSOLIDATIONS_404: Record<string, string> = {
  // us-vs-china GDP cluster — 358 + 25 + 18 + 15 + 6 views
  "us-vs-china-gdp-comparison-2026": "us-vs-china-gdp",
  "us-vs-china-gdp-2026-latest-estimates": "us-vs-china-gdp",
  "us-vs-china-nominal-gdp-2026": "us-nominal-gdp-vs-china-2026",
  "nominal-gdp-us-vs-china-2026": "us-nominal-gdp-vs-china-2026",
  "us-nominal-gdp-2026-vs-china": "us-nominal-gdp-vs-china-2026",

  // us/china economy
  "china-vs-us-economy-2026-comparison": "us-economy-vs-china-economy",
  "us-vs-china-economy-comparison-2026": "us-economy-vs-china-economy",

  // console cluster — every variant folds into the one live page
  "ps5-vs-xbox-series-x-2026-comparison": "ps5-vs-xbox-series-x",
  "ps5-vs-xbox-series-x-comparison-2026": "ps5-vs-xbox-series-x",
  "ps5-vs-xbox-series-x-comparison-specs-2026": "ps5-vs-xbox-series-x",
  "ps5-vs-xbox-series-x-specs-performance-comparison-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-performance-benchmarks-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-comparison-specs-performance-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-specs-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-specs-comparison-2026": "ps5-vs-xbox-series-x",
  "playstation-5-vs-xbox-series-x-2026-comparison": "ps5-vs-xbox-series-x",

  // reversed entity order
  //
  // NOTE: mike-tyson-vs-muhammad-ali is deliberately NOT mapped here. DAN-2078
  // already folds ali-vs-tyson INTO it, so adding the reverse would form a
  // cycle. It 404'd because the survivor was archived; the fix was publishing
  // the survivor, not another redirect.
  "f-15-vs-f-16": "f-16-vs-f-15",
  "mercedes-vs-bmw": "bmw-vs-mercedes",
  "michael-jordan-vs-lebron-james": "lebron-vs-jordan",
  "14-inch-vs-16-inch-macbook-pro": "macbook-pro-14-vs-16-inch",
  "japan-vs-china-economy-comparison-2026": "china-vs-japan-economy-comparison-2026",
  "cristiano-ronaldo-vs-neymar-career-stats-comparison-2026":
    "neymar-vs-cristiano-ronaldo-career-stats-comparison-2026",
};

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
  // Both full-name orders 404. jordan-vs-lebron already folds into the live page.
  // Confirmed 2026-10-03: these two are 404, /compare/lebron-vs-jordan is 200.
  "michael-jordan-vs-lebron-james": "lebron-vs-jordan",
  "lebron-james-vs-michael-jordan": "lebron-vs-jordan",
  // Short NBA aliases. Both orders point at the live page so the alphabetical
  // shell cannot insert a hop (sixers-vs-knicks would otherwise become
  // knicks-vs-sixers, and wembanyama-vs-sga would become sga-vs-wembanyama).
  // Confirmed 2026-10-03: these four 404 or end on a 404. Destinations are the
  // published editorial pages.
  "sga-vs-wembanyama": "shai-gilgeous-alexander-vs-victor-wembanyama",
  "wembanyama-vs-sga": "shai-gilgeous-alexander-vs-victor-wembanyama",
  "knicks-vs-sixers": "knicks-vs-76ers",
  "sixers-vs-knicks": "knicks-vs-76ers",
  // Spurs vs Thunder / Knicks vs Spurs full names. Both orders are sources so
  // the alphabetical shell cannot insert a hop. Confirmed 2026-10-03:
  // san-antonio-spurs-vs-oklahoma-city-thunder 301s to
  // oklahoma-city-thunder-vs-san-antonio-spurs, which 404s; the Knicks full-name
  // order does the same onto new-york-knicks-vs-san-antonio-spurs.
  // The -match-player-stats slug is a published, indexed page (title
  // "Spurs vs Thunder 2026: 52-30 Record Comparison", championship-odds rows).
  // Mapping it here runs before the DB lookup and adds it to
  // REDIRECTED_COMPARE_SLUGS, which canonicalComparisonWhere() excludes from
  // the sitemap. Repo and sitemap/1.xml had no other legacy slug for
  // Knicks/Spurs, Thunder/Spurs, or Flagg/Wembanyama.
  "san-antonio-spurs-vs-oklahoma-city-thunder-match-player-stats":
    "oklahoma-city-thunder-vs-spurs",
  "san-antonio-spurs-vs-oklahoma-city-thunder": "oklahoma-city-thunder-vs-spurs",
  "oklahoma-city-thunder-vs-san-antonio-spurs": "oklahoma-city-thunder-vs-spurs",
  "new-york-knicks-vs-san-antonio-spurs": "knicks-vs-spurs",
  "san-antonio-spurs-vs-new-york-knicks": "knicks-vs-spurs",
  // Batch 3 name orders and -match-player-stats forms. Confirmed 2026-10-03
  // on the live site, sitemap/0.xml through sitemap/images.xml, and the repo:
  // none of these slugs is a 200 or a sitemap URL. Each is a 404, or a 301
  // whose alphabetical shell lands on a 404. Both orders are sources so the
  // shell cannot insert a hop. No odds or records title was found for these
  // pairs. Destinations are the new editorial pages, and the sources join
  // REDIRECTED_COMPARE_SLUGS so canonicalComparisonWhere() keeps them out of
  // the comparison sitemap.
  "ja-morant-vs-damian-lillard": "damian-lillard-vs-ja-morant",
  "ja-morant-vs-damian-lillard-match-player-stats": "damian-lillard-vs-ja-morant",
  "damian-lillard-vs-ja-morant-match-player-stats": "damian-lillard-vs-ja-morant",
  "ja-morant-match-player-stats-vs-damian-lillard": "damian-lillard-vs-ja-morant",
  "damian-lillard-match-player-stats-vs-ja-morant": "damian-lillard-vs-ja-morant",
  "ja-morant-vs-lillard": "damian-lillard-vs-ja-morant",
  "lillard-vs-ja-morant": "damian-lillard-vs-ja-morant",
  "ja-morant-vs-lillard-match-player-stats": "damian-lillard-vs-ja-morant",
  "lillard-vs-ja-morant-match-player-stats": "damian-lillard-vs-ja-morant",
  "ja-morant-match-player-stats-vs-lillard": "damian-lillard-vs-ja-morant",
  "lillard-match-player-stats-vs-ja-morant": "damian-lillard-vs-ja-morant",
  "morant-vs-damian-lillard": "damian-lillard-vs-ja-morant",
  "damian-lillard-vs-morant": "damian-lillard-vs-ja-morant",
  "morant-vs-damian-lillard-match-player-stats": "damian-lillard-vs-ja-morant",
  "damian-lillard-vs-morant-match-player-stats": "damian-lillard-vs-ja-morant",
  "morant-match-player-stats-vs-damian-lillard": "damian-lillard-vs-ja-morant",
  "damian-lillard-match-player-stats-vs-morant": "damian-lillard-vs-ja-morant",
  "morant-vs-lillard": "damian-lillard-vs-ja-morant",
  "lillard-vs-morant": "damian-lillard-vs-ja-morant",
  "morant-vs-lillard-match-player-stats": "damian-lillard-vs-ja-morant",
  "lillard-vs-morant-match-player-stats": "damian-lillard-vs-ja-morant",
  "morant-match-player-stats-vs-lillard": "damian-lillard-vs-ja-morant",
  "lillard-match-player-stats-vs-morant": "damian-lillard-vs-ja-morant",
  "stephen-curry-vs-lebron-james": "lebron-james-vs-stephen-curry",
  "lebron-james-vs-stephen-curry-match-player-stats": "lebron-james-vs-stephen-curry",
  "stephen-curry-vs-lebron-james-match-player-stats": "lebron-james-vs-stephen-curry",
  "lebron-james-match-player-stats-vs-stephen-curry": "lebron-james-vs-stephen-curry",
  "stephen-curry-match-player-stats-vs-lebron-james": "lebron-james-vs-stephen-curry",
  "lebron-james-vs-curry": "lebron-james-vs-stephen-curry",
  "curry-vs-lebron-james": "lebron-james-vs-stephen-curry",
  "lebron-james-vs-curry-match-player-stats": "lebron-james-vs-stephen-curry",
  "curry-vs-lebron-james-match-player-stats": "lebron-james-vs-stephen-curry",
  "lebron-james-match-player-stats-vs-curry": "lebron-james-vs-stephen-curry",
  "curry-match-player-stats-vs-lebron-james": "lebron-james-vs-stephen-curry",
  "lebron-vs-stephen-curry": "lebron-james-vs-stephen-curry",
  "stephen-curry-vs-lebron": "lebron-james-vs-stephen-curry",
  "lebron-vs-stephen-curry-match-player-stats": "lebron-james-vs-stephen-curry",
  "stephen-curry-vs-lebron-match-player-stats": "lebron-james-vs-stephen-curry",
  "lebron-match-player-stats-vs-stephen-curry": "lebron-james-vs-stephen-curry",
  "stephen-curry-match-player-stats-vs-lebron": "lebron-james-vs-stephen-curry",
  "lebron-vs-curry": "lebron-james-vs-stephen-curry",
  "curry-vs-lebron": "lebron-james-vs-stephen-curry",
  "lebron-vs-curry-match-player-stats": "lebron-james-vs-stephen-curry",
  "curry-vs-lebron-match-player-stats": "lebron-james-vs-stephen-curry",
  "lebron-match-player-stats-vs-curry": "lebron-james-vs-stephen-curry",
  "curry-match-player-stats-vs-lebron": "lebron-james-vs-stephen-curry",
  "kobe-vs-jordan": "jordan-vs-kobe",
  "jordan-vs-kobe-match-player-stats": "jordan-vs-kobe",
  "kobe-vs-jordan-match-player-stats": "jordan-vs-kobe",
  "jordan-match-player-stats-vs-kobe": "jordan-vs-kobe",
  "kobe-match-player-stats-vs-jordan": "jordan-vs-kobe",
  "jordan-vs-kobe-bryant": "jordan-vs-kobe",
  "kobe-bryant-vs-jordan": "jordan-vs-kobe",
  "jordan-vs-kobe-bryant-match-player-stats": "jordan-vs-kobe",
  "kobe-bryant-vs-jordan-match-player-stats": "jordan-vs-kobe",
  "jordan-match-player-stats-vs-kobe-bryant": "jordan-vs-kobe",
  "kobe-bryant-match-player-stats-vs-jordan": "jordan-vs-kobe",
  "michael-jordan-vs-kobe": "jordan-vs-kobe",
  "kobe-vs-michael-jordan": "jordan-vs-kobe",
  "michael-jordan-vs-kobe-match-player-stats": "jordan-vs-kobe",
  "kobe-vs-michael-jordan-match-player-stats": "jordan-vs-kobe",
  "michael-jordan-match-player-stats-vs-kobe": "jordan-vs-kobe",
  "kobe-match-player-stats-vs-michael-jordan": "jordan-vs-kobe",
  "michael-jordan-vs-kobe-bryant": "jordan-vs-kobe",
  "kobe-bryant-vs-michael-jordan": "jordan-vs-kobe",
  "michael-jordan-vs-kobe-bryant-match-player-stats": "jordan-vs-kobe",
  "kobe-bryant-vs-michael-jordan-match-player-stats": "jordan-vs-kobe",
  "michael-jordan-match-player-stats-vs-kobe-bryant": "jordan-vs-kobe",
  "kobe-bryant-match-player-stats-vs-michael-jordan": "jordan-vs-kobe",
  // Batch 4 name orders and -match-player-stats forms. Confirmed 2026-10-03
  // on the live site, sitemap/0.xml through sitemap/images.xml, and the repo:
  // none of these slugs is a 200 or a sitemap URL. Each is a 404, or a 301
  // whose alphabetical shell lands on a 404. Both orders are sources so the
  // shell cannot insert a hop. No odds or records title was found for these
  // pairs. houston-rockets-vs-lakers-match-player-stats is a different pair
  // and is not mapped. Destinations are the new editorial pages, and the
  // sources join REDIRECTED_COMPARE_SLUGS so canonicalComparisonWhere() keeps
  // them out of the comparison sitemap.
  "kon-knueppel-vs-cooper-flagg": "cooper-flagg-vs-kon-knueppel",
  "cooper-flagg-vs-kon-knueppel-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "kon-knueppel-vs-cooper-flagg-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "cooper-flagg-match-player-stats-vs-kon-knueppel": "cooper-flagg-vs-kon-knueppel",
  "kon-knueppel-match-player-stats-vs-cooper-flagg": "cooper-flagg-vs-kon-knueppel",
  "cooper-flagg-vs-knueppel": "cooper-flagg-vs-kon-knueppel",
  "knueppel-vs-cooper-flagg": "cooper-flagg-vs-kon-knueppel",
  "cooper-flagg-vs-knueppel-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "knueppel-vs-cooper-flagg-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "cooper-flagg-match-player-stats-vs-knueppel": "cooper-flagg-vs-kon-knueppel",
  "knueppel-match-player-stats-vs-cooper-flagg": "cooper-flagg-vs-kon-knueppel",
  "flagg-vs-kon-knueppel": "cooper-flagg-vs-kon-knueppel",
  "kon-knueppel-vs-flagg": "cooper-flagg-vs-kon-knueppel",
  "flagg-vs-kon-knueppel-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "kon-knueppel-vs-flagg-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "flagg-match-player-stats-vs-kon-knueppel": "cooper-flagg-vs-kon-knueppel",
  "kon-knueppel-match-player-stats-vs-flagg": "cooper-flagg-vs-kon-knueppel",
  "flagg-vs-knueppel": "cooper-flagg-vs-kon-knueppel",
  "knueppel-vs-flagg": "cooper-flagg-vs-kon-knueppel",
  "flagg-vs-knueppel-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "knueppel-vs-flagg-match-player-stats": "cooper-flagg-vs-kon-knueppel",
  "flagg-match-player-stats-vs-knueppel": "cooper-flagg-vs-kon-knueppel",
  "knueppel-match-player-stats-vs-flagg": "cooper-flagg-vs-kon-knueppel",
  "celtics-vs-lakers": "lakers-vs-celtics",
  "lakers-vs-celtics-match-player-stats": "lakers-vs-celtics",
  "celtics-vs-lakers-match-player-stats": "lakers-vs-celtics",
  "lakers-match-player-stats-vs-celtics": "lakers-vs-celtics",
  "celtics-match-player-stats-vs-lakers": "lakers-vs-celtics",
  "lakers-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-vs-lakers": "lakers-vs-celtics",
  "lakers-vs-boston-celtics-match-player-stats": "lakers-vs-celtics",
  "boston-celtics-vs-lakers-match-player-stats": "lakers-vs-celtics",
  "lakers-match-player-stats-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-match-player-stats-vs-lakers": "lakers-vs-celtics",
  "los-angeles-lakers-vs-celtics": "lakers-vs-celtics",
  "celtics-vs-los-angeles-lakers": "lakers-vs-celtics",
  "los-angeles-lakers-vs-celtics-match-player-stats": "lakers-vs-celtics",
  "celtics-vs-los-angeles-lakers-match-player-stats": "lakers-vs-celtics",
  "los-angeles-lakers-match-player-stats-vs-celtics": "lakers-vs-celtics",
  "celtics-match-player-stats-vs-los-angeles-lakers": "lakers-vs-celtics",
  "los-angeles-lakers-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-vs-los-angeles-lakers": "lakers-vs-celtics",
  "los-angeles-lakers-vs-boston-celtics-match-player-stats": "lakers-vs-celtics",
  "boston-celtics-vs-los-angeles-lakers-match-player-stats": "lakers-vs-celtics",
  "los-angeles-lakers-match-player-stats-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-match-player-stats-vs-los-angeles-lakers": "lakers-vs-celtics",
  "la-lakers-vs-celtics": "lakers-vs-celtics",
  "celtics-vs-la-lakers": "lakers-vs-celtics",
  "la-lakers-vs-celtics-match-player-stats": "lakers-vs-celtics",
  "celtics-vs-la-lakers-match-player-stats": "lakers-vs-celtics",
  "la-lakers-match-player-stats-vs-celtics": "lakers-vs-celtics",
  "celtics-match-player-stats-vs-la-lakers": "lakers-vs-celtics",
  "la-lakers-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-vs-la-lakers": "lakers-vs-celtics",
  "la-lakers-vs-boston-celtics-match-player-stats": "lakers-vs-celtics",
  "boston-celtics-vs-la-lakers-match-player-stats": "lakers-vs-celtics",
  "la-lakers-match-player-stats-vs-boston-celtics": "lakers-vs-celtics",
  "boston-celtics-match-player-stats-vs-la-lakers": "lakers-vs-celtics",
  "lebron-vs-durant": "durant-vs-lebron",
  "durant-vs-lebron-match-player-stats": "durant-vs-lebron",
  "lebron-vs-durant-match-player-stats": "durant-vs-lebron",
  "durant-match-player-stats-vs-lebron": "durant-vs-lebron",
  "lebron-match-player-stats-vs-durant": "durant-vs-lebron",
  "durant-vs-lebron-james": "durant-vs-lebron",
  "lebron-james-vs-durant": "durant-vs-lebron",
  "durant-vs-lebron-james-match-player-stats": "durant-vs-lebron",
  "lebron-james-vs-durant-match-player-stats": "durant-vs-lebron",
  "durant-match-player-stats-vs-lebron-james": "durant-vs-lebron",
  "lebron-james-match-player-stats-vs-durant": "durant-vs-lebron",
  "kevin-durant-vs-lebron": "durant-vs-lebron",
  "lebron-vs-kevin-durant": "durant-vs-lebron",
  "kevin-durant-vs-lebron-match-player-stats": "durant-vs-lebron",
  "lebron-vs-kevin-durant-match-player-stats": "durant-vs-lebron",
  "kevin-durant-match-player-stats-vs-lebron": "durant-vs-lebron",
  "lebron-match-player-stats-vs-kevin-durant": "durant-vs-lebron",
  "kevin-durant-vs-lebron-james": "durant-vs-lebron",
  "lebron-james-vs-kevin-durant": "durant-vs-lebron",
  "kevin-durant-vs-lebron-james-match-player-stats": "durant-vs-lebron",
  "lebron-james-vs-kevin-durant-match-player-stats": "durant-vs-lebron",
  "kevin-durant-match-player-stats-vs-lebron-james": "durant-vs-lebron",
  "lebron-james-match-player-stats-vs-kevin-durant": "durant-vs-lebron",
  // Batch 5 name orders and -match-player-stats forms.
  // The hub hrefs are these canonical slugs, so the pages are not redirect sources.
  // Confirmed 2026-10-03 on the live site, sitemap/0.xml through
  // sitemap/images.xml, and the repo: none of these slugs is a 200
  // or a sitemap URL. Each is a 404, or a 301 whose alphabetical
  // shell lands on a 404. Both orders are sources so the shell
  // cannot insert a hop. No odds or records title was found for
  // Embiid/Jokic or Kobe/Curry. Destinations are the new editorial
  // pages, and the sources join REDIRECTED_COMPARE_SLUGS so
  // canonicalComparisonWhere() keeps them out of the comparison sitemap.
  "joel-embiid-vs-nikola-jokic": "embiid-vs-jokic",
  "joel-embiid-vs-nikola-jokic-match-player-stats": "embiid-vs-jokic",
  "joel-embiid-match-player-stats-vs-nikola-jokic": "embiid-vs-jokic",
  "nikola-jokic-vs-joel-embiid": "embiid-vs-jokic",
  "nikola-jokic-vs-joel-embiid-match-player-stats": "embiid-vs-jokic",
  "nikola-jokic-match-player-stats-vs-joel-embiid": "embiid-vs-jokic",
  "joel-embiid-vs-jokic": "embiid-vs-jokic",
  "joel-embiid-vs-jokic-match-player-stats": "embiid-vs-jokic",
  "joel-embiid-match-player-stats-vs-jokic": "embiid-vs-jokic",
  "jokic-vs-joel-embiid": "embiid-vs-jokic",
  "jokic-vs-joel-embiid-match-player-stats": "embiid-vs-jokic",
  "jokic-match-player-stats-vs-joel-embiid": "embiid-vs-jokic",
  "embiid-vs-nikola-jokic": "embiid-vs-jokic",
  "embiid-vs-nikola-jokic-match-player-stats": "embiid-vs-jokic",
  "embiid-match-player-stats-vs-nikola-jokic": "embiid-vs-jokic",
  "nikola-jokic-vs-embiid": "embiid-vs-jokic",
  "nikola-jokic-vs-embiid-match-player-stats": "embiid-vs-jokic",
  "nikola-jokic-match-player-stats-vs-embiid": "embiid-vs-jokic",
  "embiid-vs-jokic-match-player-stats": "embiid-vs-jokic",
  "embiid-match-player-stats-vs-jokic": "embiid-vs-jokic",
  "jokic-vs-embiid": "embiid-vs-jokic",
  "jokic-vs-embiid-match-player-stats": "embiid-vs-jokic",
  "jokic-match-player-stats-vs-embiid": "embiid-vs-jokic",
  "kobe-vs-curry": "kobe-bryant-vs-steph-curry",
  "kobe-vs-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-match-player-stats-vs-curry": "kobe-bryant-vs-steph-curry",
  "curry-vs-kobe": "kobe-bryant-vs-steph-curry",
  "curry-vs-kobe-match-player-stats": "kobe-bryant-vs-steph-curry",
  "curry-match-player-stats-vs-kobe": "kobe-bryant-vs-steph-curry",
  "kobe-vs-steph-curry": "kobe-bryant-vs-steph-curry",
  "kobe-vs-steph-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-match-player-stats-vs-steph-curry": "kobe-bryant-vs-steph-curry",
  "steph-curry-vs-kobe": "kobe-bryant-vs-steph-curry",
  "steph-curry-vs-kobe-match-player-stats": "kobe-bryant-vs-steph-curry",
  "steph-curry-match-player-stats-vs-kobe": "kobe-bryant-vs-steph-curry",
  "kobe-vs-stephen-curry": "kobe-bryant-vs-steph-curry",
  "kobe-vs-stephen-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-match-player-stats-vs-stephen-curry": "kobe-bryant-vs-steph-curry",
  "stephen-curry-vs-kobe": "kobe-bryant-vs-steph-curry",
  "stephen-curry-vs-kobe-match-player-stats": "kobe-bryant-vs-steph-curry",
  "stephen-curry-match-player-stats-vs-kobe": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-vs-curry": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-vs-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-match-player-stats-vs-curry": "kobe-bryant-vs-steph-curry",
  "curry-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "curry-vs-kobe-bryant-match-player-stats": "kobe-bryant-vs-steph-curry",
  "curry-match-player-stats-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-vs-steph-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-match-player-stats-vs-steph-curry": "kobe-bryant-vs-steph-curry",
  "steph-curry-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "steph-curry-vs-kobe-bryant-match-player-stats": "kobe-bryant-vs-steph-curry",
  "steph-curry-match-player-stats-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-vs-stephen-curry": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-vs-stephen-curry-match-player-stats": "kobe-bryant-vs-steph-curry",
  "kobe-bryant-match-player-stats-vs-stephen-curry": "kobe-bryant-vs-steph-curry",
  "stephen-curry-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "stephen-curry-vs-kobe-bryant-match-player-stats": "kobe-bryant-vs-steph-curry",
  "stephen-curry-match-player-stats-vs-kobe-bryant": "kobe-bryant-vs-steph-curry",
  "14-inch-vs-16-inch-macbook-pro": "macbook-pro-14-vs-16-inch",
  "japan-vs-china-economy-comparison-2026": "china-vs-japan-economy-comparison-2026",
  "cristiano-ronaldo-vs-neymar-career-stats-comparison-2026":
    "neymar-vs-cristiano-ronaldo-career-stats-comparison-2026",
  // Java vs TypeScript name orders. java-vs-typescript is the alphabetical
  // survivor and is not a redirect source.
  "typescript-vs-java": "java-vs-typescript",
  "ts-vs-java": "java-vs-typescript",
  "java-vs-ts": "java-vs-typescript",
};

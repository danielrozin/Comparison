/**
 * /compare/* → /compare/* canonical-consolidation 301 redirects.
 *
 * Source of truth for compare-to-compare 301s used when two comparison pages
 * target the same search intent (cannibalization). The losing slug is archived
 * in the DB and 301'd here at the edge via next.config.ts redirects(), so the
 * redirect survives even if the archived row is later deleted.
 *
 * Three layers, merged below (later layers win on key collision):
 *   1. MANUAL_CONSOLIDATIONS  — hand-curated, keyword-intent clusters (DAN-1169).
 *   2. ALIAS_CONSOLIDATIONS   — same comparison under different entity *names*
 *      (e.g. "paramount" vs "paramount-plus"); cannot be detected by slug-order
 *      sorting, so listed explicitly (DAN-1265).
 *   3. ORDERING_CONSOLIDATIONS — generated A-vs-B / B-vs-A ordering duplicates
 *      (DAN-1265, 166 clusters). See compare-ordering-redirects.generated.ts.
 *
 * DAN-1269 / DAN-1908 — the PS5 Pro vs Xbox Series X cluster originally
 * consolidated into the keyword-suffixed slug `…-performance-comparison-2026`.
 * DAN-1890 Phase B later archived that slug (archived rows 404), so the whole
 * cluster is now folded into the clean, still-`published` canonical
 * `ps5-pro-vs-xbox-series-x` instead. See the MANUAL_CONSOLIDATIONS note below.
 *
 * Add new entries as more compare-route cannibalization clusters are found:
 * map each retired slug to the canonical slug it should consolidate into.
 */

import type { BlogRedirect } from "./blog-redirects";
import { DEAD_REDIRECT_SOURCES_DAN2045 } from "./compare-dead-redirects.dan2045.generated";
import { ORDERING_CONSOLIDATIONS } from "./compare-ordering-redirects.generated";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "./compare-ordering-redirects.dan1800.generated";
import { RIVALRY_CONSOLIDATIONS_DAN2078 } from "./compare-rivalry-redirects.dan2078.generated";

// DAN-1169: PS5 Pro vs Xbox Series X intent split across two live pages; keep the
// keyword-aligned page (the one Semrush shows ranking) and fold the short dup in.
//
// DAN-1281: shared-model-number legacy stub. The bare-number entity "16" sorts
// before "iphone-15" alphabetically, so the runtime ordering-canonicalizer
// (sortComparisonSlug in [slug].tsx) folds the legacy slug `iphone-15-vs-16`
// into the mangled, non-sitemapped thin page `16-vs-iphone-15`. Pin it here so it
// 308s in ONE hop straight to the real sitemap canonical
// `iphone-15-vs-iphone-16` ("iPhone 16 vs iPhone 15") at the edge, before the
// runtime sort ever runs. (Only known shared-model-number stub in the 1,964-slug
// sitemap sweep — explicit pin keeps blast radius at one URL.)
const MANUAL_CONSOLIDATIONS: Record<string, string> = {
  // DAN-1908: PS5 Pro vs Xbox Series X cluster was consolidating INTO the
  // keyword-suffixed slug `…-performance-comparison-2026`, but DAN-1890 Phase B
  // later archived that slug (archived rows 404 via getStaticProps, DAN-1886),
  // so every ordering 308'd straight into a 404 — including the clean canonical
  // `ps5-pro-vs-xbox-series-x` that was pitched to an editor in wave-1 outreach.
  // The clean slug is itself a healthy `published` 200 record, so flip the whole
  // cluster to fold INTO it: the mirror ordering + the archived keyword/spec
  // variants all 308 at the edge to the live canonical.
  "xbox-series-x-vs-ps5-pro": "ps5-pro-vs-xbox-series-x",
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026":
    "ps5-pro-vs-xbox-series-x",
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026-keyword-suffix":
    "ps5-pro-vs-xbox-series-x",
  "ps5-pro-vs-xbox-series-x-performance": "ps5-pro-vs-xbox-series-x",
  "ps5-pro-vs-xbox-series-x-specs": "ps5-pro-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-pro-specs": "ps5-pro-vs-xbox-series-x",
  "iphone-15-vs-16": "iphone-15-vs-iphone-16",
  // DAN-1365 §A: Kobe/LeBron cannibalization. Two self-canonical live pages with
  // an identical "Kobe Bryant vs LeBron James" H1 split authority. DAN-1365 kept
  // `kobe-vs-lebron`, whose slug token-matches the dominant short query ("kobe vs
  // lebron", 1,600 vol, pos 27).
  //
  // DAN-2065: a later archive sweep set `kobe-vs-lebron` to status="archived", and
  // archived rows 404 (DAN-1886) — so the chosen survivor is dead and this redirect
  // was sending the still-published full-name page into a 404. Flipped to fold into
  // the slug that is actually published, per the DAN-1908 precedent. To restore the
  // keyword-aligned slug, re-publish its DB row first; do not re-point a redirect at
  // an archived slug.
  "kobe-vs-lebron": "kobe-bryant-vs-lebron-james",
  // DAN-1747: Bloomberg/WSJ duplicate canonical. Two self-canonical live pages
  // (both 200) split link equity for "bloomberg vs wsj" (DAN-1176/DAN-1169 watch
  // keyword, baseline pos 17). Survivor is the full-name slug
  // `bloomberg-vs-the-wall-street-journal` — DAN-1288 gave it the better on-page
  // optimization. Fold the short `bloomberg-vs-wsj` slug into it (308 at edge).
  "bloomberg-vs-wsj": "bloomberg-vs-the-wall-street-journal",

  // DAN-346 (traffic-first SEO / DAN-1800 spam-recovery): the standard
  // "PlayStation 5 vs Xbox Series X" matchup existed as ELEVEN live self-canonical
  // 200 pages — the clean canonical plus ten keyword-permutation long-tail slugs
  // (…-specs-performance-2026, …-performance-comparison-2026-games-differences, …).
  // All eleven carry the IDENTICAL entity pair [playstation-5 + xbox-series-x] and
  // rehash the same specs/performance/Game-Pass ground (their shortAnswers overlap
  // and even contradict — one claims "16.7 TFLOPS"), so they are duplicates, not
  // distinct facets. Combined they drew ~12.7k GSC impressions over 28d at ~0 CTR:
  // the exact scaled-content-abuse fingerprint the June 2026 spam update demotes.
  //
  // DAN-2078's generator could not see them — it groups by reverse-ORDER pairs
  // (A-vs-B / B-vs-A), not keyword permutations that share the same tokens in the
  // same order. Fold all ten into the clean, un-stuffed canonical `ps5-vs-xbox-series-x`
  // (a live 200 and already a DAN-2078 survivor: `playstation-5-vs-xbox-series-x`
  // 308s into it). Choosing the clean slug over the highest-impression keyword-stuffed
  // one follows the DAN-1908 PS5-Pro precedent above — a spam-recovery consolidation
  // must not enshrine a scaled-content URL as the survivor.
  //
  // Deliberately NOT folded: `xbox-series-x-vs-ps5-performance-comparison-latest-2026`
  // is entity pair [playstation-5-pro + xbox-series-x] (a distinct PS5 *Pro* matchup),
  // and the `ps5-pro-vs-xbox-series-x` cluster is handled by MANUAL_CONSOLIDATIONS above.
  "xbox-series-x-vs-ps5-specs-performance-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-performance-comparison-2026-games-differences":
    "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-performance-comparison-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-specs-performance-comparison-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-specs-2026": "ps5-vs-xbox-series-x",
  "playstation-5-vs-xbox-series-x-2026-comparison": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-performance-specs-comparison-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-specs-performance-games-2026": "ps5-vs-xbox-series-x",
  "xbox-series-x-vs-ps5-performance-games-comparison-2026": "ps5-vs-xbox-series-x",
  "ps5-vs-xbox-series-x-comparison-specs-2026": "ps5-vs-xbox-series-x",

  // DAN-2323 (2026-07-17): post-2026-07-14 enrichment-cron drift. The cron minted
  // NEW keyword-suffixed near-duplicates of matchups that already have a clean
  // canonical 200 page — the same self-cannibalization DAN-2078/DAN-346 fixed, but
  // out of DAN-2078's scope (it groups by reverse-ORDER entity pairs; a
  // keyword-suffixed slug parses as a DISTINCT entity pair, e.g.
  // [california-population + texas-2026], so its generator's ONLY_NEW_CLUSTERS
  // allowlist deliberately excluded them). These are keyword-permutation spam
  // variants, so the DAN-346 remedy applies: fold each …-2026 / …-comparison-2026
  // variant INTO its clean, un-stuffed canonical — never enshrine a scaled-content
  // URL as the survivor, even when it carries more impressions (california). All
  // four survivors verified live 200 in prod 2026-07-17; all four sources verified
  // live 200 (net-new pages, not archived), so each is a valid redirect per DAN-2045.
  "california-population-vs-texas-2026": "california-vs-texas",
  "japan-vs-china-economic-comparison-2026": "japan-vs-china",
  "disney-vs-netflix-2026": "disney-vs-netflix",
  // nfl-vs-nba-revenue is the FACET DAN-2078 deliberately kept live; fold this
  // keyword-suffixed variant into that facet, not into the base nfl-vs-nba.
  "nfl-vs-nba-revenue-comparison-2026": "nfl-vs-nba-revenue",
};

// DAN-1265: entity-alias duplicates — same comparison, different entity naming.
// Survivor chosen by current Semrush rank (per the DAN-1264 audit). "paramount"
// here is Paramount+, the same service as "paramount-plus".
//   paramount-vs-peacock (pos 39) beats paramount-plus-vs-peacock (pos 57).
// DAN-1742: collapse 2-hop chain. peacock-vs-paramount-plus would otherwise go
// through the runtime sortComparisonSlug (→ paramount-plus-vs-peacock 308) then
// the alias redirect (→ paramount-vs-peacock 308). Pin directly at the edge.
const ALIAS_CONSOLIDATIONS: Record<string, string> = {
  "paramount-plus-vs-peacock": "paramount-vs-peacock",
  "peacock-vs-paramount-plus": "paramount-vs-peacock",
  // DAN-2078: "mercedes" and "mercedes-benz" resolve to the same brand.
  // bmw-vs-mercedes is the shorter/dominant slug; fold the full-name variant in.
  "bmw-vs-mercedes-benz": "bmw-vs-mercedes",
};

/**
 * DAN-2115 — title-derived slugs. A comparison's display title and its slug are
 * allowed to disagree ("FreshBooks vs QuickBooks Online" lives at
 * /compare/freshbooks-vs-quickbooks; "Amazon Web Services (AWS) vs Microsoft
 * Azure" at /compare/aws-vs-azure). Anyone who builds the URL from the title we
 * printed — a reader, a journalist citing the SaaS study, an LLM summarising the
 * page — lands on a 404 for a page we do publish.
 *
 * That is not hypothetical: DAN-2112 was filed claiming the study "links to 404s
 * incl. flagship Mailchimp vs HubSpot", and DAN-2115 that
 * /compare/freshbooks-vs-quickbooks-online is a dead exemplar link. Neither is a
 * link on the page — both were title-constructed URLs. The hrefs were 200 all
 * along, but the 404s the reporters hit are real and every study reader can hit
 * them the same way. So: alias the title-derived form onto the canonical slug.
 *
 * Every source below was verified 404 in prod (never shadow a live page) and
 * every destination 200. `copilot-vs-chatgpt` is deliberately absent — it already
 * 308s via the ordering layer.
 */
const TITLE_ALIAS_CONSOLIDATIONS: Record<string, string> = {
  "freshbooks-vs-quickbooks-online": "freshbooks-vs-quickbooks",
  "quickbooks-online-vs-freshbooks": "freshbooks-vs-quickbooks",
  "amazon-web-services-vs-microsoft-azure": "aws-vs-azure",
  "amazon-web-services-vs-azure": "aws-vs-azure",
  "aws-vs-microsoft-azure": "aws-vs-azure",
  "microsoft-azure-vs-amazon-web-services": "aws-vs-azure",
  "microsoft-copilot-vs-chatgpt": "chatgpt-vs-copilot",
  "chatgpt-vs-microsoft-copilot": "chatgpt-vs-copilot",
  "zoom-vs-google-meet-vs-microsoft-teams": "zoom-vs-google-meet-vs-teams",
  "zoom-vs-google-meet-vs-microsoft-teams-video-conferencing-compared":
    "zoom-vs-google-meet-vs-teams",
};

/**
 * DAN-2065 — 18 clusters where ORDERING_CONSOLIDATIONS kept the wrong survivor.
 *
 * The generated map picked each cluster's survivor by viewCount — but view_count
 * is seed data, not traffic (DAN-2037). In 18 clusters that retired the slug that
 * is actually `published` and kept the one that is `archived`. Archived rows 404
 * (DAN-1886), so each of those 18 live pages was 301'ing at the edge straight into
 * a 404: /compare/zoom-vs-microsoft-teams, tesla-vs-rivian, india-vs-china,
 * netflix-vs-apple-tv-plus … all verified dead in prod. The ordering-canonicalizer
 * in [slug].tsx then bounced the archived target back to the published one, so some
 * clusters also formed a redirect loop (starbucks-vs-dunkin ⇄ dunkin-vs-starbucks).
 *
 * Exactly the failure the PS5-Pro cluster hit in DAN-1908, so the same remedy: fold
 * each cluster INTO the slug that is actually published. Keyed retired -> survivor
 * and applied after the merge, because this has to *remove* the inverted source key,
 * which a later spread cannot do (it could only overwrite its value, and mapping a
 * slug to itself is a self-loop).
 */
const SURVIVOR_OVERRIDES: Record<string, string> = {
  "apple-tv-plus-vs-netflix": "netflix-vs-apple-tv-plus",
  "bmw-x5-vs-mercedes-gle": "mercedes-gle-vs-bmw-x5",
  "china-gdp-vs-us": "us-vs-china-gdp",
  "china-vs-india": "india-vs-china",
  "convertkit-vs-mailchimp": "mailchimp-vs-convertkit",
  "doordash-vs-instacart": "instacart-vs-doordash",
  "f-22-vs-f-35": "f-35-vs-f-22",
  "fidelity-vs-robinhood": "robinhood-vs-fidelity",
  "fidelity-vs-vanguard": "vanguard-vs-fidelity",
  "honda-cr-v-vs-toyota-rav4": "toyota-rav4-vs-honda-cr-v",
  "hubspot-vs-mailchimp": "mailchimp-vs-hubspot",
  "microsoft-teams-vs-zoom": "zoom-vs-microsoft-teams",
  "nordictrack-vs-peloton": "peloton-vs-nordictrack",
  "rivian-vs-tesla": "tesla-vs-rivian",
  "roborock-vs-roomba": "roomba-vs-roborock",
  "shein-vs-temu": "temu-vs-shein",
  "spotify-vs-tidal": "tidal-vs-spotify",
  "starbucks-vs-dunkin": "dunkin-vs-starbucks",
};

// Merge order: DAN-1265 ordering first, then the DAN-1800 ordering sweep, then
// alias, then rivalry, then manual overrides win. The loop/chain guard below drops
// any source that collides with a survivor across all layers, so later layers can
// safely re-map a slug an earlier layer used as a destination.
//
// DAN-2078 sits after the ordering layers on purpose: it is keyed by ENTITY PAIR,
// not slug shape, so it is the only layer that can see a duplicate whose two slugs
// share no tokens (`us-economy-vs-china-economy` / `china-economy-size-vs-us`). Where
// it overlaps an ordering entry it is the better-informed of the two — its survivor
// comes from real GSC impressions, not the seed `viewCount` that misled DAN-1265.
const COMPARE_CONSOLIDATIONS: Record<string, string> = {
  ...ORDERING_CONSOLIDATIONS,
  ...ORDERING_CONSOLIDATIONS_DAN1800,
  ...ALIAS_CONSOLIDATIONS,
  ...TITLE_ALIAS_CONSOLIDATIONS,
  ...RIVALRY_CONSOLIDATIONS_DAN2078,
  ...MANUAL_CONSOLIDATIONS,
};

// DAN-2078: the rivalry layer's survivor is authoritative over an earlier layer that
// retired that same slug. Without this, a slug we just chose to KEEP (because GSC says
// it carries the impressions) could still be sitting as a redirect *source* in the
// ordering map — and the merge above cannot remove it, only overwrite its value. That
// is the exact shape of the DAN-2065 inversion: a live page 308ing away to a page we
// meant to retire. Same remedy as SURVIVOR_OVERRIDES below: delete the survivor's key.
for (const survivor of Object.values(RIVALRY_CONSOLIDATIONS_DAN2078)) {
  delete COMPARE_CONSOLIDATIONS[survivor];
}

// DAN-2065: re-point the inverted clusters. Deleting the survivor's own key is the
// point — that slug is the live page and must not redirect anywhere.
for (const [retired, survivor] of Object.entries(SURVIVOR_OVERRIDES)) {
  delete COMPARE_CONSOLIDATIONS[survivor];
  COMPARE_CONSOLIDATIONS[retired] = survivor;
}

/**
 * Chain resolver: collapse a -> b -> c into a -> c, so every source 308s to its
 * TERMINAL survivor in exactly one hop.
 *
 * This used to be a guard that simply DROPPED any source which was also a survivor.
 * For a self-loop that is right, but for a chain it is actively harmful: given
 * `disney-plus-vs-netflix -> netflix-vs-disney-plus` (DAN-1265 ordering layer) and
 * `netflix-vs-disney-plus -> disney-vs-netflix` (DAN-2078 rivalry layer), it dropped
 * the SECOND and kept the first — leaving a live 308 pointing straight at a page we
 * had just decided to retire, and the duplicate uncollapsed. Three of DAN-2078's 14
 * consolidations were silently voided that way (disney, burger-king, mercedes-gle).
 *
 * Resolving instead of dropping also fixes the pre-existing 2-hop chains, which cost
 * a redirect hop of link equity each. Cycles are still dropped and shout in dev — a
 * cycle means two layers disagree about the survivor and neither may win by accident.
 */
// DAN-2045: a redirect may only be emitted when its destination is a live page.
// The ordering layers paired A-vs-B with B-vs-A while both were published; DAN-1890
// Phase B later archived BOTH members of 163 clusters, leaving redirects that 308
// onto a 404. Bouncing a crawler through a hop to reach a dead end is strictly worse
// than serving the 404 directly, so drop the source entirely.
//
// Destination liveness is a DB fact and this map is built synchronously (it feeds
// next.config redirects() and canonicalComparisonWhere()), so the list is generated
// rather than queried — see scripts/dan2045-generate-dead-redirects.ts, which
// refuses to list a source that is still published.
const DEAD_REDIRECT_SOURCES = new Set(DEAD_REDIRECT_SOURCES_DAN2045);

const MAX_CHAIN_HOPS = 8;
const safeConsolidations: Record<string, string> = {};
for (const [from] of Object.entries(COMPARE_CONSOLIDATIONS)) {
  if (DEAD_REDIRECT_SOURCES.has(from)) continue;
  const seen = new Set<string>([from]);
  let to = COMPARE_CONSOLIDATIONS[from];
  let hops = 0;
  while (COMPARE_CONSOLIDATIONS[to] !== undefined && hops < MAX_CHAIN_HOPS) {
    if (seen.has(to)) break; // cycle — fall through to the guard below
    seen.add(to);
    to = COMPARE_CONSOLIDATIONS[to];
    hops++;
  }

  const unresolved = COMPARE_CONSOLIDATIONS[to] !== undefined; // cycle or too deep
  if (from === to || unresolved) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[compare-redirects] skipping unsafe consolidation ${from} -> ${to} (self-loop or unresolvable chain)`,
      );
    }
    continue;
  }
  safeConsolidations[from] = to;
}

export const COMPARE_REDIRECTS: BlogRedirect[] = Object.entries(
  safeConsolidations,
).map(([from, to]) => ({
  source: `/compare/${from}`,
  destination: `/compare/${to}`,
  permanent: true as const,
}));

/**
 * Runtime lookup for the consolidation map (same data the edge redirects use).
 * Returns the survivor slug a retired comparison slug should fold into, or null
 * if the slug is not a known duplicate. Used by the generation route to refuse
 * recreating an archived duplicate (DAN-1265 source prevention).
 */
export function getConsolidatedCompareSlug(slug: string): string | null {
  return safeConsolidations[slug] ?? null;
}

/**
 * DAN-2067 — every slug that 308s at the edge. A retired slug is *supposed* to be
 * archived in the DB too, but archiving is a separate script from adding the
 * redirect, so the two drift: on 2026-07-13 the live sitemap shipped 491 URLs of
 * which 22 were redirect sources still marked `status="published"`. Google was
 * being handed 22 redirects as if they were pages, and every corpus figure we
 * published counted them as pages.
 *
 * `status="published"` is therefore NOT sufficient to mean "this is a real page".
 * The redirect map is the edge's own source of truth, so deriving the exclusion
 * from it cannot drift the way a DB status column can. Anything that counts or
 * emits comparison pages must exclude these — use `canonicalComparisonWhere()`
 * (src/lib/db/canonical-comparisons.ts) rather than filtering by status alone.
 *
 * ADDING A SLUG HERE SHRINKS THE PUBLISHED CATALOG. DAN-2078 folded 14 rivalries into
 * their survivors and left CANONICAL_COMPARISON_COUNT_FALLBACK at 468 while the live
 * catalog fell to 454, so every page's JSON-LD overstated the corpus by 14. If you add
 * to `safeConsolidations`, re-run `scripts/dan2067-verify.ts` and lower that constant in
 * the same PR — the guard in src/lib/seo/__tests__/corpus-count-truthfulness.test.ts
 * will fail the build until you do.
 */
export const REDIRECTED_COMPARE_SLUGS: string[] = Object.keys(safeConsolidations);

/** True when `slug` 308s at the edge — i.e. it is a redirect, not a page. */
export function isRedirectedCompareSlug(slug: string): boolean {
  return slug in safeConsolidations;
}

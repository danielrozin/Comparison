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
import { ORDERING_CONSOLIDATIONS } from "./compare-ordering-redirects.generated";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "./compare-ordering-redirects.dan1800.generated";

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
// alias, then manual overrides win. The loop/chain guard below drops any source
// that collides with a survivor across all layers, so later layers can safely
// re-map a slug an earlier layer used as a destination.
const COMPARE_CONSOLIDATIONS: Record<string, string> = {
  ...ORDERING_CONSOLIDATIONS,
  ...ORDERING_CONSOLIDATIONS_DAN1800,
  ...ALIAS_CONSOLIDATIONS,
  ...MANUAL_CONSOLIDATIONS,
};

// DAN-2065: re-point the inverted clusters. Deleting the survivor's own key is the
// point — that slug is the live page and must not redirect anywhere.
for (const [retired, survivor] of Object.entries(SURVIVOR_OVERRIDES)) {
  delete COMPARE_CONSOLIDATIONS[survivor];
  COMPARE_CONSOLIDATIONS[retired] = survivor;
}

// Loop / chain guard: a survivor (destination) must never also be a retired
// source — that would 301-chain or loop at the edge. Drop any such source and
// fail loudly in dev so a bad regen can't ship a redirect loop.
const survivors = new Set(Object.values(COMPARE_CONSOLIDATIONS));
const safeConsolidations: Record<string, string> = {};
for (const [from, to] of Object.entries(COMPARE_CONSOLIDATIONS)) {
  if (from === to || survivors.has(from)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[compare-redirects] skipping unsafe consolidation ${from} -> ${to} (self-loop or chained survivor)`,
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

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
  // an identical "Kobe Bryant vs LeBron James" H1 split authority. The survivor is
  // `kobe-vs-lebron` — its slug token-matches the dominant short query
  // ("kobe vs lebron", 1,600 vol, pos 27), 4× the dup's keyword. Fold the
  // full-name slug in; its full-name query stays covered by the survivor's H1.
  "kobe-bryant-vs-lebron-james": "kobe-vs-lebron",
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

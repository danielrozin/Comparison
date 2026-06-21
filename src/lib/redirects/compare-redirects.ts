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
 * DAN-1269 — DAN-1169 (PR #72) redirected only the xbox-first short slug and
 * missed the mirror ps5-first short slug, leaving `ps5-pro-vs-xbox-series-x` as
 * a thin, self-canonicalizing 200 duplicate competing for the same cluster.
 * Fold that short slug into the same canonical so both orderings 308 to it.
 *
 * Add new entries as more compare-route cannibalization clusters are found:
 * map each retired slug to the canonical slug it should consolidate into.
 */

import type { BlogRedirect } from "./blog-redirects";
import { ORDERING_CONSOLIDATIONS } from "./compare-ordering-redirects.generated";

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
  "xbox-series-x-vs-ps5-pro":
    "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "ps5-pro-vs-xbox-series-x":
    "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "iphone-15-vs-16": "iphone-15-vs-iphone-16",
};

// DAN-1265: entity-alias duplicates — same comparison, different entity naming.
// Survivor chosen by current Semrush rank (per the DAN-1264 audit). "paramount"
// here is Paramount+, the same service as "paramount-plus".
//   paramount-vs-peacock (pos 39) beats paramount-plus-vs-peacock (pos 57).
const ALIAS_CONSOLIDATIONS: Record<string, string> = {
  "paramount-plus-vs-peacock": "paramount-vs-peacock",
};

// Merge order: ordering (generated) first, then alias, then manual overrides win.
const COMPARE_CONSOLIDATIONS: Record<string, string> = {
  ...ORDERING_CONSOLIDATIONS,
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

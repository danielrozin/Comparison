/**
 * /entity/* → /entity/* canonical-consolidation 308 redirects.
 *
 * Source of truth for entity-to-entity redirects used when two entity profile
 * pages target the same search intent (duplicate canonical / link-equity split).
 * The losing slug is 308'd here at the edge via next.config.ts redirects(), so
 * the redirect survives independent of the entity data source.
 *
 * DAN-1748 — "browns" duplicate canonical. Both `/entity/browns` and
 * `/entity/cleveland-browns` returned 200 and self-declared as canonical,
 * splitting Google link equity for "versus browns" (6,600 vol/mo, DAN-1176/
 * DAN-1169 watch keyword, baseline pos 18). DAN-1289 gave `cleveland-browns`
 * the intro/lede paragraph and the fuller, NFL-scoped <title>, making it the
 * preferred canonical. Fold the short `browns` slug into it (308 at the edge).
 *
 * Add new entries as more entity-route duplicate-canonical clusters are found:
 * map each retired slug to the canonical slug it should consolidate into.
 */

import type { BlogRedirect } from "./blog-redirects";

const ENTITY_CONSOLIDATIONS: Record<string, string> = {
  // DAN-1748: fold the bare `browns` entity into the fuller `cleveland-browns`
  // canonical (DAN-1289 gave it the lede paragraph + NFL-scoped title).
  browns: "cleveland-browns",
};

// Loop / chain guard: a survivor (destination) must never also be a retired
// source — that would 308-chain or loop at the edge. Drop any such source and
// warn loudly in dev so a bad edit can't ship a redirect loop.
const survivors = new Set(Object.values(ENTITY_CONSOLIDATIONS));
const safeConsolidations: Record<string, string> = {};
for (const [from, to] of Object.entries(ENTITY_CONSOLIDATIONS)) {
  if (from === to || survivors.has(from)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[entity-redirects] skipping unsafe consolidation ${from} -> ${to} (self-loop or chained survivor)`,
      );
    }
    continue;
  }
  safeConsolidations[from] = to;
}

export const ENTITY_REDIRECTS: BlogRedirect[] = Object.entries(
  safeConsolidations,
).map(([from, to]) => ({
  source: `/entity/${from}`,
  destination: `/entity/${to}`,
  permanent: true as const,
}));

/**
 * Runtime lookup for the entity consolidation map (same data the edge redirects
 * use). Returns the survivor slug a retired entity slug should fold into, or
 * null if the slug is not a known duplicate.
 */
export function getConsolidatedEntitySlug(slug: string): string | null {
  return safeConsolidations[slug] ?? null;
}

/**
 * /compare/* → /compare/* canonical-consolidation 301 redirects.
 *
 * Source of truth for compare-to-compare 301s used when two comparison pages
 * target the same search intent (cannibalization). The losing slug is archived
 * in the DB and 301'd here at the edge via next.config.ts redirects(), so the
 * redirect survives even if the archived row is later deleted.
 *
 * Origin: DAN-1169 — the PS5 Pro vs Xbox Series X intent was split across two
 * live pages (`xbox-series-x-vs-ps5-pro` and the keyword-targeted
 * `ps5-pro-vs-xbox-series-x-performance-comparison-2026`), both stuck in
 * positions 14–20. We keep the keyword-aligned page as canonical (it is the one
 * Semrush/DataForSEO show ranking) and fold the short duplicate into it.
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

// retired comparison slug -> canonical comparison slug
const COMPARE_CONSOLIDATIONS: Record<string, string> = {
  "xbox-series-x-vs-ps5-pro":
    "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "ps5-pro-vs-xbox-series-x":
    "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
};

export const COMPARE_REDIRECTS: BlogRedirect[] = Object.entries(
  COMPARE_CONSOLIDATIONS,
).map(([from, to]) => ({
  source: `/compare/${from}`,
  destination: `/compare/${to}`,
  permanent: true as const,
}));

/**
 * DAN-2518 — consolidation redirects emitted by the batch archive tool.
 *
 * GENERATED / APPENDED by scripts/dan2518-batch-archive.ts. Do not hand-edit:
 * feed the tool a CSV instead, then commit the diff it produces.
 *
 * Every entry here is a PATH A corpus-consolidation retirement: the source slug
 * was archived in the DB (so it leaves the sitemap and 404s) and is folded into
 * a survivor at the edge via next.config.ts redirects(). This is the last layer
 * merged into COMPARE_CONSOLIDATIONS, so a batch decision wins over the older
 * generated ordering/rivalry layers — the same precedence rule DAN-2078
 * established for its own layer.
 *
 * ADDING ENTRIES HERE SHRINKS THE PUBLISHED CATALOG. Each source becomes a
 * REDIRECTED_COMPARE_SLUG and drops out of canonicalComparisonWhere(), so
 * CANONICAL_COMPARISON_COUNT_FALLBACK must fall by the same amount in the same
 * PR or corpus-count-truthfulness.test.ts fails the build. The batch tool
 * prints the required new floor at the end of every `--apply` run.
 */
export const BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518: Record<string, string> = {
  // (no batches applied yet — Phase 1 archive runs against this file)
};

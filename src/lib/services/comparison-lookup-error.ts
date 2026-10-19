/**
 * ROO-263 — the comparison lookup itself failed (Prisma error, pool timeout,
 * query timeout), as opposed to answering "no such row".
 *
 * `/compare/[slug]` must never turn this into a `notFound`: under a crawler
 * burst the pool ran dry, the swallowed error looked exactly like a missing
 * row, the `SELECT 1` probe answered once the burst eased, and live pages were
 * served (and ISR-cached) as noindex 404s.
 */
export class ComparisonLookupError extends Error {
  readonly slug: string;
  constructor(slug: string, cause: unknown) {
    super(
      `ROO-263: comparison lookup failed for "${slug}": ${
        cause instanceof Error ? cause.message : String(cause)
      }`
    );
    this.name = "ComparisonLookupError";
    this.slug = slug;
    (this as { cause?: unknown }).cause = cause;
  }
}

export function isComparisonLookupError(e: unknown): e is ComparisonLookupError {
  return e instanceof ComparisonLookupError;
}

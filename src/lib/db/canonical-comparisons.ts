/**
 * DAN-2067 — the canonical definition of "a comparison page that actually exists".
 *
 * A comparison row is a real, indexable page only when it is BOTH `published` AND
 * not a redirect source. Filtering on `status: "published"` alone is what put 22
 * redirect URLs into sitemap/1.xml and inflated every published corpus figure
 * (491 claimed vs 469 real pages at the time). Redirect sources keep their `published` row —
 * the archive step is a separate script from the redirect registration, so the two
 * drift apart. See REDIRECTED_COMPARE_SLUGS in @/lib/redirects/compare-redirects.
 *
 * Use these helpers anywhere a comparison is counted, listed, or emitted to a
 * crawler. Do not hand-roll `{ status: "published" }` for comparisons again.
 */
import { REDIRECTED_COMPARE_SLUGS, isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

/**
 * Prisma `where` clause matching only canonical (200-returning) comparison pages.
 * Merge extra constraints in via the argument — e.g. `canonicalComparisonWhere({ category: "software" })`.
 */
type CanonicalComparisonWhere = { status: "published"; slug: { notIn: string[] } };

export function canonicalComparisonWhere(): CanonicalComparisonWhere;
export function canonicalComparisonWhere<T extends Record<string, unknown>>(
  extra: T
): CanonicalComparisonWhere & T;
export function canonicalComparisonWhere(extra?: Record<string, unknown>) {
  return {
    status: "published" as const,
    slug: { notIn: REDIRECTED_COMPARE_SLUGS },
    ...(extra ?? {}),
  };
}

/**
 * Drop redirect sources from an already-fetched list of comparison rows. Use when
 * the rows come from `$queryRaw` (which cannot take the Prisma `where` above) or
 * are otherwise already in memory.
 */
export function excludeRedirectedComparisons<T>(rows: T[], slugOf: (row: T) => string): T[] {
  return rows.filter((row) => !isRedirectedCompareSlug(slugOf(row)));
}

/**
 * DAN-2112 — the count to fall back on when the DB is unreachable, and the count
 * the static (pages-router) schema emits.
 *
 * Verified 2026-07-14 (post-DAN-2078): all 454 `/compare/` URLs in sitemap/1.xml
 * return a direct 200 — 0 redirects, 0 404s — and both `/api/sitemap.total` and the
 * DB `canonicalComparisonWhere()` count agree at 454. This is the number we may
 * state publicly.
 *
 * It is a FLOOR, never a ceiling: understating the corpus costs us nothing, but
 * overstating it puts a number in front of a journalist that they can disprove by
 * clicking. The site previously advertised `491+` (raw published rows, 22 of them
 * redirect sources) and `500+` (invented) in JSON-LD. Never write a corpus literal
 * anywhere else — import this, or better, count with `canonicalComparisonWhere()`.
 *
 * THIS CONSTANT SHRINKS EVERY TIME A RIVALRY IS CONSOLIDATED. DAN-2078 folded 14
 * duplicate rivalries into their survivors, which retired 14 slugs into
 * REDIRECTED_COMPARE_SLUGS and took the catalog from 468 to 454 — but the constant
 * stayed at 468, so for the life of that deploy the site-wide JSON-LD overstated the
 * corpus by 14 pages. Any PR that adds to `safeConsolidations` must re-run
 * `scripts/dan2067-verify.ts` and bring this number down with it.
 */
export const CANONICAL_COMPARISON_COUNT_FALLBACK = 454;

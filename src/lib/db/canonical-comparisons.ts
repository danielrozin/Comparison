/**
 * DAN-2067 — the canonical definition of "a comparison page that actually exists".
 *
 * A comparison row is a real, indexable page only when it is BOTH `published` AND
 * not a redirect source. Filtering on `status: "published"` alone is what put 22
 * redirect URLs into sitemap/1.xml and inflated every published corpus figure
 * (491 claimed vs 469 real pages). Redirect sources keep their `published` row —
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
export function canonicalComparisonWhere<T extends Record<string, unknown>>(extra?: T) {
  return {
    status: "published",
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

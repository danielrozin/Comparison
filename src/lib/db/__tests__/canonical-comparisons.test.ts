/**
 * DAN-2067 — a published row is not necessarily a page.
 *
 * 22 rows in prod were `status="published"` AND redirect sources, so sitemap/1.xml
 * shipped 491 URLs when only 469 return 200. These tests pin the invariant that
 * caught it: nothing that counts or emits comparison pages may filter on status alone.
 */
import { describe, it, expect } from "vitest";
import { canonicalComparisonWhere, excludeRedirectedComparisons } from "../canonical-comparisons";
import { REDIRECTED_COMPARE_SLUGS, isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { COMPARE_REDIRECTS } from "@/lib/redirects/compare-redirects";

describe("canonicalComparisonWhere", () => {
  it("excludes every slug that 308s at the edge", () => {
    const where = canonicalComparisonWhere();
    expect(where.status).toBe("published");
    // The exclusion list and the edge redirect table must describe the same set —
    // if they drift, the sitemap starts advertising redirects as pages again.
    const edgeSources = COMPARE_REDIRECTS.map((r) => r.source.replace("/compare/", "")).sort();
    expect([...where.slug.notIn].sort()).toEqual(edgeSources);
  });

  it("merges extra constraints without dropping the redirect exclusion", () => {
    const where = canonicalComparisonWhere({ category: "software" });
    expect(where.category).toBe("software");
    expect(where.slug.notIn).toBe(REDIRECTED_COMPARE_SLUGS);
  });

  it("never excludes a redirect *target* — those are the live pages", () => {
    for (const { destination } of COMPARE_REDIRECTS) {
      const survivor = destination.replace("/compare/", "");
      expect(isRedirectedCompareSlug(survivor)).toBe(false);
    }
  });
});

describe("excludeRedirectedComparisons", () => {
  it("drops redirect sources from raw-SQL rows and keeps everything else", () => {
    const redirected = REDIRECTED_COMPARE_SLUGS[0];
    expect(redirected).toBeTruthy();
    const rows = [{ cslug: redirected }, { cslug: "a-real-page-that-is-not-a-redirect" }];
    const kept = excludeRedirectedComparisons(rows, (r) => r.cslug);
    expect(kept).toEqual([{ cslug: "a-real-page-that-is-not-a-redirect" }]);
  });
});

// ROO-29 — next-step chips prefer related, then cluster; live-filter drops dead.

import { describe, it, expect, vi, beforeEach } from "vitest";

const resolveCanonicalComparisonSlugs = vi.fn();
const getConsolidatedCompareSlug = vi.fn();

vi.mock("@/lib/services/comparison-service", () => ({
  resolveCanonicalComparisonSlugs: (s: string[]) =>
    resolveCanonicalComparisonSlugs(s),
}));
vi.mock("@/lib/redirects/compare-redirects", () => ({
  getConsolidatedCompareSlug: (s: string) => getConsolidatedCompareSlug(s),
}));
vi.mock("@/lib/services/blog-generator", () => ({
  getBlogBySlug: vi.fn(),
}));

import { buildCompareNextChips } from "@/lib/data/build-compare-next-chips";

beforeEach(() => {
  vi.clearAllMocks();
  getConsolidatedCompareSlug.mockReturnValue(null);
});

describe("buildCompareNextChips", () => {
  it("prefers related slugs, excludes current, drops dead (DAN-2581)", async () => {
    resolveCanonicalComparisonSlugs.mockResolvedValue(
      new Set(["us-vs-china-gdp", "usa-vs-china"])
    );

    const chips = await buildCompareNextChips("japan-vs-china", [
      { slug: "us-vs-china-gdp", title: "US vs China GDP: 2026 Outlook" },
      { slug: "dead-vs-gone", title: "Dead vs Gone" },
      { slug: "japan-vs-china", title: "Japan vs China" },
    ]);

    expect(chips.map((c) => c.slug)).toEqual([
      "us-vs-china-gdp",
      "usa-vs-china",
    ]);
    expect(chips[0].label).toBe("US vs China GDP");
    expect(resolveCanonicalComparisonSlugs).toHaveBeenCalled();
  });

  it("falls back to cluster candidates when related is empty", async () => {
    resolveCanonicalComparisonSlugs.mockImplementation(
      async (slugs: string[]) => {
        const allow = new Set([
          "uber-vs-taxi",
          "doordash-vs-uber-eats",
          "messi-vs-ronaldo",
        ]);
        return new Set(slugs.filter((s) => allow.has(s)));
      }
    );

    const chips = await buildCompareNextChips("lyft-vs-uber", []);
    expect(chips.length).toBeGreaterThan(0);
    expect(chips.every((c) => c.slug !== "lyft-vs-uber")).toBe(true);
    expect(chips.map((c) => c.slug)).toContain("uber-vs-taxi");
  });

  it("returns empty when nothing is live", async () => {
    resolveCanonicalComparisonSlugs.mockResolvedValue(new Set());
    const chips = await buildCompareNextChips("japan-vs-china", [
      { slug: "ghost-vs-void", title: "Ghost vs Void" },
    ]);
    expect(chips).toEqual([]);
  });
});

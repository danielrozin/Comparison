/**
 * ROO-453 — /compare hub and homepage listings read the editorial registry.
 */
import { describe, it, expect } from "vitest";
import { listEditorialCompareSlugs } from "../index";
import {
  groupEditorialComparesByCategory,
  latestEditorialCompares,
  latestEditorialUpdatedAt,
  listEditorialCompareCards,
} from "../listing";

describe("editorial compare listings", () => {
  it("lists every registry slug exactly once across the hub groups", () => {
    const grouped = groupEditorialComparesByCategory().flatMap((g) => g.items.map((i) => i.slug));
    expect(grouped.sort()).toEqual([...listEditorialCompareSlugs()].sort());
  });

  it("labels known categories with their display name", () => {
    const tech = groupEditorialComparesByCategory().find((g) => g.category === "technology");
    expect(tech?.label).toBe("Technology");
  });

  it("orders latest by published date, newest first", () => {
    const latest = latestEditorialCompares(10);
    expect(latest).toHaveLength(10);
    for (let i = 1; i < latest.length; i++) {
      expect(Date.parse(latest[i - 1].publishedAt)).toBeGreaterThanOrEqual(Date.parse(latest[i].publishedAt));
    }
    const newest = Math.max(...listEditorialCompareCards().map((c) => Date.parse(c.publishedAt) || 0));
    expect(Date.parse(latest[0].publishedAt)).toBe(newest);
  });

  it("reports the newest content date, not the build time", () => {
    const iso = latestEditorialUpdatedAt();
    expect(iso).not.toBeNull();
    const newest = Math.max(
      ...listEditorialCompareCards().flatMap((c) => [Date.parse(c.updatedAt) || 0, Date.parse(c.publishedAt) || 0]),
    );
    expect(Date.parse(iso!)).toBe(newest);
  });
});

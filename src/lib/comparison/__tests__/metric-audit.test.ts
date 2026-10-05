import { describe, expect, it } from "vitest";
import {
  NEXT_TIER_COMPARE_SLUGS,
  PRIORITY_COMPARE_SLUGS,
  buildCompareMetricAudit,
} from "@/lib/comparison/metric-audit";
import { inspectComparisonMetrics } from "@/lib/comparison/metric-table-guard";
import { lyftVsUberFixture, usVsChinaGdpFixture } from "@/lib/comparison/metric-table-fixtures";
import type { ComparisonPageData } from "@/types";

function conflict(page: ComparisonPageData, metric: string) {
  return inspectComparisonMetrics(page).conflicts.find((item) => item.metric === metric);
}

describe("inspectComparisonMetrics", () => {
  it("lists every nominal-GDP value and keeps the scorecard row", () => {
    const nominal = conflict(usVsChinaGdpFixture(), "nominal gdp");
    expect(nominal).toBeTruthy();
    expect(nominal?.kept).toContain("$30.0–30.5T");
    expect(nominal?.kept).toContain("about $19 trillion");
    expect(nominal?.values.some((value) => value.includes("$27.4T"))).toBe(true);
    expect(nominal?.values.some((value) => value.includes("$17.9T"))).toBe(true);
    expect(nominal?.values.length).toBeGreaterThan(1);
  });

  it("keeps China's debt-to-GDP at 77% and records the 282% row", () => {
    const debt = conflict(usVsChinaGdpFixture(), "debt to gdp");
    expect(debt?.kept).toContain("77%");
    expect(debt?.values.some((value) => value.includes("282%"))).toBe(true);
  });

  it("keeps Lyft's 25% commission and records the 75–80% row", () => {
    const commission = conflict(lyftVsUberFixture(), "driver commission");
    expect(commission?.kept).toContain("approximately 25% platform fee");
    expect(commission?.values.some((value) => value.includes("75–80%"))).toBe(true);

    const revenue = conflict(lyftVsUberFixture(), "annual revenue");
    expect(revenue?.kept).toContain("$38.7 billion");
    expect(revenue?.values.some((value) => value.includes("$37.2 billion"))).toBe(true);
    expect(revenue?.values.some((value) => value.includes("$39.7 billion"))).toBe(true);
  });
});

describe("buildCompareMetricAudit", () => {
  const audit = buildCompareMetricAudit([usVsChinaGdpFixture(), lyftVsUberFixture()]);

  it("checks the priority slugs first, in order, with a conflict list", () => {
    expect(audit.priority.map((page) => page.slug)).toEqual([...PRIORITY_COMPARE_SLUGS]);
    expect(audit.priority[0].slug).toBe("us-vs-china-gdp");
    expect(audit.priority[0].found).toBe(true);
    expect(audit.priority[0].conflicts.some((item) => item.metric === "nominal gdp" && item.kept?.includes("$30.0–30.5T"))).toBe(true);
    expect(audit.priority[3].slug).toBe("lyft-vs-uber");
    expect(audit.priority[3].conflicts.some((item) => item.metric === "driver commission")).toBe(true);
    expect(audit.priority[4].found).toBe(false);
    expect(audit.priority[4].conflicts).toEqual([]);
  });

  it("checks the next tier after the priority pages, then ranks everyone else", () => {
    expect(audit.nextTier.map((page) => page.slug)).toEqual([...NEXT_TIER_COMPARE_SLUGS]);
    expect(audit.nextTier.every((page) => page.found === false)).toBe(true);
    expect(audit.ranked.find((page) => page.slug === "us-vs-china-gdp" || page.slug === "lyft-vs-uber")).toBeUndefined();
  });
});

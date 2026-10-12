import { describe, expect, it } from "vitest";
import { applyEditorialAeoOverlay } from "@/lib/data/editorial-aeo-overlays";
import {
  CN_HDI,
  CN_LIFE,
  CN_MILITARY,
  CN_NOMINAL,
  CN_PER_CAPITA,
  JP_LIFE,
  JP_MILITARY,
  JP_NOMINAL,
  LYFT_REVENUE,
  US_MILITARY,
  US_NOMINAL,
  US_PER_CAPITA,
  UBER_REVENUE,
} from "@/lib/data/official-compare-scorecards";
import { presentComparisonMetrics, canonicalizeMetricName } from "@/lib/comparison/metric-table-guard";
import { lyftVsUberFixture, usVsChinaGdpFixture } from "@/lib/comparison/metric-table-fixtures";
import { getMockComparison } from "@/lib/services/mock-data";

function cell(page: { attributes: { name: string; values: { entityId: string; valueText: string | null }[] }[] }, name: string, entityId: string) {
  const row = page.attributes.find((attr) => attr.name === name);
  return row?.values.find((value) => value.entityId === entityId)?.valueText;
}

describe("official scorecards replace near-miss Key Facts", () => {
  it("keeps IMF and SIPRI figures for us-vs-china-gdp when stored rows are within 15%", () => {
    const next = presentComparisonMetrics(applyEditorialAeoOverlay(usVsChinaGdpFixture()));
    const labels = ["United States", "China"];
    const nominal = next.attributes.filter(
      (attr) => canonicalizeMetricName(attr.name, attr.unit, labels) === "nominal gdp",
    );
    expect(nominal).toHaveLength(1);
    expect(cell(next, "Nominal GDP", "us")).toBe(US_NOMINAL);
    expect(cell(next, "Nominal GDP", "cn")).toBe(CN_NOMINAL);
    expect(cell(next, "GDP per capita", "us")).toBe(US_PER_CAPITA);
    expect(cell(next, "GDP per capita", "cn")).toBe(CN_PER_CAPITA);
    expect(cell(next, "2026 real GDP growth", "us")).toBe("2.3%, IMF WEO April 2026");
    expect(cell(next, "2026 real GDP growth", "cn")).toBe("4.4%, IMF WEO April 2026");
    const withStaleGrowth = usVsChinaGdpFixture();
    withStaleGrowth.keyDifferences.push({
      label: "Expected Growth Rate 2026",
      entityAValue: "2-2.5%",
      entityBValue: "4.5-5%",
      winner: "b",
    });
    const collapsed = applyEditorialAeoOverlay(withStaleGrowth);
    const growthRows = collapsed.keyDifferences.filter((row) => row.label === "2026 real GDP growth" || row.label === "Expected Growth Rate 2026");
    expect(growthRows).toHaveLength(1);
    expect(growthRows[0]?.entityAValue).toBe("2.3%, IMF WEO April 2026");
    expect(growthRows[0]?.entityBValue).toBe("4.4%, IMF WEO April 2026");
    expect(cell(next, "Defense spending", "us")).toBe(US_MILITARY);
    expect(cell(next, "Defense spending", "cn")).toBe(CN_MILITARY);
    const debt = next.attributes.find((attr) => canonicalizeMetricName(attr.name, attr.unit, labels) === "debt to gdp");
    expect(debt?.values.find((value) => value.entityId === "cn")?.valueText).toBe("77%");
    expect(next.attributes.some((attr) => attr.values.some((value) => value.valueText?.includes("€")))).toBe(false);
    expect(next.resources?.some((resource) => resource.url.includes("/NGDPD/"))).toBe(true);
    expect(next.resources?.some((resource) => resource.url.includes("sipri.org"))).toBe(true);
  });

  it("keeps Uber and Lyft FY2024 filing revenue on lyft-vs-uber", () => {
    const next = presentComparisonMetrics(applyEditorialAeoOverlay(lyftVsUberFixture()));
    const labels = ["Uber", "Lyft"];
    const revenue = next.attributes.filter(
      (attr) => canonicalizeMetricName(attr.name, attr.unit, labels) === "annual revenue",
    );
    expect(revenue).toHaveLength(1);
    expect(cell(next, "Annual Revenue", "uber")).toBe(UBER_REVENUE);
    expect(cell(next, "Annual Revenue", "lyft")).toBe(LYFT_REVENUE);
    const commission = next.attributes.find(
      (attr) => canonicalizeMetricName(attr.name, null, labels) === "driver commission",
    );
    expect(commission?.values.find((value) => value.entityId === "lyft")?.valueText).toBe(
      "approximately 25% platform fee",
    );
  });

  it("uses IMF figures on the economy and country mocks and keeps manufacturing", () => {
    for (const slug of ["us-economy-vs-china-economy", "usa-vs-china"] as const) {
      const next = presentComparisonMetrics(applyEditorialAeoOverlay(getMockComparison(slug)!));
      const nominal = next.keyDifferences.find((row) => row.label === "Nominal GDP");
      expect(nominal?.entityAValue, slug).toBe(US_NOMINAL);
      expect(nominal?.entityBValue, slug).toBe(CN_NOMINAL);
      expect(nominal?.entityAValue, slug).not.toMatch(/25\.5|28\.7|27\.4/);
    }
    const economy = applyEditorialAeoOverlay(getMockComparison("us-economy-vs-china-economy")!);
    expect(economy.keyDifferences.some((row) => row.label === "Manufacturing Share")).toBe(true);
    const usa = applyEditorialAeoOverlay(getMockComparison("usa-vs-china")!);
    expect(usa.keyDifferences.find((row) => row.label === "Defense spending")?.entityAValue).toBe(US_MILITARY);
    expect(usa.keyDifferences.some((row) => row.label === "Population")).toBe(true);
  });

  it("uses World Bank life expectancy and labels China’s HDI High", () => {
    const next = applyEditorialAeoOverlay(getMockComparison("japan-vs-china")!);
    const life = next.keyDifferences.find((row) => row.label === "Life expectancy");
    expect(life?.entityAValue).toBe(JP_LIFE);
    expect(life?.entityBValue).toBe(CN_LIFE);
    const hdi = next.keyDifferences.find((row) => row.label === "HDI");
    expect(hdi?.entityBValue).toBe(CN_HDI);
    expect(hdi?.entityBValue).not.toMatch(/Very high/);
    const defense = next.keyDifferences.find((row) => row.label === "Defense spending");
    expect(defense?.entityAValue).toBe(JP_MILITARY);
    expect(defense?.entityBValue).toBe(CN_MILITARY);
    expect(defense?.entityAValue).not.toMatch(/€/);
    expect(next.keyDifferences.find((row) => row.label === "Nominal GDP")?.entityAValue).toBe(JP_NOMINAL);
    expect(next.resources?.some((resource) => resource.url.includes("worldbank.org"))).toBe(true);
    expect(next.resources?.some((resource) => resource.url.includes("hdr.undp.org"))).toBe(true);
  });

  it("keeps retired dollar totals out of the stored mock pros and descriptions", () => {
    const stale = /\$25\.5|\$17\.7|\$17\.9|\$27\.4|\$35T|\$39,285|\b84\.6\b|0\.920|0\.796|1\.417|2-2\.5%|4\.5-5%|\$12,500|\$76,300|\$76,398|\$30\+|\$13,500/;
    for (const slug of ["us-economy-vs-china-economy", "usa-vs-china", "japan-vs-china"]) {
      const page = getMockComparison(slug);
      expect(page, slug).toBeTruthy();
      const stored = [
        page?.shortAnswer ?? "",
        ...((page?.entities ?? []).flatMap((entity) => [entity.shortDesc ?? "", ...entity.pros, ...entity.cons])),
      ].join("\n");
      expect(stored, slug).not.toMatch(stale);
    }
  });
});

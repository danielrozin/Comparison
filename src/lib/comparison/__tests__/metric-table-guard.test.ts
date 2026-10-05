import { describe, expect, it, afterEach } from "vitest";
import { assembleCompareJsonLd } from "@/lib/seo/compare-jsonld";
import { getEditorialAeoOverlay } from "@/lib/data/editorial-aeo-overlays";
import type { ComparisonAttribute, ComparisonPageData } from "@/types";
import {
  canonicalizeMetricName,
  guardComparisonAttributes,
  presentComparisonMetrics,
  scoreComparisonMetrics,
  valuesMatch,
} from "@/lib/comparison/metric-table-guard";
import { lyftVsUberFixture, usVsChinaGdpFixture } from "@/lib/comparison/metric-table-fixtures";

const ENV_KEY = "COMPARE_METRIC_DEDUPE";

afterEach(() => {
  delete process.env[ENV_KEY];
  delete process.env.NEXT_PUBLIC_COMPARE_METRIC_DEDUPE;
});

function cell(attr: ComparisonAttribute, entityId: string): string {
  return attr.values.find((value) => value.entityId === entityId)?.valueText ?? "";
}

function names(attributes: ComparisonAttribute[]): string[] {
  return attributes.map((attr) => attr.name);
}

describe("canonicalizeMetricName", () => {
  it("treats case, punctuation, units, years, and nominal-GDP synonyms as one metric", () => {
    const labels = ["United States", "China"];
    const keys = [
      "Nominal GDP",
      "GDP (nominal)",
      "GDP Nominal (USD)",
      "Nominal GDP 2024",
      "US Nominal GDP",
      "Total GDP",
    ].map((name) => canonicalizeMetricName(name, "USD", labels));
    expect(new Set(keys)).toEqual(new Set(["nominal gdp"]));
    expect(canonicalizeMetricName("Defence spending (EUR)", "EUR", labels)).toBe("defense spending");
    expect(canonicalizeMetricName("Defense spending (USD)", "USD", labels)).toBe("defense spending");
    expect(canonicalizeMetricName("Debt to GDP ratio", null, labels)).toBe("debt to gdp");
    expect(canonicalizeMetricName("GDP (PPP)", null, labels)).toBe("gdp ppp");
    expect(canonicalizeMetricName("GDP per Capita", null, labels)).toBe("gdp per capita");
    expect(canonicalizeMetricName("Driver Commission Rate", null, ["Uber", "Lyft"])).toBe("driver commission");
    expect(canonicalizeMetricName("2024 Annual Revenue", null, ["Uber", "Lyft"])).toBe("annual revenue");
    expect(canonicalizeMetricName("Revenue Diversification", null, ["Uber", "Lyft"])).not.toBe(
      "annual revenue",
    );
    expect(canonicalizeMetricName("Nominal GDP Size", null, labels)).toBe("nominal gdp");
    expect(canonicalizeMetricName("Manufacturing as % of GDP", null, labels)).not.toBe("nominal gdp");
    expect(canonicalizeMetricName("Healthcare Spending (% of GDP)", null, labels)).not.toBe("nominal gdp");
    expect(canonicalizeMetricName("R&D Spending as % of GDP", null, labels)).not.toBe("nominal gdp");
    expect(canonicalizeMetricName("Geographic Coverage", null, ["Uber", "Lyft"])).toBe(
      canonicalizeMetricName("Global Market Presence", null, ["Uber", "Lyft"]),
    );
  });

  it("matches a figure inside a range or within ±5%, and rejects a wider gap", () => {
    expect(valuesMatch("$30+ trillion", "$30.0–30.5T")).toBe(true);
    expect(valuesMatch("$31 trillion", "$30+ trillion")).toBe(true);
    expect(valuesMatch("$28.7T", "$30+ trillion")).toBe(true);
    expect(valuesMatch("$38.7 billion", "$38.7B")).toBe(true);
    expect(valuesMatch("$39.7 billion", "$38.7 billion")).toBe(true);
    expect(valuesMatch("$37.2 billion", "$38.7 billion")).toBe(true);
    expect(valuesMatch("approximately 25% platform fee", "approximately 25%")).toBe(true);
    expect(valuesMatch("$27.4T", "$30+ trillion")).toBe(false);
    expect(valuesMatch("75–80%", "approximately 25%")).toBe(false);
    expect(valuesMatch("77%", "282%")).toBe(false);
    expect(valuesMatch("US and Canada", "1 (US only)")).toBe(false);
    expect(valuesMatch("38.7", "$38.7 billion")).toBe(false);
  });
});

describe("us-vs-china-gdp fixture", () => {
  const raw = usVsChinaGdpFixture();
  const guarded = guardComparisonAttributes(raw);
  const score = scoreComparisonMetrics(raw);

  it("starts near the live page's 350 rows and keeps one scorecard-sized table", () => {
    expect(raw.attributes).toHaveLength(350);
    expect(score.rawRowCount).toBe(350);
    expect(score.duplicateGroupCount).toBeGreaterThan(0);
    expect(score.conflictingRowCount).toBeGreaterThan(0);
    expect(score.identicalRowCount).toBeGreaterThanOrEqual(300);
    expect(guarded).toHaveLength(25);
    expect(score.guardedRowCount).toBe(25);
  });

  it("keeps the scorecard nominal GDP, not China's $17.9T pasted into the US column", () => {
    const nominal = guarded.find((attr) => canonicalizeMetricName(attr.name, attr.unit, ["United States", "China"]) === "nominal gdp");
    expect(nominal).toBeTruthy();
    expect(guarded.filter((attr) => canonicalizeMetricName(attr.name, attr.unit, ["United States", "China"]) === "nominal gdp")).toHaveLength(1);
    expect(cell(nominal!, "us")).toBe("$30.0–30.5T");
    expect(cell(nominal!, "cn")).toBe("about $19 trillion");
    expect(names(guarded).join(" ")).not.toContain("Total GDP");
    expect(guarded.some((attr) => attr.values.some((value) => value.valueText === "$17.9T"))).toBe(false);
  });

  it("keeps China's debt-to-GDP at the scorecard 77%, not 282%", () => {
    const debt = guarded.filter((attr) => canonicalizeMetricName(attr.name, attr.unit) === "debt to gdp");
    expect(debt).toHaveLength(1);
    expect(cell(debt[0], "cn")).toBe("77%");
    expect(debt[0].values.find((value) => value.entityId === "us")?.winner).toBeUndefined();
    expect(debt[0].values.find((value) => value.entityId === "cn")?.winner).toBe(true);
  });

  it("drops identical copied rows and puts scorecard metrics first", () => {
    expect(guarded.some((attr) => attr.name.startsWith("Copied metric"))).toBe(false);
    expect(guarded.slice(0, 7).map((attr) => canonicalizeMetricName(attr.name, attr.unit, ["United States", "China"]))).toEqual([
      "nominal gdp",
      "gdp ppp",
      "gdp per capita",
      "gdp growth",
      "population",
      "debt to gdp",
      "defense spending",
    ]);
    const defense = guarded.find((attr) => attr.name.includes("Defense spending"));
    expect(cell(defense!, "us")).toBe("$886 billion");
    expect(guarded.some((attr) => attr.name.includes("EUR"))).toBe(false);
  });
});

describe("lyft-vs-uber fixture", () => {
  const raw = lyftVsUberFixture();
  const guarded = guardComparisonAttributes(raw);

  it("drops the 75–80% commission and keeps one 2024 revenue", () => {
    expect(raw.attributes).toHaveLength(13);
    expect(guarded.length).toBeLessThan(raw.attributes.length);
    expect(guarded).toHaveLength(7);
    const commission = guarded.find((attr) => canonicalizeMetricName(attr.name, null, ["Uber", "Lyft"]) === "driver commission");
    expect(cell(commission!, "lyft")).toBe("approximately 25% platform fee");
    expect(commission!.values.find((value) => value.entityId === "lyft")?.winner).toBe(true);
    expect(guarded.some((attr) => attr.values.some((value) => value.valueText?.includes("75")))).toBe(false);

    const revenue = guarded.filter((attr) => canonicalizeMetricName(attr.name, null, ["Uber", "Lyft"]) === "annual revenue");
    expect(revenue).toHaveLength(1);
    // $39.7B is within ±5% of the $38.7B scorecard and is the newest sourced row.
    expect(cell(revenue[0], "uber")).toBe("$39.7 billion");
    expect(cell(revenue[0], "lyft")).toBe("$4.3 billion");
    expect(revenue[0].values.some((value) => value.valueText?.includes("75"))).toBe(false);
  });

  it("drops geographic coverage that contradicts US and Canada, and keeps the rating tie", () => {
    const geo = guarded.find((attr) => canonicalizeMetricName(attr.name, null, ["Uber", "Lyft"]) === "geographic coverage");
    expect(cell(geo!, "lyft")).toBe("US and Canada");
    expect(guarded.some((attr) => attr.values.some((value) => value.valueText?.includes("US only")))).toBe(false);
    const rating = guarded.find((attr) => attr.name.startsWith("Average Driver Rating"));
    expect(rating).toBeTruthy();
    expect(cell(rating!, "uber")).toBe("4.6+ stars");
    expect(cell(rating!, "lyft")).toBe("4.6+ stars");
  });
});

describe("guard preference rules", () => {
  function bare(attributes: ComparisonAttribute[], extra?: Partial<ComparisonPageData>): ComparisonPageData {
    return {
      id: "bare",
      slug: "bare",
      title: "Bare",
      shortAnswer: extra?.shortAnswer ?? null,
      keyDifferences: extra?.keyDifferences ?? [],
      verdict: null,
      category: null,
      entities: [
        { id: "a", slug: "a", name: "Alpha", shortDesc: null, imageUrl: null, entityType: "x", position: 0, pros: [], cons: [], bestFor: null },
        { id: "b", slug: "b", name: "Beta", shortDesc: null, imageUrl: null, entityType: "x", position: 1, pros: [], cons: [], bestFor: null },
      ],
      attributes,
      faqs: [],
      relatedComparisons: [],
      relatedBlogPosts: [],
      quickAnswer: extra?.quickAnswer,
      metadata: {
        metaTitle: "Bare",
        metaDescription: "Bare",
        publishedAt: null,
        updatedAt: "2026-01-01T00:00:00.000Z",
        isAutoGenerated: false,
        isHumanReviewed: false,
        viewCount: 0,
      },
    };
  }

  function metric(id: string, a: string, b: string, extra?: { source?: string; updatedAt?: string; winner?: "a" | "b" }): ComparisonAttribute {
    return {
      id,
      slug: id,
      name: "Headcount",
      unit: null,
      category: null,
      dataType: "number",
      higherIsBetter: true,
      values: [
        { entityId: "a", valueText: a, valueNumber: null, valueBoolean: null, ...(extra?.winner === "a" ? { winner: true } : {}), ...(extra?.source ? { source: extra.source } : {}), ...(extra?.updatedAt ? { updatedAt: extra.updatedAt } : {}) },
        { entityId: "b", valueText: b, valueNumber: null, valueBoolean: null, ...(extra?.winner === "b" ? { winner: true } : {}), ...(extra?.source ? { source: extra.source } : {}), ...(extra?.updatedAt ? { updatedAt: extra.updatedAt } : {}) },
      ],
    };
  }

  it("prefers a scorecard match over a newer sourced row", () => {
    const page = bare([
      metric("new", "11", "21", { source: "Blog", updatedAt: "2026-09-01T00:00:00.000Z" }),
      metric("card", "10", "20"),
    ], {
      keyDifferences: [{ label: "Headcount", entityAValue: "10", entityBValue: "20", winner: "b" }],
    });
    const guarded = guardComparisonAttributes(page);
    expect(guarded).toHaveLength(1);
    expect(guarded[0].id).toBe("card");
  });

  it("otherwise keeps the most recent sourced row, and otherwise the first row", () => {
    const sourced = bare([
      metric("old", "10", "20"),
      metric("mid", "11", "21", { source: "IMF", updatedAt: "2020-01-01T00:00:00.000Z" }),
      metric("new", "12", "22", { source: "World Bank", updatedAt: "2024-01-01T00:00:00.000Z" }),
    ]);
    expect(guardComparisonAttributes(sourced)[0].id).toBe("new");

    const first = bare([
      metric("first", "10", "20"),
      metric("later", "11", "21", { updatedAt: "2024-01-01T00:00:00.000Z" }),
    ]);
    expect(guardComparisonAttributes(first)[0].id).toBe("first");
  });

  it("prefers a quick-answer match when the scorecard has no row for the metric", () => {
    const page = bare([
      metric("wrong", "$27.4T", "$17.9T", { source: "Blog", updatedAt: "2026-09-01T00:00:00.000Z" }),
      metric("prose", "$30 trillion", "$19 trillion"),
    ], {
      shortAnswer: "Nominal headcount is not the point. The figures to use are $30 trillion and $19 trillion.",
      quickAnswer: { tldr: "$30 trillion vs $19 trillion", winnerName: null, winnerReason: null, keyFact: "" },
    });
    expect(guardComparisonAttributes(page)[0].id).toBe("prose");
  });

  it("keeps a scorecard metric from the scorecard when the stored gap is over 15%", () => {
    const page = bare([
      metric("bad", "25-30% platform fee", "75–80%", { winner: "b" }),
    ], {
      keyDifferences: [{ label: "Headcount", entityAValue: "25-30% platform fee", entityBValue: "approximately 25% platform fee", winner: "b" }],
    });
    const guarded = guardComparisonAttributes(page);
    expect(guarded).toHaveLength(1);
    expect(guarded[0].id).toBe("scorecard:headcount");
    expect(cell(guarded[0], "b")).toBe("approximately 25% platform fee");
    expect(guarded[0].values.some((value) => value.valueText?.includes("75"))).toBe(false);
    expect(guarded[0].values.find((value) => value.entityId === "b")?.winner).toBe(true);
  });

  it("drops an opposite winner and renders the scorecard cells instead", () => {
    const page = bare([
      metric("row", "10", "20", { winner: "a" }),
    ], {
      keyDifferences: [{ label: "Headcount", entityAValue: "10", entityBValue: "20", winner: "b" }],
    });
    const guarded = guardComparisonAttributes(page);
    expect(guarded).toHaveLength(1);
    expect(guarded[0].id).not.toBe("row");
    expect(cell(guarded[0], "a")).toBe("10");
    expect(cell(guarded[0], "b")).toBe("20");
    expect(guarded[0].values.find((value) => value.entityId === "a")?.winner).toBeUndefined();
    expect(guarded[0].values.find((value) => value.entityId === "b")?.winner).toBe(true);
  });

  it("keeps the closest row within about 15% and clears its winner", () => {
    const page = bare([
      metric("near", "110", "220", { winner: "b" }),
    ], {
      keyDifferences: [{ label: "Headcount", entityAValue: "100", entityBValue: "200", winner: "b" }],
    });
    const guarded = guardComparisonAttributes(page);
    expect(guarded).toHaveLength(1);
    expect(guarded[0].id).toBe("near");
    expect(cell(guarded[0], "a")).toBe("110");
    expect(guarded[0].values.every((value) => value.winner == null)).toBe(true);
  });

  it("still yields a nominal-GDP row when every stored value conflicts", () => {
    const page = bare([
      { ...metric("pasted", "$17.9T", "$17.9T"), name: "Total GDP" },
      { ...metric("wrong", "$10T", "$40T", { winner: "b" }), name: "GDP (nominal)" },
    ], {
      keyDifferences: [{ label: "Nominal GDP", entityAValue: "$30+ trillion", entityBValue: "about $19 trillion", winner: "a" }],
    });
    const guarded = guardComparisonAttributes(page);
    const nominal = guarded.filter((attr) => canonicalizeMetricName(attr.name, attr.unit, ["Alpha", "Beta"]) === "nominal gdp");
    expect(nominal).toHaveLength(1);
    expect(cell(nominal[0], "a")).toBe("$30+ trillion");
    expect(cell(nominal[0], "b")).toBe("about $19 trillion");
    expect(nominal[0].values.some((value) => value.valueText?.includes("17.9") || value.valueText?.includes("75"))).toBe(false);
    expect(nominal[0].values.find((value) => value.entityId === "a")?.winner).toBe(true);
  });

  it("drops a value copied from the other entity", () => {
    const page = bare([
      { ...metric("real", "$27.4T", "$17.9T"), id: "real", name: "Nominal GDP" },
      { ...metric("paste", "$17.9T", "$18.5T"), id: "paste", name: "Total GDP" },
    ]);
    const guarded = guardComparisonAttributes(page);
    expect(guarded).toHaveLength(1);
    expect(cell(guarded[0], "a")).toBe("$27.4T");
  });

  it("is idempotent and can be switched off", () => {
    const raw = lyftVsUberFixture();
    const once = presentComparisonMetrics(raw);
    const twice = presentComparisonMetrics(once);
    expect(twice.attributes.map((attr) => attr.id)).toEqual(once.attributes.map((attr) => attr.id));

    process.env[ENV_KEY] = "false";
    expect(presentComparisonMetrics(raw).attributes).toHaveLength(raw.attributes.length);
    expect(presentComparisonMetrics(raw)).toBe(raw);
  });
});

describe("JSON-LD stays aligned with the rendered table", () => {
  it("keeps one variableMeasured entry per rendered metric", () => {
    const raw = usVsChinaGdpFixture();
    const page = presentComparisonMetrics({
      ...raw,
      schemaMarkup: {
        "@context": "https://schema.org",
        "@type": "Dataset",
        variableMeasured: [
          { "@type": "PropertyValue", name: "Nominal GDP" },
          { "@type": "PropertyValue", name: "GDP (nominal)" },
          { "@type": "PropertyValue", name: "Total GDP" },
          { "@type": "PropertyValue", name: "Debt-to-GDP" },
          { "@type": "PropertyValue", name: "Copied metric 1" },
        ],
      },
    });
    const assembled = assembleCompareJsonLd({
      comparison: page,
      voteData: null,
      videoNode: null,
      fallbackDescription: page.shortAnswer || page.title,
    });
    const measured = (assembled.document.variableMeasured as Array<{ name: string }>).map((item) => item.name);
    expect(measured).toEqual(["Nominal GDP", "Debt-to-GDP"]);
    const rendered = new Set(page.attributes.map((attr) => canonicalizeMetricName(attr.name, attr.unit, ["United States", "China"])));
    expect(rendered.has("nominal gdp")).toBe(true);
    expect(rendered.has("debt to gdp")).toBe(true);
    expect(page.attributes.some((attr) => attr.name.startsWith("Copied metric"))).toBe(false);
  });
});

describe("citation copy", () => {
  it("does not tell readers or answer engines to quote the row", () => {
    for (const slug of ["us-vs-china-gdp", "us-economy-vs-china-economy", "usa-vs-china", "lyft-vs-uber"]) {
      const overlay = getEditorialAeoOverlay(slug);
      expect(overlay, slug).toBeTruthy();
      const blob = JSON.stringify(overlay).toLowerCase();
      expect(blob, slug).not.toContain("quote the row");
      expect(blob, slug).not.toContain("cite the row");
      expect(blob, slug).not.toContain("cite that row");
    }
  });
});

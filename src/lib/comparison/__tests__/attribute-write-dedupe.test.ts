import { describe, expect, it } from "vitest";
import { canonicalMetricKey, planAttributeWrites } from "@/lib/comparison/attribute-write-dedupe";

describe("planAttributeWrites (ROO-154)", () => {
  const entities = ["United States", "China"];

  it("reuses the existing attribute slug for the same canonical metric", () => {
    const plan = planAttributeWrites(
      [{ slug: "total-gdp-2024", name: "Total GDP (2024)", unit: "USD" }],
      [{ slug: "nominal-gdp", name: "Nominal GDP", unit: "USD" }],
      entities,
    );
    expect(plan.writes.map((w) => w.slug)).toEqual(["nominal-gdp"]);
    expect(plan.writes[0].originalSlug).toBe("total-gdp-2024");
    expect(plan.skipped).toEqual([]);
  });

  it("keeps an exact slug match on its own slug", () => {
    const plan = planAttributeWrites(
      [{ slug: "gdp-growth", name: "GDP growth" }],
      [
        { slug: "real-gdp-growth", name: "Real GDP Growth" },
        { slug: "gdp-growth", name: "GDP growth" },
      ],
    );
    expect(plan.writes.map((w) => w.slug)).toEqual(["gdp-growth"]);
  });

  it("drops a second attribute with the same metric in one batch", () => {
    const plan = planAttributeWrites(
      [
        { slug: "debt-to-gdp", name: "Debt-to-GDP" },
        { slug: "debt-to-gdp-ratio-2025", name: "Debt to GDP ratio (2025)" },
        { slug: "population", name: "Population" },
      ],
      [],
    );
    expect(plan.writes.map((w) => w.slug)).toEqual(["debt-to-gdp", "population"]);
    expect(plan.skipped.map((s) => s.slug)).toEqual(["debt-to-gdp-ratio-2025"]);
  });

  it("leaves distinct metrics alone", () => {
    const plan = planAttributeWrites(
      [
        { slug: "gdp-per-capita", name: "GDP per capita" },
        { slug: "gdp-ppp", name: "GDP (PPP)" },
      ],
      [{ slug: "nominal-gdp", name: "Nominal GDP" }],
    );
    expect(plan.writes.map((w) => w.slug)).toEqual(["gdp-per-capita", "gdp-ppp"]);
  });

  it("falls back to the slug when the name is empty", () => {
    expect(canonicalMetricKey({ slug: "battery-life", name: "" })).not.toBe("");
  });
});

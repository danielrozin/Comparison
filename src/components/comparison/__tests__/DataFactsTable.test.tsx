import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { ComparisonAttribute, ComparisonEntityData } from "@/types";
import { presentComparisonMetrics } from "@/lib/comparison/metric-table-guard";
import { getEditorialComparison } from "@/lib/data/editorial-compares";
import { DataFactsTable, showsLimitRatio } from "../DataFactsTable";

function entity(id: string, name: string): ComparisonEntityData {
  return {
    id,
    slug: id,
    name,
    shortDesc: "",
    imageUrl: null,
    entityType: "concept",
    position: id === "a" ? 0 : 1,
    pros: [],
    cons: [],
    bestFor: "",
  };
}

function numericAttr(
  name: string,
  aText: string,
  bText: string,
  aNumber: number,
  bNumber: number,
): ComparisonAttribute {
  return {
    id: name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    unit: null,
    category: null,
    dataType: "number",
    higherIsBetter: null,
    values: [
      { entityId: "a", valueText: aText, valueNumber: aNumber, valueBoolean: null },
      { entityId: "b", valueText: bText, valueNumber: bNumber, valueBoolean: null },
    ],
  };
}

describe("Key Facts ratio", () => {
  it("hides the ratio when a limit row compares different kinds of caps", () => {
    expect(
      showsLimitRatio(
        "US maximum",
        "Chase: any amount at a branch. Wells Fargo: $6,000 a month",
        "USPS, Chase, and Wells Fargo: $1,000 each",
      ),
    ).toBe(false);

    const page = presentComparisonMetrics(getEditorialComparison("cashiers-check-vs-money-order")!);
    render(
      <DataFactsTable
        attributes={page.attributes}
        entityA={page.entities[0]}
        entityB={page.entities[1]}
      />,
    );

    const row = screen.getByRole("row", { name: /US maximum/ });
    expect(within(row).getByText(/\$6,000 a month/)).toBeInTheDocument();
    expect(within(row).getByText(/\$1,000 each/)).toBeInTheDocument();
    expect(within(row).queryByText("+500%")).not.toBeInTheDocument();
    expect(within(row).queryByText(/%/)).not.toBeInTheDocument();
  });

  it("keeps a ratio for an ordinary number and for limits of the same kind", () => {
    expect(showsLimitRatio("Price", "$10", "$5")).toBe(true);
    expect(showsLimitRatio("Annual Contribution Limit", "$7,000", "$23,500")).toBe(true);
    expect(showsLimitRatio("US maximum", "$6,000 a month", "$1,000 a month")).toBe(true);

    render(
      <DataFactsTable
        entityA={entity("a", "Alpha")}
        entityB={entity("b", "Beta")}
        attributes={[
          numericAttr("Price", "$10", "$5", 10, 5),
          numericAttr("Annual Contribution Limit", "$7,000", "$23,500", 7000, 23500),
        ]}
      />,
    );

    expect(within(screen.getByRole("row", { name: /Price/ })).getByText("+100%")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Annual Contribution Limit/ })).getByText("-70%")).toBeInTheDocument();
  });
});

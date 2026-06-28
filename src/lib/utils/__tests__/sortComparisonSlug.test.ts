import { describe, it, expect } from "vitest";
import { sortComparisonSlug } from "../slugify";

describe("sortComparisonSlug", () => {
  it("reorders a B-vs-A slug into the canonical alphabetical ordering", () => {
    expect(sortComparisonSlug("roomba-vs-roborock")).toBe("roborock-vs-roomba");
  });

  it("leaves an already-canonical ordering unchanged", () => {
    expect(sortComparisonSlug("roborock-vs-roomba")).toBe("roborock-vs-roomba");
  });

  it("returns the input unchanged when there is no -vs- separator", () => {
    expect(sortComparisonSlug("just-an-entity")).toBe("just-an-entity");
  });

  it("sorts N-way orderings", () => {
    expect(sortComparisonSlug("c-vs-a-vs-b")).toBe("a-vs-b-vs-c");
  });

  // Regression hazard (DAN-1265): sortComparisonSlug sorts the raw "-vs-" tokens,
  // so a slug whose last entity carries a keyword suffix gets the suffix sorted
  // into the MIDDLE, producing a slug that does not correspond to any real page.
  // This is exactly why the /compare/[slug] redirect MUST confirm the sorted
  // target resolves to a real comparison before issuing a 308 — otherwise it
  // would permanently redirect to a self-canonicalizing thin-shell dead-end.
  it("misplaces a trailing keyword suffix (documents why the redirect must verify DB existence)", () => {
    expect(
      sortComparisonSlug("xbox-series-x-vs-ps5-pro-performance-comparison-2026"),
    ).toBe("ps5-pro-performance-comparison-2026-vs-xbox-series-x");
    expect(
      sortComparisonSlug("rtx-4090-vs-rtx-4080-performance-comparison-2026"),
    ).toBe("rtx-4080-performance-comparison-2026-vs-rtx-4090");
  });
});

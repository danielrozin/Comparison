/**
 * ROO-53 — popular-compare cards only reuse slugs the hub already has.
 */
import { describe, expect, it } from "vitest";
import { buildPopularCompareDestinations } from "../hub-popular-compares";

describe("buildPopularCompareDestinations", () => {
  it("puts the primary compare first, then the next live chip", () => {
    expect(
      buildPopularCompareDestinations(
        "amazon-vs-best-buy",
        "Amazon vs Best Buy",
        [
          { slug: "amazon-vs-best-buy", label: "Amazon vs Best Buy" },
          { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
          { slug: "iphone-17-vs-samsung-s26", label: "iPhone vs Samsung" },
        ],
      ),
    ).toEqual([
      { slug: "amazon-vs-best-buy", label: "Amazon vs Best Buy" },
      { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
    ]);
  });

  it("stops at two cards so the stack stays above a short-phone cookie banner", () => {
    const items = buildPopularCompareDestinations("a-vs-b", "A vs B", [
      { slug: "c-vs-d", label: "C vs D" },
      { slug: "e-vs-f", label: "E vs F" },
    ]);
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.slug)).toEqual(["a-vs-b", "c-vs-d"]);
  });

  it("drops blank slugs and fills a missing label from the slug", () => {
    expect(
      buildPopularCompareDestinations("  ", "Blank", [
        { slug: "mac-vs-windows", label: "  " },
      ]),
    ).toEqual([{ slug: "mac-vs-windows", label: "mac vs windows" }]);
  });

  it("returns nothing when the hub has no live compare", () => {
    expect(buildPopularCompareDestinations(null, null, [])).toEqual([]);
  });
});

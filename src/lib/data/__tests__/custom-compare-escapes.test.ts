/**
 * ROO-132 — /custom-compare only links comparisons the live filter kept.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CUSTOM_COMPARE_ESCAPE_LIMIT,
  CUSTOM_COMPARE_SOURCE_PAGE,
  selectCustomCompareEscapes,
} from "../custom-compare-escapes";

const ranked = [
  { slug: "iphone-17-vs-samsung-s26", title: "iPhone 17 vs Samsung Galaxy S26" },
  { slug: "usa-vs-china", title: "USA vs China" },
  { slug: "lebron-vs-jordan", title: "LeBron vs Jordan" },
  { slug: "ww1-vs-ww2", title: "World War 1 vs World War 2" },
  { slug: "mac-vs-windows", title: "Mac vs Windows" },
  { slug: "android-vs-ios", title: "Android vs iOS" },
];

describe("selectCustomCompareEscapes", () => {
  it("keeps live slugs in ranked order and stops at five", () => {
    const escapes = selectCustomCompareEscapes(ranked, ranked.map((item) => item.slug));
    expect(escapes).toHaveLength(CUSTOM_COMPARE_ESCAPE_LIMIT);
    expect(escapes.map((item) => item.slug)).toEqual([
      "iphone-17-vs-samsung-s26",
      "usa-vs-china",
      "lebron-vs-jordan",
      "ww1-vs-ww2",
      "mac-vs-windows",
    ]);
    expect(escapes[0]?.label).toBe("iPhone 17 vs Samsung Galaxy S26");
  });

  it("drops a popular slug the live filter did not return", () => {
    const escapes = selectCustomCompareEscapes(ranked, [
      "usa-vs-china",
      "mac-vs-windows",
      "android-vs-ios",
    ]);
    expect(escapes.map((item) => item.slug)).toEqual([
      "usa-vs-china",
      "mac-vs-windows",
      "android-vs-ios",
    ]);
    expect(escapes.some((item) => item.slug === "iphone-17-vs-samsung-s26")).toBe(false);
  });

  it("does not invent a slug that was never ranked or live", () => {
    const escapes = selectCustomCompareEscapes(
      [{ slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo" }],
      ["messi-vs-ronaldo"],
    );
    expect(escapes).toEqual([{ slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" }]);
  });

  it("dedupes and labels a live slug that has no title", () => {
    const escapes = selectCustomCompareEscapes(
      [{ slug: "  ", title: "Blank" }],
      ["  mac-vs-windows  ", "mac-vs-windows", ""],
    );
    expect(escapes).toEqual([{ slug: "mac-vs-windows", label: "mac vs windows" }]);
  });

  it("returns nothing when no comparison is live", () => {
    expect(selectCustomCompareEscapes(ranked, [])).toEqual([]);
  });
});

describe("/custom-compare page wiring (ROO-132)", () => {
  const page = readFileSync(path.resolve(process.cwd(), "src/app/custom-compare/page.tsx"), "utf8");

  it("builds the hero links from trending data and the live-slug filter", () => {
    expect(page).toContain("getTrendingComparisons");
    expect(page).toContain("filterLiveCompareSlugs");
    expect(page).toContain("selectCustomCompareEscapes");
    expect(page).toContain("beforeTitle={<CustomCompareEscapes");
    expect(page).toContain("<CustomCompareViewTracker");
    expect(page).toContain("escapes={escapes}");
    expect(CUSTOM_COMPARE_SOURCE_PAGE).toBe("/custom-compare");
  });

  it("does not turn generation on or promise a 24-hour page", () => {
    expect(page).not.toContain("USER_GENERATION_ENABLED");
    expect(page).not.toMatch(/24 hours/i);
  });
});

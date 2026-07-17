import { describe, it, expect } from "vitest";
import { stripEntityKeywordSuffix, stripKeywordSuffixSlug } from "../slugify";

describe("stripEntityKeywordSuffix", () => {
  it("strips a trailing calendar year", () => {
    expect(stripEntityKeywordSuffix("texas-2026")).toBe("texas");
    expect(stripEntityKeywordSuffix("netflix-2027")).toBe("netflix");
  });

  it("strips a known keyword tail", () => {
    expect(stripEntityKeywordSuffix("california-population")).toBe("california");
    expect(stripEntityKeywordSuffix("iphone-specs")).toBe("iphone");
  });

  it("strips a compound keyword+year tail to a fixed point", () => {
    expect(stripEntityKeywordSuffix("china-economic-comparison-2026")).toBe("china");
    expect(stripEntityKeywordSuffix("nba-revenue-comparison-2026")).toBe("nba");
  });

  it("prefers the compound tail over its shorter substring", () => {
    // Must strip the whole "-economic-comparison", not just "-comparison"
    expect(stripEntityKeywordSuffix("china-economic-comparison")).toBe("china");
  });

  it("leaves a bare token that IS the suffix untouched", () => {
    expect(stripEntityKeywordSuffix("2026")).toBe("2026");
    expect(stripEntityKeywordSuffix("specs")).toBe("specs");
  });

  it("leaves a year outside the conservative window untouched", () => {
    expect(stripEntityKeywordSuffix("civic-1998")).toBe("civic-1998");
  });

  it("leaves a clean token unchanged", () => {
    expect(stripEntityKeywordSuffix("netflix")).toBe("netflix");
    expect(stripEntityKeywordSuffix("united-states")).toBe("united-states");
  });
});

describe("stripKeywordSuffixSlug", () => {
  // The four DAN-2323 drift cases must resolve to their clean canonical base pair.
  it("maps the DAN-2323 drift slugs to their base pair", () => {
    expect(stripKeywordSuffixSlug("california-population-vs-texas-2026")).toBe(
      "california-vs-texas"
    );
    expect(stripKeywordSuffixSlug("japan-vs-china-economic-comparison-2026")).toBe(
      "china-vs-japan"
    );
    expect(stripKeywordSuffixSlug("disney-vs-netflix-2026")).toBe(
      "disney-vs-netflix"
    );
    expect(stripKeywordSuffixSlug("nfl-vs-nba-revenue-comparison-2026")).toBe(
      "nba-vs-nfl"
    );
  });

  it("returns null when there is no suffix to strip", () => {
    expect(stripKeywordSuffixSlug("disney-vs-netflix")).toBeNull();
    expect(stripKeywordSuffixSlug("california-vs-texas")).toBeNull();
  });

  it("returns null for a non-comparison slug", () => {
    expect(stripKeywordSuffixSlug("just-an-entity")).toBeNull();
  });

  it("returns null when stripping would collapse the pair into a self-comparison", () => {
    // Both sides strip to "netflix" — must NOT emit a degenerate netflix-vs-netflix.
    expect(stripKeywordSuffixSlug("netflix-2026-vs-netflix-2027")).toBeNull();
  });

  it("re-sorts the stripped tokens into canonical order", () => {
    expect(stripKeywordSuffixSlug("texas-2026-vs-california-population")).toBe(
      "california-vs-texas"
    );
  });
});

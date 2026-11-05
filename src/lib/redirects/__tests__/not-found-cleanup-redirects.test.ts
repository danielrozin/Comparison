import { describe, expect, it } from "vitest";
import { CATEGORY_SOFT_404_REDIRECTS } from "../category-soft-404-redirects";
import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import {
  NEVER_PUBLISHED_ALIASES,
  NOT_FOUND_CLEANUP_CONSOLIDATIONS,
} from "../not-found-cleanup-redirects";
import { isKnownCategorySlug, isKnownSubcategorySlug } from "@/lib/seo/category-page-path";

describe("404 cleanup compare redirects", () => {
  it("leaves the NBA short aliases and Curry/LeBron slugs to the other batch", () => {
    const ownedElsewhere = [
      "sga-vs-wembanyama",
      "wembanyama-vs-sga",
      "knicks-vs-sixers",
      "sixers-vs-knicks",
      "curry-vs-lebron",
      "stephen-curry-vs-lebron-james",
    ];
    for (const slug of ownedElsewhere) {
      expect(NOT_FOUND_CLEANUP_CONSOLIDATIONS, slug).not.toHaveProperty(slug);
    }
  });

  it("sends each alias to its live target in one hop", () => {
    expect(Object.keys(NOT_FOUND_CLEANUP_CONSOLIDATIONS).length).toBeGreaterThan(0);
    for (const [from, to] of Object.entries(NOT_FOUND_CLEANUP_CONSOLIDATIONS)) {
      expect(getConsolidatedCompareSlug(from), from).toBe(to);
      expect(getConsolidatedCompareSlug(to), `${to} must not redirect again`).toBeNull();
      const hit = COMPARE_REDIRECTS.find((redirect) => redirect.source === `/compare/${from}`);
      expect(hit?.destination, from).toBe(`/compare/${to}`);
      expect(hit?.statusCode, from).toBe(301);
    }
  });
});

describe("ROO-382 demand slug aliases", () => {
  const ALIASES = {
    "us-vs-china": "usa-vs-china",
    "germany-vs-usa": "germany-vs-united-states",
  } as const;

  // Live pages this batch must not retarget. united-states-vs-china already
  // 301s to usa-vs-china through runtime alias resolution, not this map.
  const UNTOUCHED = [
    "usa-vs-china",
    "united-states-vs-china",
    "us-vs-china-gdp",
    "germany-vs-united-states",
    "us-economy-vs-china-economy",
    "china-vs-us-gdp-military-tech-comparison-2026",
    "us-nominal-gdp-vs-china-2026",
    "usa-vs-china-vs-india-gdp-2026",
  ];

  it("301s the two demand slugs onto the verified live pages", () => {
    expect(getConsolidatedCompareSlug("us-vs-china")).toBe("usa-vs-china");
    expect(getConsolidatedCompareSlug("germany-vs-usa")).toBe(
      "germany-vs-united-states",
    );
  });

  it("does not redirect the survivors or other live US-China pages", () => {
    for (const slug of UNTOUCHED) {
      expect(NOT_FOUND_CLEANUP_CONSOLIDATIONS, slug).not.toHaveProperty(slug);
      expect(getConsolidatedCompareSlug(slug), slug).toBeNull();
    }
  });

  it("is one hop: destinations are not themselves redirect sources", () => {
    const sources = new Set(COMPARE_REDIRECTS.map((redirect) => redirect.source));
    for (const [from, to] of Object.entries(ALIASES)) {
      expect(getConsolidatedCompareSlug(to), to).toBeNull();
      expect(sources.has(`/compare/${to}`), to).toBe(false);
      const hit = COMPARE_REDIRECTS.find(
        (redirect) => redirect.source === `/compare/${from}`,
      );
      expect(hit).toEqual({
        source: `/compare/${from}`,
        destination: `/compare/${to}`,
        statusCode: 301,
      });
      expect(sources.has(hit?.destination ?? ""), from).toBe(false);
    }
  });

  it("counts both sources as never-published so corpus math does not shrink", () => {
    for (const from of Object.keys(ALIASES)) {
      expect(NEVER_PUBLISHED_ALIASES.has(from), from).toBe(true);
    }
  });
});

describe("404 cleanup category redirects", () => {
  it("sends each legacy category URL to a real page in one hop", () => {
    const sources = new Set(CATEGORY_SOFT_404_REDIRECTS.map((redirect) => redirect.source));
    expect(sources).toEqual(
      new Set([
        "/category/gaming",
        "/category/ecommerce",
        "/category/kitchen-appliances",
        "/category/food_and_drink",
        "/category/social_media",
        "/category/science",
        "/category/general",
      ]),
    );

    for (const redirect of CATEGORY_SOFT_404_REDIRECTS) {
      expect(redirect.statusCode).toBe(301);
      expect(sources.has(redirect.destination), redirect.destination).toBe(false);
      const parts = redirect.destination.replace("/category/", "").split("/");
      const parent = parts[0] ?? "";
      const child = parts[1];
      expect(isKnownCategorySlug(parent), redirect.destination).toBe(true);
      if (child) expect(isKnownSubcategorySlug(parent, child), redirect.destination).toBe(true);
    }
  });
});

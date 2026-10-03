import { describe, expect, it } from "vitest";
import { CATEGORY_SOFT_404_REDIRECTS } from "../category-soft-404-redirects";
import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import { NOT_FOUND_CLEANUP_CONSOLIDATIONS } from "../not-found-cleanup-redirects";
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

describe("404 cleanup category redirects", () => {
  it("sends each legacy category URL to a real page in one hop", () => {
    const sources = new Set(CATEGORY_SOFT_404_REDIRECTS.map((redirect) => redirect.source));
    expect(sources).toEqual(
      new Set([
        "/category/gaming",
        "/category/ecommerce",
        "/category/kitchen-appliances",
        "/category/food_and_drink",
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

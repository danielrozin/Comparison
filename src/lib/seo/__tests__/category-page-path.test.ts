import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  categoryPagePath,
  isKnownCategorySlug,
  isUnknownCategoryPath,
} from "../category-page-path";

describe("categoryPagePath", () => {
  it("maps raw database categories onto real pages", () => {
    expect(categoryPagePath("gaming")).toBe("/category/products/gaming");
    expect(categoryPagePath("Gaming")).toBe("/category/products/gaming");
    expect(categoryPagePath("food_and_drink")).toBe("/category/companies/food-beverage");
    expect(categoryPagePath("Food_and_drink")).toBe("/category/companies/food-beverage");
    expect(categoryPagePath("food and drink")).toBe("/category/companies/food-beverage");
    expect(categoryPagePath("ecommerce")).toBe("/category/companies/retail-ecommerce");
    expect(categoryPagePath("kitchen-appliances")).toBe("/category/products/home-kitchen");
    expect(categoryPagePath("kitchen_appliances")).toBe("/category/products/home-kitchen");
  });

  it("keeps real top-level categories and drops values with no page", () => {
    expect(categoryPagePath("software")).toBe("/category/software");
    expect(categoryPagePath("automotive")).toBe("/category/automotive");
    expect(categoryPagePath("science")).toBeNull();
    expect(categoryPagePath("general")).toBeNull();
    expect(categoryPagePath("")).toBeNull();
    expect(categoryPagePath(null)).toBeNull();
  });
});

describe("unknown /category paths", () => {
  it("treats legacy and invented slugs as unknown, and real pages as known", () => {
    expect(isKnownCategorySlug("sports")).toBe(true);
    expect(isKnownCategorySlug("gaming")).toBe(false);
    expect(isUnknownCategoryPath("/category/gaming")).toBe(true);
    expect(isUnknownCategoryPath("/category/food_and_drink")).toBe(true);
    expect(isUnknownCategoryPath("/category/not-a-real-category")).toBe(true);
    expect(isUnknownCategoryPath("/category/sports")).toBe(false);
    expect(isUnknownCategoryPath("/category/products/gaming")).toBe(false);
    expect(isUnknownCategoryPath("/category/sports/not-a-sub")).toBe(true);
    expect(isUnknownCategoryPath("/compare/usa-vs-china")).toBe(false);
  });

  it("404s before the category page can stream a 200", () => {
    const page = readFileSync(
      path.resolve(process.cwd(), "src/app/category/[slug]/page.tsx"),
      "utf8",
    );
    const layout = readFileSync(
      path.resolve(process.cwd(), "src/app/category/[slug]/layout.tsx"),
      "utf8",
    );
    const subcategory = readFileSync(
      path.resolve(process.cwd(), "src/app/category/[slug]/[subcategory]/page.tsx"),
      "utf8",
    );

    expect(page).toContain("export const dynamicParams = false");
    expect(subcategory).toContain("export const dynamicParams = false");
    expect(layout).toContain("if (!isKnownCategorySlug(slug)) notFound()");

    const pageNotFound = page.indexOf("if (!category) notFound()");
    const pageQuery = page.indexOf("await getComparisonsByCategory");
    expect(pageNotFound).toBeGreaterThan(-1);
    expect(pageNotFound).toBeLessThan(pageQuery);

    const subNotFound = subcategory.indexOf("if (!category || !subcat) notFound()");
    const subQuery = subcategory.indexOf("await getComparisonsByCategory");
    expect(subNotFound).toBeGreaterThan(-1);
    expect(subNotFound).toBeLessThan(subQuery);
  });

  it("does not build category links from the raw database value", () => {
    const breadcrumb = readFileSync(
      path.resolve(process.cwd(), "src/components/comparison/DynamicComparison.tsx"),
      "utf8",
    );
    const compare = readFileSync(
      path.resolve(process.cwd(), "src/pages/compare/[slug].tsx"),
      "utf8",
    );
    expect(breadcrumb).toContain("categoryPagePath");
    expect(breadcrumb).not.toContain("`/category/${comparison.category}`");
    expect(compare).toContain("categoryPagePath");
    expect(compare).not.toContain("meta.articleSection.toLowerCase().replace");
  });
});

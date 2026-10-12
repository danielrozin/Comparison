import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import {
  isKnownCategorySlug,
  isUnknownSubcategoryPath,
  UNKNOWN_CATEGORY_404_REWRITE,
} from "../category-page-path";

function run(path: string) {
  return middleware(new NextRequest(`https://www.aversusb.net${path}`));
}

describe("unknown subcategory 404 rewrite", () => {
  it("rewrites a known category with an unknown subcategory to the real 404", () => {
    expect(isUnknownSubcategoryPath("/category/products/not-a-subcategory")).toBe(true);
    expect(isKnownCategorySlug("__not-a-category__")).toBe(false);

    const response = run("/category/products/not-a-subcategory");
    expect(response.headers.get("x-middleware-rewrite")).toContain(UNKNOWN_CATEGORY_404_REWRITE);
    expect(response.headers.get("x-middleware-next")).toBeNull();
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("leaves known category and subcategory pages alone", () => {
    expect(isUnknownSubcategoryPath("/category/sports/basketball")).toBe(false);
    expect(isUnknownSubcategoryPath("/category/technology")).toBe(false);
    expect(isUnknownSubcategoryPath("/category/foo")).toBe(false);
    expect(isUnknownSubcategoryPath("/category/gaming")).toBe(false);

    for (const path of [
      "/category/sports/basketball",
      "/category/technology?page=2",
      "/category/foo",
      "/category/gaming",
    ]) {
      const response = run(path);
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
      expect(response.headers.get("x-middleware-next"), path).toBe("1");
    }

    for (const [parent, subs] of Object.entries(CATEGORY_SUBCATEGORIES)) {
      for (const sub of subs) {
        const path = `/category/${parent}/${sub.slug}`;
        expect(isUnknownSubcategoryPath(path), path).toBe(false);
        const response = run(path);
        expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
        expect(response.headers.get("x-middleware-next"), path).toBe("1");
      }
    }
  });
});

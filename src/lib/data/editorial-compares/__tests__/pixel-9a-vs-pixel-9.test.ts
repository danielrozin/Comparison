import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "pixel-9a-vs-pixel-9";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|passmark|\bexpert\b|human review|byline/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, item] of Object.entries(node)) {
        if (key === "expertAnalysis") parts.push(String(item));
        else visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("Pixel 9a vs Pixel 9", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs.length).toBeGreaterThanOrEqual(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-18T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "galaxy-s25-vs-galaxy-s25-ultra",
      "iphone-16e-vs-iphone-17e",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
  });

  it("states sourced facts without benchmarks, review claims or self-reference", () => {
    const text = readerText(page());
    expect(text).toContain("Tensor G4");
    expect(text).toContain("5,100 mAh");
    expect(text).toContain("4,700 mAh");
    expect(text).toContain("12GB");
    expect(text).toContain("IP68");
    expect(text).toContain("seven years");
    expect(text).toContain("$499 launch price (MSRP), per Google Keyword blog, March 2025");
    expect(text).toContain("$799 launch price (MSRP), per Google Keyword blog, August 2024");
    expect(text).not.toMatch(/\bfrom \$\d|\$\d+ at launch/i);
    const vendorLinks = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(vendorLinks.map((r) => r.url)).toEqual(["https://store.google.com/us/product/pixel_9a?hl=en-US"]);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(support\.google\.com|store\.google\.com|blog\.google)\//);
    }
  });

  it("shows up on the technology smartphones hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((s) => s.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });
});

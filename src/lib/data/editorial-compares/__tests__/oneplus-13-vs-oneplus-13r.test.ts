import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "oneplus-13-vs-oneplus-13r";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|passmark|\bexpert\b|human review|byline|\$\d/i;

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

describe("OnePlus 13 vs OnePlus 13R", () => {
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
      "oneplus-15-vs-samsung-galaxy-s26-ultra-vs-samsung-galaxy-s25-ultra",
      "galaxy-s25-vs-galaxy-s25-ultra",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
  });

  it("states sourced facts without benchmarks, review claims or self-reference", () => {
    const text = readerText(page());
    expect(text).toContain("Snapdragon 8 Elite");
    expect(text).toContain("Snapdragon 8 Gen 3");
    expect(text).toContain("IP68 and IP69");
    expect(text).toContain("IP65");
    expect(text).toContain("50W AIRVOOC");
    expect(text).toContain("6,000 mAh");
    expect(text).toContain("January 7, 2031");
    expect(text).not.toMatch(/Android 1[6-9]|four Android upgrades/);
    expect(text).toContain("six years of security updates");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    expect(page().citationStats?.sources.map((source) => source.url)).toContain("https://www.oneplus.com/uk/psti");
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.oneplus\.com\//);
    }
  });

  it("shows up on the technology smartphones hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((s) => s.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });
});

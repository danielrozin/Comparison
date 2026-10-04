import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "galaxy-z-flip-8-vs-galaxy-s26-ultra";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404/i;

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
      for (const item of Object.values(node)) visit(item);
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("Galaxy Z Flip8 vs Galaxy S26 Ultra", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("technology");
    expect(page().faqs).toHaveLength(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-04T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    const sentences = page().shortAnswer.split(/(?<=\.)\s+/);
    expect(sentences[0]).toMatch(/Flip8/);
    expect(sentences[1]).toMatch(/S26 Ultra/);
  });

  it("uses Samsung's listed weight, battery, charging, cameras, and regional chips", () => {
    const text = readerText(page());
    expect(text).toContain("180 grams");
    expect(text).toContain("6.1 mm");
    expect(text).toContain("13.1 mm");
    expect(text).toContain("4300 mAh");
    expect(text).toContain("4174 mAh");
    expect(text).toContain("25W");
    expect(text).toContain("214 grams");
    expect(text).toContain("7.9 mm");
    expect(text).toContain("6.9-inch");
    expect(text).toContain("5000 mAh");
    expect(text).toContain("31 hours");
    expect(text).toContain("from 45 W to 60 W");
    expect(text).toContain("75%");
    expect(text).toContain("200 MP");
    expect(text).toContain("50 MP");
    expect(text).toContain("Snapdragon 8 Elite Gen 5 for Galaxy");
    expect(text).toContain("Exynos 2600");
    expect(text).toContain("select markets");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/\bexpert\b|human review|byline/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.samsung\.com\//);
    }
  });

  it("shows up on the technology smartphones hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const phones = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, phones!).map((card) => card.slug)).toContain(SLUG);
  });
});

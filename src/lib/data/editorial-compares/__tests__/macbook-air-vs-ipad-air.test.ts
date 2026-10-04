import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "macbook-air-vs-ipad-air";

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

describe("MacBook Air vs iPad Air", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("technology");
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-04T00:00:00Z");
    expect(page().relatedComparisons).toEqual([]);
    expect(findSelfContradictions(page())).toEqual([]);
    const sentences = page().shortAnswer.split(/(?<=\.)\s+/);
    expect(sentences[0]).toMatch(/MacBook Air/);
    expect(sentences[1]).toMatch(/iPad Air/);
  });

  it("uses Apple's listed chips, sizes, battery, weight, and prices", () => {
    const text = readerText(page());
    expect(text).toContain("Apple M5");
    expect(text).toContain("Apple M4");
    expect(text).toContain("13.6-inch");
    expect(text).toContain("2560-by-1664");
    expect(text).toContain("15.3-inch");
    expect(text).toContain("2880-by-1864");
    expect(text).toContain("16GB");
    expect(text).toContain("18 hours");
    expect(text).toContain("15 hours");
    expect(text).toContain("2.7 pounds (1.23 kg)");
    expect(text).toContain("3.3 pounds (1.51 kg)");
    expect(text).toContain("2360-by-1640");
    expect(text).toContain("2732-by-2048");
    expect(text).toContain("12GB");
    expect(text).toContain("10 hours");
    expect(text).toContain("1.02 pounds (464 grams)");
    expect(text).toContain("Apple Pencil Pro");
    expect(text).toContain("Apple Pencil (USB-C)");
    expect(text).toContain("$1,299");
    expect(text).toContain("$1,499");
    expect(text).toContain("$749");
    expect(text).toContain("$129");
    expect(text).toContain("$79");
    expect(text).toContain("$269");
    expect(text).toContain("$319");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/\bexpert\b|human review|byline/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.apple\.com\//);
    }
  });

  it("shows up on the technology laptop and tablet hubs", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const subs = CATEGORY_SUBCATEGORIES.technology;
    const laptops = subs.find((sub) => sub.slug === "laptops-computers");
    const tablets = subs.find((sub) => sub.slug === "tablets");
    expect(comparisonsForSubcategory(cards, laptops!).map((card) => card.slug)).toContain(SLUG);
    expect(comparisonsForSubcategory(cards, tablets!).map((card) => card.slug)).toContain(SLUG);
  });
});

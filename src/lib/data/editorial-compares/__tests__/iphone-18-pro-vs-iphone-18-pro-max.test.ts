import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "iphone-18-pro-vs-iphone-18-pro-max";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|\bexpert\b|human review|byline|rumou?r|leak|\bwinner\b|\bbest\b/i;

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
        else if (key === "winner") continue;
        else visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("iPhone 18 Pro vs iPhone 18 Pro Max (ROO-274)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs.length).toBeGreaterThanOrEqual(5);
    expect(page().faqs.length).toBeLessThanOrEqual(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-19T00:00:00Z");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
  });

  it("writes the verdict as choose-X-if", () => {
    expect(page().shortAnswer).toMatch(/^Choose iPhone 18 Pro if /);
    expect(page().shortAnswer).toMatch(/Choose iPhone 18 Pro Max if /);
    expect(page().verdict).toMatch(/^Choose iPhone 18 Pro if /);
    expect(page().verdict).toMatch(/Choose iPhone 18 Pro Max if /);
  });

  it("states Apple's specs with dated launch prices and no source-talk", () => {
    const text = readerText(page());
    for (const fact of ["A20 Pro", "6.3-inch", "6.9-inch", "211 g", "249 g", "24 hours", "30 hours", "36 hours", "45 hours", "2TB", "IP68"]) {
      expect(text).toContain(fact);
    }
    expect(text).toContain("$1,199 launch price (MSRP), per Apple Newsroom, September 2026");
    expect(text).toContain("$1,299 launch price (MSRP), per Apple Newsroom, September 2026");
    expect(text).not.toMatch(/\bfrom \$\d|\$\d+ at launch|starts at \$/i);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    const vendorLinks = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(vendorLinks.map((r) => r.url)).toEqual(["https://www.apple.com/shop/buy-iphone/iphone-18-pro"]);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.apple\.com\//);
    }
  });

  it("does not reuse sentences from the 17-vs-18 pages", () => {
    const own = page().expertAnalysis ?? "";
    for (const file of ["iphone-17-pro-max-vs-iphone-18-pro-max.ts", "iphone-17-pro-vs-iphone-18-pro.ts"]) {
      const other = readFileSync(`src/lib/data/editorial-compares/${file}`, "utf8");
      const sentences = own.split(/(?<=[.!?])\s+/).filter((s) => s.length > 50);
      for (const sentence of sentences) expect(other.includes(sentence), sentence).toBe(false);
    }
  });

  it("links live related compares", () => {
    for (const item of page().relatedComparisons) {
      expect(isRedirectedCompareSlug(item.slug)).toBe(false);
      expect(getEditorialComparison(item.slug)?.slug ?? item.slug).toBe(item.slug);
    }
  });

  it("shows up on the technology smartphones hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((s) => s.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });
});

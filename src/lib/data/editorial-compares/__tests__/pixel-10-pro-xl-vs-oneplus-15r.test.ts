import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "pixel-10-pro-xl-vs-oneplus-15r";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\babove\b|\bshown\b|\bquoted\b|according to|reddit|trustpilot|versus\.com|commenter|thread|\bfps\b|benchmark|geekbench|antutu|\d+(?:\.\d+)?\s?%|most complete|ultrasonic|human review|byline|reviewed by/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node)) parts.push(node);
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

describe("Pixel 10 Pro XL vs OnePlus 15R", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
    expect(page().category).toBe("technology");
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-28T00:00:00Z");
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)).not.toBeNull();
    }
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses Google and OnePlus specs with dated prices only", () => {
    const text = readerText(page());
    for (const fact of ["Tensor G5", "Snapdragon 8 Gen 5", "48 MP 5x telephoto", "42 MP", "5200 mAh", "7,400 mAh", "Qi2", "25W", "55W SUPERVOOC", "165Hz", "IP68", "IP69K", "7 years", "December 31, 2031", "Android 16"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    for (const price of text.match(/\$\d[\d,.]*\d/g) ?? []) {
      expect(["$1199", "$699.99"]).toContain(price);
    }
    expect(text).toContain("$1199 starting price (256GB), per Google, August 2025");
    expect(text).toContain("$699.99 for 12GB+256GB on the OnePlus US store, October 2026");
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(store\.google\.com|blog\.google|www\.oneplus\.com)\//);
    }
  });

  it("links both vendor price pages", () => {
    const labels = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(labels.map((r) => new URL(r.url).hostname).sort()).toEqual(["store.google.com", "www.oneplus.com"]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
  });

  it("shows up on the technology smartphones hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((s) => s.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });
});

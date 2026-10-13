import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "oneplus-15-vs-samsung-galaxy-s26-ultra-vs-samsung-galaxy-s25-ultra";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|\bincluded\b|reddit|benchmark|geekbench|dxo|street price/i;

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

describe("OnePlus 15 vs Galaxy S26 Ultra vs Galaxy S25 Ultra", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("technology");
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-12T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["galaxy-s26-vs-galaxy-s26-ultra", "iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra"]);
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses OnePlus and Samsung facts", () => {
    const text = readerText(page());
    for (const fact of ["7,300mAh", "5,000mAh", "80W", "50W", "60W", "November 13, 2031", "February 2033", "January 2032", "S Pen", "165Hz", "Snapdragon 8 Elite Gen 5"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
        expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/\$[0-9]|in 3 years|in 2 years/);
    expect(page().entities).toHaveLength(3);
    expect(text).not.toMatch(/human review|byline|reviewed by/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(www\.oneplus\.com|www\.samsung\.com|images\.samsung\.com)\//);
    }
  });
  it("shows up on the technology hub", () => {
    expect(mergeEditorialCategoryComparisons("technology", []).map((card) => card.slug)).toContain(SLUG);
  });
});

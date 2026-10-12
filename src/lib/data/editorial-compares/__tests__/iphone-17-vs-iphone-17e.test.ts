import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "iphone-17-vs-iphone-17e";

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

describe("iPhone 17 vs iPhone 17e", () => {
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
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["iphone-16e-vs-iphone-17e", "iphone-17-vs-iphone-air", "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro"]);
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses Apple specs without benchmarks", () => {
    const text = readerText(page());
    for (const fact of ["A19", "30 hours", "26 hours", "27 hours", "21 hours", "177 g", "169 g", "Ultra Wide", "120Hz", "IP68", "C1X", "N1"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
        expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/A19 Pro|triple|\$[0-9]/);
    expect(text).not.toMatch(/human review|byline|reviewed by/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.apple\.com\//);
    }
  });
  it("shows up on the technology hub", () => {
    expect(mergeEditorialCategoryComparisons("technology", []).map((card) => card.slug)).toContain(SLUG);
  });

  it("fixes the iPhone 17 entity copy to Apple's specs", async () => {
    const { ENTITY_CONTENT } = await import("@/lib/data/entity-content");
    const entry = JSON.stringify((ENTITY_CONTENT as Record<string, unknown>)["iphone-17"]);
    expect(entry).toContain("A19 chip");
    expect(entry).toContain("48MP Dual Fusion");
    expect(entry).toContain("30 hours");
    expect(entry).not.toMatch(/A19 Pro chip, built|triple camera|28 hours|28h|titanium/);
  });
});

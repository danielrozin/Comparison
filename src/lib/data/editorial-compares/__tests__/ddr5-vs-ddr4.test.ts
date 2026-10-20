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

const SLUG = "ddr5-vs-ddr4";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\babove\b|\bshown\b|\bquoted\b|according to|reddit|commenter|\bfps\b|faster|benchmark|headroom|end-of-line|\d+(?:\.\d+)?\s?%|€|\$\d|MSRP|launch price/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      // Source URLs are not reader copy (one Kingston slug contains "fps").
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

describe("DDR5 vs DDR4", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-10-20T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-9700x-vs-ryzen-7-9800x3d",
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      "oled-vs-mini-led-gaming-monitor",
    ]);
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

  it("uses vendor specs without benchmarks, prices or thread anecdotes", () => {
    const text = readerText(page());
    for (const fact of ["4800 MT/s", "3200 MT/s", "8800 MT/s", "1.1V", "1.2V", "PMIC", "32-bit subchannels", "DDR5-5600", "DDR4-3200", "AM5", "AM4", "LGA1700", "LGA1851", "Ryzen 5 9600X", "Ryzen 7 5800X3D", "Core i5-14600K", "Core Ultra 5 245K", "dual channel"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/DDR5-6400|6400 MT\/s/);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/human review|byline|reviewed by/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.(amd|intel|kingston)\.com\//);
    }
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

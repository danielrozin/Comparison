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

const SLUG = "rx-9070-vs-rx-9070-xt";

// Reader copy must not talk about the page or its sources, and must not carry
// performance numbers. "Community opinion" is allowed only as a labelled block.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\babove\b|\bshown\b|\bquoted\b|according to|trustpilot|commenter|\bfps\b|benchmark|techpowerup|\d+(?:\.\d+)?\s?%|faster than|restart(?:ed)? production|human review|byline|reviewed by/i;

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

describe("RX 9070 vs RX 9070 XT", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, one FAQPage and no ClaimReview", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-30T00:00:00Z");
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

  it("uses AMD facts and dated SEP prices only", () => {
    const text = readerText(page());
    for (const fact of ["56", "64", "3584", "4096", "2520 MHz", "2970 MHz", "256-bit", "640 GB/s", "64 MB", "220 W", "304 W", "650W", "750W", "March 6, 2025"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    for (const price of text.match(/\$\d[\d,.]*\d/g) ?? []) {
      expect(["$549", "$599", "$50"]).toContain(price);
    }
    expect(text).toContain("$549 launch suggested price (SEP), per AMD, February 2025");
    expect(text).toContain("$599 launch suggested price (SEP), per AMD, February 2025");
    expect(text).toMatch(/Community opinion[\s\S]*This is community opinion, not measured results\./);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.amd\.com\//);
    }
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
  });

  it("links the AMD vendor price page", () => {
    const labels = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(labels.map((r) => new URL(r.url).hostname)).toEqual(["www.amd.com"]);
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

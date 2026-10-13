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

const SLUG = "rx-9060-xt-vs-rtx-5060-ti";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|\bincluded\b|reddit|hwben|\bfps\b|faster|benchmark|9800X3D|headroom|3\.5x/i;

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

describe("RX 9060 XT vs RTX 5060 Ti", () => {
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
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["rx-9070-xt-vs-rtx-5080", "nvidia-vs-amd"]);
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses AMD and NVIDIA launch prices and specs without benchmarks", () => {
    const text = readerText(page());
    for (const fact of ["$349", "$429", "$299", "$379", "16 GB", "GDDR6", "GDDR7", "128-bit", "32 MB", "3130 MHz", "160 W", "450 W", "4,608", "2.57 GHz", "180 W", "600 W", "PCIe 5.0 x16", "Multi Frame Generation", "FSR 4"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/TechSpot|9%|\bfps\b/i);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/human review|byline|reviewed by/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(www\.amd\.com|www\.nvidia\.com|nvidianews\.nvidia\.com)\//);
    }
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

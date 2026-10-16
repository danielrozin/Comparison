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

const SLUG = "ryzen-7-9700x-vs-ryzen-7-9800x3d";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\babove\b|\bshown\b|\bquoted\b|according to|reddit|nanoreview|techspot|passmark|geekbench|cinebench|specsmith|\bfps\b|faster|benchmark|headroom|\d+(?:\.\d+)?\s?%|€|\$\d/i;

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

describe("Ryzen 7 9700X vs Ryzen 7 9800X3D", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-10-16T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["rx-9070-xt-vs-rtx-5080", "nvidia-vs-amd"]);
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses AMD specs without benchmarks or prices", () => {
    const text = readerText(page());
    for (const fact of ["8 cores, 16 threads", "32 MB", "96 MB", "104 MB", "8 MB L2", "65W", "120W", "5.5 GHz", "5.2 GHz", "3.8 GHz", "4.7 GHz", "AM5", "DDR5-5600", "PCIe 5.0", "3D V-Cache", "August 8, 2024", "November 7, 2024"]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/human review|byline|reviewed by/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.amd\.com\//);
    }
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

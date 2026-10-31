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

const SLUG = "b850-vs-x870";

const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const TECHSPOT =
  "https://www.techspot.com/guides/2901-amd-ryzen-x870-b850-b840-x670-b650-a620-motherboards/";

// Reader copy must not narrate the research, and must not carry invented
// performance, price, or board-model stats. "Community opinion" is allowed
// only as a labelled block with no numbers from the thread.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\bshown\b|\bquoted\b|according to|trustpilot|commenter|\bfps\b|benchmark|techpowerup|323052|5GbE|2\.5GbE|\bASUS\b|\bROG\b|Wi-Fi 7|Promontory|motherboardcentral|\d+(?:\.\d+)?\s?%|faster than|\$\d|human review|byline|reviewed by/i;

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

describe("B850 vs X870", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, one FAQPage and no ClaimReview", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().shortAnswer).toMatch(/Neither chipset is right for everyone/);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-31T00:00:00Z");
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)).not.toBeNull();
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-5800x3d-vs-am5",
      "ddr5-vs-ddr4",
      "rx-9070-vs-rx-9070-xt",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("keeps FAQ schema text identical to the visible faqs", () => {
    const schemas = comparisonPageSchema(page()) as Array<{
      "@type"?: string;
      "@graph"?: Array<{ "@type"?: string; mainEntity?: { name: string; acceptedAnswer?: { text: string } }[] }>;
      mainEntity?: { name: string; acceptedAnswer?: { text: string } }[];
    }>;
    const faqNodes = schemas.flatMap((node) => {
      const graph = node["@graph"] ?? [];
      return [node, ...graph].filter((item) => item["@type"] === "FAQPage");
    });
    expect(faqNodes).toHaveLength(1);
    const main = faqNodes[0].mainEntity ?? [];
    expect(main.map((item) => item.name)).toEqual(page().faqs.map((faq) => faq.question));
    expect(main.map((item) => item.acceptedAnswer?.text)).toEqual(page().faqs.map((faq) => faq.answer));
  });

  it("uses the AMD chipset table and bans invented stats", () => {
    const text = readerText(page());
    for (const fact of [
      "1x16 or 2x8 PCIe 5.0",
      "1x16 or 2x8 PCIe 4.0",
      "1x4 PCIe 5.0 plus 4x PCIe GPP",
      "1x4 PCIe 5.0",
      "36 / 24",
      "36 / 4",
      "1 / 6 / 1",
      "Optional",
      "Standard",
      "Socket AM5",
      "EXPO",
      "44 usable PCIe lanes",
      "2 / 12 / 2",
      "February 6, 2025",
      "B650E",
    ]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).toMatch(/Community opinion[\s\S]*This is community opinion, not measured results\./);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([AMD_AM5, AMD_9800X3D, TECHSPOT]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([AMD_AM5, AMD_9800X3D, TECHSPOT]);
    expect(page().citationStats?.sourceCount).toBe(3);
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).not.toMatch(/techpowerup|reddit\.com/i);
    }
    expect(page().citationStats?.sources[0]?.url).toMatch(/^https:\/\/www\.amd\.com\//);
    expect(page().citationStats?.sources[1]?.url).toMatch(/^https:\/\/www\.amd\.com\//);
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

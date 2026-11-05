import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "b650-vs-b850";

const AMD_AM5 = "https://www.amd.com/en/products/processors/chipsets/am5.html";
const AMD_9800X3D =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const TECHSPOT =
  "https://www.techspot.com/guides/2901-amd-ryzen-x870-b850-b840-x670-b650-a620-motherboards/";
const TECHPOWERUP =
  "https://www.techpowerup.com/review/nvidia-geforce-rtx-5090-pci-express-scaling/";

// Reader copy credits AMD, TechSpot and the named TechPowerUp setup.
// It must not narrate the research or say "this page" / "article says".
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|this page|checked against|Source note|(?:^|\n)Sources:|official page|\bfetch\b|human review|byline|reviewed by/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      if (!/^https?:\/\//.test(node) && !node.startsWith("/")) parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, item] of Object.entries(node)) {
        if (key === "winner" || key === "winnerName") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("B650 vs B850", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().shortAnswer).toMatch(/Neither chipset is right for everyone/);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attribute of page().attributes) {
      for (const value of attribute.values) expect(value.winner).not.toBe(true);
    }
    expect(findSelfContradictions(page())).toEqual([]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug), related.slug).not.toBeNull();
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "b850-vs-x870",
      "ryzen-7-9700x-vs-ryzen-7-9800x3d",
      "rx-9070-vs-rx-9070-xt",
    ]);
  });

  it("keeps FAQ schema text identical to the visible answers", () => {
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
    const types = schemas.flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses AMD and TechSpot floors and does not narrate the page", () => {
    const text = readerText(page());
    for (const fact of [
      "1x16 or 2x8 PCIe 4.0",
      "1x4 PCIe 5.0",
      "PCIe 5.0 optional",
      "36 / 4",
      "36 / 0",
      "1 / 6 / 1",
      "Check the SKU",
      "February 6, 2025",
      "January 24, 2025",
      "about 1 percent",
      "B650E",
      "Socket AM5",
      "EXPO",
      "Ryzen 7 9800X3D",
      "RX 9070 XT",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/Community opinion|reddit\.com|r\/buildapc|close the loop/i);
    expect(text).not.toMatch(/\d+(?:\.\d+)?\s?%/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_AM5,
      AMD_9800X3D,
      TECHSPOT,
      TECHPOWERUP,
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      AMD_AM5,
      AMD_9800X3D,
      TECHSPOT,
      TECHPOWERUP,
    ]);
    expect(page().citationStats?.sourceCount).toBe(4);
    expect(page().citationStats?.sources[0]?.url).toMatch(/^https:\/\/www\.amd\.com\//);
    expect(page().citationStats?.sources[1]?.url).toMatch(/^https:\/\/www\.amd\.com\//);
  });

  it("shows up on the gaming hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

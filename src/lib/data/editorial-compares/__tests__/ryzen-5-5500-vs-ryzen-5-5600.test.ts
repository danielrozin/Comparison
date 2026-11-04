import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "ryzen-5-5500-vs-ryzen-5-5600";

const AMD_LAUNCH =
  "https://www.amd.com/en/newsroom/press-releases/2022-3-15-amd-launches-the-ultimate-gaming-processor-brings.html";
const AMD_5500 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5500.html";
const AMD_5600 =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600.html";
const AMD_5500F =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5500f.html";
const AMD_5600X =
  "https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html";
const AMD_5600G =
  "https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-5000-series/amd-ryzen-5-5600g.html";
const TECHSPOT = "https://www.techspot.com/review/2494-amd-ryzen-5500/";
const TOMS =
  "https://www.tomshardware.com/reviews/amd-ryzen-5-5600-and-ryzen-5-5500-review/3";
const ARS =
  "https://arstechnica.com/gadgets/2022/04/review-ryzen-5-5500-and-5600-can-breathe-new-life-into-older-amd-pcs/";

// Reader copy credits AMD, TechSpot, Tom's Hardware, and Ars Technica.
// It must not narrate the research, name a winner, or carry street prices.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\bquoted\b|reddit|human review|byline|reviewed by|\bwinner\b|\bbest\b|Drafted with AI|\$90|\$150|\$140|\$110/i;

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

describe("Ryzen 5 5500 vs Ryzen 5 5600", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(5);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-04T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    expect(page().shortAnswer).toMatch(/Neither chip is the right pick for every build/);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
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

  it("states sourced 2022 facts and links the live AM4 pages", () => {
    const text = readerText(page());
    for (const fact of [
      "6 cores",
      "12 threads",
      "16 MB",
      "32 MB",
      "19 MB",
      "35 MB",
      "4.2 GHz",
      "4.4 GHz",
      "3.6 GHz",
      "3.5 GHz",
      "PCIe 3.0",
      "PCIe 4.0",
      "65 W",
      "Wraith Stealth",
      "$159",
      "$199",
      "17 percent",
      "14 percent",
      "7 percent",
      "98.1 percent",
      "83.2 percent",
      "90 and 95 percent",
      "13 percent",
      "Cezanne",
      "Vermeer",
      "September 10, 2026",
      "Radeon Graphics",
      "7 graphics cores",
      "1900 MHz",
      "B450",
      "DDR4-3200",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    for (const price of text.match(/\$\d+(?:\.\d+)?/g) ?? []) {
      expect(["$159", "$199"]).toContain(price);
    }
    expect(text).toContain("launch prices, not current street prices");
    expect(text).toContain("Ryzen 7 5800X3D or AM5");
    expect(text).toContain("DDR5 vs DDR4");
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_LAUNCH,
      AMD_5500,
      AMD_5600,
      AMD_5500F,
      AMD_5600X,
      AMD_5600G,
      TECHSPOT,
      TOMS,
      ARS,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-5800x3d-vs-am5",
      "ddr5-vs-ddr4",
    ]);
    expect(isRedirectedCompareSlug("ryzen-7-5800x3d-vs-am5")).toBe(false);
    expect(isRedirectedCompareSlug("ddr5-vs-ddr4")).toBe(false);
    expect(getEditorialComparison("ryzen-7-5800x3d-vs-am5")).not.toBeNull();
    expect(getEditorialComparison("ddr5-vs-ddr4")).not.toBeNull();
  });

  it("shows up on the desktop and gaming hubs and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const computers = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "laptops-computers");
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, computers!).map((card) => card.slug)).toContain(SLUG);
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

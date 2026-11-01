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

const SLUG = "rtx-5060-vs-rtx-3060-12gb";

const NV_COMPARE = "https://www.nvidia.com/en-us/geforce/graphics-cards/compare/";
const NV_5060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5060-family/";
const NV_3060 = "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3060-3060ti/";
const TECHSPOT = "https://www.techspot.com/review/2992-nvidia-geforce-rtx-5060/";
const HWZ =
  "https://www.hardwarezone.com.sg/pc/components/nvidia-geforce-rtx-5060-8gb-review-it-had-rough-start-its-not-bad-gpu";
const MSI = "https://www.msi.com/Motherboard/B450M-A-PRO-MAX/Specification";
const BLENDER = "https://www.blender.org/download/requirements/";

// Reader copy must not narrate the research. The Reddit thread returned 403,
// so a community-opinion block is not allowed. Performance percentages are
// only the two review summaries named below.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|on that table|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|returned 404|\bshown\b|\bquoted\b|according to|trustpilot|commenter|human review|byline|reviewed by|nanoreview|pcbench|digital foundry|optix/i;

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

describe("RTX 5060 vs RTX 3060 12GB", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, one FAQPage and no ClaimReview", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBeFalsy();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
    expect(page().faqs).toHaveLength(5);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(buildPageTitle(page().metadata.metaTitle).length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-01T00:00:00Z");
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)).not.toBeNull();
    }
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5060-vs-rx-9060-xt",
      "rx-9060-xt-vs-rx-9070",
      "rx-9070-vs-rx-9070-xt",
      "ddr5-vs-ddr4",
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

  it("uses NVIDIA specs and only the two attributed review summaries", () => {
    const text = readerText(page());
    for (const fact of [
      "3840",
      "3584",
      "8 GB GDDR7",
      "12 GB GDDR6",
      "128-bit",
      "192-bit",
      "448 GB/sec",
      "145 W",
      "170 W",
      "550 W",
      "Blackwell",
      "Ampere",
      "PCIe 5.0 x8",
      "PCIe 3.0 x16",
      "22%",
      "roughly 20%",
      "6 fps",
      "May 22, 2025",
      "May 31, 2025",
      "B450M-A PRO MAX",
      "Starting at $299",
      "Multi Frame Generation",
    ]) {
      expect(text).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/Community opinion|community opinion|reddit\.com|r\/buildapc|r\/gpu/i);
    const percents = text.match(/\d+(?:\.\d+)?\s?%/g) ?? [];
    expect(percents.length).toBeGreaterThan(0);
    expect(new Set(percents)).toEqual(new Set(["22%", "20%"]));
    for (const price of text.match(/\$\d+/g) ?? []) {
      expect(price).toBe("$299");
    }
    expect(text).not.toMatch(/\b360\s?GB/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      NV_COMPARE,
      NV_5060,
      NV_3060,
      TECHSPOT,
      HWZ,
      MSI,
      BLENDER,
    ]);
    expect(page().resources?.map((resource) => resource.url)).toEqual([
      NV_COMPARE,
      NV_5060,
      NV_3060,
      TECHSPOT,
      HWZ,
      MSI,
      BLENDER,
    ]);
    expect(page().citationStats?.sourceCount).toBe(7);
    expect(page().citationStats?.sources[0]?.url).toMatch(/^https:\/\/www\.nvidia\.com\//);
    expect(page().citationStats?.sources[1]?.url).toMatch(/^https:\/\/www\.nvidia\.com\//);
    expect(page().citationStats?.sources[2]?.url).toMatch(/^https:\/\/www\.nvidia\.com\//);
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

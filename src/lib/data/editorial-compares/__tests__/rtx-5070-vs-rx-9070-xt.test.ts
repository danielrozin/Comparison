import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rtx-5070-vs-rx-9070-xt";

const NV_FAMILY = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/";
const NV_ARCH =
  "https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf";
const NV_SHOP = "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5070-family/#shop-all";
const AMD_XT =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070xt.html";
const AMD_9070 =
  "https://www.amd.com/en/products/graphics/desktops/radeon/9000-series/amd-radeon-rx-9070.html";
const AMD_PR =
  "https://www.amd.com/en/newsroom/press-releases/2025-2-28-amd-unveils-next-generation-amd-rdna-4-architectu.html";
const AMD_BUY = "https://www.amd.com/en/where-to-buy/graphics/radeon.html";
const TECHSPOT = "https://www.techspot.com/review/2991-amd-radeon-9070-xt-vs-nvidia-rtx-5070/";

// Reader copy credits NVIDIA, AMD, and TechSpot. It must not narrate the
// research, name a winner, copy a price, or turn memory size into a speed claim.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\bquoted\b|human review|byline|reviewed by|\bwinner\b|Drafted with AI|reddit|r\/PcBuild|€|\$|MSRP|placeholder|TODO|ensures faster|more VRAM ensures/i;

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

describe("RTX 5070 vs RX 9070 XT", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    expect(HUMAN_REVIEWED_SLUGS).not.toContain(SLUG);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(page().expertAnalysis).not.toMatch(/\bFAQ\b|Frequently asked|Drafted with AI|human-reviewed/i);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    expect(sortComparisonSlug(SLUG)).toBe(SLUG);
    expect(isDegenerateComparisonSlug(SLUG)).toBe(false);
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    expect(page().title.length).toBeLessThanOrEqual(60);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-06T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(page().keyDifferences.length).toBeGreaterThan(0);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect((page().shortAnswer ?? "").split(/(?<=[.!?])\s+/)).toHaveLength(2);
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.dataPointCount).toBe(46);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rtx-5070-vs-rx-9070-xt-vs-rtx-5070-ti",
      "rx-9070-vs-rx-9070-xt",
      "rx-9060-xt-vs-rx-9070-xt",
    ]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug), related.slug).not.toBeNull();
    }
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
    const serialized = JSON.stringify(schemas);
    expect(serialized).not.toMatch(/Daniel Rozin/);
    expect(serialized).not.toMatch(/"isHumanReviewed":\s*true/);
  });

  it("uses vendor specs and one dated TechSpot test without a price or a speed crown", () => {
    const text = readerText(page());
    for (const fact of [
      "6,144",
      "8,960",
      "4,096",
      "3,584",
      "12 GB",
      "16 GB",
      "GDDR7",
      "GDDR6",
      "192-bit",
      "256-bit",
      "672 GB/sec",
      "640 GB/s",
      "64 MB",
      "2.51 GHz",
      "2.33 GHz",
      "2.45 GHz",
      "2400 MHz",
      "2970 MHz",
      "3.0 GHz",
      "2070 MHz",
      "2520 MHz",
      "250 W",
      "300 W",
      "304 W",
      "220 W",
      "650 W",
      "750 W",
      "Blackwell",
      "RDNA 4",
      "DLSS 5",
      "DLSS 4",
      "FSR \"Redstone\"",
      "FSR 4",
      "Reflex 2",
      "NVENC",
      "AV1",
      "17%",
      "21%",
      "12%",
      "57 games",
      "May 25, 2025",
      "February 28, 2025",
      "TechSpot",
      "Hunt: Showdown 1896",
      "576.40",
      "25.5.1",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/page says|article says/i);
    expect(text).not.toMatch(/Community opinion|community opinion/i);
    expect(text).toMatch(/[Mm]ore memory does not by itself make a card faster/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      NV_FAMILY,
      NV_ARCH,
      AMD_XT,
      AMD_9070,
      AMD_PR,
      TECHSPOT,
      NV_SHOP,
      AMD_BUY,
    ]);
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

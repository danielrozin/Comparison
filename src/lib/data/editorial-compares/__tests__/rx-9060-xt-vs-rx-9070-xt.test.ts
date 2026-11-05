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

const SLUG = "rx-9060-xt-vs-rx-9070-xt";

const AMD_9060 =
  "https://newsroom.amd.com/news/amd-introduces-new-radeon-graphics-cards-and-ryzen.html";
const AMD_9070 =
  "https://ir.amd.com/news-events/press-releases/detail/1238/amd-unveils-next-generation-amd-rdna-4-architecture-with-the-launch-of-amd-radeon-rx-9000-series-graphics-cards";
const TECHSPOT = "https://www.techspot.com/review/2961-amd-radeon-9070-xt/";

// Reader copy credits AMD and TechSpot. It must not narrate the research,
// name a winner, or treat a street price as an SEP.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\bquoted\b|human review|byline|reviewed by|\bwinner\b|Drafted with AI|reddit|r\/buildapc|\$650|\$1,?300|\bCAD\b|182\s*W|640\s*GB|4,?096/i;

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

describe("RX 9060 XT vs RX 9070 XT", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner, ties only, and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
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
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(page().category).toBe("technology");
    expect(page().keyDifferences.length).toBeGreaterThan(0);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(page().shortAnswer).toMatch(/Neither card is right for everyone/);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rx-9060-xt-vs-rx-9070",
      "rx-9070-vs-rx-9070-xt",
      "rtx-5060-vs-rx-9060-xt",
    ]);
    for (const related of page().relatedComparisons) {
      expect(getEditorialComparison(related.slug)).not.toBeNull();
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
  });

  it("uses AMD specs and TechSpot 1440p framing without a 9060-to-9070 percentage", () => {
    const text = readerText(page());
    for (const fact of [
      "$349",
      "$599",
      "$299",
      "$549",
      "32 compute units",
      "64 compute units",
      "56 compute units",
      "128-bit",
      "256-bit",
      "32 MB",
      "64 MB",
      "2.53 GHz",
      "3.13 GHz",
      "2.4 GHz",
      "3.0 GHz",
      "160 W",
      "150 W",
      "304 W",
      "220 W",
      "RDNA 4",
      "119 fps",
      "6%",
      "March 5, 2025",
      "May 20, 2025",
      "February 28, 2025",
      "TechSpot",
      "AMD",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/page says|article says/i);
    for (const sentence of text.split(/[.!?]/)) {
      if (sentence.includes("%")) {
        expect(sentence).not.toMatch(/9060/);
      }
    }
    expect(text).not.toMatch(/Community opinion|community opinion/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_9060,
      AMD_9070,
      TECHSPOT,
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

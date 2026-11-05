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
import { isRedirectedCompareSlug, getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "ryzen-7-7800x3d-vs-ryzen-7-9800x3d";

const AMD_7800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html";
const AMD_9800 =
  "https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9800x3d.html";
const PC_GAMER =
  "https://www.pcgamer.com/hardware/processors/amd-says-the-problem-with-ryzen-7-9800x3d-chips-failing-to-boot-is-down-to-memory-compatibility-issues-and-not-actually-dead-cpus/";
const VIDEOCARDZ =
  "https://videocardz.com/newz/three-dead-ryzen-7-9800x3d-cases-reported-on-asrock-bios-4-10-despite-new-am5-fix";

// Reader copy credits AMD, PC Gamer, and VideoCardz.
// It must not narrate the research, name a scorecard winner, or invent a frame-rate percentage.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|article shows|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\bquoted\b|reddit|human review|byline|reviewed by|\bwinner\b|\bbest\b|Drafted with AI|\d+(?:\.\d+)?\s?%|\$\d/i;

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
        if (key === "winner" || key === "winnerName" || key === "winnerReason") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("Ryzen 7 7800X3D vs Ryzen 7 9800X3D", () => {
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
    expect(getConsolidatedCompareSlug(SLUG)).toBeNull();
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).toBeUndefined();
    }
    expect(page().shortAnswer).toMatch(/Neither chip is the right pick for every build/);
    expect(page().shortAnswer).toMatch(/^At the same price, the Ryzen 7 9800X3D is the better buy\./);
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

  it("states AMD specs and the cautious BIOS notes, with no frame-rate percentage", () => {
    const text = readerText(page());
    for (const fact of [
      "8 cores",
      "16 threads",
      "96 MB",
      "8 MB",
      "4.2 GHz",
      "4.7 GHz",
      "5 GHz",
      "5.2 GHz",
      "Zen 4",
      "Zen 5",
      "120W",
      "89°C",
      "95°C",
      "TSMC 5nm",
      "TSMC 4nm",
      "128 GB",
      "256 GB",
      "DDR5-5200",
      "DDR5-5600",
      "B650",
      "April 6, 2023",
      "November 7, 2024",
      "2nd gen AMD 3D V-Cache",
      "limited number of user reports",
      "ASRock",
      "ASUS Prime B650M-R",
      "BIOS 4.10",
      "March 24, 2026",
      "April 2, 2025",
      "360 mm",
      "Ryzen 5 7600",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\bfps\b/i);
    expect(text).toContain("not a failure rate");
    expect(text).toContain("Ryzen 7 9700X vs Ryzen 7 9800X3D for Zen 5 gaming");
    expect(text).toContain("RX 9070 XT vs RTX 5080 for the graphics card");
    expect(text).toContain("B850 vs X870 when replacing a B650 board");
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      AMD_7800,
      AMD_9800,
      PC_GAMER,
      VIDEOCARDZ,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "ryzen-7-9700x-vs-ryzen-7-9800x3d",
      "rx-9070-xt-vs-rtx-5080",
      "b850-vs-x870",
    ]);
    for (const related of page().relatedComparisons.map((item) => item.slug)) {
      expect(isRedirectedCompareSlug(related)).toBe(false);
      expect(getEditorialComparison(related)).not.toBeNull();
    }
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
    expect(component).toContain("Analysis:");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

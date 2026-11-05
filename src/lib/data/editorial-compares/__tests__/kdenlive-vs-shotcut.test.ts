import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "kdenlive-vs-shotcut";

const KDENLIVE_HOME = "https://kdenlive.org/";
const KDENLIVE_DOWNLOAD = "https://kdenlive.org/download/";
const KDENLIVE_ABOUT = "https://kdenlive.org/about/";
const KDENLIVE_GITHUB = "https://github.com/KDE/kdenlive";
const SHOTCUT_HOME = "https://shotcut.org/";
const SHOTCUT_DOWNLOAD = "https://shotcut.org/download/";
const SHOTCUT_FAQ = "https://shotcut.org/FAQ/";
const SHOTCUT_FEATURES = "https://shotcut.org/features/";
const SHOTCUT_GITHUB = "https://github.com/mltframework/shotcut";
const RESOLVE_PRODUCT = "https://www.blackmagicdesign.com/products/davinciresolve";
const RESOLVE_DOWNLOAD = "https://www.blackmagicdesign.com/event/davinciresolvedownload";
const PREMIERE_GUIDE =
  "https://www.aversusb.net/blog/davinci-resolve-free-vs-premiere-pro-2026-complete-decision-guide";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison shows|this page|we checked|reddit|human review|byline|reviewed by|\bwinner\b|Drafted with AI/i;

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

describe("Kdenlive vs Shotcut (ROO-266)", () => {
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
    expect(page().category).toBe("software");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    for (const attr of page().attributes) {
      for (const value of attr.values) expect(value.winner).not.toBe(true);
    }
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.dataPointCount).toBe(page().attributes.length);
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

  it("states the vendor facts and links the other compare", () => {
    const text = readerText(page());
    for (const fact of [
      "26.08.2",
      "26.9.27",
      "GPL",
      "MLT",
      "4 GB",
      "8 GB",
      "16 GB",
      "OpenGL 2.0",
      "Direct3D 11",
      "Preview Scaling",
      "proxies",
      "Windows 10",
      "macOS 13",
      "macOS 12 - 27",
      "GPLv3",
      "/compare/kdenlive-vs-davinci-resolve",
      "DaVinci Resolve free vs Premiere Pro",
      "3840 x 2160",
      "macOS 12 Monterey",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\bfps\b.*faster|dedicated GPU is required|4 GB of VRAM|16 GB of system memory/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      KDENLIVE_HOME,
      KDENLIVE_DOWNLOAD,
      KDENLIVE_ABOUT,
      KDENLIVE_GITHUB,
      SHOTCUT_HOME,
      SHOTCUT_DOWNLOAD,
      SHOTCUT_FAQ,
      SHOTCUT_FEATURES,
      SHOTCUT_GITHUB,
      RESOLVE_PRODUCT,
      RESOLVE_DOWNLOAD,
      PREMIERE_GUIDE,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["kdenlive-vs-davinci-resolve"]);
    expect(isRedirectedCompareSlug("kdenlive-vs-davinci-resolve")).toBe(false);
    expect(getEditorialComparison("kdenlive-vs-davinci-resolve")).not.toBeNull();
  });

  it("shows up on the software hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("software", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis: ${entityAName} vs ${entityBName}");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

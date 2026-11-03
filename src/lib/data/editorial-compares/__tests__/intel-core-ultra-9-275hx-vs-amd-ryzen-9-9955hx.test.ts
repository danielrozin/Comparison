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
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "intel-core-ultra-9-275hx-vs-amd-ryzen-9-9955hx";

const NOTEBOOKCHECK =
  "https://www.notebookcheck.net/AMD-Ryzen-9-9955HX-vs-Intel-Core-Ultra-9-275HX-Analysis-The-battle-for-the-fastest-gaming-CPU.989996.0.html";
const AMD_9955HX =
  "https://www.amd.com/en/products/processors/laptop/ryzen/9000-series/amd-ryzen-9-9955hx.html";
const AMD_9955HX3D =
  "https://www.amd.com/en/products/processors/laptop/ryzen/9000-series/amd-ryzen-9-9955hx3d.html";

// Reader copy credits Notebookcheck and AMD. It must not narrate the research,
// name a winner, or carry Intel figures the 403 spec URL did not confirm.
const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|this article|article says|checked against|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\bshown\b|\bquoted\b|reddit|thunderbolt|36\s?MB|5\.40|54 W|better on battery|human review|byline|reviewed by|\bwinner\b|\bbest\b|Drafted with AI/i;

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

describe("Core Ultra 9 275HX vs Ryzen 9 9955HX", () => {
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
    const title = buildPageTitle(page().metadata.metaTitle);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    const description = clampDescription(page().metadata.metaDescription);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-03T00:00:00Z");
    expect(page().category).toBe("technology");
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    expect(page().shortAnswer).toMatch(/Neither CPU is right for every gaming laptop/);
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

  it("states sourced laptop-CPU facts and links the desktop pages without copying them", () => {
    const text = readerText(page());
    for (const fact of [
      "24 cores",
      "8 performance and 16 efficiency",
      "without hyperthreading",
      "16 cores",
      "32 threads",
      "5.4 GHz",
      "2.5 GHz",
      "64 MB",
      "55 W",
      "55-75 W",
      "more than 150 W",
      "2,223",
      "2,058",
      "5 percent",
      "99.7",
      "95.4",
      "147 fps",
      "128 MB",
      "64 GB",
      "32 GB",
      "572.84",
      "1,633",
      "1,489",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).toContain("Ryzen 9 9900X vs Core Ultra 9");
    expect(text).not.toContain("185H");
    expect(text).not.toContain("285K");
    expect(text).not.toMatch(BANNED);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual([
      NOTEBOOKCHECK,
      AMD_9955HX,
      AMD_9955HX3D,
    ]);
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "amd-ryzen-9-9900x-vs-intel-core-ultra-9",
      "rtx-4070-laptop-vs-rtx-5060-laptop",
    ]);
    expect(isRedirectedCompareSlug("amd-ryzen-9-9900x-vs-intel-core-ultra-9")).toBe(false);
    expect(getEditorialComparison("rtx-4070-laptop-vs-rtx-5060-laptop")).not.toBeNull();
    expect(page().relatedBlogPosts.map((post) => post.slug)).toEqual([
      "amd-ryzen-9-9900x-vs-intel-core-ultra-9-2026-which-cpu-wins",
    ]);
  });

  it("shows up on the laptops hub and keeps the shared Analysis disclosure", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "laptops-computers");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

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

const SLUG = "iphone-air-vs-iphone-18-pro";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\brumou?r\b|second-gen|2027|mAh|\$0\.99|\bexpert\b|human review|byline|geekbench|\bwinner\b|\bbest\b/i;

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
        if (key === "winner") continue;
        visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("iPhone Air vs iPhone 18 Pro (ROO-360)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-02T00:00:00Z");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
  });

  it("writes the verdict as choose-X-if and keeps FAQ schema identical to the visible answers", () => {
    expect(page().shortAnswer).toMatch(/^Choose the iPhone 18 Pro if /);
    expect(page().shortAnswer).toMatch(/Choose the iPhone Air if /);
    expect(page().verdict).toMatch(/^Choose the iPhone 18 Pro if /);
    expect(page().verdict).toMatch(/Choose the iPhone Air if /);
    expect(page().expertAnalysis).toMatch(/^Choose the iPhone 18 Pro if /);
    expect(page().expertAnalysis).toContain("Key takeaways");
    expect(page().expertAnalysis).not.toMatch(/Drafted with AI|human-reviewed|FAQ/i);

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

  it("states Apple specs and dated store prices, with no source-talk", () => {
    const text = readerText(page());
    for (const fact of [
      "A19 Pro",
      "A20 Pro",
      "5-core GPU",
      "7-core GPU",
      "165 grams",
      "5.64 mm",
      "211 grams",
      "8.75 mm",
      "27 hours",
      "36 hours",
      "22 hours",
      "33 hours",
      "40 hours",
      "IP68",
      "18MP Center Stage",
      "48MP",
      "$1,099",
      "$1,199",
      "$999",
      "2 November 2026",
      "9 September 2025",
      "iOS 27",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\b1000\b|1,000 complete|80 percent/);
    const dollars = text.match(/\$[0-9,]+(?:\.[0-9]+)?/g) ?? [];
    expect(new Set(dollars)).toEqual(new Set(["$1,099", "$1,199", "$999"]));
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    const vendorLinks = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(vendorLinks.map((r) => r.url)).toEqual([
      "https://www.apple.com/shop/buy-iphone/iphone-air",
      "https://www.apple.com/shop/buy-iphone/iphone-18-pro",
    ]);
  });

  it("does not reuse sentences from the neighboring iPhone pages", () => {
    const own = page().expertAnalysis ?? "";
    for (const file of [
      "iphone-17-vs-iphone-air.ts",
      "iphone-17-pro-vs-iphone-18-pro.ts",
      "iphone-18-pro-vs-iphone-18-pro-max.ts",
    ]) {
      const other = readFileSync(`src/lib/data/editorial-compares/${file}`, "utf8");
      const sentences = own.split(/(?<=[.!?])\s+/).filter((s) => s.length > 80);
      for (const sentence of sentences) expect(other.includes(sentence), sentence).toBe(false);
    }
  });

  it("links the live related compares and shows up on the smartphones hub", () => {
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-vs-iphone-air",
      "iphone-17-pro-vs-iphone-18-pro",
      "iphone-18-pro-vs-iphone-18-pro-max",
    ]);
    for (const item of page().relatedComparisons) {
      expect(isRedirectedCompareSlug(item.slug)).toBe(false);
      expect(getEditorialComparison(item.slug)?.slug).toBe(item.slug);
    }
    expect(page().resources?.map((resource) => resource.url)).toEqual(
      expect.arrayContaining(["/entity/iphone-air", "/alternatives/iphone-air"]),
    );
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((s) => s.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

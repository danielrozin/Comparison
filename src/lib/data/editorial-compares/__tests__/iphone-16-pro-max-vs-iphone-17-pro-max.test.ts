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

const SLUG = "iphone-16-pro-max-vs-iphone-17-pro-max";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\brumou?r\b|\bexpert\b|human review|human-reviewed|byline|geekbench|\bwinner\b|\bbest\b|\$/i;

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

describe("iPhone 16 Pro Max vs iPhone 17 Pro Max (ROO-320)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(7);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-05T00:00:00Z");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.dataPointCount).toBe(page().attributes.length);
  });

  it("writes the verdict as choose-X-if and keeps FAQ schema identical to the visible answers", () => {
    expect(page().shortAnswer).toMatch(/^Choose the iPhone 17 Pro Max if /);
    expect(page().shortAnswer).toMatch(/Choose the iPhone 16 Pro Max if /);
    expect(page().verdict).toMatch(/^Choose the iPhone 17 Pro Max if /);
    expect(page().verdict).toMatch(/Choose the iPhone 16 Pro Max if /);
    expect(page().expertAnalysis).toMatch(/^Choose the iPhone 17 Pro Max if /);
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

  it("states Apple U.S. specs with no prices, no source-talk, and no invented tests", () => {
    const text = readerText(page());
    for (const fact of [
      "A18 Pro",
      "A19 Pro",
      "33 hours",
      "39 hours",
      "29 hours",
      "35 hours",
      "227 grams",
      "233 grams",
      "8.25 mm",
      "8.75 mm",
      "2868 by 1320",
      "460 ppi",
      "2000 nits",
      "3000 nits",
      "12MP 5x",
      "120 mm",
      "48MP",
      "100 mm",
      "optical-quality 8x",
      "18MP Center Stage",
      "vapor chamber enclosure",
      "Battery Health",
      "iPhone Locked to Owner",
      "Hello screen",
      "U.S.",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\b1000 complete\b|1,000 complete|80 percent|charge cycles at/);
    expect(text).not.toMatch(/\$[0-9]/);
    expect(text).not.toMatch(/drop-test result of|measured temperature of|degrees/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    const urls = (page().citationStats?.sources ?? []).flatMap((source) => (source.url ? [source.url] : []));
    for (const url of urls.filter((url) => url.startsWith("http"))) {
      expect(url).toMatch(/^https:\/\/(www\.apple\.com|support\.apple\.com)\//);
    }
    expect(urls).toEqual(expect.arrayContaining(["/entity/iphone-16-pro-max", "/entity/iphone-17-pro-max"]));
  });

  it("does not reuse long sentences from the neighboring Pro Max page", () => {
    const own = page().expertAnalysis ?? "";
    const other = readFileSync("src/lib/data/editorial-compares/iphone-17-pro-max-vs-iphone-18-pro-max.ts", "utf8");
    const sentences = own.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 80);
    for (const sentence of sentences) expect(other.includes(sentence), sentence).toBe(false);
  });

  it("links the live related compares and shows up on the smartphones hub", () => {
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "iphone-17-pro-max-vs-iphone-18-pro-max",
      "iphone-16-pro-vs-iphone-16-pro-max",
    ]);
    for (const item of page().relatedComparisons) {
      expect(isRedirectedCompareSlug(item.slug)).toBe(false);
    }
    expect(getEditorialComparison("iphone-17-pro-max-vs-iphone-18-pro-max")?.slug).toBe(
      "iphone-17-pro-max-vs-iphone-18-pro-max",
    );
    expect(page().resources?.map((resource) => resource.url)).toEqual(
      expect.arrayContaining(["/entity/iphone-16-pro-max", "/entity/iphone-17-pro-max"]),
    );
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.technology.find((item) => item.slug === "smartphones");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

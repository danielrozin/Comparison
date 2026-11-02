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
import {
  appendEditorialRelatedLinks,
  getEditorialComparison,
  listEditorialCompareSitemapEntries,
} from "../index";
import type { ComparisonPageData } from "@/types";

const SLUG = "kindle-vs-ipad";

const BANNED =
  /page lists|list shows|table lists|no published|page says|on that page|the page|article says|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\brumou?r\b|\bexpert\b|human review|byline|Drafted with AI|\bwinner\b|\bbest\b/i;

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

describe("Kindle vs iPad for reading (ROO-369)", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/A Versus B$/);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-11-02T00:00:00Z");
    expect(findSelfContradictions(page())).toEqual([]);
    for (const diff of page().keyDifferences) expect(diff.winner).toBe("tie");
    expect(page().citationStats?.sourceCount).toBe(page().citationStats?.sources.length);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
  });

  it("writes the verdict as choose-X-if and keeps FAQ schema identical to the visible answers", () => {
    expect(page().shortAnswer).toMatch(/^Choose a Kindle if /);
    expect(page().shortAnswer).toMatch(/Choose an iPad if /);
    expect(page().verdict).toMatch(/^Choose a Kindle if /);
    expect(page().verdict).toMatch(/Choose an iPad if /);
    expect(page().expertAnalysis).toMatch(/^Choose a Kindle if /);
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

  it("states dated store specs and skips source-talk", () => {
    const text = readerText(page());
    for (const fact of [
      "300 ppi",
      "150 ppi",
      "12 weeks",
      "8 weeks",
      "6 weeks",
      "10 hours",
      "IPX8",
      "2 meters",
      "211 grams",
      "477 grams",
      "500 nits",
      "28.93",
      "$449",
      "$199.99",
      "$142.55",
      "$289.99",
      "$149.99",
      "2 November 2026",
      "28 October 2026",
      "U.S. only",
      "Kindle+",
      "EPUB",
    ]) {
      expect(text, fact).toContain(fact);
    }
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/20-20-20|Redditors|Fire HD/);
    const dollars = text.match(/\$[0-9,]+(?:\.[0-9]+)?/g) ?? [];
    expect(new Set(dollars)).toEqual(
      new Set([
        "$449",
        "$549",
        "$749",
        "$199.99",
        "$142.55",
        "$289.99",
        "$246.49",
        "$149.99",
        "$189.99",
        "$249.99",
        "$319.99",
        "$179.99",
      ]),
    );
    const vendorLinks = (page().resources ?? []).filter((resource) =>
      resource.label.startsWith("See vendor page for current price"),
    );
    expect(vendorLinks.map((resource) => resource.url)).toEqual([
      "https://www.amazon.com/Amazon-Kindle-Paperwhite-16-GB/dp/B0CFPJYX7P",
      "https://www.amazon.com/Amazon-Kindle-Colorsoft/dp/B0CGVSKR1G",
      "https://www.apple.com/shop/buy-ipad/ipad",
    ]);
  });

  it("cross-links Kindle vs Kobo and the live Kindle vs physical books slug", () => {
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "kindle-vs-kobo",
      "kindle-vs-physical-books",
    ]);
    expect(isRedirectedCompareSlug("kindle-vs-kobo")).toBe(false);
    expect(isRedirectedCompareSlug("kindle-vs-physical-books")).toBe(false);
    expect(getEditorialComparison("kindle-vs-kobo")?.slug).toBe("kindle-vs-kobo");
    expect(getEditorialComparison("kindle-vs-physical-books")).toBeNull();

    const physical = appendEditorialRelatedLinks({
      slug: "kindle-vs-physical-books",
      relatedComparisons: [],
    } as unknown as ComparisonPageData);
    expect(physical.relatedComparisons.map((item) => item.slug)).toEqual([SLUG]);

    const kobo = appendEditorialRelatedLinks({
      slug: "kindle-vs-kobo",
      relatedComparisons: [],
    } as unknown as ComparisonPageData);
    expect(kobo.relatedComparisons.map((item) => item.slug)).toEqual([SLUG]);

    const cards = mergeEditorialCategoryComparisons("products", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const sub = CATEGORY_SUBCATEGORIES.products.find((item) => item.slug === "ereaders");
    expect(comparisonsForSubcategory(cards, sub!).map((card) => card.slug)).toContain(SLUG);
  });

  it("does not reuse long sentences from Kindle vs Kobo", () => {
    const own = page().expertAnalysis ?? "";
    const other = readFileSync("src/lib/data/editorial-compares/kindle-vs-kobo.ts", "utf8");
    const sentences = own.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.length > 80);
    for (const sentence of sentences) expect(other.includes(sentence), sentence).toBe(false);
  });

  it("keeps the Analysis disclosure in the shared component, not a human byline", () => {
    const component = readFileSync("src/components/comparison/ExpertAnalysis.tsx", "utf8");
    expect(component).toContain("Analysis:");
    expect(component).toContain("Drafted with AI from web research.");
    expect(page().metadata.isHumanReviewed).toBe(false);
  });
});

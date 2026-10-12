import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { getConsolidatedCompareSlug, REDIRECTED_COMPARE_SLUGS } from "@/lib/redirects/compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "@/lib/redirects/not-found-cleanup-redirects";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "coinbase-vs-binance";

const ALIASES = [
  "binance-vs-coinbase",
  "coinbase-exchange-vs-binance",
  "binance-vs-coinbase-exchange",
  "coinbase-vs-binance-exchange",
  "binance-exchange-vs-coinbase",
];

describe("Coinbase vs Binance", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("companies");
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-03T00:00:00Z");
    expect(page().relatedComparisons).toEqual([]);
    expect(findSelfContradictions(page())).toEqual([]);
  });

  it("uses the fees and company facts checked on 3 October 2026", () => {
    const text = [
      page().shortAnswer,
      page().verdict,
      page().expertAnalysis,
      ...page().faqs.map((faq) => faq.answer),
      ...page().entities.flatMap((entity) => [...entity.pros, ...entity.cons]),
      ...page().attributes.flatMap((attr) => attr.values.map((value) => value.valueText)),
    ].join("\n");
    expect(text).toContain("0.1%");
    expect(text).toContain("0.075%");
    expect(text).toContain("1%");
    expect(text).toContain("$246 billion");
    expect(text).toContain("30 June 2026");
    expect(text).toContain("5 January 2026");
    expect(text).toContain("Nest Exchange Limited");
    expect(text).not.toMatch(/cheaper|lowest fee|better exchange/i);
    expect(text).not.toMatch(/no published|not described as|is published|is stated|described as/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(help\.coinbase\.com|www\.coinbase\.com|www\.binance\.info)\//);
    }
  });

  it("shows up on the finance companies hub", () => {
    const cards = mergeEditorialCategoryComparisons("companies", []);
    const finance = CATEGORY_SUBCATEGORIES.companies.find((sub) => sub.slug === "finance-companies");
    expect(finance).toBeDefined();
    expect(comparisonsForSubcategory(cards, finance!).map((card) => card.slug)).toContain(SLUG);
  });

  it("sends each name order to coinbase-vs-binance in one hop", () => {
    expect(getConsolidatedCompareSlug(SLUG)).toBeNull();
    expect(REDIRECTED_COMPARE_SLUGS).not.toContain(SLUG);
    for (const alias of ALIASES) {
      expect(getConsolidatedCompareSlug(alias)).toBe(SLUG);
      expect(NEVER_PUBLISHED_ALIASES.has(alias)).toBe(true);
      expect(getConsolidatedCompareSlug(SLUG)).toBeNull();
    }
  });
});

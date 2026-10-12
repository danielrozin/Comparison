import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "microsoft-word-vs-libreoffice";

describe("Microsoft Word vs LibreOffice Writer", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("software");
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

  it("uses the prices and versions from the official pages checked on 3 October 2026", () => {
    const text = [
      page().shortAnswer,
      page().verdict,
      page().expertAnalysis,
      ...page().faqs.map((faq) => faq.answer),
      ...page().attributes.flatMap((attr) => attr.values.map((value) => value.valueText)),
    ].join("\n");
    expect(text).toContain("$179.99");
    expect(text).toContain("$9.99");
    expect(text).toContain("$99.99");
    expect(text).toContain("26.8.0");
    expect(text).toContain("Mozilla Public License");
    expect(text).toContain(".odt");
    expect(text).toContain("OneDrive");
    expect(text).not.toMatch(/\$149\.99|\$69\.99/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(
        /^https:\/\/(www\.)?(microsoft\.com|learn\.microsoft\.com|libreoffice\.org|books\.libreoffice\.org)\//,
      );
    }
  });

  it("shows up on the software office-tools hub from the editorial card", () => {
    const cards = mergeEditorialCategoryComparisons("software", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const office = SOFTWARE_SUBCATEGORIES.find((sub) => sub.slug === "office-tools");
    expect(office).toBeDefined();
    expect(comparisonsForSubcategory(cards, office!).map((card) => card.slug)).toContain(SLUG);
  });
});

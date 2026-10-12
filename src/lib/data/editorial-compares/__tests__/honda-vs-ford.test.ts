import { describe, expect, it } from "vitest";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "honda-vs-ford";

describe("Honda vs Ford", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("automotive");
    expect(page().faqs).toHaveLength(4);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-03T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["toyota-rav4-vs-honda-cr-v"]);
    expect(findSelfContradictions(page())).toEqual([]);
  });

  it("uses founding years, lineup categories, and 2026 IIHS awards, with no prices", () => {
    const text = [
      page().shortAnswer,
      page().verdict,
      page().expertAnalysis,
      ...page().faqs.map((faq) => faq.answer),
      ...page().entities.flatMap((entity) => [...entity.pros, ...entity.cons]),
      ...page().attributes.flatMap((attr) => attr.values.map((value) => value.valueText)),
    ].join("\n");
    expect(text).toContain("1948");
    expect(text).toContain("June 16, 1903");
    expect(text).toContain("Top Safety Pick+");
    expect(text).toContain("Mustang Mach-E");
    expect(text).toContain("June 11, 1959");
    expect(text).toContain("Fathom");
    expect(text).toContain("2027 E-Transit");
    expect(text).not.toContain("F-150 Lightning");
    expect(text).not.toContain("Escape Plug-In Hybrid");
    expect(text).not.toContain("body-on-frame");
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toMatch(/safest|J\.D\. Power|JD Power/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(
        /^https:\/\/(www\.)?(honda\.com|automobiles\.honda\.com|ford\.com|shareholder\.ford\.com|fromtheroad\.ford\.com|iihs\.org)\//,
      );
    }
  });

  it("shows up on the live automotive hubs", () => {
    const cards = mergeEditorialCategoryComparisons("automotive", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const subs = CATEGORY_SUBCATEGORIES.automotive;
    const suvs = subs.find((sub) => sub.slug === "suvs-trucks");
    const sedans = subs.find((sub) => sub.slug === "sedans-coupes");
    const evs = subs.find((sub) => sub.slug === "electric-vehicles");
    expect(comparisonsForSubcategory(cards, suvs!).map((card) => card.slug)).toContain(SLUG);
    expect(comparisonsForSubcategory(cards, sedans!).map((card) => card.slug)).toContain(SLUG);
    expect(comparisonsForSubcategory(cards, evs!).map((card) => card.slug)).toContain(SLUG);
  });
});

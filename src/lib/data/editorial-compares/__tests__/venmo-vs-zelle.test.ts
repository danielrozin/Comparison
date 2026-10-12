import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "@/lib/redirects/not-found-cleanup-redirects";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "venmo-vs-zelle";
const ALIASES = ["zelle-vs-venmo"] as const;

const READER_COPY_BANS = [
  "page says",
  "on that page",
  "the page",
  "about page",
  "article says",
  "is described there",
  "does not print",
  "doesn't print",
  "checked 3 october",
  "checked the same day",
  "in the help example",
  "announcement assigns",
  "official page",
];

function allStrings(node: unknown, out: string[] = []): string[] {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((item) => allStrings(item, out));
  else if (node && typeof node === "object") Object.values(node).forEach((item) => allStrings(item, out));
  return out;
}

describe("Venmo vs Zelle", () => {
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

  it("uses only the published fees and limits", () => {
    const text = allStrings(page()).join("\n");
    expect(text).toContain("3.00%");
    expect(text).toContain("1.75%");
    expect(text).toContain("$299.99");
    expect(text).toContain("$60,000");
    expect(text).toContain("$19,999.99");
    expect(text).toContain("99.40%");
    expect(text).toContain("Q1 2026");
    expect(text).toContain("Early Warning");
    expect(text).not.toMatch(/99\.32%|\$1\.2 trillion|0\.02%/);
    expect(text).not.toMatch(/\b(you should|we recommend|safer choice|better choice)\b/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(venmo\.com|help\.venmo\.com|www\.zelle\.com)\//);
    }
  });

  it("keeps reader copy free of source-describing phrases", () => {
    const hits = allStrings(page()).flatMap((value) =>
      READER_COPY_BANS.filter((ban) => value.toLowerCase().includes(ban)).map((ban) => `${ban} :: ${value}`),
    );
    expect(hits).toEqual([]);
  });

  it("shows up on the finance hub and 301s the reverse alias", () => {
    const cards = mergeEditorialCategoryComparisons("software", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const finance = SOFTWARE_SUBCATEGORIES.find((sub) => sub.slug === "finance-accounting");
    expect(finance).toBeDefined();
    expect(comparisonsForSubcategory(cards, finance!).map((card) => card.slug)).toContain(SLUG);
    expect(getConsolidatedCompareSlug(SLUG)).toBeNull();
    for (const alias of ALIASES) {
      expect(NEVER_PUBLISHED_ALIASES.has(alias), alias).toBe(true);
      expect(getConsolidatedCompareSlug(alias), alias).toBe(SLUG);
    }
  });
});

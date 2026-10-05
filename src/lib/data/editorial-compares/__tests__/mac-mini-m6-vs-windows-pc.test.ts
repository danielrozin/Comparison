import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "mac-mini-m6-vs-windows-pc";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404/i;

function readerText(value: unknown): string {
  const parts: string[] = [];
  const visit = (node: unknown) => {
    if (typeof node === "string") {
      parts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const item of Object.values(node)) visit(item);
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("Mac mini M6 vs Windows PC", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("technology");
    expect(page().faqs).toHaveLength(6);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-05T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "macbook-air-vs-ipad-air",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    const sentences = (page().shortAnswer ?? "").split(/(?<=\.)\s+/);
    expect(sentences[0]).toMatch(/Mac mini/);
    expect(sentences[1]).toMatch(/Windows PC/);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
    expect(page().entities.map((entity) => entity.slug)).toEqual(["mac-mini", "windows-pc"]);
  });

  it("uses Apple's M6 specs and NVIDIA's laptop GPU figures", () => {
    const text = readerText(page());
    expect(text).toContain("H.264");
    expect(text).toContain("HEVC");
    expect(text).toContain("ProRes RAW");
    expect(text).toContain("12-core CPU");
    expect(text).toContain("12-core GPU");
    expect(text).toContain("16GB");
    expect(text).toContain("24GB");
    expect(text).toContain("32GB");
    expect(text).toContain("64GB");
    expect(text).toContain("153GB/s");
    expect(text).toContain("170GB/s");
    expect(text).toContain("1.5 pounds");
    expect(text).toContain("5 dBA");
    expect(text).toContain("$899");
    expect(text).toContain("$1,699");
    expect(text).toContain("$1,899");
    expect(text).toContain("3328");
    expect(text).toContain("2560");
    expect(text).toContain("8 GB GDDR7");
    expect(text).toContain("ninth-gen");
    expect(text).toContain("DaVinci Resolve");
    expect(text).not.toMatch(/Geekbench|Cinebench|fps\b/i);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/\bexpert\b|human review|byline/i);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.(apple|nvidia)\.com\//);
    }
  });

  it("shows up on the technology computers hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const computers = CATEGORY_SUBCATEGORIES.technology.find(
      (sub) => sub.slug === "laptops-computers",
    );
    expect(comparisonsForSubcategory(cards, computers!).map((card) => card.slug)).toContain(SLUG);
  });
});

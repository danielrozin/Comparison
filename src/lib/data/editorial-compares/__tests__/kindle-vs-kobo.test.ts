import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { PRODUCT_SUBCATEGORIES, SITE_URL } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "kindle-vs-kobo";

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

describe("Kindle vs Kobo", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().category).toBe("products");
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

  it("uses the prices and limits from the official pages checked on 3 October 2026", () => {
    const text = [
      page().shortAnswer,
      page().verdict,
      page().expertAnalysis,
      ...page().faqs.map((faq) => faq.answer),
      ...page().attributes.flatMap((attr) => attr.values.map((value) => value.valueText)),
    ].join("\n");
    expect(text).toContain("$149.99");
    expect(text).toContain("$159.99");
    expect(text).toContain("$259.99");
    expect(text).toContain("up to 12 weeks");
    expect(text).toContain("EPUB");
    expect(text).toContain("Libby");
    expect(text).toContain("OverDrive");
    expect(text).toContain("$79.99");
    expect(page().entities[0]?.cons).toContain("EPUB files are added through Send to Kindle");
    expect(
      page().citationStats?.sources.some((source) => source.url?.includes("GUWACXF9HENBXTQP")),
    ).toBe(true);
    for (const fileType of ["HTML", "RTF", "TXT", "JPEG", "GIF", "PNG", "BMP", "PDF", "EPUB"]) {
      expect(text).toContain(fileType);
    }
    expect(text).not.toMatch(/\bDOCX?\b|lowest hardware price|does not print|doesn't print|page does not/i);
    expect(text).toContain("Waterproof (IPX8)");
    expect(text).not.toMatch(/7-inch Paperwhite|7" Paperwhite/);
    expect(readerText(page())).not.toMatch(
      /no published|not described as|is published|is stated|described as/i,
    );
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(
        /^https:\/\/(www\.)?(aboutamazon\.com|amazon\.com|kobo\.com|ereader\.kobo\.com|help\.kobo\.com)\//,
      );
    }
  });

  it("shows up on the products e-readers hub, which canonicalizes to itself", async () => {
    const cards = mergeEditorialCategoryComparisons("products", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const ereaders = PRODUCT_SUBCATEGORIES.find((sub) => sub.slug === "ereaders");
    expect(ereaders?.name).toBe("E-Readers");
    expect(comparisonsForSubcategory(cards, ereaders!).map((card) => card.slug)).toContain(SLUG);

    const { generateMetadata } = await import("@/app/category/[slug]/[subcategory]/page");
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "products", subcategory: "ereaders" }),
      searchParams: Promise.resolve({}),
    });
    expect(meta.title).toBe("E-Readers Comparisons — Best E-Readers Compared");
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/category/products/ereaders`);
    expect(meta.robots).toBeUndefined();
  });
});

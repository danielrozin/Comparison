import { describe, expect, it } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import {
  comparisonsForSubcategory,
  mergeEditorialCategoryComparisons,
} from "@/lib/categories/hub-comparisons";
import { CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rx-9070-xt-vs-rtx-5080";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|\bincluded\b|reddit|hwben|\bfps\b|faster|benchmark|9800X3D|headroom|3\.5x/i;

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

describe("RX 9070 XT vs RTX 5080", () => {
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
    expect(page().metadata.updatedAt).toBe("2026-10-06T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual(["nvidia-vs-amd"]);
    expect(findSelfContradictions(page())).toEqual([]);
    const sentences = (page().shortAnswer ?? "").split(/(?<=\.)\s+/);
    expect(sentences[0]).toMatch(/9070 XT/);
    expect(sentences[1]).toMatch(/5080/);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
    expect(page().entities.map((entity) => entity.slug)).toEqual(["rx-9070-xt", "rtx-5080"]);
    const types = (comparisonPageSchema(page()) as Array<{ "@type"?: string }>).flatMap((node) => {
      const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
      return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
    });
    expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
    expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);
  });

  it("uses AMD and NVIDIA reference specs without benchmark scores", () => {
    const text = readerText(page());
    expect(text).toContain("16 GB");
    expect(text).toContain("GDDR6");
    expect(text).toContain("GDDR7");
    expect(text).toContain("256-bit");
    expect(text).toContain("64 MB");
    expect(text).toContain("64 compute units");
    expect(text).toContain("2970 MHz");
    expect(text).toContain("3.0 GHz");
    expect(text).toContain("304 W");
    expect(text).toContain("750 W");
    expect(text).toContain("2x 8-pin");
    expect(text).toContain("$599");
    expect(text).toContain("10,752");
    expect(text).toContain("2.62 GHz");
    expect(text).toContain("360 W");
    expect(text).toContain("850 W");
    expect(text).toContain("$999");
    expect(text).toContain("$400");
    expect(text).toContain("Multi Frame Generation");
    expect(text).toContain("Ray Reconstruction");
    expect(text).toContain("DLAA");
    expect(text).toContain("FSR 4");
    expect(text).toContain("FSR 3.1");
    expect(text).toContain("12 GB");
    expect(text).toContain("192-bit");
    expect(text).toContain("250 W");
    expect(text).toContain("56 compute units");
    expect(text).toContain("220 W");
    expect(text).toContain("$549");
    expect(text).toContain("9950X");
    expect(text).not.toMatch(/\d+\s+games/i);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(text).not.toMatch(/\bexpert\b|human review|byline/i);
    expect(text).not.toMatch(/%/);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    expect(page().citationStats?.sourceCount).toBe(7);
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.(amd|nvidia)\.com\//);
    }
  });

  it("shows up on the technology gaming hub", () => {
    const cards = mergeEditorialCategoryComparisons("technology", []);
    expect(cards.map((card) => card.slug)).toContain(SLUG);
    const gaming = CATEGORY_SUBCATEGORIES.technology.find((sub) => sub.slug === "gaming-tech");
    expect(comparisonsForSubcategory(cards, gaming!).map((card) => card.slug)).toContain(SLUG);
  });
});

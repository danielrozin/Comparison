import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "rtx-4070-laptop-vs-rtx-5060-laptop";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|passmark|\bexpert\b|human review|byline|faster|percent|%|\$[0-9]|19,458|16,765/i;

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
      for (const [key, item] of Object.entries(node)) {
        if (key === "expertAnalysis") parts.push(String(item));
        else visit(item);
      }
    }
  };
  visit(value);
  return parts.join("\n");
}

describe("RTX 4070 Laptop vs RTX 5060 Laptop", () => {
  const page = () => getEditorialComparison(SLUG)!;

  it("publishes the slug with no winner and a sitemap row", () => {
    expect(page().metadata.status).toBe("published");
    expect(page().metadata.isHumanReviewed).toBe(false);
    expect(page().schemaMarkup).toBeUndefined();
    expect(page().quickAnswer?.winnerName).toBeNull();
    expect(page().quickAnswer?.tldr).toBe(page().shortAnswer);
    expect(page().faqs.length).toBeGreaterThanOrEqual(5);
    expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(SLUG);
    const title = buildPageTitle(page().metadata.metaTitle);
    const description = clampDescription(page().metadata.metaDescription);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(page().metadata.updatedAt).toBe("2026-10-18T00:00:00Z");
    expect(page().relatedComparisons.map((item) => item.slug)).toEqual([
      "rx-9060-xt-vs-rtx-5060-ti",
      "rtx-4090-vs-rtx-5080",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
  });

  it("states sourced facts without benchmarks, review claims or self-reference", () => {
    const text = readerText(page());
    expect(text).toContain("8 GB GDDR6");
    expect(text).toContain("8 GB GDDR7");
    expect(text).toContain("128-bit");
    expect(text).toContain("4,608");
    expect(text).toContain("3,328");
    expect(text).toContain("35 to 115 W");
    expect(text).toContain("45 to 100 W");
    expect(text).toContain("Multi Frame Generation");
    expect(text).toContain("NVENC");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/www\.nvidia\.com\//);
    }
  });
});

import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "canada-vs-united-states";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|passmark|\bexpert\b|human review|byline/i;

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

describe("Canada vs United States", () => {
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
      "mexico-vs-united-states",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
  });

  it("states sourced facts without benchmarks, review claims or self-reference", () => {
    const text = readerText(page());
    expect(text).toContain("9,984,670 km²");
    expect(text).toContain("9,833,517 km²");
    expect(text).toContain("341,784,857");
    expect(text).toContain("41,651,653");
    expect(text).toContain("$90,027");
    expect(text).toContain("$55,698");
    expect(text).toContain("$66,746");
    expect(text).toContain("82.1 years");
    expect(text).toContain("78.9 years");
    expect(text).toContain("English and French");
    expect(text).toContain("Executive Order 14224");
    expect(text).toContain("$333.6 billion");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(data\.worldbank\.org|www150\.statcan\.gc\.ca|www\.census\.gov|www\.canada\.ca|www\.ourcommons\.ca|www\.usa\.gov|laws-lois\.justice\.gc\.ca|www\.whitehouse\.gov)\//);
    }
  });
});

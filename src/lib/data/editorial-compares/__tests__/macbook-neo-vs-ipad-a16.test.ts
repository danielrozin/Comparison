import { describe, expect, it } from "vitest";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";

const SLUG = "macbook-neo-vs-ipad-a16";

const BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|reddit|\bfps\b|benchmark|geekbench|antutu|passmark|\bexpert\b|human review|byline|screen-on|cannot run/i;

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

describe("MacBook Neo vs iPad (A16)", () => {
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
      "macbook-air-vs-ipad-air",
      "macbook-air-m5-vs-macbook-pro-m5",
    ]);
    expect(findSelfContradictions(page())).toEqual([]);
    expect(page().shortAnswer).toMatch(/Neither is better for everyone/);
  });

  it("states sourced facts without benchmarks, review claims or self-reference", () => {
    const text = readerText(page());
    expect(text).toContain("A18 Pro");
    expect(text).toContain("A16");
    expect(text).toContain("$599 launch price (MSRP), per Apple Newsroom, March 2026");
    expect(text).toContain("$349 launch price (MSRP), per Apple Newsroom, March 2025");
    expect(text).toContain("$249 launch price (MSRP), per Apple Newsroom, October 2022");
    expect(text).toContain("$79 launch price (MSRP), per Apple Newsroom, October 2023");
    expect(text).toContain("$677");
    expect(text).not.toMatch(/\bfrom \$\d/i);
    const vendorLinks = (page().resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(vendorLinks.map((r) => r.url)).toEqual([
      "https://www.apple.com/shop/buy-mac/macbook-neo",
      "https://www.apple.com/shop/buy-ipad/ipad",
    ]);
    expect(text).toContain("up to 16 hours");
    expect(text).toContain("28.93");
    expect(text).toContain("477 g");
    expect(text).toContain("Apple Pencil (USB-C)");
    expect(text).toContain("Magic Keyboard Folio");
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/\/entity\//);
    expect(page().citationStats?.sources.map((source) => source.url)).toEqual(
      page().resources?.map((resource) => resource.url),
    );
    for (const source of page().citationStats?.sources ?? []) {
      expect(source.url).toMatch(/^https:\/\/(www|support)\.apple\.com\//);
    }
  });
});

import { expect } from "vitest";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getEditorialComparison, listEditorialCompareSitemapEntries } from "../index";
import type { EditorialComparison } from "../types";

/**
 * ROO-224: shared checks for the blog-linked head-term compares.
 * Same gates as #389/#395/#401: published, no winner, 2+ official sources,
 * FAQs only in `faqs` (one module FAQPage, no ClaimReview), no byline or
 * human-review flag, no source-process wording in reader copy.
 */
export const ROO224_BANNED =
  /date of death|page lists|list shows|info box lists|table lists|on that table|no published|not described as|page says|on that page|the page|about page|article says|is described there|does not print|doesn't print|checked|Source note|(?:^|\n)Sources:|official page|fetch|this comparison|this page|according to|our sources|Index, follow|returned 404|\babove\b|\bshown\b|\bquoted\b|\bprints\b|benchmark|\bodds\b|prediction|human review|reviewed by|byline|\/entity\//i;

export function readerText(value: unknown): string {
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

export function expectRoo224Page(
  slug: string,
  opts: { category: string; updatedAt: string; related: string[]; sourceHosts: RegExp; facts: string[] },
): EditorialComparison {
  const page = getEditorialComparison(slug);
  expect(page).toBeTruthy();
  const p = page!;
  expect(p.slug).toBe(slug);
  expect(p.metadata.status).toBe("published");
  expect(p.metadata.isHumanReviewed).toBeFalsy();
  expect(p.quickAnswer?.winnerName).toBeNull();
  expect(p.quickAnswer?.tldr).toBe(p.shortAnswer);
  expect(p.category).toBe(opts.category);
  expect(p.faqs.length).toBeGreaterThanOrEqual(5);
  expect(p.faqs.length).toBeLessThanOrEqual(6);
  expect(p.metadata.updatedAt).toBe(opts.updatedAt);
  expect(listEditorialCompareSitemapEntries().map((entry) => entry.slug)).toContain(slug);
  expect(buildPageTitle(p.metadata.metaTitle).length).toBeLessThanOrEqual(60);
  const description = clampDescription(p.metadata.metaDescription);
  expect(description.length).toBeGreaterThanOrEqual(70);
  expect(description.length).toBeLessThanOrEqual(160);
  expect(p.relatedComparisons.map((item) => item.slug)).toEqual(opts.related);
  expect(findSelfContradictions(p)).toEqual([]);

  const types = (comparisonPageSchema(p) as Array<{ "@type"?: string }>).flatMap((node) => {
    const graph = (node as { "@graph"?: Array<{ "@type"?: string }> })["@graph"];
    return graph ? graph.map((child) => child["@type"]) : [node["@type"]];
  });
  expect(types.filter((type) => type === "FAQPage")).toHaveLength(1);
  expect(types.filter((type) => type === "ClaimReview")).toHaveLength(0);

  const sources = p.citationStats?.sources ?? [];
  expect(sources.length).toBeGreaterThanOrEqual(2);
  expect(p.citationStats?.sourceCount).toBe(sources.length);
  expect(sources.map((source) => source.url)).toEqual(p.resources?.map((resource) => resource.url));
  for (const source of sources) expect(source.url).toMatch(opts.sourceHosts);

  const text = readerText(p);
  for (const fact of opts.facts) expect(text).toContain(fact);
  expect(text.match(ROO224_BANNED)?.[0] ?? null).toBeNull();
  return p;
}

/**
 * Editorial compare pages are AI-written. isHumanReviewed is true only when
 * the slug is on HUMAN_REVIEWED_SLUGS. That list is empty, so every page in
 * the pack is false.
 */
import { afterEach, describe, expect, it } from "vitest";
import { assembleCompareJsonLd } from "@/lib/seo/compare-jsonld";
import { HUMAN_REVIEWED_SLUGS, isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";
import { getEditorialComparison, listEditorialCompareSlugs } from "../index";
import { buildEditorialComparison } from "../helpers";

afterEach(() => {
  HUMAN_REVIEWED_SLUGS.length = 0;
});

describe("editorial isHumanReviewed allowlist", () => {
  it("is false on every editorial compare page outside the allowlist", () => {
    const slugs = listEditorialCompareSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);

    const reviewed: string[] = [];
    for (const slug of slugs) {
      const page = getEditorialComparison(slug);
      expect(page, slug).not.toBeNull();
      if (page!.metadata.isHumanReviewed) reviewed.push(slug);
      expect(page!.metadata.isHumanReviewed).toBe(isHumanReviewedSlug(slug));
    }
    expect(reviewed).toEqual([]);
  });

  it("follows the allowlist when a page is built", () => {
    const base = {
      title: "Alpha vs Beta",
      shortAnswer: "Alpha is one choice. Beta is the other. Neither is named the winner.",
      verdict: "Neither is named the winner.",
      entities: [],
      keyDifferences: [],
      attributes: [],
      faqs: [],
      relatedComparisons: [],
      expertAnalysis: "A short analysis.",
      quickAnswer: {
        tldr: "Alpha is one choice. Beta is the other. Neither is named the winner.",
        winnerName: null,
        winnerReason: "Neither is named the winner.",
        keyFact: "One fact.",
      },
      citationStats: {
        sourceCount: 0,
        dataPointCount: 0,
        reviewsAnalyzed: null,
        preferencePercent: null,
        preferenceEntity: null,
        lastResearched: "2026-10-06",
        sources: [],
      },
      metaTitle: "Alpha vs Beta | A Versus B",
    };

    expect(buildEditorialComparison({ ...base, slug: "alpha-vs-beta" }).metadata.isHumanReviewed).toBe(false);

    HUMAN_REVIEWED_SLUGS.push("alpha-vs-beta");
    expect(buildEditorialComparison({ ...base, slug: "alpha-vs-beta" }).metadata.isHumanReviewed).toBe(true);
    expect(buildEditorialComparison({ ...base, slug: "other-vs-page" }).metadata.isHumanReviewed).toBe(false);
  });

  it("does not mark mac-mini or cashier's check JSON-LD as reviewed by Daniel", () => {
    for (const slug of [
      "mac-mini-m6-vs-windows-pc",
      "cashiers-check-vs-money-order",
      "cashiers-check-vs-certified-check",
    ]) {
      const page = getEditorialComparison(slug)!;
      expect(page.metadata.isHumanReviewed).toBe(false);
      const assembled = assembleCompareJsonLd({
        comparison: page,
        voteData: null,
        videoNode: null,
        fallbackDescription: page.metadata.metaDescription,
      });
      const json = JSON.stringify(assembled.document);
      expect(json).not.toContain("reviewedBy");
      expect(json).not.toContain("lastReviewed");
      expect(json).not.toContain("isHumanReviewed");
      const graph = assembled.document["@graph"];
      const nodes = Array.isArray(graph) ? graph : [assembled.document];
      const article = nodes.find(
        (node) => node && typeof node === "object" && (node as { "@type"?: string })["@type"] === "Article",
      ) as { author?: { "@type"?: string; name?: string } | Array<{ "@type"?: string; name?: string }> } | undefined;
      expect(article).toBeTruthy();
      const authors = Array.isArray(article!.author) ? article!.author : [article!.author];
      expect(authors.some((author) => author?.name === "Daniel Rozin")).toBe(false);
      expect(authors.some((author) => author?.["@type"] === "Organization" && author?.name === "A Versus B")).toBe(true);
    }
  });
});

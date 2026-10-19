import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { CASHIERS_CHECK_ARTICLE, CASHIERS_CHECK_BLOG_SLUG, CASHIERS_CHECK_FAQS } from "@/lib/data/cashiers-check-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|(?:^|\n)Sources:/i;

describe("cashiers-check-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(CASHIERS_CHECK_BLOG_SLUG)).toBe(CASHIERS_CHECK_ARTICLE);
    expect(findRepoBlogOverride(CASHIERS_CHECK_BLOG_SLUG)).toBe(CASHIERS_CHECK_ARTICLE);
    expect(CASHIERS_CHECK_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(CASHIERS_CHECK_ARTICLE.publishedAt).toBe("2026-07-10T08:48:57.020Z");
    expect(CASHIERS_CHECK_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, keeps the label to the template, and avoids source-talk", () => {
    const text = CASHIERS_CHECK_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
  });

  it("states fees only with issuer, date and a current-price link", () => {
    const text = CASHIERS_CHECK_ARTICLE.content;
    expect(text).toContain("$10 per check, per Chase Additional Banking Services and Fees");
    expect(text).not.toMatch(/\$8\b|\$15\b|Walmart|Citibank|PNC|TD Bank/);
    expect(text.match(/See vendor page for current price/g)!.length).toBeGreaterThanOrEqual(3);
  });

  it("links a live compare page in the body", () => {
    expect(CASHIERS_CHECK_ARTICLE.content).toContain("(/compare/cashiers-check-vs-money-order)");
    expect(isRedirectedCompareSlug("cashiers-check-vs-money-order")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(CASHIERS_CHECK_BLOG_SLUG)?.faqs).toBe(CASHIERS_CHECK_FAQS);
    for (const faq of CASHIERS_CHECK_FAQS) {
      expect(CASHIERS_CHECK_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(CASHIERS_CHECK_ARTICLE.content).toContain(faq.answer);
    }
  });
});

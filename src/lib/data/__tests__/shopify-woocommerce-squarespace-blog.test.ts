import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  SHOPIFY_WOO_SQUARESPACE_ARTICLE,
  SHOPIFY_WOO_SQUARESPACE_BLOG_SLUG,
  SHOPIFY_WOO_SQUARESPACE_FAQS,
} from "@/lib/data/shopify-woocommerce-squarespace-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("shopify vs woocommerce vs squarespace blog override", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(SHOPIFY_WOO_SQUARESPACE_BLOG_SLUG)).toBe(SHOPIFY_WOO_SQUARESPACE_ARTICLE);
    expect(findRepoBlogOverride(SHOPIFY_WOO_SQUARESPACE_BLOG_SLUG)).toBe(SHOPIFY_WOO_SQUARESPACE_ARTICLE);
    expect(SHOPIFY_WOO_SQUARESPACE_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("keeps the AI label, date note, answer-first table, and clean copy", () => {
    const text = SHOPIFY_WOO_SQUARESPACE_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Oct 2026");
    expect(text.indexOf("| | Shopify |")).toBeLessThan(text.indexOf("## "));
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(SHOPIFY_WOO_SQUARESPACE_BLOG_SLUG)?.faqs).toBe(SHOPIFY_WOO_SQUARESPACE_FAQS);
    for (const faq of SHOPIFY_WOO_SQUARESPACE_FAQS) {
      expect(SHOPIFY_WOO_SQUARESPACE_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(SHOPIFY_WOO_SQUARESPACE_ARTICLE.content).toContain(faq.answer);
    }
  });
});

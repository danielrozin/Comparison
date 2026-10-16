import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  BEST_CLOUD_PLATFORMS_ARTICLE,
  BEST_CLOUD_PLATFORMS_BLOG_SLUG,
  BEST_CLOUD_PLATFORMS_FAQS,
} from "@/lib/data/best-cloud-platforms-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("best cloud platforms 2026 blog override", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(BEST_CLOUD_PLATFORMS_BLOG_SLUG)).toBe(BEST_CLOUD_PLATFORMS_ARTICLE);
    expect(findRepoBlogOverride(BEST_CLOUD_PLATFORMS_BLOG_SLUG)).toBe(BEST_CLOUD_PLATFORMS_ARTICLE);
    expect(BEST_CLOUD_PLATFORMS_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("keeps the AI label, date note, answer-first table, and clean copy", () => {
    const text = BEST_CLOUD_PLATFORMS_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Oct 2026");
    expect(text.indexOf("| # | Platform |")).toBeLessThan(text.indexOf("## "));
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(BEST_CLOUD_PLATFORMS_BLOG_SLUG)?.faqs).toBe(BEST_CLOUD_PLATFORMS_FAQS);
    for (const faq of BEST_CLOUD_PLATFORMS_FAQS) {
      expect(BEST_CLOUD_PLATFORMS_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(BEST_CLOUD_PLATFORMS_ARTICLE.content).toContain(faq.answer);
    }
  });
});

describe("best cloud platforms ItemList anchors", () => {
  it("point at real heading ids and drop the personal byline", () => {
    const extras = getBlogSchemaExtras(BEST_CLOUD_PLATFORMS_BLOG_SLUG);
    expect(extras?.author).toBeUndefined();
    const ids = BEST_CLOUD_PLATFORMS_ARTICLE.content
      .split("\n")
      .filter((line) => line.startsWith("### "))
      .map((line) => line.slice(4).trim().toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"));
    for (const item of extras?.itemList?.items ?? []) {
      expect(ids).toContain(item.anchor);
    }
  });
});

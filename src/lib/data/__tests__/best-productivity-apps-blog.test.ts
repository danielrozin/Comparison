import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  BEST_PRODUCTIVITY_APPS_ARTICLE,
  BEST_PRODUCTIVITY_APPS_BLOG_SLUG,
  BEST_PRODUCTIVITY_APPS_FAQS,
} from "@/lib/data/best-productivity-apps-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("best productivity apps 2026 blog override", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(BEST_PRODUCTIVITY_APPS_BLOG_SLUG)).toBe(BEST_PRODUCTIVITY_APPS_ARTICLE);
    expect(findRepoBlogOverride(BEST_PRODUCTIVITY_APPS_BLOG_SLUG)).toBe(BEST_PRODUCTIVITY_APPS_ARTICLE);
    expect(BEST_PRODUCTIVITY_APPS_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("keeps the AI label, date note, answer-first table, and clean copy", () => {
    const text = BEST_PRODUCTIVITY_APPS_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Oct 2026");
    expect(text.indexOf("| App |")).toBeLessThan(text.indexOf("## "));
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(BEST_PRODUCTIVITY_APPS_BLOG_SLUG)?.faqs).toBe(BEST_PRODUCTIVITY_APPS_FAQS);
    for (const faq of BEST_PRODUCTIVITY_APPS_FAQS) {
      expect(BEST_PRODUCTIVITY_APPS_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(BEST_PRODUCTIVITY_APPS_ARTICLE.content).toContain(faq.answer);
    }
  });
});

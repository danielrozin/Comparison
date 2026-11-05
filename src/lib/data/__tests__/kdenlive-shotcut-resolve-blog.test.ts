import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  KDENLIVE_SHOTCUT_RESOLVE_ARTICLE,
  KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG,
  KDENLIVE_SHOTCUT_RESOLVE_FAQS,
} from "@/lib/data/kdenlive-shotcut-resolve-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:|4 GB of VRAM|16 GB of system memory/i;

describe("kdenlive vs shotcut vs davinci resolve blog", () => {
  it("is served from the repo and is not a database override", () => {
    expect(findRepoBlogArticle(KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG)).toBe(KDENLIVE_SHOTCUT_RESOLVE_ARTICLE);
    expect(findRepoBlogOverride(KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG)).toBeNull();
    expect(KDENLIVE_SHOTCUT_RESOLVE_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(KDENLIVE_SHOTCUT_RESOLVE_ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
  });

  it("keeps the AI label, the answer-first table, and clean copy", () => {
    const text = KDENLIVE_SHOTCUT_RESOLVE_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Nov 2026");
    expect(text.indexOf("| | Kdenlive |")).toBeLessThan(text.indexOf("## "));
    expect(text).toContain("/compare/kdenlive-vs-shotcut");
    expect(text).toContain("/compare/kdenlive-vs-davinci-resolve");
    expect(text).toContain("davinci-resolve-free-vs-premiere-pro-2026-complete-decision-guide");
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(KDENLIVE_SHOTCUT_RESOLVE_BLOG_SLUG)?.faqs).toBe(KDENLIVE_SHOTCUT_RESOLVE_FAQS);
    for (const faq of KDENLIVE_SHOTCUT_RESOLVE_FAQS) {
      expect(KDENLIVE_SHOTCUT_RESOLVE_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(KDENLIVE_SHOTCUT_RESOLVE_ARTICLE.content).toContain(faq.answer);
    }
  });
});

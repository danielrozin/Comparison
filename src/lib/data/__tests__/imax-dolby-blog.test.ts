import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { IMAX_DOLBY_ARTICLE, IMAX_DOLBY_BLOG_SLUG, IMAX_DOLBY_FAQS } from "@/lib/data/imax-dolby-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("imax-dolby-blog override", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(IMAX_DOLBY_BLOG_SLUG)).toBe(IMAX_DOLBY_ARTICLE);
    expect(findRepoBlogOverride(IMAX_DOLBY_BLOG_SLUG)).toBe(IMAX_DOLBY_ARTICLE);
    expect(IMAX_DOLBY_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("keeps the AI label, date note, answer-first table, and clean copy", () => {
    const text = IMAX_DOLBY_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Oct 2026");
    expect(text.indexOf('| | IMAX | Dolby Cinema |')).toBeGreaterThan(-1);
    expect(text.indexOf('| | IMAX | Dolby Cinema |')).toBeLessThan(text.indexOf("## "));
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(IMAX_DOLBY_BLOG_SLUG)?.faqs).toBe(IMAX_DOLBY_FAQS);
    for (const faq of IMAX_DOLBY_FAQS) {
      expect(IMAX_DOLBY_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(IMAX_DOLBY_ARTICLE.content).toContain(faq.answer);
    }
  });
});

describe("imax vs dolby build link", () => {
  it("links /build/dolby-cinema-vs-imax, which the blog renderer marks nofollow", async () => {
    const { IMAX_DOLBY_ARTICLE: a } = await import("@/lib/data/imax-dolby-blog");
    expect(a.content).toContain("(/build/dolby-cinema-vs-imax)");
    const fs = await import("node:fs");
    const src = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8");
    expect(src).toContain(`href.startsWith("/build/")`);
    expect(src).toContain(`' rel="nofollow"'`);
  });
});

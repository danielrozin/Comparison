import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { IPHONE_BROWSER_ARTICLE, IPHONE_BROWSER_BLOG_SLUG, IPHONE_BROWSER_FAQS } from "@/lib/data/iphone-browser-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("iphone-browser-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(IPHONE_BROWSER_BLOG_SLUG)).toBe(IPHONE_BROWSER_ARTICLE);
    expect(findRepoBlogOverride(IPHONE_BROWSER_BLOG_SLUG)).toBe(IPHONE_BROWSER_ARTICLE);
    expect(IPHONE_BROWSER_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(IPHONE_BROWSER_ARTICLE.publishedAt).toBe("2026-07-19T02:04:41.661Z");
    expect(IPHONE_BROWSER_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = IPHONE_BROWSER_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
  });

  it("links a live compare page in the body", () => {
    expect(IPHONE_BROWSER_ARTICLE.content).toContain("(/compare/chrome-vs-safari)");
    expect(isRedirectedCompareSlug("chrome-vs-safari")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(IPHONE_BROWSER_BLOG_SLUG)?.faqs).toBe(IPHONE_BROWSER_FAQS);
    for (const faq of IPHONE_BROWSER_FAQS) {
      expect(IPHONE_BROWSER_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(IPHONE_BROWSER_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("drops the unsourced battery test figures and byline", () => {
    const text = IPHONE_BROWSER_ARTICLE.content;
    expect(text).not.toMatch(/~?1[0-5] hours|25-35%|iPhone 16 Pro, 2026/);
    expect(text).toContain("WebKit");
  });
});

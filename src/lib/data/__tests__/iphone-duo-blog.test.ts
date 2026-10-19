import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { IPHONE_DUO_ARTICLE, IPHONE_DUO_BLOG_SLUG, IPHONE_DUO_FAQS } from "@/lib/data/iphone-duo-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:|rumou?r|leak|hands-on|durab/i;

describe("iphone-duo-features blog (ROO-272)", () => {
  it("is a new repo post, not a DB override", () => {
    expect(IPHONE_DUO_BLOG_SLUG).toBe("iphone-duo-features");
    expect(findRepoBlogArticle(IPHONE_DUO_BLOG_SLUG)).toBe(IPHONE_DUO_ARTICLE);
    expect(findRepoBlogOverride(IPHONE_DUO_BLOG_SLUG)).toBeNull();
    expect(IPHONE_DUO_ARTICLE.status).toBe("published");
    expect(IPHONE_DUO_ARTICLE.metaTitle!.length).toBeLessThanOrEqual(47);
    expect(IPHONE_DUO_ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(IPHONE_DUO_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(new Date(IPHONE_DUO_ARTICLE.publishedAt!).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = IPHONE_DUO_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text.slice(0, 600)).toMatch(/first foldable iPhone/);
    expect(text.slice(0, 600)).toMatch(/folds like a book/);
    expect(text.slice(0, 600)).toMatch(/has not announced a flip-style iPhone/);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Key takeaways");
    expect(text).toContain("## Sources");
    expect(text).toMatch(/\n\*Table: /);
  });

  it("dates every price and links Apple's store page", () => {
    const text = IPHONE_DUO_ARTICLE.content;
    expect(text).toContain("$1,999 launch price (MSRP) for 256GB, per Apple Newsroom, September 2026");
    expect(text).toContain("See vendor page for current price");
    expect(text).toContain("https://www.apple.com/shop/buy-iphone/iphone-duo");
    for (const m of text.matchAll(/\$\d[\d,]*/g)) {
      const around = text.slice(Math.max(0, m.index! - 40), m.index! + 120);
      expect(around).toMatch(/MSRP|launch price/);
    }
  });

  it("cites Apple only", () => {
    const sources = IPHONE_DUO_ARTICLE.content.split("## Sources")[1];
    const urls = [...sources.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThanOrEqual(4);
    for (const url of urls) expect(url).toMatch(/^https:\/\/www\.apple\.com\//);
  });

  it("links live compare pages only", () => {
    for (const slug of IPHONE_DUO_ARTICLE.relatedComparisonSlugs) {
      expect(IPHONE_DUO_ARTICLE.content).toContain(`(/compare/${slug})`);
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
    expect(IPHONE_DUO_ARTICLE.content).not.toContain("/compare/iphone-18-pro-vs-iphone-18-pro-max");
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(IPHONE_DUO_FAQS.length).toBeGreaterThanOrEqual(5);
    expect(IPHONE_DUO_FAQS.length).toBeLessThanOrEqual(6);
    expect(getBlogSchemaExtras(IPHONE_DUO_BLOG_SLUG)?.faqs).toBe(IPHONE_DUO_FAQS);
    for (const faq of IPHONE_DUO_FAQS) {
      expect(IPHONE_DUO_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(IPHONE_DUO_ARTICLE.content).toContain(faq.answer);
    }
  });
});

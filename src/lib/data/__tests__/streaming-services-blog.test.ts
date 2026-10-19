import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { STREAMING_SERVICES_ARTICLE, STREAMING_SERVICES_BLOG_SLUG, STREAMING_SERVICES_FAQS } from "@/lib/data/streaming-services-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("streaming-services-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(STREAMING_SERVICES_BLOG_SLUG)).toBe(STREAMING_SERVICES_ARTICLE);
    expect(findRepoBlogOverride(STREAMING_SERVICES_BLOG_SLUG)).toBe(STREAMING_SERVICES_ARTICLE);
    expect(STREAMING_SERVICES_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(STREAMING_SERVICES_ARTICLE.publishedAt).toBe("2026-07-19T03:01:11.788Z");
    expect(STREAMING_SERVICES_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = STREAMING_SERVICES_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
  });

  it("links a live compare page in the body", () => {
    expect(STREAMING_SERVICES_ARTICLE.content).toContain("(/compare/amazon-vs-hulu)");
    expect(isRedirectedCompareSlug("amazon-vs-hulu")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(STREAMING_SERVICES_BLOG_SLUG)?.faqs).toBe(STREAMING_SERVICES_FAQS);
    for (const faq of STREAMING_SERVICES_FAQS) {
      expect(STREAMING_SERVICES_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(STREAMING_SERVICES_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("uses current, dated prices and drops stale ones", () => {
    const text = STREAMING_SERVICES_ARTICLE.content;
    expect(text).toContain("$8.99/month, per Netflix pricing page, October 2026");
    expect(text).toContain("$19.99/month");
    expect(text).toContain("$26.99/month");
    expect(text).not.toMatch(/\$(?:7|15|23|82|96)(?![.\d])|\$17\+ billion|\$1 billion|YouTube TV/);
    expect(text).toContain("See vendor page for current price");
  });
});

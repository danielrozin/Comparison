import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { NAVIGATION_APPS_ARTICLE, NAVIGATION_APPS_BLOG_SLUG, NAVIGATION_APPS_FAQS } from "@/lib/data/navigation-apps-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("navigation-apps-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(NAVIGATION_APPS_BLOG_SLUG)).toBe(NAVIGATION_APPS_ARTICLE);
    expect(findRepoBlogOverride(NAVIGATION_APPS_BLOG_SLUG)).toBe(NAVIGATION_APPS_ARTICLE);
    expect(NAVIGATION_APPS_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(NAVIGATION_APPS_ARTICLE.publishedAt).toBe("2026-07-18T20:29:04.247Z");
    expect(NAVIGATION_APPS_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = NAVIGATION_APPS_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
  });

  it("links a live compare page in the body", () => {
    expect(NAVIGATION_APPS_ARTICLE.content).toContain("(/compare/google-maps-vs-waze)");
    expect(isRedirectedCompareSlug("google-maps-vs-waze")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(NAVIGATION_APPS_BLOG_SLUG)?.faqs).toBe(NAVIGATION_APPS_FAQS);
    for (const faq of NAVIGATION_APPS_FAQS) {
      expect(NAVIGATION_APPS_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(NAVIGATION_APPS_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("drops unsourced user counts, timing claims and Waze Carpool", () => {
    const text = NAVIGATION_APPS_ARTICLE.content;
    expect(text).not.toMatch(/billion|140 million|3–5 minutes|5–15 minutes|Carpool|Live View|Not covered here/);
  });
});

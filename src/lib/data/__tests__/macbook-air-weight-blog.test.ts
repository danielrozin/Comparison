import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  MACBOOK_AIR_WEIGHT_ARTICLE,
  MACBOOK_AIR_WEIGHT_BLOG_SLUG,
  MACBOOK_AIR_WEIGHT_FAQS,
} from "@/lib/data/macbook-air-weight-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("macbook-air-weight-blog override (ROO-406)", () => {
  it("replaces the database row and keeps the original publish date", () => {
    expect(findRepoBlogArticle(MACBOOK_AIR_WEIGHT_BLOG_SLUG)).toBe(MACBOOK_AIR_WEIGHT_ARTICLE);
    expect(findRepoBlogOverride(MACBOOK_AIR_WEIGHT_BLOG_SLUG)).toBe(MACBOOK_AIR_WEIGHT_ARTICLE);
    expect(MACBOOK_AIR_WEIGHT_ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(MACBOOK_AIR_WEIGHT_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(`${MACBOOK_AIR_WEIGHT_ARTICLE.metaTitle} | A Versus B`.length).toBeLessThanOrEqual(60);
    expect(MACBOOK_AIR_WEIGHT_ARTICLE.publishedAt).toBe("2026-05-05T18:14:10.191Z");
    expect(MACBOOK_AIR_WEIGHT_ARTICLE.updatedAt).toBe("2026-11-10T00:00:00Z");
  });

  it("leads with Apple's listed weights and avoids source-talk", () => {
    const text = MACBOOK_AIR_WEIGHT_ARTICLE.content;
    expect(text.startsWith("**Updated November 10, 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
    expect(text).toContain("1.23 kg");
    expect(text).toContain("1.51 kg");
    expect(text).not.toMatch(/1\.24 kg|1\.22 kg|1\.50 kg|expected/);
    expect(text).not.toMatch(/\$\d/);
  });

  it("links live compare pages and no redirect sources", () => {
    for (const slug of [
      "macbook-air-vs-macbook-pro",
      "macbook-air-m5-vs-macbook-pro-m5",
      "dell-xps-13-vs-macbook-air",
    ]) {
      expect(MACBOOK_AIR_WEIGHT_ARTICLE.content).toContain(`(/compare/${slug})`);
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(MACBOOK_AIR_WEIGHT_BLOG_SLUG)?.faqs).toBe(MACBOOK_AIR_WEIGHT_FAQS);
    expect(MACBOOK_AIR_WEIGHT_FAQS).toHaveLength(6);
    for (const faq of MACBOOK_AIR_WEIGHT_FAQS) {
      expect(MACBOOK_AIR_WEIGHT_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(MACBOOK_AIR_WEIGHT_ARTICLE.content).toContain(faq.answer);
    }
  });
});

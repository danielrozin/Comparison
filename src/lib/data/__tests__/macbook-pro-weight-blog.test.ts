import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { MACBOOK_PRO_WEIGHT_ARTICLE, MACBOOK_PRO_WEIGHT_BLOG_SLUG, MACBOOK_PRO_WEIGHT_FAQS } from "@/lib/data/macbook-pro-weight-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("macbook-pro-weight-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(MACBOOK_PRO_WEIGHT_BLOG_SLUG)).toBe(MACBOOK_PRO_WEIGHT_ARTICLE);
    expect(findRepoBlogOverride(MACBOOK_PRO_WEIGHT_BLOG_SLUG)).toBe(MACBOOK_PRO_WEIGHT_ARTICLE);
    expect(MACBOOK_PRO_WEIGHT_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(MACBOOK_PRO_WEIGHT_ARTICLE.publishedAt).toBe("2026-05-01T06:53:19.352Z");
    expect(MACBOOK_PRO_WEIGHT_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = MACBOOK_PRO_WEIGHT_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
  });

  it("links a live compare page in the body", () => {
    expect(MACBOOK_PRO_WEIGHT_ARTICLE.content).toContain("(/compare/macbook-pro-14-vs-macbook-pro-16)");
    expect(isRedirectedCompareSlug("macbook-pro-14-vs-macbook-pro-16")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(MACBOOK_PRO_WEIGHT_BLOG_SLUG)?.faqs).toBe(MACBOOK_PRO_WEIGHT_FAQS);
    for (const faq of MACBOOK_PRO_WEIGHT_FAQS) {
      expect(MACBOOK_PRO_WEIGHT_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(MACBOOK_PRO_WEIGHT_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("carries Apple's current weights and dated launch prices", () => {
    const text = MACBOOK_PRO_WEIGHT_ARTICLE.content;
    for (const w of ["1.55 kg", "1.60 kg", "1.62 kg", "2.14 kg", "2.15 kg", "1.23 kg", "1.51 kg"]) expect(text).toContain(w);
    expect(text).not.toMatch(/1\.63 kg|2\.13 kg|1\.22 kg|1\.24 kg/);
    expect(text).toContain("$2,199, per Apple Newsroom, March 2026");
    expect(text).toContain("See vendor page for current price");
  });
});

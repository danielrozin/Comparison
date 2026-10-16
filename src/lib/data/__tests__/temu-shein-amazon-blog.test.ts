import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { TEMU_SHEIN_AMAZON_ARTICLE, TEMU_SHEIN_AMAZON_BLOG_SLUG, TEMU_SHEIN_AMAZON_FAQS } from "@/lib/data/temu-shein-amazon-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

const BANNED =
  /this page|the page|according to|our sources|reviewed by|human review|checked|fetch|Source note|(?:^|\n)Sources:/i;

describe("temu-shein-amazon-blog override", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(TEMU_SHEIN_AMAZON_BLOG_SLUG)).toBe(TEMU_SHEIN_AMAZON_ARTICLE);
    expect(findRepoBlogOverride(TEMU_SHEIN_AMAZON_BLOG_SLUG)).toBe(TEMU_SHEIN_AMAZON_ARTICLE);
    expect(TEMU_SHEIN_AMAZON_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("keeps the AI label, date note, answer-first table, and clean copy", () => {
    const text = TEMU_SHEIN_AMAZON_ARTICLE.content;
    expect(text.startsWith("*Analysis. Drafted with AI from web research.")).toBe(true);
    expect(text).toContain("Updated Oct 2026");
    expect(text.indexOf("| | Temu | Shein | Amazon Haul |")).toBeGreaterThan(-1);
    expect(text.indexOf("| | Temu | Shein | Amazon Haul |")).toBeLessThan(text.indexOf("## "));
    expect(text).not.toMatch(BANNED);
  });

  it("puts every FAQ in the faqs field and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(TEMU_SHEIN_AMAZON_BLOG_SLUG)?.faqs).toBe(TEMU_SHEIN_AMAZON_FAQS);
    for (const faq of TEMU_SHEIN_AMAZON_FAQS) {
      expect(TEMU_SHEIN_AMAZON_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(TEMU_SHEIN_AMAZON_ARTICLE.content).toContain(faq.answer);
    }
  });
});

describe("temu vs shein vs amazon links", () => {
  it("links the requested pages and no three-way compare", async () => {
    const { TEMU_SHEIN_AMAZON_ARTICLE: a } = await import("@/lib/data/temu-shein-amazon-blog");
    for (const href of ["/compare/temu-vs-shein", "/compare/amazon-haul-vs-shein", "/entity/temu", "/entity/shein", "/alternatives/temu", "/alternatives/shein"]) {
      expect(a.content).toContain(`(${href})`);
    }
    expect(a.content).not.toContain("/compare/temu-vs-shein-vs-amazon");
  });
});

import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import { MARVEL_MOVIES_RANKED_ARTICLE, MARVEL_MOVIES_RANKED_BLOG_SLUG, MARVEL_MOVIES_RANKED_FAQS } from "@/lib/data/marvel-movies-ranked-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

describe("marvel-movies-ranked-blog override (ROO-269)", () => {
  it("is served from the repo ahead of the DB row", () => {
    expect(findRepoBlogArticle(MARVEL_MOVIES_RANKED_BLOG_SLUG)).toBe(MARVEL_MOVIES_RANKED_ARTICLE);
    expect(findRepoBlogOverride(MARVEL_MOVIES_RANKED_BLOG_SLUG)).toBe(MARVEL_MOVIES_RANKED_ARTICLE);
    expect(MARVEL_MOVIES_RANKED_ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(MARVEL_MOVIES_RANKED_ARTICLE.publishedAt).toBe("2026-07-18T21:17:26.185Z");
    expect(MARVEL_MOVIES_RANKED_ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
  });

  it("leads with the answer, leaves labels to the template, and avoids source-talk", () => {
    const text = MARVEL_MOVIES_RANKED_ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Sources");
  });

  it("links a live compare page in the body", () => {
    expect(MARVEL_MOVIES_RANKED_ARTICLE.content).toContain("(/compare/marvel-vs-dc)");
    expect(isRedirectedCompareSlug("marvel-vs-dc")).toBe(false);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(getBlogSchemaExtras(MARVEL_MOVIES_RANKED_BLOG_SLUG)?.faqs).toBe(MARVEL_MOVIES_RANKED_FAQS);
    for (const faq of MARVEL_MOVIES_RANKED_FAQS) {
      expect(MARVEL_MOVIES_RANKED_ARTICLE.content).toContain(`### ${faq.question}`);
      expect(MARVEL_MOVIES_RANKED_ARTICLE.content).toContain(faq.answer);
    }
  });

  it("ranks all 38 MCU films once and drops Morbius and placeholders", () => {
    const text = MARVEL_MOVIES_RANKED_ARTICLE.content;
    const ranks = [...text.matchAll(/^### (\d+)\. /gm)].map((m) => Number(m[1]));
    expect(ranks).toEqual(Array.from({ length: 38 }, (_, i) => i + 1));
    for (const film of ["The Marvels (2023)", "Captain America: Brave New World (2025)", "Thunderbolts* (2025)", "The Fantastic Four: First Steps (2025)", "Spider-Man: Brand New Day (2026)"]) {
      expect(text).toContain(film);
    }
    expect(text).not.toMatch(/Pending|35 theatrical|70\+ characters|Morbin/);
  });
});

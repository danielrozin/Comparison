import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride } from "@/lib/data/nba-season-preview-blog";
import {
  COMPARE_CAR_INSURANCE_QUOTES_ARTICLE as ARTICLE,
  COMPARE_CAR_INSURANCE_QUOTES_BLOG_SLUG as SLUG,
  COMPARE_CAR_INSURANCE_QUOTES_FAQS as FAQS,
} from "@/lib/data/compare-car-insurance-quotes-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { howToSchemaFromBlog } from "@/lib/seo/schema";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked against|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:/i;

/** YMYL: process only. No rates, averages, rankings or superlatives. */
const NO_RANKINGS =
  /cheapest|(?<!A\.M\. )\bbest\b|ranked|\branking|\btop \d|\#1|number one|lowest rates?|average (premium|rate|cost)|\bper month\b|\/mo\b|save up to|market share|nerdwallet|policygenius|the zebra/i;

describe("how-to-compare-car-insurance-quotes blog (ROO-276)", () => {
  it("is a new repo post, not a DB override", () => {
    expect(findRepoBlogArticle(SLUG)).toBe(ARTICLE);
    expect(findRepoBlogOverride(SLUG)).toBeNull();
    expect(ARTICLE.status).toBe("published");
    expect(ARTICLE.category).toBe("finance");
    expect(ARTICLE.metaTitle!.length).toBeLessThanOrEqual(47);
    expect(ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
    expect(new Date(ARTICLE.publishedAt!).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("leads with the answer, carries a general-information note, and avoids source-talk", () => {
    const text = ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.**")).toBe(true);
    expect(text.slice(0, 400)).toMatch(/same coverages, limits and deductibles/);
    expect(text).toMatch(/General information, not insurance or legal advice/);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).toContain("## Key takeaways");
    expect(text).toContain("## Sources");
    expect(text).toMatch(/\n\*Table: /);
  });

  it("has no rates, averages, rankings or cheapest claims", () => {
    const all = [ARTICLE.title, ARTICLE.metaTitle, ARTICLE.metaDescription, ARTICLE.excerpt, ARTICLE.content, ...FAQS.flatMap((f) => [f.question, f.answer])].join("\n");
    expect(all).not.toMatch(NO_RANKINGS);
    // The only dollar figures are statutory minimum limits and the NAIC deductible example.
    const dollars = [...ARTICLE.content.matchAll(/\$[\d,]+/g)].map((m) => m[0]);
    expect(new Set(dollars)).toEqual(new Set(["$30,000", "$60,000", "$25,000", "$15,000", "$1,000", "$500"]));
  });

  it("cites the NAIC and state regulators only", () => {
    const sources = ARTICLE.content.split("## Sources")[1];
    const urls = [...sources.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThanOrEqual(4);
    for (const url of urls) expect(url).toMatch(/^https:\/\/(content\.naic\.org|www\.tdi\.texas\.gov|www\.insurance\.ca\.gov)\//);
  });

  it("links live compare pages", () => {
    for (const slug of ARTICLE.relatedComparisonSlugs) {
      expect(ARTICLE.content).toContain(`(/compare/${slug})`);
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
  });

  it("emits HowTo steps from the step headings only", () => {
    const howTo = howToSchemaFromBlog({ title: ARTICLE.title, description: ARTICLE.metaDescription, url: "https://example.test/x", content: ARTICLE.content });
    const names = (howTo?.step ?? []).map((s) => s.name);
    expect(names).toHaveLength(7);
    for (const name of names) expect(name).toMatch(/^Step \d: /);
  });

  it("puts every FAQ in the schema extras and in the visible FAQ section", () => {
    expect(FAQS.length).toBeGreaterThanOrEqual(5);
    expect(FAQS.length).toBeLessThanOrEqual(6);
    expect(getBlogSchemaExtras(SLUG)?.faqs).toBe(FAQS);
    for (const faq of FAQS) {
      expect(ARTICLE.content).toContain(`### ${faq.question}`);
      expect(ARTICLE.content).toContain(faq.answer);
    }
  });
});

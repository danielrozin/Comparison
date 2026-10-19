import { describe, expect, it } from "vitest";
import { findRepoBlogArticle, findRepoBlogOverride, listRepoBlogOverrideSlugs } from "@/lib/data/nba-season-preview-blog";
import {
  CHEAPEST_CAR_INSURANCE_ARTICLE as ARTICLE,
  CHEAPEST_CAR_INSURANCE_BLOG_SLUG as SLUG,
  CHEAPEST_CAR_INSURANCE_FAQS as FAQS,
} from "@/lib/data/cheapest-car-insurance-blog";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED =
  /this page|the page|this article|according to|our sources|sources say|reviewed by|human review|checked against|fetch|Source note|Drafted with AI|Daniel Rozin|(?:^|\n)Sources:|\bBy [A-Z][a-z]+ [A-Z]/;

/** YMYL: no rankings, superlatives or unsourced numbers. The FAQ question and answer that say no insurer is cheapest are the only use of the word. */
const NO_RANKINGS =
  /(?<!A\.M\. )\bbest\b|ranked|\branking|\btop \d|\#\d|number one|lowest rates?|largest|highest|average (annual )?(premium|rate|cost|savings)|save(?:s|d)? (?:up to|an average)|\bper (month|year)\b|\/(mo|yr)\b|market share|nerdwallet|policygenius|the zebra|\bUSAA\b|\berie\b|\bAARP\b|Name Your Price|Steer Clear/i;

describe("cheapest-car-insurance blog YMYL rewrite", () => {
  it("keeps the URL, overrides the DB row and preserves the publish date", () => {
    expect(SLUG).toBe("cheapest-car-insurance-companies-2026-ranked-and-compared");
    expect(findRepoBlogArticle(SLUG)).toBe(ARTICLE);
    expect(findRepoBlogOverride(SLUG)).toBe(ARTICLE);
    expect(listRepoBlogOverrideSlugs()).toContain(SLUG);
    expect(ARTICLE.status).toBe("published");
    expect(ARTICLE.publishedAt).toBe("2026-07-18T20:29:03.158Z");
    expect(ARTICLE.updatedAt).toBe("2026-10-19T00:00:00Z");
    expect(ARTICLE.metaTitle!.length).toBeLessThanOrEqual(47);
    expect(ARTICLE.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(ARTICLE.metaDescription.length).toBeLessThanOrEqual(160);
  });

  it("drops rankings, 'cheapest' claims and superlatives from every reader field", () => {
    for (const field of [ARTICLE.title, ARTICLE.metaTitle!]) expect(field).not.toMatch(/cheapest|ranked/i);
    for (const field of [ARTICLE.metaDescription, ARTICLE.excerpt]) {
      expect(field).not.toMatch(/ranked/i);
      expect(field.replace(/^No insurer is cheapest for every driver\./, "")).not.toMatch(/cheapest/i);
    }
    const all = [ARTICLE.title, ARTICLE.metaTitle, ARTICLE.metaDescription, ARTICLE.excerpt, ARTICLE.content, ...FAQS.flatMap((f) => [f.question, f.answer])].join("\n");
    expect(all).not.toMatch(NO_RANKINGS);
    const cheapest = [...[ARTICLE.content, ...FAQS.flatMap((f) => [f.question, f.answer])].join("\n").matchAll(/[^.\n]*\bcheapest\b[^.\n]*/gi)].map((m) => m[0]);
    for (const sentence of cheapest) expect(sentence).toMatch(/\b(no|none|not)\b|\?\s*$/i);
    expect(ARTICLE.excerpt).toMatch(/^No insurer is cheapest for every driver/);
  });

  it("carries no dollar figures and only official percentages", () => {
    expect(ARTICLE.content).not.toMatch(/\$\d/);
    const percents = [...ARTICLE.content.matchAll(/\d+(?:\.\d+)?%/g)].map((m) => m[0]);
    expect(percents).toEqual(["20%"]);
    expect(ARTICLE.content).toMatch(/California Department of Insurance says a Good Driver's rates must be at least 20% lower/);
  });

  it("leads with the answer, has no byline and avoids source-talk", () => {
    const text = ARTICLE.content;
    expect(text.startsWith("**Updated Oct 2026.** No single company is the cheapest car insurer for every driver.")).toBe(true);
    expect(text).toMatch(/General information, not insurance or legal advice/);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(/^# /m);
    expect(text).not.toMatch(/2027/);
    expect(text).toContain("## Key takeaways");
    expect(text).toMatch(/\n\*Table: /);
  });

  it("cites the NAIC, state regulators and the insurers' own program pages only", () => {
    const sources = ARTICLE.content.split("## Sources")[1];
    const urls = [...sources.matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    for (const url of urls) {
      expect(url).toMatch(/^https:\/\/(content\.naic\.org|www\.tdi\.texas\.gov|www\.insurance\.ca\.gov|www\.statefarm\.com|www\.progressive\.com|www\.geico\.com)\//);
    }
  });

  it("links live compare pages", () => {
    for (const slug of ARTICLE.relatedComparisonSlugs) {
      expect(ARTICLE.content).toContain(`(/compare/${slug})`);
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
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

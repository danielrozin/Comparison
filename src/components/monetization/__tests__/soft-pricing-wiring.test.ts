/**
 * ROO-44 — high-traffic landers render the shared soft pricing line
 * with a stable src, near the top of the page.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("ROO-44 lander wiring", () => {
  it("places the blog hub line under the compare CTA and above the headline", () => {
    const page = source("src/app/blog/page.tsx");
    const compareAt = page.indexOf("<HomeCompareCTA");
    const pricingAt = page.indexOf('<SoftPricingLine src="blog"');
    const headingAt = page.indexOf('id="blog-hero-heading"');
    const filtersAt = page.indexOf("Filter articles by category");

    expect(compareAt).toBeGreaterThan(-1);
    expect(pricingAt).toBeGreaterThan(compareAt);
    // A line under the headline is covered by the cookie banner on a short phone.
    expect(headingAt).toBeGreaterThan(pricingAt);
    expect(filtersAt).toBeGreaterThan(pricingAt);
  });

  it("tags each blog article with blog-{slug} above the headline", () => {
    const page = source("src/app/blog/[slug]/page.tsx");
    const compareAt = page.indexOf("<HomeCompareCTA");
    const pricingAt = page.indexOf("src={`blog-${slug}`}");
    const headingAt = page.indexOf("font-display font-bold leading-tight mb-4");
    const bodyAt = page.indexOf('id="blog-article-body"');

    expect(pricingAt).toBeGreaterThan(compareAt);
    expect(headingAt).toBeGreaterThan(pricingAt);
    expect(page).toContain("mobileLead");
    expect(bodyAt).toBeGreaterThan(pricingAt);
  });

  it("tags both compare layouts with compare-{slug} after the answer", () => {
    const page = source("src/pages/compare/[slug].tsx");
    const needle = "src={`compare-${slug}`}";
    const first = page.indexOf(needle);
    const second = page.indexOf(needle, first + needle.length);
    const answerAt = page.indexOf("Quick Answer TL;DR");

    expect(first).toBeGreaterThan(answerAt);
    expect(second).toBeGreaterThan(first);
  });

  it("tags curated SEO landers in the hero, before the article", () => {
    const landers: Array<[string, string, string]> = [
      ["src/app/browser-comparison-2026/page.tsx", "browser-comparison-2026", "<article"],
      ["src/app/password-manager-comparison/page.tsx", "password-manager-comparison", "<article"],
      ["src/app/llm-comparisons/page.tsx", "llm-comparisons", "<article"],
      ["src/app/probability-vs-statistics/page.tsx", "probability-vs-statistics", "<article"],
      ["src/app/q1-2026-ai-battles/page.tsx", "q1-2026-ai-battles", "Report highlights"],
      ["src/app/blog/best-ai-assistant-2026/page.tsx", "blog-best-ai-assistant-2026", "Introduction"],
      ["src/app/blog/best-cloud-platform-2026/page.tsx", "blog-best-cloud-platform-2026", "Introduction"],
    ];

    for (const [file, src, afterMarker] of landers) {
      const page = source(file);
      const at = page.indexOf(`<SoftPricingLine src="${src}"`);
      const after = page.indexOf(afterMarker);
      const intro = page.indexOf('id="page-intro"');
      expect(at, file).toBeGreaterThan(-1);
      expect(after, file).toBeGreaterThan(at);
      // Long intros used to push the line into the cookie banner.
      if (intro !== -1) expect(intro, file).toBeGreaterThan(at);
    }
  });
});

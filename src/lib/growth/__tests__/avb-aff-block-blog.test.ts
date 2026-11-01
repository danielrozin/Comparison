import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AVB_AFF_BLOCK_BLOG_PATHS,
  getBlogAffBlock,
  isAffBlockTestVariant,
  isAvbAffBlockBlogPath,
  isAvbAffBlockBlogSlug,
} from "../avb-aff-block-blog";

describe("ROO-359 blog affiliate experiment paths", () => {
  it("lists the seven exact paths and nothing nearby", () => {
    expect(AVB_AFF_BLOCK_BLOG_PATHS).toEqual([
      "/blog",
      "/blog/best-fast-food-burgers-2026-ranked-and-reviewed",
      "/blog/is-wayfair-furniture-better-than-ikea-honest-comparison",
      "/blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide",
      "/blog/best-keurig-pods-2026-ranked-flavor-value-compatibility",
      "/blog/best-cloud-platforms-2026",
      "/blog/best-browser-for-iphone-2026-safari-vs-chrome-vs-firefox",
    ]);
    expect(isAvbAffBlockBlogPath("/blog/")).toBe(true);
    expect(isAvbAffBlockBlogPath("/blog?category=food")).toBe(true);
    expect(isAvbAffBlockBlogSlug("best-cloud-platforms-2026")).toBe(true);
    // Singular guide is a different URL and must stay out of the experiment.
    expect(isAvbAffBlockBlogPath("/blog/best-cloud-platform-2026")).toBe(false);
    expect(isAvbAffBlockBlogSlug("best-cloud-platform-2026")).toBe(false);
    expect(isAvbAffBlockBlogPath("/compare/ikea-vs-wayfair")).toBe(false);
  });

  it("treats only the test variant as the block", () => {
    expect(isAffBlockTestVariant("test")).toBe(true);
    expect(isAffBlockTestVariant(true)).toBe(true);
    expect(isAffBlockTestVariant("control")).toBe(false);
    expect(isAffBlockTestVariant(false)).toBe(false);
    expect(isAffBlockTestVariant(undefined)).toBe(false);
    expect(isAffBlockTestVariant(null)).toBe(false);
  });

  it("builds disclosed Amazon search links with the organic tag", () => {
    const block = getBlogAffBlock("/blog/best-keurig-pods-2026-ranked-flavor-value-compatibility");
    expect(block).not.toBeNull();
    expect(block!.picks.length).toBeGreaterThan(0);
    for (const pick of block!.picks) {
      expect(pick.partner).toBe("amazon");
      expect(pick.url).toMatch(/^https:\/\/www\.amazon\.com\/s\?k=/);
      expect(pick.url).toContain("tag=");
      expect(pick.label).toContain("Amazon");
    }
    expect(getBlogAffBlock("/blog/best-cloud-platform-2026")).toBeNull();

    const index = readFileSync("src/app/blog/page.tsx", "utf8");
    const article = readFileSync("src/app/blog/[slug]/page.tsx", "utf8");
    expect(index).toContain('<BlogAffiliateExperiment path="/blog" />');
    expect(article).toContain("isAvbAffBlockBlogSlug(slug)");
    expect(article).toContain("<BlogAffiliateExperiment path={`/blog/${slug}`} />");
    expect(getBlogAffBlock("/blog/best-cloud-platforms-2026")!.picks.length).toBeGreaterThan(0);
    expect(
      getBlogAffBlock("/blog/best-browser-for-iphone-2026-safari-vs-chrome-vs-firefox")!.picks
        .length,
    ).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import {
  NBA_PREVIEW_COMPARE_SLUGS,
  NBA_PREVIEW_DEBATES,
  NBA_PREVIEW_MORE_DEBATES,
  NBA_SEASON_PREVIEW_ARTICLE,
  NBA_SEASON_PREVIEW_BLOG_SLUG,
  splitHtmlAtCompareCtas,
} from "@/lib/data/nba-season-preview-blog";
import { getEditorialAeoOverlay } from "@/lib/data/editorial-aeo-overlays";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { getBlogBySlug, listBlogArticles } from "@/lib/services/blog-generator";
import { getStaticProps } from "@/pages/compare/[slug]";

type Ctx = Parameters<typeof getStaticProps>[0];

describe("2026-27 NBA season preview blog", () => {
  it("publishes ten debate CTAs plus the more-debates links", () => {
    expect(NBA_SEASON_PREVIEW_ARTICLE.title).toBe("2026-27 NBA season preview: 10 debates");
    expect(NBA_SEASON_PREVIEW_ARTICLE.slug).toBe(NBA_SEASON_PREVIEW_BLOG_SLUG);
    expect(NBA_PREVIEW_DEBATES).toHaveLength(10);
    expect(NBA_PREVIEW_MORE_DEBATES).toHaveLength(5);
    expect(NBA_PREVIEW_COMPARE_SLUGS).toContain("embiid-vs-jokic");
    expect(NBA_PREVIEW_COMPARE_SLUGS).toContain("kobe-bryant-vs-steph-curry");

    const markers = splitHtmlAtCompareCtas(NBA_SEASON_PREVIEW_ARTICLE.content).filter(
      (part) => part.kind === "cta",
    );
    expect(markers.map((part) => (part.kind === "cta" ? part.slug : ""))).toEqual([
      ...NBA_PREVIEW_COMPARE_SLUGS,
    ]);

    expect(NBA_SEASON_PREVIEW_ARTICLE.content).not.toMatch(/\/entity\//);
    expect(NBA_SEASON_PREVIEW_ARTICLE.content).not.toMatch(/final season/i);
    expect(NBA_SEASON_PREVIEW_ARTICLE.content).not.toMatch(/\bhealthy\b/i);
    expect(NBA_SEASON_PREVIEW_ARTICLE.content).toContain("Stats as of October 3, 2026");
    expect(NBA_SEASON_PREVIEW_ARTICLE.content).toContain(
      "26.9 points, 7.7 rebounds, and 3.9 assists in 38 games in 2025-26",
    );
    expect(NBA_SEASON_PREVIEW_ARTICLE.content).toContain("Achilles");
  });

  it("is on the blog index and resolves by slug without a database row", async () => {
    const article = await getBlogBySlug(NBA_SEASON_PREVIEW_BLOG_SLUG);
    expect(article?.title).toBe(NBA_SEASON_PREVIEW_ARTICLE.title);
    const { articles } = await listBlogArticles({ limit: 50, status: "published" });
    expect(articles.some((item) => item.slug === NBA_SEASON_PREVIEW_BLOG_SLUG)).toBe(true);
  });

  it("links each compare at 0 hops", async () => {
    // kobe-bryant-vs-lebron-james is a published database page with a season
    // overlay. This environment has no comparison database, so getStaticProps
    // cannot render it. It is still the canonical URL: nothing redirects it,
    // and kobe-vs-lebron points at it. Production returned HTTP 200 with no hop.
    const databaseCanonical = new Set(["kobe-bryant-vs-lebron-james"]);

    for (const slug of NBA_PREVIEW_COMPARE_SLUGS) {
      expect(getConsolidatedCompareSlug(slug), slug).toBeNull();
      if (databaseCanonical.has(slug)) {
        expect(getEditorialAeoOverlay(slug)).not.toBeNull();
        expect(getConsolidatedCompareSlug("kobe-vs-lebron")).toBe(slug);
        continue;
      }
      const props = await getStaticProps({ params: { slug } } as unknown as Ctx);
      expect(props, slug).not.toHaveProperty("redirect");
      expect(props, slug).not.toHaveProperty("notFound");
    }
  });
});

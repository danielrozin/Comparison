import type { MetadataRoute } from "next";
import { CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getAllSitemapData } from "@/lib/services/comparison-service";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { getReviewCategories, getReviewedEntities } from "@/lib/services/review-service";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { BEST_CONFIG } from "@/lib/data/best-entries";

const SITE_URL = "https://www.aversusb.net";
const MAX_URLS_PER_SITEMAP = 5000; // conservative limit (Google allows 50k)

/**
 * Sitemap index generator — Next.js calls this to build a sitemap index
 * that splits URLs across multiple sub-sitemaps.
 *
 * IDs: 0 = static+categories, 1 = comparisons, 2 = entities+alternatives,
 *      3 = blog, 4 = reviews
 */
export async function generateSitemaps() {
  return [
    { id: 0 }, // static + categories + subcategories
    { id: 1 }, // comparisons
    { id: 2 }, // entities + alternatives
    { id: 3 }, // blog
    { id: 4 }, // reviews
  ];
}

export default async function sitemap({
  id,
}: {
  id: number | string;
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  // Next.js 15 may pass id as a string from URL params; normalize to number
  const numId = Number(id);

  // ── Sitemap 0: Static + Category pages ──
  if (numId === 0) {
    // Stable legal/about pages use their real last-edit date rather than `now`.
    // Inflating lastmod on every build signals false freshness and wastes Google's
    // crawl budget re-crawling pages that haven't changed.
    const LEGAL_DATE = "2025-01-15";
    const ABOUT_DATE = "2026-04-01";
    const STUDIES_DATE = "2026-05-01";

    const staticPages: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
      { url: `${SITE_URL}/about`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/contact`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.4 },
      { url: `${SITE_URL}/partnerships`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
      { url: `${SITE_URL}/developers`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}/feed`, lastModified: now, changeFrequency: "daily", priority: 0.3 },
      { url: `${SITE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
      { url: `${SITE_URL}/privacy`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/terms`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/disclaimer`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/site-map`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
      { url: `${SITE_URL}/studies`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}/studies/most-compared-brands-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/studies/b2b-saas-comparison-report-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/studies/investing-comparison-report-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
    ];

    const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const subcategoryPages: MetadataRoute.Sitemap = Object.entries(CATEGORY_SUBCATEGORIES).flatMap(
      ([catSlug, subs]) =>
        subs.map((sub) => ({
          url: `${SITE_URL}/category/${catSlug}/${sub.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.85,
        }))
    );

    const hubPages: MetadataRoute.Sitemap = Object.keys(HUB_CONFIG).map((slug) => ({
      url: `${SITE_URL}/hub/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    const bestPages: MetadataRoute.Sitemap = Object.keys(BEST_CONFIG).map((slug) => ({
      url: `${SITE_URL}/best/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    return [...staticPages, ...categoryPages, ...subcategoryPages, ...hubPages, ...bestPages];
  }

  // ── Sitemap 1: Comparison pages ──
  if (numId === 1) {
    try {
      const { comparisons } = await getAllSitemapData();
      return comparisons.slice(0, MAX_URLS_PER_SITEMAP).map((comp) => {
        // Derive entity names from the slug (format: "entity-a-vs-entity-b").
        // Slug parts use hyphens; humanize by replacing with spaces and title-casing.
        const humanize = (s: string) =>
          s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const vsParts = comp.slug.split("-vs-");
        const entityA = vsParts[0] ? humanize(vsParts[0]) : comp.slug;
        const entityB = vsParts[1] ? humanize(vsParts[1]) : "";
        const ogImageUrl = entityB
          ? `${SITE_URL}/api/og?a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&type=comparison`
          : `${SITE_URL}/api/og?title=${encodeURIComponent(entityA)}&type=home`;
        return {
          url: `${SITE_URL}/compare/${comp.slug}`,
          lastModified: comp.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.9,
          // images — explicitly declares OG images in the sitemap.
          // Google Image Search and AI crawlers use sitemap image entries to
          // discover and index images faster without re-crawling all pages.
          images: [ogImageUrl],
        };
      });
    } catch {
      return [];
    }
  }

  // ── Sitemap 2: Entity + Alternatives pages ──
  if (numId === 2) {
    try {
      const { entities: entityData } = await getAllSitemapData();
      const entries = Array.from(entityData.entries());

      const entityPages: MetadataRoute.Sitemap = entries.map(([slug, updatedAt]) => ({
        url: `${SITE_URL}/entity/${slug}`,
        lastModified: updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      const alternativesPages: MetadataRoute.Sitemap = entries.map(([slug, updatedAt]) => ({
        url: `${SITE_URL}/alternatives/${slug}`,
        lastModified: updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

      return [...entityPages, ...alternativesPages].slice(0, MAX_URLS_PER_SITEMAP);
    } catch {
      return [];
    }
  }

  // ── Sitemap 3: Blog pages ──
  if (numId === 3) {
    const blogListPage: MetadataRoute.Sitemap = [
      { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ];

    let blogArticlePages: MetadataRoute.Sitemap = [];
    try {
      const { articles } = await listBlogArticles({ limit: MAX_URLS_PER_SITEMAP, status: "published" });
      blogArticlePages = articles.map((article) => ({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    } catch {
      // Blog articles unavailable — skip
    }

    return [...blogListPage, ...blogArticlePages];
  }

  // ── Sitemap 4: Review pages ──
  if (numId === 4) {
    let reviewCategoryPages: MetadataRoute.Sitemap = [];
    try {
      const reviewCats = await getReviewCategories();
      reviewCategoryPages = reviewCats.map((cat) => ({
        url: `${SITE_URL}/reviews/category/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    } catch {
      // Review categories unavailable — skip
    }

    let reviewEntityPages: MetadataRoute.Sitemap = [];
    try {
      const { entities: reviewedEntities } = await getReviewedEntities({ limit: MAX_URLS_PER_SITEMAP });
      reviewEntityPages = reviewedEntities.map((entity) => ({
        url: `${SITE_URL}/reviews/${entity.slug}`,
        lastModified: entity.reviewAggregation?.lastAggregatedAt
          ? new Date(entity.reviewAggregation.lastAggregatedAt).toISOString()
          : now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    } catch {
      // Review entities unavailable — skip
    }

    return [...reviewCategoryPages, ...reviewEntityPages];
  }

  return [];
}

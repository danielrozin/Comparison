import type { MetadataRoute } from "next";
import { CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { getReviewCategories, getReviewedEntities } from "@/lib/services/review-service";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { GUIDE_CONFIG } from "@/lib/data/guides";
import { BEST_CONFIG } from "@/lib/data/best-entries";
import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";
import { isDegenerateComparisonSlug, isCleanSlug } from "@/lib/utils/slugify";

function comparisonOgImageUrl(title: string, entityA: string, entityB: string, category: string): string {
  return (
    `${SITE_URL}/api/og` +
    `?title=${encodeURIComponent(title)}` +
    `&a=${encodeURIComponent(entityA)}` +
    `&b=${encodeURIComponent(entityB)}` +
    `&cat=${encodeURIComponent(category)}` +
    `&type=comparison`
  );
}

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
  // Next.js 15 may pass id as a string from URL params; normalize to number
  const numId = Number(id);

  // ── Sitemap 0: Static + Category pages ──
  if (numId === 0) {
    // All lastmod values use real content timestamps or stable hand-authored dates.
    // Using `new Date()` (build-time "now") causes every redeploy to signal false
    // freshness, burning Googlebot crawl budget on unchanged pages.
    // HB384-385: FAQPage schema added to all 5 legal pages — bump lastmod to signal freshness
    const LEGAL_DATE = "2026-07-11";
    // HB371: blog interactionStatistic (ReadAction viewCount) + llms.txt refresh (2026-07-10)
    // HB-DAN1578: dateModified/contentReferenceTime freshness sweep across 17 pages (2026-07-11)
    const ABOUT_DATE = "2026-07-11";
    const STUDIES_DATE = "2026-07-11";
    const COMPARISONS_DATE = "2026-07-11";
    // HB-DAN1578: calculator tools — WebPage+speakable+potentialAction added (2026-07-12)
    const TOOLS_DATE = "2026-07-12";
    // Alternatives pages: dateModified/contentReferenceTime updated to 2026-07-11
    const ALTERNATIVES_DATE = "2026-07-11";
    const FAQ_DATE = "2026-07-11";
    const CHANGELOG_DATE = "2026-07-11";

    // Derive dynamic-page lastmod from the most recently updated published content.
    // One cheap findFirst per content type — avoids N+1 per-category queries.
    let maxComparisonDate = COMPARISONS_DATE;
    let maxReviewDate = "2026-06-01";
    try {
      const prisma = getPrisma();
      if (prisma) {
        const [latestComparison, latestReview] = await Promise.all([
          prisma.comparison.findFirst({
            where: canonicalComparisonWhere(),
            select: { updatedAt: true },
            orderBy: { updatedAt: "desc" },
          }),
          prisma.reviewAggregation.findFirst({
            select: { lastAggregatedAt: true },
            orderBy: { lastAggregatedAt: "desc" },
          }),
        ]);
        if (latestComparison) maxComparisonDate = latestComparison.updatedAt.toISOString();
        if (latestReview) maxReviewDate = latestReview.lastAggregatedAt.toISOString();
      }
    } catch {
      // fall back to fixed dates
    }

    const staticPages: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: maxComparisonDate, changeFrequency: "daily", priority: 1.0 },
      { url: `${SITE_URL}/trending`, lastModified: maxComparisonDate, changeFrequency: "daily", priority: 0.9 },
      { url: `${SITE_URL}/about`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/contact`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.4 },
      { url: `${SITE_URL}/partnerships`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/search`, lastModified: maxComparisonDate, changeFrequency: "weekly", priority: 0.6 },
      { url: `${SITE_URL}/developers`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/reviews`, lastModified: maxReviewDate, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}/feed`, lastModified: maxComparisonDate, changeFrequency: "daily", priority: 0.3 },
      { url: `${SITE_URL}/changelog`, lastModified: CHANGELOG_DATE, changeFrequency: "weekly", priority: 0.5 },
      { url: `${SITE_URL}/privacy`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/terms`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/disclaimer`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/acceptable-use`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/cookie-policy`, lastModified: LEGAL_DATE, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/site-map`, lastModified: maxComparisonDate, changeFrequency: "daily", priority: 0.6 },
      { url: `${SITE_URL}/studies`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}/studies/most-compared-brands-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/studies/b2b-saas-comparison-report-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/studies/investing-comparison-report-2026`, lastModified: STUDIES_DATE, changeFrequency: "weekly", priority: 0.8 },
      // Curated comparison landing pages
      { url: `${SITE_URL}/llm-comparisons`, lastModified: COMPARISONS_DATE, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/llm-comparisons/methodology`, lastModified: COMPARISONS_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/browser-comparison-2026`, lastModified: COMPARISONS_DATE, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/browser-comparison-2026/methodology`, lastModified: COMPARISONS_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/password-manager-comparison`, lastModified: COMPARISONS_DATE, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/password-manager-comparison/methodology`, lastModified: COMPARISONS_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/q1-2026-ai-battles`, lastModified: "2026-06-12", changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/how-we-write-verdicts`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/who-is-this-for`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/requests`, lastModified: ABOUT_DATE, changeFrequency: "weekly", priority: 0.5 },
      // Author page
      { url: `${SITE_URL}/authors/daniel-rozin`, lastModified: ABOUT_DATE, changeFrequency: "monthly", priority: 0.5 },
      // FAQ competitor comparison pages
      { url: `${SITE_URL}/faq/comparison-sites`, lastModified: FAQ_DATE, changeFrequency: "monthly", priority: 0.7 },
      { url: `${SITE_URL}/faq/diffen`, lastModified: FAQ_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/faq/g2-reviews`, lastModified: FAQ_DATE, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/faq/versus-com`, lastModified: FAQ_DATE, changeFrequency: "monthly", priority: 0.6 },
      // Static blog article pages (hand-authored, not in DB)
      { url: `${SITE_URL}/blog/best-ai-assistant-2026`, lastModified: "2026-06-13", changeFrequency: "monthly", priority: 0.85 },
      { url: `${SITE_URL}/blog/best-cloud-platform-2026`, lastModified: "2026-06-27", changeFrequency: "monthly", priority: 0.85 },
      // Interactive calculator tools (WebApplication + FAQPage schema)
      { url: `${SITE_URL}/tools/roi-calculator`, lastModified: TOOLS_DATE, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/tools/loan-payoff-calculator`, lastModified: TOOLS_DATE, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/tools/days-between-dates`, lastModified: TOOLS_DATE, changeFrequency: "monthly", priority: 0.8 },
      // Static alternatives landing pages (high-traffic curated)
      { url: `${SITE_URL}/alternatives/chatgpt`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/alternatives/figma`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/zoom`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/slack`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/notion`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/nordvpn`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/canva`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/grammarly`, lastModified: ALTERNATIVES_DATE, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/google-workspace`, lastModified: "2026-07-11", changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/monday`, lastModified: "2026-07-11", changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/alternatives/salesforce`, lastModified: "2026-07-11", changeFrequency: "weekly", priority: 0.8 },
    ];

    const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: maxComparisonDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const subcategoryPages: MetadataRoute.Sitemap = Object.entries(CATEGORY_SUBCATEGORIES).flatMap(
      ([catSlug, subs]) =>
        subs.map((sub) => ({
          url: `${SITE_URL}/category/${catSlug}/${sub.slug}`,
          lastModified: maxComparisonDate,
          changeFrequency: "weekly" as const,
          priority: 0.85,
        }))
    );

    const hubPages: MetadataRoute.Sitemap = Object.keys(HUB_CONFIG).map((slug) => ({
      url: `${SITE_URL}/hub/${slug}`,
      lastModified: maxComparisonDate,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    const guidePages: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}/guides`,
        lastModified: "2026-07-11",
        changeFrequency: "weekly" as const,
        priority: 0.85,
      },
      ...Object.keys(GUIDE_CONFIG).map((slug) => ({
        url: `${SITE_URL}/guides/${slug}`,
        lastModified: "2026-07-11",
        changeFrequency: "weekly" as const,
        priority: 0.88,
      })),
    ];

    const staticBestSlugs = new Set(Object.keys(BEST_CONFIG));
    const bestPages: MetadataRoute.Sitemap = Object.keys(BEST_CONFIG).map((slug) => ({
      url: `${SITE_URL}/best/${slug}`,
      lastModified: COMPARISONS_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    try {
      const prisma = getPrisma();
      if (prisma) {
        const dbBestPages = await prisma.bestPage.findMany({
          where: { status: "published" },
          select: { slug: true, updatedAt: true },
        });
        for (const page of dbBestPages) {
          if (!staticBestSlugs.has(page.slug)) {
            bestPages.push({
              url: `${SITE_URL}/best/${page.slug}`,
              lastModified: page.updatedAt,
              changeFrequency: "weekly" as const,
              priority: 0.85,
            });
          }
        }
      }
    } catch {
      // DB unavailable — static pages already included
    }

    return [...staticPages, ...categoryPages, ...subcategoryPages, ...hubPages, ...guidePages, ...bestPages];
  }

  // ── Sitemap 1: Comparison pages ──
  // Uses a direct Prisma query (not getAllSitemapData) so we can select entity
  // names for OG image URL construction. Next.js 15 supports `images: string[]`
  // on sitemap entries, which tells Google Images / AI visual crawlers the
  // primary image for each comparison without requiring a separate image sitemap
  // fetch. The dedicated /sitemap/images.xml remains in the index for crawlers
  // that process image sitemaps independently.
  if (numId === 1) {
    try {
      const prisma = getPrisma();
      if (!prisma) return [];

      // DAN-2067: canonicalComparisonWhere, not `status: "published"` — 22 published
      // rows are redirect sources that 308 at the edge, and we were submitting them
      // to Google as pages.
      const rows = await prisma.comparison.findMany({
        where: canonicalComparisonWhere(),
        select: {
          slug: true,
          title: true,
          category: true,
          updatedAt: true,
          entities: {
            select: {
              position: true,
              entity: { select: { name: true } },
            },
            orderBy: { position: "asc" },
            take: 2,
          },
        },
        orderBy: { viewCount: "desc" },
        take: MAX_URLS_PER_SITEMAP,
      });

      return rows
        .filter((row) => isCleanSlug(row.slug) && !isDegenerateComparisonSlug(row.slug))
        .map((row) => {
          const entityA = row.entities[0]?.entity.name ?? "";
          const entityB = row.entities[1]?.entity.name ?? entityA;
          const imageUrl = comparisonOgImageUrl(row.title, entityA, entityB, row.category ?? "");
          return {
            url: `${SITE_URL}/compare/${row.slug}`,
            lastModified: row.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.9,
            images: [imageUrl],
          };
        });
    } catch {
      return [];
    }
  }

  // ── Sitemap 2: Entity + Alternatives pages ──
  // Uses a direct Prisma query so entity names are available for OG image URL
  // construction. Entity OG images (/api/og?title={name}&type=entity) are added
  // to entity entries; alternatives entries share the same entity OG image since
  // the page is visually "Alternatives to {entity}".
  if (numId === 2) {
    try {
      const prisma = getPrisma();
      if (!prisma) return [];

      const entities = await prisma.entity.findMany({
        select: { slug: true, name: true, updatedAt: true },
        orderBy: { id: "asc" },
        take: MAX_URLS_PER_SITEMAP,
      });

      const entityPages: MetadataRoute.Sitemap = entities.map((e) => ({
        url: `${SITE_URL}/entity/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        images: [`${SITE_URL}/api/og?title=${encodeURIComponent(e.name)}&type=entity`],
      }));

      const alternativesPages: MetadataRoute.Sitemap = entities.map((e) => ({
        url: `${SITE_URL}/alternatives/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        images: [`${SITE_URL}/api/og?title=${encodeURIComponent(e.name)}&type=entity`],
      }));

      return [...entityPages, ...alternativesPages].slice(0, MAX_URLS_PER_SITEMAP);
    } catch {
      return [];
    }
  }

  // ── Sitemap 3: Blog pages ──
  if (numId === 3) {
    let maxBlogDate = "2026-06-01";
    try {
      const prisma = getPrisma();
      if (prisma) {
        const latest = await prisma.blogArticle.findFirst({
          where: { status: "published" },
          select: { updatedAt: true },
          orderBy: { updatedAt: "desc" },
        });
        if (latest) maxBlogDate = latest.updatedAt.toISOString();
      }
    } catch {
      // fall back to fixed date
    }

    const blogListPage: MetadataRoute.Sitemap = [
      { url: `${SITE_URL}/blog`, lastModified: maxBlogDate, changeFrequency: "daily", priority: 0.8 },
    ];

    let blogArticlePages: MetadataRoute.Sitemap = [];
    try {
      const { articles } = await listBlogArticles({ limit: MAX_URLS_PER_SITEMAP, status: "published" });
      blogArticlePages = articles.map((article) => ({
        url: `${SITE_URL}/blog/${article.slug}`,
        lastModified: article.updatedAt
          ? new Date(article.updatedAt).toISOString()
          : article.publishedAt
            ? new Date(article.publishedAt).toISOString()
            : article.createdAt
              ? new Date(article.createdAt).toISOString()
              : maxBlogDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        images: [`${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`],
      }));
    } catch {
      // Blog articles unavailable — skip
    }

    return [...blogListPage, ...blogArticlePages];
  }

  // ── Sitemap 4: Review pages ──
  if (numId === 4) {
    let maxReviewDate = "2026-06-01";
    try {
      const prisma = getPrisma();
      if (prisma) {
        const latest = await prisma.reviewAggregation.findFirst({
          select: { lastAggregatedAt: true },
          orderBy: { lastAggregatedAt: "desc" },
        });
        if (latest) maxReviewDate = latest.lastAggregatedAt.toISOString();
      }
    } catch {
      // fall back to fixed date
    }

    let reviewCategoryPages: MetadataRoute.Sitemap = [];
    try {
      const reviewCats = await getReviewCategories();
      reviewCategoryPages = reviewCats.map((cat) => ({
        url: `${SITE_URL}/reviews/category/${cat.slug}`,
        lastModified: maxReviewDate,
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
          : maxReviewDate,
        changeFrequency: "weekly" as const,
        priority: 0.75,
        images: [`${SITE_URL}/api/og?title=${encodeURIComponent(entity.name)}&type=review`],
      }));
    } catch {
      // Review entities unavailable — skip
    }

    return [...reviewCategoryPages, ...reviewEntityPages];
  }

  return [];
}

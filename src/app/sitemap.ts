import type { MetadataRoute } from "next";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
import { CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { getReviewCategories, getReviewedEntities } from "@/lib/services/review-service";

const SITE_URL = "https://www.aversusb.net";

/**
 * Sitemap index IDs:
 *   0 = static + category pages
 *   1 = comparison pages
 *   2 = entity + alternatives pages
 *   3 = blog pages
 *   4 = review pages
 */
const SITEMAP_IDS = [0, 1, 2, 3, 4];

export async function generateSitemaps() {
  return SITEMAP_IDS.map((id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  switch (id) {
    case 0:
      return buildStaticAndCategoryPages(now);
    case 1:
      return buildComparisonPages(now);
    case 2:
      return buildEntityAndAlternativesPages(now);
    case 3:
      return buildBlogPages(now);
    case 4:
      return buildReviewPages(now);
    default:
      return [];
  }
}

function buildStaticAndCategoryPages(now: string): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/partnerships`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/developers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/feed`, lastModified: now, changeFrequency: "daily", priority: 0.3 },
    { url: `${SITE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) => [
    {
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ]);

  const subcategoryPages: MetadataRoute.Sitemap = Object.entries(CATEGORY_SUBCATEGORIES).flatMap(
    ([catSlug, subs]) =>
      subs.map((sub) => ({
        url: `${SITE_URL}/category/${catSlug}/${sub.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }))
  );

  return [...staticPages, ...categoryPages, ...subcategoryPages];
}

function buildComparisonPages(now: string): MetadataRoute.Sitemap {
  const slugs = getAllMockSlugs();
  return slugs.map((slug) => {
    const comp = getMockComparison(slug);
    return {
      url: `${SITE_URL}/compare/${slug}`,
      lastModified: comp?.metadata?.updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });
}

function buildEntityAndAlternativesPages(now: string): MetadataRoute.Sitemap {
  const slugs = getAllMockSlugs();
  const entityData = new Map<string, string>();
  for (const slug of slugs) {
    const comp = getMockComparison(slug);
    if (comp) {
      const compUpdated = comp.metadata?.updatedAt || now;
      comp.entities.forEach((e) => {
        const existing = entityData.get(e.slug);
        if (!existing || compUpdated > existing) {
          entityData.set(e.slug, compUpdated);
        }
      });
    }
  }

  const entityPages: MetadataRoute.Sitemap = Array.from(entityData.entries()).map(
    ([slug, updatedAt]) => ({
      url: `${SITE_URL}/entity/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const alternativesPages: MetadataRoute.Sitemap = Array.from(entityData.entries()).map(
    ([slug, updatedAt]) => ({
      url: `${SITE_URL}/alternatives/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...entityPages, ...alternativesPages];
}

async function buildBlogPages(now: string): Promise<MetadataRoute.Sitemap> {
  const blogListPage: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  let blogArticlePages: MetadataRoute.Sitemap = [];
  try {
    const { articles } = await listBlogArticles({ limit: 1000, status: "published" });
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

async function buildReviewPages(now: string): Promise<MetadataRoute.Sitemap> {
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
    const { entities: reviewedEntities } = await getReviewedEntities({ limit: 1000 });
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

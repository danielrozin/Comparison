import type { MetadataRoute } from "next";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
import { CATEGORIES, PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";
import { listBlogArticles } from "@/lib/services/blog-generator";

const SITE_URL = "https://www.aversusb.net";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Subcategory pages (products)
  const subcategoryPages: MetadataRoute.Sitemap = PRODUCT_SUBCATEGORIES.map((sub) => ({
    url: `${SITE_URL}/category/products/${sub.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Comparison pages (highest value)
  const slugs = getAllMockSlugs();
  const comparisonPages: MetadataRoute.Sitemap = slugs.map((slug) => {
    const comp = getMockComparison(slug);
    return {
      url: `${SITE_URL}/compare/${slug}`,
      lastModified: comp?.metadata?.updatedAt || now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });

  // Entity pages
  const entitySlugs = new Set<string>();
  for (const slug of slugs) {
    const comp = getMockComparison(slug);
    if (comp) comp.entities.forEach((e) => entitySlugs.add(e.slug));
  }
  const entityPages: MetadataRoute.Sitemap = Array.from(entitySlugs).map((slug) => ({
    url: `${SITE_URL}/entity/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Alternatives pages
  const alternativesPages: MetadataRoute.Sitemap = Array.from(entitySlugs).map((slug) => ({
    url: `${SITE_URL}/alternatives/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Blog pages
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

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...comparisonPages,
    ...entityPages,
    ...alternativesPages,
    ...blogListPage,
    ...blogArticlePages,
  ];
}

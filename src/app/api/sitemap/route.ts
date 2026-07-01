import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";

// GET /api/sitemap
// Returns a JSON sitemap (DataFeed JSON-LD) of all published content.
//
// Query parameters:
//   type      — "comparisons" (default) | "blog" | "all"
//   category  — filter by category (comparisons/blog only)
//   limit     — max results (default 500, max 2000)
//   offset    — pagination offset
//   format    — "json" (default) | "urlset" (flat URL list only)
//
// AI crawlers that prefer JSON over XML can use this as a machine-readable
// alternative to sitemap.xml.

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? "comparisons";
  const category = searchParams.get("category") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "500", 10), 2000);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const format = searchParams.get("format") ?? "json";

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Blog sitemap
  if (type === "blog") {
    const [total, articles] = await Promise.all([
      prisma.blogArticle.count({
        where: { status: "published", ...(category ? { category } : {}) },
      }),
      prisma.blogArticle.findMany({
        where: { status: "published", ...(category ? { category } : {}) },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          tags: true,
          publishedAt: true,
          updatedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    const hasMore = offset + limit < total;
    const urls = articles.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      tags: a.tags,
      lastmod: a.updatedAt ?? a.publishedAt,
      priority: 0.7,
      changefreq: "weekly",
      jsonUrl: `${SITE_URL}/api/blog/${a.slug}`,
    }));

    if (format === "urlset") {
      return NextResponse.json(
        { total, limit, offset, hasMore, urls: urls.map((u) => u.url) },
        { headers: HEADERS }
      );
    }

    return NextResponse.json(
      {
        "@context": "https://schema.org",
        "@type": "DataFeed",
        name: "A Versus B — Blog Articles",
        url: `${SITE_URL}/api/sitemap?type=blog`,
        description: "JSON sitemap of all published blog articles on aversusb.net",
        license: "https://creativecommons.org/licenses/by/4.0/",
        total,
        limit,
        offset,
        hasMore,
        nextUrl: hasMore
          ? `${SITE_URL}/api/sitemap?type=blog&limit=${limit}&offset=${offset + limit}${category ? `&category=${category}` : ""}`
          : null,
        urls,
      },
      { headers: HEADERS }
    );
  }

  // Comparisons sitemap (default)
  const [total, comparisons] = await Promise.all([
    prisma.comparison.count({
      where: { status: "published", ...(category ? { category } : {}) },
    }),
    prisma.comparison.findMany({
      where: { status: "published", ...(category ? { category } : {}) },
      select: {
        slug: true,
        title: true,
        category: true,
        shortAnswer: true,
        updatedAt: true,
        publishedAt: true,
        viewCount: true,
      },
      orderBy: { viewCount: "desc" },
      take: limit,
      skip: offset,
    }),
  ]);

  const hasMore = offset + limit < total;

  const urls = comparisons.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug}`,
    slug: c.slug,
    title: c.title,
    category: c.category,
    shortAnswer: c.shortAnswer,
    lastmod: c.updatedAt ?? c.publishedAt,
    priority: 0.8,
    changefreq: "monthly",
    knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${c.slug}`,
    faqUrl: `${SITE_URL}/api/faq/${c.slug}`,
    answerUrl: `${SITE_URL}/api/answer/${c.slug}`,
  }));

  if (format === "urlset") {
    return NextResponse.json(
      { total, limit, offset, hasMore, urls: urls.map((u) => u.url) },
      { headers: HEADERS }
    );
  }

  return NextResponse.json(
    {
      "@context": "https://schema.org",
      "@type": "DataFeed",
      name: "A Versus B — Comparison Pages",
      url: `${SITE_URL}/api/sitemap`,
      description: "JSON sitemap of all published comparison pages on aversusb.net",
      license: "https://creativecommons.org/licenses/by/4.0/",
      total,
      limit,
      offset,
      hasMore,
      nextUrl: hasMore
        ? `${SITE_URL}/api/sitemap?limit=${limit}&offset=${offset + limit}${category ? `&category=${category}` : ""}`
        : null,
      types: {
        comparisons: `${SITE_URL}/api/sitemap?type=comparisons`,
        blog: `${SITE_URL}/api/sitemap?type=blog`,
      },
      urls,
    },
    { headers: HEADERS }
  );
}

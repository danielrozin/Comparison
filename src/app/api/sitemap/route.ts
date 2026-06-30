import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";

// GET /api/sitemap
// Returns a JSON sitemap of all published comparison pages.
// AI crawlers that prefer JSON over XML sitemap parsing can use this.
// Supports ?category filter, ?limit (default 500, max 2000), ?offset, ?format=urlset.

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
  const category = searchParams.get("category") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "500", 10), 2000);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const format = searchParams.get("format") ?? "json";

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

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
      urls,
    },
    { headers: HEADERS }
  );
}

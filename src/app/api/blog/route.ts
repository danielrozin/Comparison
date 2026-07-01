import { NextRequest, NextResponse } from "next/server";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20", 10));
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const status = searchParams.get("status") || "published";
  const format = searchParams.get("format") || "json";

  const result = await listBlogArticles({ category, limit, offset, status });

  const articles = (result.articles ?? []).map((a) => ({
    ...a,
    url: `${SITE_URL}/blog/${a.slug}`,
    jsonUrl: `${SITE_URL}/api/blog/${a.slug}`,
  }));

  const total = result.total ?? articles.length;
  const hasMore = offset + limit < total;

  if (format === "urlset") {
    return NextResponse.json(
      { total, limit, offset, hasMore, urls: articles.map((a) => a.url) },
      { headers: HEADERS }
    );
  }

  // DataFeed JSON-LD — consistent with /api/sitemap for AI crawlers
  const dataFeed = {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    "@id": `${SITE_URL}/api/blog#datafeed`,
    name: `${SITE_NAME} Blog Articles`,
    description: "Published blog articles on aversusb.net covering comparison guides, product analysis, and decision-making research.",
    url: `${SITE_URL}/api/blog`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    dataFeedElement: articles.map((a) => ({
      "@type": "DataFeedItem",
      item: {
        "@type": "BlogPosting",
        "@id": `${a.url}#article`,
        headline: a.title,
        description: a.excerpt,
        url: a.url,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        articleSection: a.category,
        keywords: Array.isArray(a.tags) ? a.tags.join(", ") : undefined,
      },
    })),
  };

  return NextResponse.json(
    {
      total,
      limit,
      offset,
      hasMore,
      nextUrl: hasMore
        ? `${SITE_URL}/api/blog?limit=${limit}&offset=${offset + limit}${category ? `&category=${category}` : ""}`
        : null,
      articles,
      dataFeed,
    },
    { headers: HEADERS }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_URL } from "@/lib/utils/constants";

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

  const result = await listBlogArticles({ category, limit, offset, status });

  // Enrich with URLs for AI crawlers
  const enriched = {
    ...result,
    articles: (result.articles ?? []).map((a) => ({
      ...a,
      url: `${SITE_URL}/blog/${a.slug}`,
      jsonUrl: `${SITE_URL}/api/blog/${a.slug}`,
    })),
  };

  return NextResponse.json(enriched, { headers: HEADERS });
}

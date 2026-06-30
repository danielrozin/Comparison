/**
 * Google News Sitemap — /sitemap/news.xml
 *
 * Serves the Google News extension namespace for blog articles published in
 * the last 2 days (Google News only indexes content within 48 hours of
 * publication; older articles should stay in the standard sitemap).
 *
 * This sitemap enables:
 *  1. Google News inclusion — drives traffic from the News tab and Discover feed
 *  2. AI news aggregators — Apple News, Yahoo News, Bing News follow news sitemaps
 *  3. Perplexity & ChatGPT news indexing — both crawl Google News sitemaps as a
 *     signal for what's "recent" and citeable in time-sensitive queries
 *
 * Format: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemaps
 */

import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_URL } from "@/lib/utils/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // rebuild hourly — new articles need fast indexing

const PUBLICATION_NAME = "A Versus B";
const PUBLICATION_LANGUAGE = "en";

// Google News only indexes articles from the last 2 days
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const cutoff = new Date(Date.now() - TWO_DAYS_MS);

  // Fetch recent articles — only the past 2 days qualify for Google News
  const { articles } = await listBlogArticles({ status: "published", limit: 200, offset: 0 });

  const recentArticles = articles.filter((a) => {
    if (!a.publishedAt) return false;
    return new Date(a.publishedAt) >= cutoff;
  });

  // If no recent articles, emit an empty but valid sitemap
  const urlEntries = recentArticles.map((article) => {
    const pubDate = new Date(article.publishedAt!).toISOString();
    const title = escapeXml(article.title);
    const url = `${SITE_URL}/blog/${article.slug}`;
    const keywords = (article.tags ?? []).slice(0, 10).join(", ");

    return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      ${keywords ? `<news:keywords>${escapeXml(keywords)}</news:keywords>` : ""}
    </news:news>
    <image:image>
      <image:loc>${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&amp;type=blog</image:loc>
      <image:title>${title}</image:title>
    </image:image>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urlEntries.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}

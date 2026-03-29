import { NextResponse } from "next/server";
import { listBlogArticles, BlogArticle } from "@/lib/services/blog-generator";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRFC822(date: Date | string): string {
  return new Date(date).toUTCString();
}

function buildBlogItem(article: BlogArticle): string {
  const pubDate = article.publishedAt || article.createdAt || new Date().toISOString();
  const url = `${SITE_URL}/blog/${article.slug}`;
  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.excerpt || article.metaDescription || "")}</description>
      <pubDate>${toRFC822(pubDate)}</pubDate>
      <category>${escapeXml(article.category || "general")}</category>
    </item>`;
}

function buildComparisonItem(slug: string): string | null {
  const comp = getMockComparison(slug);
  if (!comp) return null;
  const url = `${SITE_URL}/compare/${slug}`;
  const pubDate = comp.metadata?.publishedAt || comp.metadata?.updatedAt || new Date().toISOString();
  const description = comp.shortAnswer || comp.verdict || `Compare ${comp.entities.map((e) => e.name).join(" vs ")}`;
  return `    <item>
      <title>${escapeXml(comp.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRFC822(pubDate)}</pubDate>
      <category>${escapeXml(comp.category || "general")}</category>
    </item>`;
}

export async function GET() {
  const items: string[] = [];

  // Blog articles
  try {
    const { articles } = await listBlogArticles({ limit: 50, status: "published" });
    for (const article of articles) {
      items.push(buildBlogItem(article));
    }
  } catch {
    // Blog unavailable — skip
  }

  // Recent comparisons (limit to 50 most recent)
  const slugs = getAllMockSlugs();
  const comparisons = slugs
    .map((slug) => {
      const comp = getMockComparison(slug);
      return comp ? { slug, updatedAt: comp.metadata?.updatedAt || "2024-01-01" } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime())
    .slice(0, 50);

  for (const entry of comparisons) {
    const item = buildComparisonItem(entry!.slug);
    if (item) items.push(item);
  }

  const now = toRFC822(new Date());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Compare Anything</title>
    <link>${SITE_URL}</link>
    <description>The latest comparisons, blog articles, and analysis from ${escapeXml(SITE_NAME)}.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
${items.join("\n")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

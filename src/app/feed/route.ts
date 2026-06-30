import { NextResponse } from "next/server";
import { listBlogArticles, BlogArticle } from "@/lib/services/blog-generator";
import { getRecentComparisonsForFeed } from "@/lib/services/comparison-service";
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
  const excerpt = article.excerpt || article.metaDescription || "";
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`;
  return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(excerpt)}</description>
      <pubDate>${toRFC822(pubDate)}</pubDate>
      <category>${escapeXml(article.category || "general")}</category>
      <dc:creator>${escapeXml(SITE_NAME)} Editorial Team</dc:creator>
      <content:encoded><![CDATA[<p>${escapeXml(excerpt)}</p><p><a href="${url}">Read the full article →</a></p>]]></content:encoded>
      <media:content url="${escapeXml(ogImage)}" medium="image" type="image/png" width="1200" height="630"/>
      <media:thumbnail url="${escapeXml(ogImage)}" width="600" height="315"/>
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

  // Recent comparisons from DB + mock (50 most recent)
  const comparisons = await getRecentComparisonsForFeed(50);
  for (const comp of comparisons) {
    const url = `${SITE_URL}/compare/${comp.slug}`;
    const description = comp.shortAnswer || `Compare ${comp.title} side by side with expert verdicts, key differences, and community votes.`;
    // Derive entity names from slug for the OG image URL
    const vsParts = comp.slug.split("-vs-");
    const entityA = vsParts[0]?.replace(/-/g, " ") ?? comp.slug;
    const entityB = vsParts[1]?.replace(/-/g, " ") ?? "";
    const ogImage = entityB
      ? `${SITE_URL}/api/og?a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&type=comparison`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(comp.title)}&type=home`;
    items.push(`    <item>
      <title>${escapeXml(comp.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRFC822(comp.updatedAt)}</pubDate>
      <category>${escapeXml(comp.category)}</category>
      <dc:creator>${escapeXml(SITE_NAME)} Editorial Team</dc:creator>
      <content:encoded><![CDATA[<p>${description}</p><p><a href="${url}">Read the full comparison →</a></p>]]></content:encoded>
      <media:content url="${escapeXml(ogImage)}" medium="image" type="image/png" width="1200" height="630"/>
      <media:thumbnail url="${escapeXml(ogImage)}" width="600" height="315"/>
    </item>`);
  }

  const now = toRFC822(new Date());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Compare Anything</title>
    <link>${SITE_URL}</link>
    <description>The latest comparisons, blog articles, and analysis from ${escapeXml(SITE_NAME)}. 2,900+ data-driven comparisons across sports, technology, products, software, automotive, health, finance, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml"/>
    <atom:link href="${SITE_URL}/feed" rel="alternate" type="application/rss+xml" title="${escapeXml(SITE_NAME)} Feed"/>
    <managingEditor>daniarozin@gmail.com (${escapeXml(SITE_NAME)} Editorial Team)</managingEditor>
    <webMaster>daniarozin@gmail.com (${escapeXml(SITE_NAME)})</webMaster>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}. Licensed under CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/</copyright>
    <ttl>60</ttl>
    <dc:creator>${escapeXml(SITE_NAME)} Editorial Team</dc:creator>
    <dc:publisher>${escapeXml(SITE_NAME)}</dc:publisher>
    <dc:rights>CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/</dc:rights>
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
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

/**
 * Atom 1.0 feed — /feed/atom
 *
 * Atom 1.0 (RFC 4287) is the W3C-blessed feed format preferred by:
 *   - Google Discover (uses <updated> for freshness ranking)
 *   - AI training pipelines (cleaner XML namespace than RSS)
 *   - Academic/research crawlers (Planet aggregators, etc.)
 *   - Feed readers that require strict XML (Vienna, NetNewsWire)
 *
 * Advantages over the existing RSS /feed:
 *   - <updated> per-entry (ISO 8601) gives indexers a precise freshness signal
 *   - <author> element supports <uri> (links to entity page, useful for AI attribution)
 *   - <link rel="alternate"> and <link rel="self"> are first-class in spec
 *   - <rights> element (CC BY 4.0) is consumed by CommonCrawl license filters
 *   - <category term> supports URI-based taxonomies (Schema.org terms)
 */

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

function toISO(date: Date | string | null | undefined): string {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

function buildBlogEntry(article: BlogArticle): string {
  const pubDate = toISO(article.publishedAt || article.createdAt);
  const updatedDate = toISO(article.updatedAt || article.publishedAt || article.createdAt);
  const url = `${SITE_URL}/blog/${article.slug}`;
  const summary = escapeXml(article.excerpt || article.metaDescription || "");
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`;
  const category = article.category || "general";

  return `  <entry>
    <id>${url}</id>
    <title type="html">${escapeXml(article.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <link rel="enclosure" type="image/png" href="${escapeXml(ogImage)}" title="${escapeXml(article.title)}"/>
    <published>${pubDate}</published>
    <updated>${updatedDate}</updated>
    <author>
      <name>${escapeXml(SITE_NAME)} Editorial Team</name>
      <uri>${SITE_URL}/about</uri>
    </author>
    <category term="${escapeXml(category)}" scheme="${SITE_URL}/category/" label="${escapeXml(category)}"/>
    <summary type="html">${summary}</summary>
    <content type="html"><![CDATA[<p>${summary}</p><p><a href="${url}">Read the full article →</a></p>]]></content>
    <rights>CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/</rights>
  </entry>`;
}

export async function GET() {
  const entries: string[] = [];

  // Blog articles
  try {
    const { articles } = await listBlogArticles({ limit: 50, status: "published" });
    for (const article of articles) {
      entries.push(buildBlogEntry(article));
    }
  } catch {
    // Blog unavailable — skip
  }

  // Recent comparisons
  const comparisons = await getRecentComparisonsForFeed(50);
  for (const comp of comparisons) {
    const url = `${SITE_URL}/compare/${comp.slug}`;
    const description = comp.shortAnswer || `Compare ${comp.title} side by side with expert verdicts, key differences, and community votes.`;
    const vsParts = comp.slug.split("-vs-");
    const entityA = vsParts[0]?.replace(/-/g, " ") ?? comp.slug;
    const entityB = vsParts[1]?.replace(/-/g, " ") ?? "";
    const ogImage = entityB
      ? `${SITE_URL}/api/og?a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&type=comparison`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(comp.title)}&type=home`;

    entries.push(`  <entry>
    <id>${url}</id>
    <title type="html">${escapeXml(comp.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <link rel="enclosure" type="image/png" href="${escapeXml(ogImage)}" title="${escapeXml(comp.title)}"/>
    <published>${toISO(comp.updatedAt)}</published>
    <updated>${toISO(comp.updatedAt)}</updated>
    <author>
      <name>${escapeXml(SITE_NAME)} Editorial Team</name>
      <uri>${SITE_URL}/about</uri>
    </author>
    <category term="${escapeXml(comp.category)}" scheme="${SITE_URL}/category/" label="${escapeXml(comp.category)}"/>
    <summary type="html">${escapeXml(description)}</summary>
    <content type="html"><![CDATA[<p>${escapeXml(description)}</p><p><a href="${url}">Read the full comparison →</a></p>]]></content>
    <rights>CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/</rights>
  </entry>`);
  }

  const updatedNow = new Date().toISOString();

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
      xmlns:media="http://search.yahoo.com/mrss/">
  <id>${SITE_URL}/feed/atom</id>
  <title type="html">${escapeXml(SITE_NAME)} — Compare Anything</title>
  <subtitle>The latest comparisons and analysis from ${escapeXml(SITE_NAME)}. 2,900+ data-driven comparisons across sports, technology, products, software, countries, and more.</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}/feed/atom"/>
  <link rel="alternate" type="text/html" href="${SITE_URL}"/>
  <link rel="alternate" type="application/rss+xml" href="${SITE_URL}/feed" title="${escapeXml(SITE_NAME)} RSS Feed"/>
  <updated>${updatedNow}</updated>
  <author>
    <name>${escapeXml(SITE_NAME)} Editorial Team</name>
    <uri>${SITE_URL}/about</uri>
    <email>daniarozin@gmail.com</email>
  </author>
  <rights>© ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}. Licensed under CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/</rights>
  <generator uri="${SITE_URL}" version="1.0">${escapeXml(SITE_NAME)}</generator>
  <icon>${SITE_URL}/favicon.ico</icon>
  <logo>${SITE_URL}/icon.png</logo>
${entries.join("\n")}
</feed>`;

  return new NextResponse(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

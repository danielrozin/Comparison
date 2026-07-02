import { NextResponse } from "next/server";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { getRecentComparisonsForFeed } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /feed/json — JSON Feed 1.1 (https://jsonfeed.org/version/1.1)
//
// JSON Feed is machine-readable in a way XML RSS/Atom are not — no escaping, no parsing
// overhead, natively typed fields. AI aggregators, podcast apps, and many modern
// readers prefer JSON Feed over RSS/Atom for subscription and change detection.
//
// Includes both blog articles AND recent comparison pages in a single feed.
// Each item carries:
//   - id: canonical URL (stable GUID)
//   - url: canonical URL
//   - external_url: comparison JSON API URL (for comparisons)
//   - title, summary, date_published, date_modified
//   - tags (all items have _comparison or _blog extension)
//
// Discoverable via:
//   - <link rel="alternate" type="application/feed+json"> in layout.tsx
//   - /api/context discovery.json_feed
//   - /llms.txt api_endpoints section

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const [blogResult, comparisons] = await Promise.all([
    listBlogArticles({ limit: 30, status: "published" }).catch(() => ({ articles: [], total: 0 })),
    getRecentComparisonsForFeed(30).catch(() => []),
  ]);
  const articles = blogResult.articles;

  const now = new Date().toISOString();

  const blogItems = articles.map((article) => {
    const url = `${SITE_URL}/blog/${article.slug}`;
    const pubDate = article.publishedAt ? new Date(article.publishedAt).toISOString() : now;
    const updDate = article.updatedAt ? new Date(article.updatedAt).toISOString() : pubDate;
    return {
      id: url,
      url,
      title: article.title,
      summary: article.excerpt || article.metaDescription || undefined,
      date_published: pubDate,
      date_modified: updDate,
      authors: [{ name: `${SITE_NAME} Editorial Team`, url: `${SITE_URL}/about` }],
      tags: ["blog", ...(article.category ? [article.category] : []), ...(article.tags?.slice(0, 5) ?? [])],
      image: `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`,
      _comparison: false,
      _blog: true,
      _api: { json: `${SITE_URL}/api/blog/${article.slug}` },
    };
  });

  const comparisonItems = comparisons.map((c) => {
    const url = `${SITE_URL}/compare/${c.slug}`;
    const updDate = c.updatedAt ? new Date(c.updatedAt).toISOString() : now;
    const pubDate = updDate;
    return {
      id: url,
      url,
      external_url: `${SITE_URL}/api/answer/${c.slug}`,
      title: c.title,
      summary: c.shortAnswer || undefined,
      date_published: pubDate,
      date_modified: updDate,
      authors: [{ name: `${SITE_NAME} Editorial Team`, url: `${SITE_URL}/about` }],
      tags: ["comparison", ...(c.category ? [c.category] : [])],
      image: `${SITE_URL}/api/og?title=${encodeURIComponent(c.title)}&type=comparison`,
      _comparison: true,
      _blog: false,
      _api: {
        json: `${SITE_URL}/api/comparisons/${c.slug}`,
        answer: `${SITE_URL}/api/answer/${c.slug}`,
        jsonld: `${SITE_URL}/api/v1/schema/${c.slug}`,
        faq: `${SITE_URL}/api/faq/${c.slug}`,
      },
    };
  });

  // Interleave and sort all items by date_modified desc
  const allItems = [...blogItems, ...comparisonItems].sort(
    (a, b) => new Date(b.date_modified).getTime() - new Date(a.date_modified).getTime()
  );

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed/json`,
    description: "Latest comparisons and blog articles from A Versus B — the structured comparison platform.",
    icon: `${SITE_URL}/icon-512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    language: "en-US",
    authors: [
      { name: `${SITE_NAME} Editorial Team`, url: `${SITE_URL}/about` },
    ],
    // _api_catalog — JSON Feed extension: lets AI tools discover the broader API
    _api_catalog: `${SITE_URL}/api/context`,
    _llms_txt: `${SITE_URL}/llms.txt`,
    _mcp_manifest: `${SITE_URL}/.well-known/mcp.json`,
    items: allItems,
  };

  return NextResponse.json(feed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "all",
      "Link": `<${SITE_URL}/feed>; rel="alternate"; type="application/rss+xml", <${SITE_URL}/feed/atom>; rel="alternate"; type="application/atom+xml"`,
    },
  });
}

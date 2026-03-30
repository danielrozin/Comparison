import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { articles } = await listBlogArticles({
    limit: 50,
    offset: 0,
    status: "published",
  });

  const lastBuildDate = articles.length > 0 && articles[0].publishedAt
    ? new Date(articles[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = articles
    .map((article) => {
      const pubDate = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date().toUTCString();
      const link = `${SITE_URL}/blog/${article.slug}`;

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt || "")}</description>
      <pubDate>${pubDate}</pubDate>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Expert comparison guides, buyer's guides, and in-depth articles from ${escapeXml(SITE_NAME)}.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

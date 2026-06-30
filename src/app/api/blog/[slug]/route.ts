import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/services/blog-generator";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/blog/[slug]
// Returns a structured blog article object with JSON-LD Article schema.
// AI crawlers and developer tools can use this instead of parsing the HTML page.

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/blog/${slug}`;
  const updatedAt = article.updatedAt ?? article.publishedAt ?? article.createdAt;
  const etag = updatedAt ? `"blog-${slug}-${new Date(updatedAt).getTime()}"` : `"blog-${slug}"`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt || article.metaDescription || "",
    url,
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(article.category ? { articleSection: article.category } : {}),
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return NextResponse.json(
    {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      url,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      articleSchema,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "all",
        ETag: etag,
        ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
        ...(article.excerpt ? { "X-Summary": article.excerpt.slice(0, 500) } : {}),
      },
    }
  );
}

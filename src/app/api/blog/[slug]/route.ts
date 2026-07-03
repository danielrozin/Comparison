import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/services/blog-generator";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/blog/[slug]
// Returns a structured blog article object with JSON-LD Article schema.
// AI crawlers and developer tools can use this instead of parsing the HTML page.

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
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

  const wordCount = article.content
    ? article.content.trim().split(/\s+/).length
    : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt || article.metaDescription || "",
    // abstract = excerpt — the citation-ready TL;DR preferred by AI answer engines
    ...(article.excerpt ? { abstract: article.excerpt } : {}),
    url,
    datePublished: article.publishedAt ?? article.createdAt,
    dateCreated: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
    ...(article.category ? { articleSection: article.category } : {}),
    ...(wordCount ? { wordCount } : {}),
    license: "https://creativecommons.org/licenses/by/4.0/",
    // speakable — sections optimized for AI/voice reading extraction
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-excerpt", ".article-intro", "#article-summary"],
    },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    isAccessibleForFree: true,
  };

  const sharedHeaders = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "Access-Control-Allow-Origin": "*",
    "X-Robots-Tag": "all",
    // Vary: Accept prevents CDN from serving application/json to ld+json clients
    "Vary": "Accept",
    ETag: etag,
    ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
    ...(article.excerpt ? { "X-Summary": article.excerpt.slice(0, 500) } : {}),
    "X-Source": SITE_NAME,
    "X-Source-URL": url,
    "X-License": "CC BY 4.0",
    "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
    "X-Attribution": `According to ${SITE_NAME} (${url}), ...`,
  };

  // Content negotiation: return clean application/ld+json when explicitly requested
  // (e.g. from content-negotiation redirect /blog/{slug} → here with Accept: ld+json)
  const acceptHeader = request.headers.get("accept") ?? "";
  const primaryAccept = acceptHeader.split(",")[0]?.trim().split(";")[0]?.trim() ?? "";
  if (primaryAccept === "application/ld+json") {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [articleSchema],
    };
    return new Response(JSON.stringify(jsonLd, null, 2), {
      headers: {
        ...sharedHeaders,
        "Content-Type": "application/ld+json",
        "Link": `<${url}>; rel="canonical"`,
      },
    });
  }

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
    { headers: sharedHeaders }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug, searchComparisons } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/compare?a={entityA}&b={entityB}
//
// AI tool-calling endpoint: given two entity names or slugs, returns the comparison
// if it exists, or a lookup URL + suggestions if it doesn't.
//
// Use cases:
//   - AI assistant answering "ChatGPT vs Claude" → GET /api/v1/compare?a=chatgpt&b=claude
//   - AI agent looking up "{entity} vs {entity2}" queries
//   - Zero-shot comparison lookup for tool-calling AI models
//
// Returns:
//   - found: boolean
//   - comparison: the comparison data (if found)
//   - comparisonUrl: canonical page URL
//   - answer: shortAnswer for immediate citation (if found)
//   - slug: the slug if found
//   - suggestions: top search results if not found exactly

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const a = searchParams.get("a") ?? "";
  const b = searchParams.get("b") ?? "";

  if (!a || !b) {
    return NextResponse.json(
      { error: "Both ?a and ?b parameters are required", example: "/api/v1/compare?a=chatgpt&b=claude" },
      { status: 400, headers: HEADERS }
    );
  }

  const aSlug = slugify(a);
  const bSlug = slugify(b);

  // Try both orderings of the slug
  const candidateSlugs = [
    `${aSlug}-vs-${bSlug}`,
    `${bSlug}-vs-${aSlug}`,
  ];

  let found = null;
  let foundSlug = null;

  for (const slug of candidateSlugs) {
    const comparison = await getComparisonBySlug(slug);
    if (comparison) {
      found = comparison;
      foundSlug = slug;
      break;
    }
  }

  if (found && foundSlug) {
    const comparisonUrl = `${SITE_URL}/compare/${foundSlug}`;
    const etag = `"compare-${foundSlug}-${found.metadata.updatedAt}"`;

    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
      return new Response(null, { status: 304, headers: { ETag: etag } });
    }

    const lookupSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${comparisonUrl}#webpage`,
      name: found.title,
      url: comparisonUrl,
      inLanguage: "en-US",
      dateModified: found.metadata.updatedAt,
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      license: "https://creativecommons.org/licenses/by/4.0/",
    };

    return NextResponse.json(
      {
        found: true,
        slug: foundSlug,
        title: found.title,
        comparisonUrl,
        answerUrl: `${SITE_URL}/api/answer/${foundSlug}`,
        schemaJsonLdUrl: `${SITE_URL}/api/v1/schema/${foundSlug}`,
        knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${foundSlug}`,
        faqUrl: `${SITE_URL}/api/faq/${foundSlug}`,
        answer: found.shortAnswer ?? null,
        verdict: found.verdict ?? null,
        keyDifferences: found.keyDifferences?.slice(0, 3) ?? [],
        faqs: (found.faqs ?? []).slice(0, 3).map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
        category: found.category,
        entities: found.entities.map((e) => ({
          name: e.name,
          slug: e.slug,
          url: `${SITE_URL}/entity/${e.slug}`,
          alternativesUrl: `${SITE_URL}/api/v1/alternatives/${e.slug}`,
        })),
        lookupSchema,
      },
      {
        headers: {
          ...HEADERS,
          ETag: etag,
          ...((found.shortAnswer || found.verdict)
            ? { "X-Summary": (found.shortAnswer || found.verdict!.slice(0, 250)).slice(0, 500) }
            : {}),
          "X-Source": SITE_NAME,
          "X-Source-URL": comparisonUrl,
          "X-License": "CC BY 4.0",
          "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
          "X-Attribution": `${SITE_NAME} (${comparisonUrl})`,
        },
      }
    );
  }

  // Not found — search for suggestions
  const query = `${a} vs ${b}`;
  const suggestions = await searchComparisons(query, 5);

  return NextResponse.json(
    {
      found: false,
      searchQuery: query,
      searchUrl: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
      suggestions: suggestions.map((s) => ({
        slug: s.slug,
        title: s.title,
        url: `${SITE_URL}/compare/${s.slug}`,
        answerUrl: `${SITE_URL}/api/answer/${s.slug}`,
        schemaJsonLdUrl: `${SITE_URL}/api/v1/schema/${s.slug}`,
      })),
      note: `No exact match found for "${a} vs ${b}". See suggestions or search at ${SITE_URL}/search`,
    },
    { headers: HEADERS }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { entitySchemaType } from "@/lib/seo/schema";

// GET /api/v1/schema/{slug}
//
// Pure JSON-LD endpoint — returns a clean Schema.org @graph document for a comparison.
// Content-Type is application/ld+json (not application/json) to satisfy:
//   - Semantic Web / Linked Data clients (e.g. Apache Jena, RDF4J, EasyRDF)
//   - AI crawlers doing content negotiation (Accept: application/ld+json)
//   - JSON-LD Playground and Schema.org validators
//
// Compare to /api/knowledge-graph/{slug}: that endpoint wraps the graph in extra
// metadata fields for developer convenience. This endpoint is the pure Linked Data
// representation — just a @context + @graph array, spec-compliant JSON-LD 1.1.
//
// Discoverable via:
//   - Link: <...>; rel="alternate"; type="application/ld+json" on /compare/* pages
//   - Redirect from /compare/{slug} when Accept: application/ld+json (middleware)
//   - /api/context → api_endpoints.schema_jsonld
//   - /api/openapi → GET /api/v1/schema/{slug}

export const dynamic = "force-dynamic";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Vary": "Accept",
  "X-Robots-Tag": "all",
  "X-Source": SITE_NAME,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return new Response(null, { status: 404, headers: HEADERS });

  const url = `${SITE_URL}/compare/${slug}`;
  const updatedAt = comparison.metadata?.updatedAt;
  const etag = updatedAt ? `"schema-${slug}-${new Date(updatedAt).getTime()}"` : `"schema-${slug}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(null, {
    status: 200,
    headers: {
      ...HEADERS,
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      ETag: etag,
      "X-Source-URL": url,
      "X-Attribution": `${SITE_NAME} (${url})`,
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      Link: `<${url}>; rel="canonical"`,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...HEADERS, "Content-Type": "application/json" },
    });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const updatedAt = comparison.metadata?.updatedAt;
  const publishedAt = comparison.metadata?.publishedAt;
  const etag = updatedAt ? `"schema-${slug}-${new Date(updatedAt).getTime()}"` : `"schema-${slug}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  // Build the @graph — core Schema.org types only, no extra non-standard fields
  const graph: object[] = [];

  // WebPage node
  graph.push({
    "@type": "WebPage",
    "@id": url,
    url,
    name: comparison.title,
    description: comparison.shortAnswer ?? comparison.verdict ?? comparison.title,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(publishedAt ? { dateCreated: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Compare", item: { "@type": "WebPage", "@id": `${SITE_URL}/compare`, name: "Compare", url: `${SITE_URL}/compare` } },
        { "@type": "ListItem", position: 3, name: comparison.title, item: { "@type": "WebPage", "@id": url, name: comparison.title, url } },
      ],
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#short-answer", "#verdict", "#key-differences"],
    },
  });

  // Article node
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&a=${encodeURIComponent(comparison.entities[0]?.name ?? "")}&b=${encodeURIComponent(comparison.entities[1]?.name ?? "")}&cat=${encodeURIComponent(comparison.category ?? "")}&type=comparison`;
  graph.push({
    "@type": ["Article", "TechArticle"],
    "@id": `${url}#article`,
    headline: comparison.title,
    ...(comparison.shortAnswer ? { abstract: comparison.shortAnswer } : {}),
    description: comparison.shortAnswer ?? comparison.title,
    url,
    inLanguage: "en-US",
    mainEntityOfPage: url,
    // image — required for Google article rich results; contentUrl is machine-readable.
    image: {
      "@type": "ImageObject",
      "@id": `${url}#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: `${comparison.title} — Side-by-side comparison on A Versus B`,
    },
    thumbnailUrl: ogImage,
    // contentReferenceTime — ISO 8601 "as of" date for the data in this article.
    ...(updatedAt ? { contentReferenceTime: updatedAt } : {}),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(publishedAt ? { dateCreated: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    ...(comparison.verdict ? { text: comparison.verdict } : {}),
    // genre — content classification for AI indexers and Google Discover carousels
    genre: comparison.category
      ? comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)
      : "Comparison",
    // potentialAction — ReadAction + CompareAction for AI router intent classification
    potentialAction: [
      { "@type": "ReadAction", target: url },
      {
        "@type": "Action",
        additionalType: "CompareAction",
        name: `Compare ${comparison.entities.map((e) => e.name).join(" vs ")}`,
        target: url,
        object: comparison.entities.map((e) => ({
          "@type": entitySchemaType(e.entityType),
          name: e.name,
          url: `${SITE_URL}/entity/${e.slug}`,
        })),
      },
    ],
    about: comparison.entities.map((e) => ({
      "@type": entitySchemaType(e.entityType),
      "@id": `${SITE_URL}/entity/${e.slug}#entity`,
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
      ...(e.shortDesc ? { description: e.shortDesc } : {}),
    })),
    ...(comparison.keyDifferences?.length
      ? {
          mentions: comparison.keyDifferences.map((kd) => ({
            "@type": "Thing",
            name: kd.label,
          })),
        }
      : {}),
  });

  // Entity nodes — typed via entitySchemaType() so AI product-search carousels and
  // knowledge-graph crawlers receive correctly typed entities (SoftwareApplication,
  // Person, Country, SportsTeam, etc.) rather than the generic Thing fallback.
  for (const entity of comparison.entities) {
    graph.push({
      "@type": entitySchemaType(entity.entityType),
      "@id": `${SITE_URL}/entity/${entity.slug}#entity`,
      name: entity.name,
      url: `${SITE_URL}/entity/${entity.slug}`,
      inLanguage: "en-US",
      ...(entity.shortDesc ? { description: entity.shortDesc } : {}),
      ...(entity.imageUrl ? {
        image: {
          "@type": "ImageObject",
          url: entity.imageUrl,
          contentUrl: entity.imageUrl,
          caption: entity.name,
        },
      } : {}),
      sameAs: [
        `https://en.wikipedia.org/wiki/${encodeURIComponent(entity.name.replace(/ /g, "_"))}`,
      ],
      subjectOf: { "@type": "Article", "@id": `${url}#article` },
    });
  }

  // Dataset node
  graph.push({
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: `${comparison.title} — Comparison Data`,
    description: `Structured comparison data for ${comparison.title} with ${comparison.attributes.length} attributes.`,
    url,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@id": `${SITE_URL}/#organization` },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/ld+json",
      contentUrl: `${SITE_URL}/api/v1/schema/${slug}`,
    },
    variableMeasured: comparison.attributes.map((a) => ({
      "@type": "PropertyValue",
      name: a.name,
    })),
  });

  // FAQPage node
  if (comparison.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      inLanguage: "en-US",
      mainEntity: comparison.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  // Organization node (publisher)
  graph.push({
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return new Response(JSON.stringify(jsonLd, null, 2), {
    status: 200,
    headers: {
      ...HEADERS,
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      ETag: etag,
      "X-Source-URL": url,
      "X-Attribution": `${SITE_NAME} (${url})`,
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      ...((comparison.shortAnswer || comparison.verdict)
        ? { "X-Summary": (comparison.shortAnswer || comparison.verdict!.slice(0, 250)).slice(0, 500) }
        : {}),
      Link: [
        `<${url}>; rel="canonical"`,
        `<${SITE_URL}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/json"`,
        `<${SITE_URL}/api/comparisons/${slug}>; rel="alternate"; type="application/json"`,
        `<${SITE_URL}/api/openapi>; rel="service-doc"; type="application/json"`,
        `<${SITE_URL}/api/sitemap>; rel="collection"; type="application/json"`,
      ].join(", "),
    },
  });
}

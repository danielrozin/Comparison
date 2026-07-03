import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

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
  "X-Source-URL": SITE_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `According to ${SITE_NAME} (${SITE_URL}), ...`,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return new Response(null, { status: 404, headers: HEADERS });

  const updatedAt = comparison.metadata?.updatedAt;
  return new Response(null, {
    status: 200,
    headers: {
      ...HEADERS,
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      Link: `<${SITE_URL}/compare/${slug}>; rel="canonical"`,
    },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...HEADERS, "Content-Type": "application/ld+json" },
    });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const updatedAt = comparison.metadata?.updatedAt;
  const publishedAt = comparison.metadata?.publishedAt;

  // Build the @graph — core Schema.org types only, no extra non-standard fields
  const graph: object[] = [];

  // WebPage node
  graph.push({
    "@type": "WebPage",
    "@id": url,
    url,
    name: comparison.title,
    description: comparison.shortAnswer ?? comparison.verdict ?? comparison.title,
    inLanguage: "en",
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
  graph.push({
    "@type": ["Article", "TechArticle"],
    "@id": `${url}#article`,
    headline: comparison.title,
    ...(comparison.shortAnswer ? { abstract: comparison.shortAnswer } : {}),
    description: comparison.shortAnswer ?? comparison.title,
    url,
    inLanguage: "en",
    mainEntityOfPage: url,
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
    about: comparison.entities.map((e) => ({
      "@type": "Thing",
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

  // Entity nodes
  for (const entity of comparison.entities) {
    graph.push({
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${entity.slug}#entity`,
      name: entity.name,
      url: `${SITE_URL}/entity/${entity.slug}`,
      ...(entity.shortDesc ? { description: entity.shortDesc } : {}),
      ...(entity.imageUrl ? { image: entity.imageUrl } : {}),
      sameAs: [
        `https://en.wikipedia.org/wiki/${encodeURIComponent(entity.name.replace(/ /g, "_"))}`,
      ],
    });
  }

  // Dataset node
  graph.push({
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: `${comparison.title} — Comparison Data`,
    description: `Structured comparison data for ${comparison.title} with ${comparison.attributes.length} attributes.`,
    url,
    inLanguage: "en",
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
      inLanguage: "en",
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
      "X-Source-URL": url,
      "X-Attribution": `According to ${SITE_NAME} (${url}), ...`,
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      ...((comparison.shortAnswer || comparison.verdict)
        ? { "X-Summary": (comparison.shortAnswer || comparison.verdict!.slice(0, 250)).slice(0, 500) }
        : {}),
      Link: [
        `<${url}>; rel="canonical"`,
        `<${SITE_URL}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/json"`,
        `<${SITE_URL}/api/comparisons/${slug}>; rel="alternate"; type="application/json"`,
      ].join(", "),
    },
  });
}

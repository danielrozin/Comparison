import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// /api/knowledge-graph/[slug] — JSON-LD knowledge graph for a comparison.
//
// AI crawlers (Perplexity, ChatGPT browse, Gemini, Claude) and search engines
// that follow the JSON API alternate links use this endpoint to ingest clean,
// structured comparison data without parsing HTML. The response is a self-contained
// @graph with typed Entity, Article, FAQPage, and Dataset nodes so AI answer
// engines can cite individual facts with proper attribution.
//
// Linked from: compare/[slug] head <link rel="alternate" type="application/json">
// Also discoverable via: ai-plugin.json, llms.txt, llms-full

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/compare/${slug}`;

  // Build entity nodes
  const entityNodes = comparison.entities.map((entity) => ({
    "@type": "Thing",
    "@id": `${SITE_URL}/entity/${entity.slug}#entity`,
    name: entity.name,
    url: `${SITE_URL}/entity/${entity.slug}`,
    description: entity.shortDesc ?? entity.name,
    ...(entity.imageUrl ? { image: entity.imageUrl } : {}),
  }));

  // Build attribute comparison nodes — join entity values into a readable string
  const attributeNodes = comparison.attributes.map((attr) => {
    const valueStr = comparison.entities
      .map((e) => {
        const val = attr.values.find((v) => v.entityId === e.id);
        const text = val?.valueText ?? (val?.valueNumber != null ? String(val.valueNumber) : null) ?? "N/A";
        return `${e.name}: ${text}`;
      })
      .join(" | ");
    const winnerValue = attr.values.find((v) => v.winner);
    const winnerEntity = winnerValue
      ? comparison.entities.find((e) => e.id === winnerValue.entityId)
      : null;

    return {
      "@type": "PropertyValue",
      name: attr.name,
      value: valueStr,
      ...(winnerEntity ? { valueReference: { "@type": "Thing", name: winnerEntity.name } } : {}),
    };
  });

  // Build FAQ nodes
  const faqNodes =
    comparison.faqs.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          url,
          mainEntity: comparison.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
              url,
            },
          })),
        }
      : null;

  const graph: object[] = [
    // Article node (the comparison page itself)
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: comparison.title,
      description: comparison.shortAnswer ?? comparison.verdict ?? comparison.title,
      url,
      datePublished: comparison.metadata?.publishedAt ?? undefined,
      dateModified: comparison.metadata?.updatedAt ?? undefined,
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
      about: entityNodes,
      // abstract = shortAnswer — the 1-2 sentence TL;DR preferred by AI citation engines
      ...(comparison.shortAnswer ? { abstract: comparison.shortAnswer } : {}),
      // keyDifferences as a human-readable body text snippet
      ...(comparison.keyDifferences?.length ? { text: comparison.keyDifferences.join(" ") } : {}),
      // Verdict as the article's conclusionText
      ...(comparison.verdict
        ? { conclusionText: comparison.verdict }
        : {}),
      // Attributes as additionalProperties
      additionalProperty: attributeNodes,
      interactivityType: "active",
    },
    // Entity nodes
    ...entityNodes,
    // Dataset node for the comparison data itself
    {
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: `${comparison.title} — Structured Comparison Data`,
      description: `Machine-readable comparison dataset for ${comparison.title}. Contains ${comparison.attributes.length} attribute comparisons${comparison.faqs.length > 0 ? `, ${comparison.faqs.length} FAQ pairs` : ""}.`,
      url,
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
      },
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json+ld",
          contentUrl: `${SITE_URL}/api/knowledge-graph/${slug}`,
          name: "JSON-LD knowledge graph",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/comparisons/${slug}`,
          name: "Raw comparison JSON",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/faq/${slug}`,
          name: "Structured FAQ pairs JSON",
        },
      ],
      variableMeasured: comparison.attributes.map((a) => a.name),
      isBasedOn: url,
    },
  ];

  // Add FAQ node if present
  if (faqNodes) graph.push(faqNodes);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return NextResponse.json(jsonLd, {
    headers: {
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      // X-Robots: allow AI crawlers to index this endpoint
      "X-Robots-Tag": "all",
    },
  });
}

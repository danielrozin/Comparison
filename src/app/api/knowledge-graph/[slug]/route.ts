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

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": "application/ld+json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
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
          inLanguage: "en-US",
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

  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&a=${encodeURIComponent(comparison.entities[0]?.name ?? "")}&b=${encodeURIComponent(comparison.entities[1]?.name ?? "")}&cat=${encodeURIComponent(comparison.category ?? "")}&type=comparison`;

  const graph: object[] = [
    // Article node (the comparison page itself)
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: comparison.title,
      description: comparison.shortAnswer ?? comparison.verdict ?? comparison.title,
      url,
      inLanguage: "en-US",
      datePublished: comparison.metadata?.publishedAt ?? undefined,
      dateCreated: comparison.metadata?.publishedAt ?? undefined,
      dateModified: comparison.metadata?.updatedAt ?? undefined,
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
      about: entityNodes,
      // abstract = shortAnswer — the 1-2 sentence TL;DR preferred by AI citation engines
      ...(comparison.shortAnswer ? { abstract: comparison.shortAnswer } : {}),
      // keyDifferences as a human-readable body text snippet
      ...(comparison.keyDifferences?.length ? { text: comparison.keyDifferences.map((kd) => kd.label).join(". ") } : {}),
      // Verdict as the article's conclusionText
      ...(comparison.verdict
        ? { conclusionText: comparison.verdict }
        : {}),
      // Attributes as additionalProperties
      additionalProperty: attributeNodes,
      interactivityType: "active",
      // speakable — sections optimised for voice/AI reading extraction
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#short-answer", "#verdict", "#key-differences", "#faq"],
        xpath: ["//*[@id='short-answer']", "//*[@id='verdict']"],
      },
      // significantLink — entity profiles + alternatives so AI can traverse the graph
      significantLink: comparison.entities.flatMap((e) => [
        `${SITE_URL}/entity/${e.slug}`,
        `${SITE_URL}/alternatives/${e.slug}`,
      ]),
      // teaches — explicit decision-intent signal for AI topic classifiers
      teaches: `How to choose between ${comparison.entities.map((e) => e.name).join(" and ")}`,
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
      inLanguage: "en-US",
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
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/answer/${slug}`,
          name: "AI Answer API (citation-ready)",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/v1/related/${slug}`,
          name: "Related comparisons JSON",
        },
      ],
      variableMeasured: comparison.attributes.map((a) => a.name),
      isBasedOn: url,
    },
  ];

  // Add FAQ node if present
  if (faqNodes) graph.push(faqNodes);

  // HowTo node — captures "how to choose between X and Y" featured snippets.
  // Google grants HowTo rich results to comparison pages that structure their
  // decision criteria as steps. AI answer engines also prefer step-form guidance
  // for decision-intent queries over free-form prose.
  if (comparison.keyDifferences?.length && comparison.entities.length >= 2) {
    const entityNames = comparison.entities.map((e) => e.name).join(" and ");
    const [entityA, entityB] = comparison.entities;
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `How to Choose Between ${entityNames}`,
      description: comparison.shortAnswer ?? `A step-by-step guide to deciding between ${entityNames} based on key differences.`,
      url,
      inLanguage: "en-US",
      totalTime: "PT3M",
      step: comparison.keyDifferences.map((diff, i) => {
        const label = diff.label ?? `Difference ${i + 1}`;
        const aVal = diff.entityAValue ?? "";
        const bVal = diff.entityBValue ?? "";
        const stepText = aVal && bVal
          ? `${label}: ${entityA?.name ?? "A"} has ${aVal}, while ${entityB?.name ?? "B"} has ${bVal}.`
          : label;
        return {
          "@type": "HowToStep",
          "@id": `${url}#howto-step-${i + 1}`,
          position: i + 1,
          name: `Consider: ${label.slice(0, 80)}`,
          text: stepText,
          url: `${url}#key-differences`,
        };
      }),
      ...(comparison.verdict
        ? {
            tool: [
              {
                "@type": "HowToTool",
                name: "A Versus B Comparison Guide",
                url,
              },
            ],
            tip: [
              {
                "@type": "HowToTip",
                text: comparison.verdict,
              },
            ],
          }
        : {}),
    });
  }

  // Add ClaimReview node for the verdict when present — tells AI fact-checkers and
  // Google that the verdict is a reviewed claim, not speculation.
  if (comparison.verdict || comparison.shortAnswer) {
    graph.push({
      "@type": "ClaimReview",
      "@id": `${url}#claimreview`,
      url,
      claimReviewed: comparison.title,
      reviewBody: comparison.shortAnswer ?? comparison.verdict ?? "",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        worstRating: 1,
        bestRating: 5,
        alternateName: "Verified Comparison",
      },
      author: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      itemReviewed: {
        "@type": "CreativeWork",
        url,
        name: comparison.title,
      },
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  const etag = updatedAt
    ? `"kg-${slug}-${new Date(updatedAt).getTime()}"`
    : `"kg-${slug}"`;

  // Conditional GET support — AI crawlers polling for changes can send If-None-Match
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const comparisonUrl = `${SITE_URL}/compare/${slug}`;
  return new Response(JSON.stringify(jsonLd, null, 2), {
    status: 200,
    headers: {
      ...HEADERS,
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Source-URL": comparisonUrl,
      "X-Attribution": `${SITE_NAME} (${comparisonUrl})`,
      ETag: etag,
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      ...((comparison.shortAnswer || comparison.verdict)
        ? { "X-Summary": (comparison.shortAnswer || comparison.verdict!.slice(0, 250)).slice(0, 500) }
        : {}),
      "Link": [
        `<${comparisonUrl}>; rel="canonical"`,
        `<${SITE_URL}/api/v1/schema/${slug}>; rel="alternate"; type="application/ld+json"; title="Schema.org JSON-LD (pure)"`,
        `<${SITE_URL}/api/openapi>; rel="service-doc"; type="application/json"`,
        `<${SITE_URL}/api/sitemap>; rel="collection"; type="application/json"`,
      ].join(", "),
    },
  });
}

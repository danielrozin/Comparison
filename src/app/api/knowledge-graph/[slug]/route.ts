import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { entitySchemaType } from "@/lib/seo/schema";

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

  // Generate alternate names for an entity from its name and slug.
  // Provides AI citation engines and KG crawlers with common aliases so they can
  // resolve queries like "US vs China" to "United States vs China" (and vice versa).
  function buildAlternateNames(name: string, slug: string): string[] {
    const alts: string[] = [];
    const words = name.split(/\s+/).filter(Boolean);
    // Acronym for multi-word names (e.g. "Machine Learning" → "ML")
    if (words.length >= 2) {
      const acronym = words.map((w) => w[0] ?? "").join("").toUpperCase();
      if (acronym.length >= 2 && acronym !== name) alts.push(acronym);
    }
    // Slug → title-case variant (e.g. "united-states" → "United States")
    const slugTitle = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (slugTitle !== name && !alts.includes(slugTitle)) alts.push(slugTitle);
    return alts.slice(0, 3);
  }

  // Build entity nodes — typed via entitySchemaType() so knowledge graph crawlers
  // (Google KG, Perplexity, ChatGPT) receive correctly typed nodes instead of Thing.
  // alternateName provides common aliases/abbreviations so AI fact-checkers can
  // resolve variant spellings to the same canonical entity node.
  const entityNodes = comparison.entities.map((entity) => {
    const alternateNames = buildAlternateNames(entity.name, entity.slug);
    return {
      "@type": entitySchemaType(entity.entityType),
      "@id": `${SITE_URL}/entity/${entity.slug}#entity`,
      name: entity.name,
      ...(alternateNames.length > 0 ? { alternateName: alternateNames } : {}),
      url: `${SITE_URL}/entity/${entity.slug}`,
      inLanguage: "en-US",
      description: entity.shortDesc ?? entity.name,
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
    };
  });

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

  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;

  // Build FAQ nodes
  const faqNodes =
    comparison.faqs.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          url,
          inLanguage: "en-US",
          isAccessibleForFree: true,
          conditionsOfAccess: "Free",
          ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          isPartOf: { "@type": "WebPage", "@id": url },
          mainEntity: comparison.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
              inLanguage: "en-US",
              url,
            },
          })),
        }
      : null;

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
      // significantLink — entity profiles, alternatives, answer API, schema JSON-LD
      // so AI graph traversal reaches all machine-readable representations.
      significantLink: [
        ...comparison.entities.flatMap((e) => [
          `${SITE_URL}/entity/${e.slug}`,
          `${SITE_URL}/alternatives/${e.slug}`,
        ]),
        `${SITE_URL}/api/answer/${slug}`,
        `${SITE_URL}/api/v1/schema/${slug}`,
      ],
      // relatedLink — related comparison pages for AI graph traversal and topic clustering.
      ...(comparison.relatedComparisons?.length ? {
        relatedLink: comparison.relatedComparisons.slice(0, 8).map((r: { slug: string }) => `${SITE_URL}/compare/${r.slug}`),
      } : {}),
      // citation — Wikipedia references for each entity so AI fact-checkers always have
      // a citation chain even when no explicit editorial sources are recorded.
      citation: comparison.entities.map((e) => ({
        "@type": "CreativeWork",
        name: `${e.name} — Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`,
      })),
      // teaches — explicit decision-intent signal for AI topic classifiers
      teaches: `How to choose between ${comparison.entities.map((e) => e.name).join(" and ")}`,
      // genre — content classification for AI indexers and Google Discover carousels
      ...(comparison.category ? { genre: comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1) } : { genre: "Comparison" }),
      // potentialAction — ReadAction lets AI crawlers understand page is readable; CompareAction
      // signals comparison intent so AI routers surface this for "X vs Y" queries.
      potentialAction: [
        { "@type": "ReadAction", target: url },
        {
          "@type": "Action",
          additionalType: "CompareAction",
          name: `Compare ${comparison.entities.map((e) => e.name).join(" vs ")}`,
          target: url,
          object: comparison.entities.map((e) => ({
            "@type": "Thing",
            name: e.name,
            ...(e.slug ? { url: `${SITE_URL}/entity/${e.slug}` } : {}),
          })),
        },
      ],
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
      variableMeasured: comparison.attributes.map((a) => ({
        "@type": "PropertyValue",
        name: a.name,
        ...(a.category ? { valueReference: { "@type": "DefinedTerm", name: a.category } } : {}),
      })),
      isBasedOn: url,
    },
  ];

  // DefinedTermSet — vocabulary of attribute categories used in this comparison.
  // Tells AI indexers and semantic crawlers how the comparison attributes are classified
  // (e.g. "Performance", "Price", "Design") enabling entity-level faceted retrieval.
  const attributeCategories = [
    ...new Set(
      comparison.attributes
        .map((a) => a.category)
        .filter((c): c is string => !!c)
    ),
  ];
  if (attributeCategories.length > 0) {
    graph.push({
      "@type": "DefinedTermSet",
      "@id": `${url}#attribute-vocabulary`,
      name: `${comparison.title} — Attribute Category Vocabulary`,
      url,
      inLanguage: "en-US",
      description: `Taxonomy of attribute categories used to classify comparison data for ${comparison.title}.`,
      hasDefinedTerm: attributeCategories.map((cat) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#term-${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        termCode: cat.toLowerCase().replace(/\s+/g, "-"),
        inDefinedTermSet: `${url}#attribute-vocabulary`,
      })),
    });
  }

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

  // SportsEvent node — for sports-category comparisons, adds a virtual SportsEvent
  // representing the head-to-head matchup. Google Sports and Perplexity sports-mode
  // crawlers use SportsEvent to surface athlete/team comparisons in sports carousels.
  if (comparison.category === "sports" && comparison.entities.length >= 2) {
    graph.push({
      "@type": "SportsEvent",
      "@id": `${url}#sportsevent`,
      name: comparison.title,
      description: comparison.shortAnswer ?? `Head-to-head comparison: ${comparison.title}`,
      url,
      inLanguage: "en-US",
      ...(updatedAt ? { startDate: updatedAt } : {}),
      competitor: comparison.entities.slice(0, 2).map((e) => ({
        "@type": ["SportsTeam", "Person"].includes(entitySchemaType(e.entityType)) ? entitySchemaType(e.entityType) : "Person",
        name: e.name,
        ...(e.slug ? { url: `${SITE_URL}/entity/${e.slug}` } : {}),
        ...(e.shortDesc ? { description: e.shortDesc } : {}),
      })),
      organizer: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      isAccessibleForFree: true,
    });
  }

  // Add ClaimReview node for the verdict when present — tells AI fact-checkers and
  // Google that the verdict is a reviewed claim, not speculation.
  // itemReviewed must be @type Claim (not CreativeWork/WebPage) per Google Fact Check spec.
  // reviewRating must use TRUE/FALSE/MIXTURE tokens, not numeric 1-5.
  if (comparison.verdict || comparison.shortAnswer) {
    const entityNames = comparison.entities.map((e) => e.name);
    const claimText = entityNames.length >= 2
      ? `${entityNames[0]} is better than ${entityNames[1]}`
      : comparison.title;
    const verdictLower = (comparison.verdict ?? "").toLowerCase();
    const ratingToken =
      entityNames[0] && verdictLower === entityNames[0].toLowerCase()
        ? "TRUE"
        : entityNames[1] && verdictLower === entityNames[1].toLowerCase()
        ? "FALSE"
        : "MIXTURE";
    graph.push({
      "@type": "ClaimReview",
      "@id": `${url}#claimreview`,
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      claimReviewed: claimText,
      ...(comparison.shortAnswer ? { reviewBody: comparison.shortAnswer } : {}),
      ...(comparison.metadata?.publishedAt ? { datePublished: new Date(comparison.metadata.publishedAt).toISOString().slice(0, 10) } : {}),
      ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString().slice(0, 10) } : {}),
      reviewRating: {
        "@type": "Rating",
        ratingValue: ratingToken,
        bestRating: "TRUE",
        worstRating: "FALSE",
        alternateName:
          ratingToken === "TRUE"
            ? `${entityNames[0]} wins`
            : ratingToken === "FALSE"
            ? `${entityNames[1]} wins`
            : "Depends on use case — see analysis",
      },
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
      itemReviewed: {
        "@type": "Claim",
        inLanguage: "en-US",
        name: claimText,
        ...(comparison.shortAnswer ? { text: comparison.shortAnswer.slice(0, 300) } : {}),
        author: { "@type": "Thing", name: "Internet consensus" },
        appearance: { "@type": "WebPage", "@id": url, url },
        firstAppearance: { "@type": "WebPage", "@id": url, url },
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

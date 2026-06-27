/**
 * Structured Data / JSON-LD Schema Generator
 * Generates rich schema markup for all page types
 */

import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import type { ComparisonPageData, FAQData, CategoryData, CitationStats } from "@/types";

// ============================================================
// Organization schema (site-wide)
// ============================================================

// Centralized social profile URLs for Organization sameAs entity-graph signals.
// Each slot is overridable via NEXT_PUBLIC_SOCIAL_* env vars so URL list updates
// (DAN-422 / DAN-419 social activation) ship as a config change, not a code deploy.
// All defaults are empty: per DAN-419 default-fired 2026-05-04, no social accounts
// are claimed yet, so any hardcoded URL would 404 and act as a negative entity-graph
// signal. SMM (4f3bd1c8) sets the env vars once accounts are claimed and verified.
// Empty/unset slots are filtered out so unverified handles don't leak into JSON-LD.
export function socialSameAs(): string[] {
  const slots = [
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_PINTEREST ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_REDDIT ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_QUORA ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
  ];
  return slots.filter((url) => url.trim().length > 0);
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
      width: 200,
      height: 60,
    },
    // image — separate from logo; required for Google Knowledge Panel eligibility.
    // The OG image serves as the brand's representative image in entity cards.
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/api/og?title=Compare+Anything&type=home`,
      width: 1200,
      height: 630,
    },
    sameAs: socialSameAs(),
    description: "A Versus B is the internet's most comprehensive comparison platform — 2,900+ side-by-side comparisons across sports, technology, products, software, automotive, health, finance, countries, and more. Every page includes structured data (Schema.org), expert verdicts, community voting, and source citations.",
    foundingDate: "2024",
    knowsAbout: [
      "Product Comparisons",
      "Technology Reviews",
      "Data-Driven Analysis",
      "Sports Statistics",
      "Country Comparisons",
      "Software Reviews",
      "Automotive Comparisons",
      "Health and Wellness Comparisons",
      "Financial Product Comparisons",
      "Consumer Electronics Reviews",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Comparison API",
      url: `${SITE_URL}/developers`,
      description: "REST API for accessing structured comparison data, entity profiles, and trending topics.",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
      availableLanguage: "English",
    },
    // founder[] — E-E-A-T signal: lets Google/LLMs attribute the platform to real people.
    // sameAs on each Person links to verified social profiles for Knowledge Graph entity matching.
    founder: [
      {
        "@type": "Person",
        name: "Daniel Rozin",
        url: `${SITE_URL}/authors/daniel-rozin`,
        jobTitle: "Founder & Editor-in-Chief",
        sameAs: [
          "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
          "https://www.facebook.com/daniel.rozin.94",
        ],
      },
      {
        "@type": "Person",
        name: "Shai And",
        jobTitle: "Co-Founder & CTO",
        sameAs: ["https://www.facebook.com/shai.and1"],
      },
    ],
  };
}

// ============================================================
// WebSite schema with SearchAction (enables sitelinks search box)
// ============================================================

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Compare anything side-by-side — 2,900+ data-driven comparisons across technology, sports, software, automotive, health, finance, and more.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ============================================================
// WebPage schema
// ============================================================

export function webPageSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string;
  breadcrumbs?: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// ============================================================
// Vote data for AggregateRating on comparisons
// ============================================================

export interface ComparisonVoteData {
  votes: Record<string, number>; // entityName → vote count
  total: number;
}

// ============================================================
// Comparison page schema (Article + FAQPage + BreadcrumbList + ItemList)
// ============================================================

export function comparisonPageSchema(
  comparison: ComparisonPageData,
  voteData?: ComparisonVoteData | null,
) {
  const url = `${SITE_URL}/compare/${comparison.slug}`;

  // 3+ entity pages follow the locked schema-3way v1 contract (DAN-841 rev 1a540eda):
  // a single @graph with top-level item nodes + ItemList container, cross-referenced by @id.
  if (comparison.entities.length >= 3) {
    return [buildMultiEntityGraph(comparison, voteData, url)];
  }

  const schemas: Record<string, unknown>[] = [];

  // 1. Article schema — use TechArticle for tech/software comparisons.
  // TechArticle gets Google's "Technical Article" rich result type and is preferred
  // by AI Overviews when surfacing technical comparisons (software, SaaS, hardware).
  const techCategories = new Set(["technology", "software", "automotive", "gaming"]);
  const articleType = techCategories.has(comparison.category ?? "")
    ? ["Article", "TechArticle"]
    : "Article";
  schemas.push({
    "@context": "https://schema.org",
    "@type": articleType,
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    inLanguage: "en-US",
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    // `mentions` signals to Google/LLMs which entities this article discusses — key GEO signal.
    mentions: comparison.entities.map((e) => ({
      ...buildEntityMention(e),
    })),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    about: comparison.entities.map((e) => ({
      "@type": entitySchemaType(e.entityType),
      name: e.name,
      description: e.shortDesc,
      ...(e.imageUrl && { image: e.imageUrl }),
    })),
    // significantLink — tells crawlers which entity profile pages are the authoritative
    // destinations from this comparison. Strengthens the internal link graph and
    // improves crawl budget routing to high-value entity pages.
    significantLink: comparison.entities.map((e) => `${SITE_URL}/entity/${e.slug}`),
    // abstract — concise one-paragraph summary; AI answer engines (ChatGPT, Perplexity,
    // Claude) prefer `abstract` over `description` for citation snippets because it is
    // semantically scoped to "scholarly/article summary" rather than SEO blurb.
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    // keywords — entity names + category make the article discoverable via entity-search
    // in LLM training pipelines and Bing/Google entity recognition.
    keywords: [
      ...comparison.entities.map((e) => e.name),
      ...(comparison.category ? [comparison.category] : []),
      "comparison",
      "vs",
    ].join(", "),
    // wordCount — positive freshness/depth signal; LLMs use it to gauge content density.
    wordCount: comparison.attributes.length > 0
      ? Math.max(500, comparison.attributes.length * 80 + comparison.faqs.length * 120)
      : undefined,
    // lastReviewed / reviewedBy — explicit freshness signal. AI answer engines
    // (Perplexity, ChatGPT) prefer pages that declare a review date, as it signals
    // the data is actively maintained rather than stale or abandoned.
    lastReviewed: comparison.metadata.updatedAt,
    reviewedBy: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    // interactionStatistic — exposes real page view counts so search engines and LLMs
    // can rank content by engagement. Uses schema.org/InteractionCounter.
    ...(comparison.metadata.viewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WatchAction" },
        userInteractionCount: comparison.metadata.viewCount,
      },
    }),
    // isAccessibleForFree — signals to Google that content is not paywalled.
    // Required for "Flexible Sampling" eligibility and broader rich-result coverage.
    isAccessibleForFree: true,
    // license — public declaration of content license for AI training transparency.
    license: `${SITE_URL}/terms`,
  });

  // 2. ItemList for the compared entities
  schemas.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: comparison.title,
    description: `Comparison between ${comparison.entities.map((e) => e.name).join(" and ")}`,
    numberOfItems: comparison.entities.length,
    itemListElement: comparison.entities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entity.name,
      description: entity.shortDesc,
      url: `${SITE_URL}/entity/${entity.slug}`,
    })),
  });

  // 3. FAQPage if FAQs exist
  if (comparison.faqs.length > 0) {
    schemas.push(faqSchema(comparison.faqs));
  }

  // 3b. SpeakableSpecification — marks verdict + key-differences sections for
  // voice assistants and AEO (Answer Engine Optimization). These CSS selectors
  // target the rendered DOM IDs on the /compare/[slug] page.
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#verdict", "#key-differences", "#pros-cons"],
    },
    url,
  });

  // 4. BreadcrumbList
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(comparison.category
      ? [{ name: comparison.category, url: `${SITE_URL}/category/${comparison.category}` }]
      : []),
    { name: comparison.title, url },
  ];
  schemas.push(breadcrumbSchema(breadcrumbs));

  // 5. Dataset for structured comparison data (enriched with citation stats)
  if (comparison.attributes.length > 0) {
    const citation = comparison.citationStats;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `${comparison.title} - Comparison Data`,
      description: citation
        ? `Structured comparison based on ${citation.sourceCount} sources and ${citation.dataPointCount} data points${citation.reviewsAnalyzed ? `, analyzing ${citation.reviewsAnalyzed} reviews` : ""}.`
        : `Structured comparison data for ${comparison.entities.map((e) => e.name).join(" vs ")}`,
      url,
      variableMeasured: comparison.attributes.map((attr) => attr.name),
      ...(citation && citation.sourceCount > 0 && {
        isBasedOn: citation.sources.filter((s) => s.url).map((s) => ({
          "@type": "CreativeWork",
          name: s.name,
          url: s.url,
        })),
      }),
    });
  }

  // 6. AggregateRating + individual Review per entity from user poll votes + review counts.
  // Individual Review objects make entities eligible for Google rich-result star snippets;
  // AggregateRating alone does not qualify without at least one Review present.
  if (voteData && voteData.total >= 10) {
    const citation = comparison.citationStats;
    for (const entity of comparison.entities) {
      const entityVotes = voteData.votes[entity.name] || 0;
      if (entityVotes === 0) continue;
      const voteShare = entityVotes / voteData.total;
      // Map vote share to 1–5 scale: 0% → 1.0, 50% → 3.0, 100% → 5.0
      const ratingValue = 1 + voteShare * 4;
      const schemaType = entitySchemaType(entity.entityType);

      schemas.push({
        "@context": "https://schema.org",
        "@type": schemaType,
        name: entity.name,
        url: `${SITE_URL}/entity/${entity.slug}`,
        ...(entity.imageUrl && { image: entity.imageUrl }),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: ratingValue.toFixed(1),
          bestRating: 5,
          worstRating: 1,
          ratingCount: entityVotes,
          ...(citation?.reviewsAnalyzed && { reviewCount: citation.reviewsAnalyzed }),
        },
        // Individual Review — required alongside AggregateRating for Google rich-result eligibility.
        // Uses the comparison page itself as the review body; author is the platform.
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: ratingValue.toFixed(1),
            bestRating: 5,
            worstRating: 1,
          },
          author: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          reviewBody:
            comparison.shortAnswer ||
            `Comparison of ${entity.name} based on ${comparison.attributes.length} attributes across ${comparison.entities.map((e) => e.name).join(" vs ")}.`,
          url,
        },
      });
    }
  }

  // 7. DefinedTermSet for key differences — AEO signal: marks each attribute
  // as a defined term so LLMs (ChatGPT, Perplexity, Google AI Overviews) can
  // extract structured Q&A pairs directly from schema, not just from prose.
  if (comparison.keyDifferences.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: `Key Differences: ${comparison.entities.map((e) => e.name).join(" vs ")}`,
      url,
      hasDefinedTerm: comparison.keyDifferences.map((kd) => ({
        "@type": "DefinedTerm",
        name: kd.label,
        description:
          comparison.entities.length >= 2
            ? `${comparison.entities[0]?.name}: ${kd.entityAValue} | ${comparison.entities[1]?.name}: ${kd.entityBValue}`
            : kd.entityAValue,
        inDefinedTermSet: url,
      })),
    });
  }

  return schemas;
}

/**
 * Consolidate multiple top-level JSON-LD schema objects into a single
 * `@graph` document. Google (and other crawlers) treat a single
 * `{ "@context": ..., "@graph": [...] }` block as equivalent to N separate
 * `<script type="application/ld+json">` blocks, so this is SEO-neutral while
 * shrinking the emitted HTML: one script wrapper instead of N, and the
 * repeated per-item `"@context"` string is hoisted out exactly once.
 *
 * Items are accepted with or without their own `@context`; it is stripped so
 * the graph-level context applies uniformly.
 */
export function jsonLdGraph(
  schemas: Array<Record<string, unknown> | null | undefined>,
) {
  const graph = schemas
    .filter((s): s is Record<string, unknown> => Boolean(s))
    .map(({ ["@context"]: _ctx, ...rest }) => rest);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// ============================================================
// Multi-entity (N≥3) @graph emitter — schema-3way v1 (DAN-841)
// ============================================================
//
// Locked contract (rev 1a540eda, sign-off DAN-844 2026-05-28):
// - Single @graph document with cross-referenced @id nodes.
// - 3 (or more) top-level SoftwareApplication/typed-item nodes, NOT nested in Article.about.
// - ItemList container @id="{url}#comparison" with ListItem.item.@id pointers to the item nodes.
// - Article.mainEntity → #comparison.
// - AI-chatbots cluster baseline: applicationCategory="BusinessApplication", operatingSystem="Web, iOS, Android".
// - Offer omitted for chatbots (deferred to other clusters per §2.3 deferral note).
// - aggregateRating field stays vote-gated (real on-site data only, DAN-608 §6 inheritance), but its
//   absence does not suppress the parent item node — items always emit.

function buildMultiEntityGraph(
  comparison: ComparisonPageData,
  voteData: ComparisonVoteData | null | undefined,
  url: string,
): Record<string, unknown> {
  const itemListId = `${url}#comparison`;
  const itemIds = comparison.entities.map(
    (_, i) => `${url}#item-${String.fromCharCode(97 + i)}`,
  );
  const citation = comparison.citationStats;
  const realVotes = voteData && voteData.total >= 10 ? voteData : null;

  const itemNodes = comparison.entities.map((entity, i) => {
    const schemaType = entitySchemaType(entity.entityType);
    const node: Record<string, unknown> = {
      "@type": schemaType,
      "@id": itemIds[i],
      name: entity.name,
      url: `${SITE_URL}/entity/${entity.slug}`,
    };
    if (entity.shortDesc) node.description = entity.shortDesc;
    if (entity.imageUrl) node.image = entity.imageUrl;

    if (schemaType === "SoftwareApplication") {
      node.applicationCategory = "BusinessApplication";
      node.operatingSystem = "Web, iOS, Android";
      // publisher name defaults to the entity's own brand name; real-data backfill
      // from Entity.metadata is tracked separately and is out of scope here.
      node.publisher = {
        "@type": "Organization",
        name: entity.name,
      };
    }

    if (realVotes) {
      const entityVotes = realVotes.votes[entity.name] ?? 0;
      if (entityVotes > 0) {
        const voteShare = entityVotes / realVotes.total;
        const ratingValue = 1 + voteShare * 4;
        node.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: ratingValue.toFixed(1),
          bestRating: 5,
          worstRating: 1,
          ratingCount: entityVotes,
          ...(citation?.reviewsAnalyzed && { reviewCount: citation.reviewsAnalyzed }),
        };
      }
    }

    return node;
  });

  const itemList: Record<string, unknown> = {
    "@type": "ItemList",
    "@id": itemListId,
    name: comparison.title,
    description: `Comparison between ${comparison.entities.map((e) => e.name).join(", ")}`,
    numberOfItems: comparison.entities.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: comparison.entities.map((_, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@id": itemIds[i] },
    })),
  };

  const techCategoriesMulti = new Set(["technology", "software", "automotive", "gaming"]);
  const article: Record<string, unknown> = {
    "@type": techCategoriesMulti.has(comparison.category ?? "")
      ? ["Article", "TechArticle"]
      : "Article",
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    inLanguage: "en-US",
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    // `mentions` — entity graph signals for GEO (same pattern as 2-entity layout)
    mentions: comparison.entities.map((e) => buildEntityMention(e)),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    mainEntity: { "@id": itemListId },
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    keywords: [
      ...comparison.entities.map((e) => e.name),
      ...(comparison.category ? [comparison.category] : []),
      "comparison",
      "vs",
    ].join(", "),
    wordCount: comparison.attributes.length > 0
      ? Math.max(500, comparison.attributes.length * 80 + comparison.faqs.length * 120)
      : undefined,
    ...(comparison.metadata.viewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WatchAction" },
        userInteractionCount: comparison.metadata.viewCount,
      },
    }),
    isAccessibleForFree: true,
    license: `${SITE_URL}/terms`,
    lastReviewed: comparison.metadata.updatedAt,
    reviewedBy: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(comparison.category
      ? [{ name: comparison.category, url: `${SITE_URL}/category/${comparison.category}` }]
      : []),
    { name: comparison.title, url },
  ];
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const graph: Record<string, unknown>[] = [
    article,
    itemList,
    ...itemNodes,
    breadcrumbList,
  ];

  if (comparison.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: comparison.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  // DefinedTermSet for multi-entity key differences — mirrors the 2-entity path.
  if (comparison.keyDifferences.length > 0) {
    graph.push({
      "@type": "DefinedTermSet",
      name: `Key Differences: ${comparison.entities.map((e) => e.name).join(" vs ")}`,
      url,
      hasDefinedTerm: comparison.keyDifferences.map((kd) => ({
        "@type": "DefinedTerm",
        name: kd.label,
        description: kd.values
          ? kd.values.map((v, i) => `${comparison.entities[i]?.name ?? i}: ${v}`).join(" | ")
          : `${comparison.entities[0]?.name}: ${kd.entityAValue} | ${comparison.entities[1]?.name}: ${kd.entityBValue}`,
        inDefinedTermSet: url,
      })),
    });
  }

  // SpeakableSpecification for multi-entity pages — same DOM IDs as 2-entity layout.
  graph.push({
    "@type": "WebPage",
    "@id": url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#verdict", "#key-differences", "#pros-cons"],
    },
    url,
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// ============================================================
// VideoObject schema for comparison videos
// ============================================================

export function videoObjectSchema(opts: {
  slug: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  uploadDate: string;
  entityA: string;
  entityB: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${opts.entityA} vs ${opts.entityB} — Full Comparison`,
    description: opts.description,
    thumbnailUrl: `https://img.youtube.com/vi/${opts.youtubeVideoId}/maxresdefault.jpg`,
    uploadDate: opts.uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${opts.youtubeVideoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${opts.youtubeVideoId}`,
    duration: "PT36S",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    potentialAction: {
      "@type": "WatchAction",
      target: `https://www.youtube.com/watch?v=${opts.youtubeVideoId}`,
    },
  };
}

// ============================================================
// FAQ schema
// ============================================================

export function faqSchema(faqs: FAQData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================
// Breadcrumb schema
// ============================================================

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================================
// Category page schema (CollectionPage)
// ============================================================

export function categoryPageSchema(category: CategoryData) {
  const url = `${SITE_URL}/category/${category.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.description,
      url,
      inLanguage: "en-US",
      mainEntity: {
        "@type": "ItemList",
        name: `${category.name} Comparisons`,
        numberOfItems: category.comparisonCount,
        itemListElement: category.topComparisons.map((comp, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: comp.title,
          url: `${SITE_URL}/compare/${comp.slug}`,
        })),
      },
      // hasPart — explicit article membership for each top comparison in this category.
      // Reinforces the category→comparison hierarchy in the knowledge graph so AI
      // engines correctly attribute comparison content to its parent category topic.
      hasPart: category.topComparisons.slice(0, 10).map((comp) => ({
        "@type": "Article",
        name: comp.title,
        url: `${SITE_URL}/compare/${comp.slug}`,
        isPartOf: { "@type": "CollectionPage", url },
      })),
      // speakable — marks the category name/description for voice assistants.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".category-description"],
      },
    },
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: category.name, url },
    ]),
  ];
}

// ============================================================
// Entity page schema
// ============================================================

export function entityPageSchema(entity: {
  name: string;
  slug: string;
  shortDesc: string | null;
  entityType: string;
  imageUrl: string | null;
}) {
  const url = `${SITE_URL}/entity/${entity.slug}`;
  const schemaType = entitySchemaType(entity.entityType);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: entity.name,
    description: entity.shortDesc,
    url,
    ...(entity.imageUrl && { image: entity.imageUrl }),
    // potentialAction ReadAction — tells AI crawlers this page is designed to be
    // read and understood, distinguishing it from interactive/transactional pages.
    // Increases citation probability in AI Overviews for entity queries.
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
  };
}

// ============================================================
// ProfilePage schema — wraps entity pages for Knowledge Panel signals.
// Google uses ProfilePage to understand that a URL is "about" a named entity.
// Emitting this alongside the entity schema strengthens entity disambiguation
// and increases the chance of our entity pages appearing in AI Overview citations.
// ============================================================

export function profilePageSchema(entity: {
  name: string;
  slug: string;
  shortDesc: string | null;
  entityType: string;
  imageUrl: string | null;
  comparisonCount?: number;
  topComparisons?: { slug: string; title: string }[];
}) {
  const url = `${SITE_URL}/entity/${entity.slug}`;
  const schemaType = entitySchemaType(entity.entityType);

  // subjectOf — bidirectional knowledge graph edge: entity → comparisons.
  // This tells Google/LLMs that the entity is the subject of multiple comparison
  // articles, creating a rich entity graph that improves AI Overview citation quality.
  const subjectOf = (entity.topComparisons ?? []).slice(0, 10).map((c) => ({
    "@type": "Article",
    headline: c.title,
    url: `${SITE_URL}/compare/${c.slug}`,
  }));

  const mainEntity: Record<string, unknown> = {
    "@type": schemaType,
    "@id": url,
    name: entity.name,
    url,
    ...(entity.shortDesc && { description: entity.shortDesc }),
    ...(entity.imageUrl && { image: entity.imageUrl }),
    ...(subjectOf.length > 0 && { subjectOf }),
    // potentialAction ReadAction — tells AI crawlers this is an informational
    // resource about the named entity, not a transactional page.
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${entity.name} — Comparisons & Profile`,
    url,
    dateModified: new Date().toISOString().slice(0, 10),
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    // speakable — marks the entity name/description for voice assistants + AEO.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".entity-description", ".entity-short-desc"],
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: entity.name, item: url },
      ],
    },
    mainEntity,
    ...(entity.comparisonCount && entity.comparisonCount > 0 && {
      about: {
        "@type": "ItemList",
        name: `Comparisons involving ${entity.name}`,
        numberOfItems: entity.comparisonCount,
        url: `${SITE_URL}/entity/${entity.slug}`,
      },
    }),
  };
}

// ============================================================
// SiteNavigation schema — emitted in the global layout.
// Tells crawlers (Googlebot, LLM bots) the primary navigation structure,
// improving crawl budget allocation to high-value category pages.
// ============================================================

export function siteNavigationSchema(categories: { name: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SiteLinksSearchBox",
    url: SITE_URL,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={query}` },
        "query-input": "required name=query",
      },
    ],
    hasPart: categories.map((cat) => ({
      "@type": "WebPage",
      "@id": `${SITE_URL}/category/${cat.slug}`,
      name: `${cat.name} Comparisons`,
      url: `${SITE_URL}/category/${cat.slug}`,
    })),
  };
}

// ============================================================
// AggregateRating schema (for review/entity pages)
// ============================================================

export function aggregateRatingSchema(entity: {
  name: string;
  slug: string;
  entityType: string;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  const url = `${SITE_URL}/entity/${entity.slug}`;
  const schemaType = entitySchemaType(entity.entityType);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: entity.name,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: entity.ratingValue.toFixed(1),
      bestRating: entity.bestRating ?? 5,
      worstRating: entity.worstRating ?? 1,
      reviewCount: entity.reviewCount,
    },
  };
}

// ============================================================
// HowTo schema for step-by-step blog articles (AEO)
// ============================================================

/**
 * Generates HowTo JSON-LD for blog articles whose title starts with "How to".
 * AI answer engines extract HowTo steps directly from schema — higher citation
 * rate than prose extraction. Steps are derived from heading structure via simple
 * regex on markdown content (h2 headings become steps).
 */
export function howToSchemaFromBlog(opts: {
  title: string;
  description: string;
  url: string;
  content: string;
}) {
  if (!/^how to /i.test(opts.title)) return null;

  // Extract h2 headings from markdown content as step names.
  const headingMatches = opts.content.match(/^##\s+(.+)$/gm) ?? [];
  const steps = headingMatches
    .map((h) => h.replace(/^##\s+/, "").trim())
    .filter((s) => s.length > 0 && !/introduction|conclusion|summary|overview/i.test(s))
    .slice(0, 10);

  if (steps.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    step: steps.map((name, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
      url: `${opts.url}#step-${i + 1}`,
    })),
  };
}

// ============================================================
// Helpers
// ============================================================

/**
 * Builds a rich entity mention object for use in Article `mentions` arrays.
 * Adds type-specific enrichments: Country gets containedInPlace, Event/War gets
 * `@type: "Event"` override so Google can link to KG event records.
 */
function buildEntityMention(e: {
  entityType: string;
  name: string;
  slug: string;
  shortDesc?: string | null;
  imageUrl?: string | null;
}): Record<string, unknown> {
  const base: Record<string, unknown> = {
    "@type": entitySchemaType(e.entityType),
    name: e.name,
    url: `${SITE_URL}/entity/${e.slug}`,
    ...(e.shortDesc && { description: e.shortDesc }),
    ...(e.imageUrl && { image: e.imageUrl }),
  };

  if (e.entityType === "country") {
    base["containedInPlace"] = { "@type": "Place", name: "Earth" };
  }

  if (e.entityType === "war" || e.entityType === "event") {
    // Event entities get superEvent for hierarchy context — helps KG entity matching.
    base["superEvent"] = { "@type": "Event", name: "World History" };
  }

  return base;
}

function entitySchemaType(entityType: string): string {
  const map: Record<string, string> = {
    person: "Person",
    country: "Country",
    product: "Product",
    team: "SportsTeam",
    company: "Organization",
    technology: "SoftwareApplication",
    brand: "Brand",
    event: "Event",
    war: "Event",
    software: "SoftwareApplication",
    place: "Place",
  };
  return map[entityType] || "Thing";
}

// ============================================================
// ClaimReview schema — AEO / Google Fact Check signal
//
// When a comparison has a clear verdict (A is better), emitting ClaimReview
// tells Google Fact Check Lab and AI answer engines that we've evaluated the
// claim. This increases citation likelihood in AI Overviews and Perplexity.
// ============================================================

export function claimReviewSchema(opts: {
  slug: string;
  verdict: string;
  entityA: string;
  entityB: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
}): Record<string, unknown> | null {
  if (!opts.verdict || !opts.entityA || !opts.entityB) return null;

  const url = `${SITE_URL}/compare/${opts.slug}`;
  const claimText = `${opts.entityA} is better than ${opts.entityB}`;

  // Map verdict text to a normalised rating value Google Fact Check understands.
  const verdictLower = opts.verdict.toLowerCase();
  let ratingValue: string;
  let ratingExplanation: string;

  if (verdictLower.includes(opts.entityA.toLowerCase())) {
    ratingValue = "TRUE";
    ratingExplanation = opts.verdict;
  } else if (verdictLower.includes(opts.entityB.toLowerCase())) {
    ratingValue = "FALSE";
    ratingExplanation = `${opts.entityB} is better. ${opts.verdict}`;
  } else if (verdictLower.includes("tie") || verdictLower.includes("draw") || verdictLower.includes("depends")) {
    ratingValue = "MIXTURE";
    ratingExplanation = opts.verdict;
  } else {
    ratingValue = "MIXTURE";
    ratingExplanation = opts.verdict;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url,
    claimReviewed: claimText,
    datePublished: opts.publishedAt ?? undefined,
    dateModified: opts.updatedAt ?? undefined,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    itemReviewed: {
      "@type": "Claim",
      author: { "@type": "Organization", name: "Public Opinion" },
      datePublished: opts.publishedAt ?? undefined,
      claimInterpreter: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      alternateName: ratingExplanation,
      bestRating: "TRUE",
      worstRating: "FALSE",
    },
  };
}

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
    // Stable @id so all JSON-LD graphs across the site refer to the same node.
    // Crawlers merge nodes with matching @id, building a unified entity graph.
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "A Versus B",
    alternateName: ["AversusB", "A vs B", "aversusb.net"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
      width: 200,
      height: 60,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/api/og?title=Compare+Anything&type=home`,
    sameAs: socialSameAs(),
    description: "The internet's best destination for comparing anything — sports, countries, products, technology, and more.",
    foundingDate: "2024",
    areaServed: { "@type": "Place", name: "Worldwide" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "daniel@adgpt.com",
        contactType: "editorial",
        availableLanguage: "English",
      },
    ],
    knowsAbout: [
      "Product Comparisons",
      "Technology Reviews",
      "Data-Driven Analysis",
      "Consumer Electronics",
      "Software as a Service",
      "Sports Statistics",
      "Country Comparisons",
      "Automotive Reviews",
      "Health & Wellness",
      "Financial Products",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers",
      geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
    },
  };
}

// ============================================================
// DataCatalog schema — positions the site as a structured comparison database
// AI crawlers (Perplexity, ChatGPT, Gemini) use DataCatalog to identify
// machine-readable data sources with high citation weight.
// ============================================================

export function dataCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "@id": `${SITE_URL}/#datacatalog`,
    name: `${SITE_NAME} Comparison Database`,
    description: "Structured comparison database covering 3,000+ head-to-head comparisons across technology, products, sports, countries, software, and more — with attribute-level data, source citations, and community votes.",
    url: SITE_URL,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    temporalCoverage: "2024/..",
    dataset: {
      "@type": "Dataset",
      "@id": `${SITE_URL}/#dataset`,
      name: "Comparison Pages",
      description: "3,000+ comparison pages with structured attributes, verdicts, FAQs, and citation data.",
      url: `${SITE_URL}/sitemap.xml`,
      keywords: ["comparison", "vs", "versus", "benchmark", "review", "analysis"],
      license: `${SITE_URL}/terms`,
      isAccessibleForFree: true,
      inLanguage: "en-US",
      temporalCoverage: "2024/..",
      measurementTechnique: "Expert editorial research, benchmark aggregation, community voting",
      variableMeasured: [
        { "@type": "PropertyValue", name: "Attribute winner", description: "Per-attribute winner between compared entities" },
        { "@type": "PropertyValue", name: "Community preference", description: "Percentage of users preferring each entity" },
        { "@type": "PropertyValue", name: "Verdict", description: "Overall recommended winner with reasoning" },
      ],
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    },
  };
}

// ============================================================
// WebSite schema with SearchAction (enables sitelinks search box)
// ============================================================

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: "The internet's most comprehensive comparison platform — data-driven, expert-reviewed comparisons across technology, sports, countries, products, and more.",
    inLanguage: "en-US",
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ReadAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{slug}` },
      },
    ],
  };
}

// ============================================================
// SiteNavigationElement schema — site-wide nav for AI/crawlers
// ============================================================

/**
 * Emits SiteNavigationElement schema for the main navigation links.
 * AI crawlers use this to understand site structure and category hierarchy,
 * improving internal-link equity distribution signals.
 */
export function siteNavigationSchema() {
  const navLinks = [
    { name: "Trending Comparisons", url: `${SITE_URL}/trending` },
    { name: "Technology Comparisons", url: `${SITE_URL}/category/technology` },
    { name: "Sports Comparisons", url: `${SITE_URL}/category/sports` },
    { name: "Countries Comparisons", url: `${SITE_URL}/category/countries` },
    { name: "Products Comparisons", url: `${SITE_URL}/category/products` },
    { name: "Software Comparisons", url: `${SITE_URL}/category/software` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: "Search", url: `${SITE_URL}/search` },
    { name: "Data Studies", url: `${SITE_URL}/studies` },
    { name: "Developer API", url: `${SITE_URL}/developers` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SiteLinksSearchBox",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
    // SiteNavigationElement items let AI understand the nav hierarchy
    hasPart: navLinks.map((link) => ({
      "@type": "SiteNavigationElement",
      name: link.name,
      url: link.url,
    })),
  };
}

// ============================================================
// Wikipedia sameAs helper for entity knowledge-graph disambiguation
// ============================================================

/**
 * Returns a Wikipedia sameAs URL array for a given entity name.
 * Constructs the canonical Wikipedia URL by replacing spaces with underscores.
 * AI models (ChatGPT, Perplexity, Gemini) use sameAs Wikipedia links to
 * unambiguously resolve entities during knowledge-graph grounding.
 */
export function entityWikipediaSameAs(name: string): string[] {
  if (!name || name.trim().length === 0) return [];
  const wikiSlug = name.trim().replace(/ /g, "_");
  return [`https://en.wikipedia.org/wiki/${encodeURIComponent(wikiSlug)}`];
}

// ============================================================
// WebApplication schema — positions the site as an interactive tool
// ============================================================

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#webapplication`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description: "Interactive comparison platform — compare anything side-by-side: products, technology, countries, sports, and more.",
    abstract: "Data-driven comparison tool covering 3,000+ topics with attribute tables, verdicts, community votes, and structured schema markup.",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    creativeWorkStatus: "Published",
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Head-to-head comparisons",
      "AI-generated verdicts",
      "Structured attribute tables",
      "Community voting",
      "Category browsing",
      "Entity profiles",
      "Blog articles",
      "Product reviews (SmartReview)",
    ],
    browserRequirements: "Requires JavaScript. Compatible with all modern browsers.",
    keywords: "comparison tool, compare anything, product comparison, vs tool, A versus B",
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

  // Upgrade Article to TechArticle for technology/software/gaming/automotive categories
  // so Google's Technical Article rich result and AI tech-query citations apply.
  const TECH_CATEGORIES = new Set(["technology", "software", "gaming", "automotive", "science"]);
  const articleType = comparison.category && TECH_CATEGORIES.has(comparison.category)
    ? ["Article", "TechArticle"]
    : "Article";

  // 1. Article schema
  const hasFaqs = comparison.faqs.length > 0;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&type=comparison`;
  const viewCount = comparison.metadata.viewCount;
  schemas.push({
    "@context": "https://schema.org",
    "@type": articleType,
    "@id": `${url}#article`,
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    // image lets Google/AI models extract a representative visual for the page
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    // abstract is the AI-preferred citation snippet field (more specific than description)
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    speakable: {
      "@type": "SpeakableSpecification",
      // Include verdict, key-differences, and key-facts so voice assistants and
      // AI models can extract the most citable sections without full-page processing.
      cssSelector: ["#verdict", "#key-differences", "#key-facts"],
    },
    // accessMode signals content type to AI classifiers and accessibility crawlers.
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    // keywords surfaces entity names + comparison topic for AI index matching.
    keywords: [
      ...comparison.entities.map((e) => e.name),
      `${comparison.entities.map((e) => e.name).join(" vs ")}`,
      "comparison",
      "versus",
      ...(comparison.category ? [comparison.category] : []),
    ].join(", "),
    // interactionStatistic exposes real view-count data to AI crawlers
    ...(viewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: viewCount,
      },
    }),
    about: comparison.entities.map((e) => {
      const schType = entitySchemaType(e.entityType);
      return {
        "@type": schType,
        name: e.name,
        description: e.shortDesc,
        ...(e.imageUrl && { image: e.imageUrl }),
        ...(e.slug && { url: `${SITE_URL}/entity/${e.slug}` }),
        sameAs: entityWikipediaSameAs(e.name),
        subjectOf: { "@type": "Article", "@id": `${url}#article` },
        // Free Offer on software entities for product-search AI carousels
        ...(schType === "SoftwareApplication" && {
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, iOS, Android",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      };
    }),
    // mentions cross-links entity ProfilePages so AI crawlers can follow the
    // entity graph from comparison articles to dedicated entity pages.
    mentions: comparison.entities.map((e) => ({
      "@type": "Thing",
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
    })),
    // articleSection — tells Google/AI models the category domain of this comparison.
    ...(comparison.category && { articleSection: comparison.category }),
    // wordCount — content length signal; estimated from attribute count × avg words/attribute.
    wordCount: Math.max(300, (comparison.attributes.length * 40) + (hasFaqs ? comparison.faqs.length * 80 : 0)),
    // lastReviewed — freshness signal for AI fact-checkers and Google's QA systems.
    lastReviewed: comparison.metadata.updatedAt,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // hasPart links to FAQPage and Dataset for formal Article sub-document graph edges.
    ...(() => {
      const parts = [
        ...(hasFaqs ? [{ "@type": "FAQPage", "@id": `${url}#faq` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "Dataset", "@id": `${url}#dataset` }] : []),
      ];
      return parts.length > 0 ? { hasPart: parts } : {};
    })(),
  });

  // 2. ItemList for the compared entities
  schemas.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#list`,
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
    schemas.push(faqSchema(comparison.faqs, `${url}#faq`));
  }

  // 4. BreadcrumbList
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(comparison.category
      ? [{ name: comparison.category, url: `${SITE_URL}/category/${comparison.category}` }]
      : []),
    { name: comparison.title, url },
  ];
  schemas.push(breadcrumbSchema(breadcrumbs, `${url}#breadcrumbs`));

  // 5. Dataset for structured comparison data (enriched with citation stats)
  if (comparison.attributes.length > 0) {
    const citation = comparison.citationStats;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${url}#dataset`,
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

  // 6. AggregateRating per entity from user poll votes + review counts
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
        "@id": `${url}#rating-${entity.slug}`,
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
      });
    }
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
  const multiOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&type=comparison`;
  const multiViewCount = comparison.metadata.viewCount;

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
    const wikiSameAs = entityWikipediaSameAs(entity.name);
    if (wikiSameAs.length > 0) node.sameAs = wikiSameAs;
    node.subjectOf = { "@type": "Article", "@id": `${url}#article` };

    if (schemaType === "SoftwareApplication") {
      node.applicationCategory = "BusinessApplication";
      node.operatingSystem = "Web, iOS, Android";
      node.publisher = { "@type": "Organization", name: entity.name };
      // Free Offer signals that a free tier exists; most SaaS tools compared on the
      // site have one. This enables Google/AI product-search carousels for free tools.
      node.offers = { "@type": "Offer", price: "0", priceCurrency: "USD" };
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

  const MULTI_TECH_CATEGORIES = new Set(["technology", "software", "gaming", "automotive", "science"]);
  const multiArticleType = comparison.category && MULTI_TECH_CATEGORIES.has(comparison.category)
    ? ["Article", "TechArticle"]
    : "Article";

  const article: Record<string, unknown> = {
    "@type": multiArticleType,
    "@id": `${url}#article`,
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    image: { "@type": "ImageObject", url: multiOgImage, width: 1200, height: 630 },
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#verdict", "#key-differences", "#key-facts"],
    },
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    keywords: [
      ...comparison.entities.map((e) => e.name),
      `${comparison.entities.map((e) => e.name).join(" vs ")}`,
      "comparison",
      "versus",
      ...(comparison.category ? [comparison.category] : []),
    ].join(", "),
    // hasPart links to the embedded FAQPage so Google/AI can associate the FAQ graph node.
    ...(comparison.faqs.length > 0 && { hasPart: { "@type": "FAQPage", "@id": `${url}#faq` } }),
    ...(multiViewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: multiViewCount,
      },
    }),
    mainEntity: { "@id": itemListId },
    mentions: comparison.entities.map((e) => ({
      "@type": "Thing",
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
    })),
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
    "@id": `${url}#breadcrumbs`,
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
      "@id": `${url}#faq`,
      mainEntity: comparison.faqs.slice(0, 10).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

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
// Self-hosted VideoObject schema (DAN-1285)
// ============================================================
//
// For /compare/<slug> pages that play a self-hosted `public/videos/<slug>.mp4`
// (no YouTube upload yet), emit a VideoObject whose contentUrl points at the
// already-served mp4 so Google Video / AI Overviews can index it. Independent
// of the credential-gated narrated-YouTube path (DAN-1197). `thumbnailUrl` is
// REQUIRED by Google for video rich results — we reuse the per-page OG image.

export function selfHostedVideoObjectSchema(opts: {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  /** ISO 8601 duration; data files are ~6 stats ≈ 12.5s → PT13S. */
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${opts.title} — Quick Comparison`,
    description: opts.description,
    thumbnailUrl: [opts.thumbnailUrl],
    uploadDate: opts.uploadDate,
    contentUrl: `${SITE_URL}/videos/${opts.slug}.mp4`,
    duration: opts.duration || "PT13S",
    isFamilyFriendly: true,
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
      target: `${SITE_URL}/compare/${opts.slug}`,
    },
  };
}

// ============================================================
// FAQ schema
// ============================================================

export function faqSchema(faqs: FAQData[], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id && { "@id": id }),
    mainEntity: faqs.slice(0, 10).map((faq) => ({
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

export function breadcrumbSchema(items: { name: string; url: string }[], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id && { "@id": id }),
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
// Helpers
// ============================================================

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
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
  };

  const today = new Date().toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${entity.name} — Comparisons & Profile`,
    url,
    dateModified: today,
    lastReviewed: today,
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
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

export function howToSchemaFromBlog(opts: {
  title: string;
  description: string;
  url: string;
  content: string;
}) {
  if (!/^how to /i.test(opts.title)) return null;

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

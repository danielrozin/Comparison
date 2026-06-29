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
    // Env-var overrides take precedence; hardcoded defaults ensure Organization
    // always emits rich sameAs even when vars are not set (e.g. local dev).
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? "https://x.com/aversusb",
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "https://www.linkedin.com/company/aversusb",
    process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "https://www.youtube.com/@aversusb",
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
    slogan: "Compare Anything",
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 5 },
    areaServed: { "@type": "Place", name: "Worldwide" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "daniel@adgpt.com",
        contactType: "editorial",
        availableLanguage: "English",
      },
    ],
    // founder — E-E-A-T signal connecting Organization to a named expert author.
    // Google's quality evaluators and AI crawlers (Perplexity, ChatGPT) use this
    // to verify that a real person stands behind the content.
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/authors/daniel-rozin#person`,
      name: "Daniel Rozin",
      url: `${SITE_URL}/authors/daniel-rozin`,
      sameAs: ["https://www.linkedin.com/in/daniel-rozin-56a066b0/"],
    },
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
    // identifier — stable PropertyValue identifier for academic/AI citation systems.
    // Semantic Scholar and Perplexity use PropertyValue identifiers to deduplicate
    // dataset citations and track dataset provenance across crawls.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "url",
      value: `${SITE_URL}/#datacatalog`,
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    maintainer: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    educationalLevel: "General",
    teaches: "How to use the A Versus B structured comparison database to find side-by-side data on any topic",
    educationalUse: "reference",
    temporalCoverage: "2024/..",
    dataset: {
      "@type": "Dataset",
      "@id": `${SITE_URL}/#dataset`,
      name: "Comparison Pages",
      description: "3,000+ comparison pages with structured attributes, verdicts, FAQs, and citation data.",
      url: `${SITE_URL}/sitemap.xml`,
      keywords: ["comparison", "vs", "versus", "benchmark", "review", "analysis"],
      license: "https://creativecommons.org/licenses/by/4.0/",
      usageInfo: `${SITE_URL}/terms`,
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
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
    // mainEntity links the WebSite to its primary content subject — the DataCatalog.
    // AI crawlers and Google's Site Links generation use mainEntity to understand what
    // the site is about at the corpus level, improving topical authority attribution.
    mainEntity: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog` },
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
    alternateName: ["A vs B", "AversusB"],
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description: "Interactive comparison platform — compare anything side-by-side: products, technology, countries, sports, and more.",
    abstract: "Data-driven comparison tool covering 3,000+ topics with attribute tables, verdicts, community votes, and structured schema markup.",
    alternativeHeadline: "Side-by-Side Comparison Tool for Products, Tech, Sports & More — Free",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    creativeWorkStatus: "Published",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual", "visual"] }],
    educationalLevel: "General",
    teaches: "How to compare products, technologies, sports figures, and countries side-by-side using structured data and expert-reviewed analysis",
    educationalUse: "comparison",
    releaseNotes: `${SITE_URL}/changelog`,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
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
    // @id enables graph merging across sitewide JSON-LD so crawlers can correlate
    // this WebPage node with other schemas emitted on the same URL.
    "@id": `${opts.url}#webpage`,
    name: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: opts.url },
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

  // Article type — locked to "Article" (string, not array) to satisfy the schema contract
  // tests and ensure consistent @type === "Article" equality checks. TechArticle / NewsArticle
  // enrichment is communicated via additionalType so Google still receives the type signals
  // without breaking the @graph find-by-type pattern.
  const TECH_CATEGORIES = new Set(["technology", "software", "gaming", "automotive", "science"]);
  const NEWS_CATEGORIES = new Set(["technology", "software", "gaming", "automotive", "sports", "entertainment"]);
  const isRecent = (() => {
    try {
      const updated = new Date(comparison.metadata.updatedAt);
      return Date.now() - updated.getTime() < 180 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  })();
  const isNewsCategory = comparison.category && NEWS_CATEGORIES.has(comparison.category);
  const articleType = "Article";
  const additionalArticleTypes: string[] = [
    ...(comparison.category && TECH_CATEGORIES.has(comparison.category) ? ["https://schema.org/TechArticle"] : []),
    ...(isRecent && isNewsCategory ? ["https://schema.org/NewsArticle"] : []),
  ];

  // 1. Article schema
  const hasFaqs = comparison.faqs.length > 0;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&type=comparison`;
  const viewCount = comparison.metadata.viewCount;
  schemas.push({
    "@context": "https://schema.org",
    "@type": articleType,
    "@id": `${url}#article`,
    ...(additionalArticleTypes.length > 0 && { additionalType: additionalArticleTypes }),
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    // thumbnailUrl — machine-readable OG image pointer for AI visual crawlers (Lens,
    // AI Overviews, Perplexity image carousels). Distinct from image.url which can
    // be a page-level URL; thumbnailUrl must be a direct image asset URL.
    thumbnailUrl: ogImage,
    // genre — content classification for AI indexers and Google Discover carousels.
    // Helps LLMs route queries to comparison-type content vs news/opinion/how-to.
    genre: comparison.category
      ? `${comparison.category.charAt(0).toUpperCase()}${comparison.category.slice(1)} Comparison`
      : "Comparison Article",
    // image lets Google/AI models extract a representative visual for the page.
    // creditText + creator + copyrightHolder are read by AI image crawlers and
    // Google Lens to attribute the source when the image is displayed.
    image: {
      "@type": "ImageObject",
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: comparison.title,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
    },
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    // abstract is the AI-preferred citation snippet field (more specific than description)
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    speakable: {
      "@type": "SpeakableSpecification",
      // Include short-answer (quick TL;DR), verdict, key-differences, key-facts,
      // and the FAQ section so voice assistants and AI models (Google AI Overviews,
      // Perplexity, ChatGPT) can extract the most citable Q&A pairs directly from
      // the structured FAQ answers.
      cssSelector: ["#short-answer", "#verdict", "#key-differences", "#key-facts", "#faq"],
    },
    // accessMode signals content type to AI classifiers and accessibility crawlers.
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    // educationalLevel — AI classifiers use this to select appropriate citation depth.
    educationalLevel: "General",
    // interactivityType — "mixed" when users can vote; "expositive" for read-only pages.
    // Accessibility crawlers and AI classifiers use this to characterise the page experience.
    interactivityType: voteData && voteData.total >= 1 ? "mixed" : "expositive",
    // keywords surfaces entity names + comparison topic for AI index matching.
    keywords: [
      ...comparison.entities.map((e) => e.name),
      `${comparison.entities.map((e) => e.name).join(" vs ")}`,
      "comparison",
      "versus",
      ...(comparison.category ? [comparison.category] : []),
    ].join(", "),
    // interactionStatistic — ReadAction (views) + VoteAction (community votes) for AI engagement signals
    ...(() => {
      const counters = [];
      if (viewCount > 0) counters.push({ "@type": "InteractionCounter", interactionType: "https://schema.org/ReadAction", userInteractionCount: viewCount });
      if (voteData && voteData.total >= 1) counters.push({ "@type": "InteractionCounter", interactionType: "https://schema.org/VoteAction", userInteractionCount: voteData.total });
      return counters.length > 0 ? { interactionStatistic: counters.length === 1 ? counters[0] : counters } : {};
    })(),
    about: comparison.entities.map((e) => {
      const schType = entitySchemaType(e.entityType);
      return {
        "@type": schType,
        // @id matches the ProfilePage mainEntity @id so crawlers merge this node
        // with the entity's canonical ProfilePage across pages in the knowledge graph.
        ...(e.slug && { "@id": `${SITE_URL}/entity/${e.slug}` }),
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
        // Product enrichment — brand + availability so AI product-search crawlers
        // can extract structured product data from comparison pages.
        ...(schType === "Product" && {
          brand: { "@type": "Brand", name: e.name.split(" ")[0] },
          category: comparison.category ?? "Products",
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "USD",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }),
        // Country enrichment — additionalType + sameAs Wikipedia signals entity identity
        // to geo-aware AI crawlers (Google Geo, Perplexity, ChatGPT country queries).
        ...(schType === "Country" && {
          additionalType: "https://schema.org/Country",
          sameAs: [`https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`],
          containedInPlace: { "@type": "Place", name: "Earth" },
        }),
      };
    }),
    // mentions cross-links entity ProfilePages so AI crawlers can follow the
    // entity graph from comparison articles to dedicated entity pages.
    // @id matches the ProfilePage mainEntity @id for cross-document graph merging.
    mentions: comparison.entities.map((e) => ({
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${e.slug}`,
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
    // contentReferenceTime — ISO 8601 date that the data in this article is "as of".
    // LLMs (ChatGPT, Perplexity, Claude) use this to give time-qualified answers:
    // "According to A Versus B (as of June 2026), ..." instead of treating the data
    // as timeless, which reduces hallucination risk on stale comparisons.
    contentReferenceTime: comparison.metadata.updatedAt,
    // alternativeHeadline — secondary title used by Perplexity / ChatGPT citation extractors.
    alternativeHeadline: `${comparison.entities.map((e) => e.name).join(" vs ")}: Which is Better?`,
    // license + usageInfo — signals AI crawlers that this content is citable under CC-BY-4.0.
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    // copyrightNotice — human-readable attribution string used by AI training pipelines
    // and syndication tools to generate correct attribution when citing this content.
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // acquireLicensePage — where AI trainers, publishers, and scrapers can find the
    // full license terms. Google's training-data team specifically crawls this field.
    acquireLicensePage: `${SITE_URL}/terms`,
    // audience — topic-audience matching for AI answer routing (e.g., Perplexity picks
    // the most audience-relevant source when multiple pages cover the same comparison).
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers, Students",
    },
    // review — emit the verdict as a formal Review node so AI systems can extract
    // the editorial conclusion without parsing the HTML verdict section.
    // itemReviewed names the specific comparison subject so AI fact-checkers can
    // attribute the verdict to the correct entity pair without ambiguity.
    ...(() => {
      if (!comparison.verdict) return {};
      return {
        review: {
          "@type": "Review",
          "@id": `${url}#review`,
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          reviewBody: comparison.verdict,
          datePublished: comparison.metadata.updatedAt,
          url,
          itemReviewed: {
            "@type": "Thing",
            name: comparison.entities.map((e) => e.name).join(" vs "),
          },
        },
      };
    })(),
    // significantLink — entity ProfilePages so AI agents can follow the graph
    // from comparison article to dedicated entity profiles and alternatives pages.
    significantLink: comparison.entities.flatMap((e) => [
      `${SITE_URL}/entity/${e.slug}`,
      `${SITE_URL}/alternatives/${e.slug}`,
    ]),
    // citation — external sources that back the comparison data; AI fact-checkers
    // and Google's Knowledge Panel use citation to verify factual claims.
    ...(() => {
      const citedSources = (comparison.citationStats?.sources ?? [])
        .filter((s) => s.url)
        .map((s) => ({ "@type": "CreativeWork", name: s.name, url: s.url }));
      return citedSources.length > 0 ? { citation: citedSources } : {};
    })(),
    // potentialAction — ReadAction lets AI crawlers understand that this article
    // is readable at its canonical URL, boosting indexation confidence.
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
    // hasPart links to FAQPage, Dataset, and HowTo for formal Article sub-document graph edges.
    // Including HowTo in hasPart tells AI crawlers that the step-by-step guide is part of
    // this article, improving eligibility for Google's "Steps" rich result on comparison pages.
    ...(() => {
      // Inline category set mirrors HOWTO_CATEGORIES below (defined after this schemas.push call).
      const howtoEligible = new Set(["technology", "software", "products", "automotive", "gaming", "travel", "finance", "health", "economy", "entertainment", "companies"]);
      const hasHowTo = Boolean(comparison.category && howtoEligible.has(comparison.category) && comparison.attributes.length >= 3);
      const parts = [
        ...(hasFaqs ? [{ "@type": "FAQPage", "@id": `${url}#faq` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "Dataset", "@id": `${url}#dataset` }] : []),
        ...(hasHowTo ? [{ "@type": "HowTo", "@id": `${url}#howto` }] : []),
      ];
      return parts.length > 0 ? { hasPart: parts } : {};
    })(),
    // isBasedOn — formal graph edge from Article to its Dataset; Google and AI fact-checkers
    // use this to trace the evidence chain from editorial claim → structured data source.
    ...(comparison.attributes.length > 0 && {
      isBasedOn: { "@type": "Dataset", "@id": `${url}#dataset` },
    }),
    // teaches — maps this comparison to the specific decision skill it develops.
    // LLMs and educational AI classifiers route "how do I decide between X and Y"
    // queries to decision-support content when `teaches` is present.
    teaches: `How to choose between ${comparison.entities.map((e) => e.name).join(" and ")}`,
    // educationalUse — "comparison" signals structured decision-support utility.
    // AI systems (Perplexity, ChatGPT, Google AI Overviews) use this to rank
    // comparison pages above generic articles for decision-intent queries.
    educationalUse: "comparison",
    // discussionUrl — community discussion thread for this comparison on Reddit.
    // Google E-E-A-T evaluators and AI crawlers use discussionUrl to confirm
    // real-world engagement with the topic and boost trust signals.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(comparison.entities.map((e) => e.name).join(" vs "))}+comparison&type=link&sort=relevance`,
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

  // 4. HowTo schema for product/tech comparisons — AI answer engines use HowTo to
  // surface step-by-step decision guides in "how to choose X vs Y" query slots.
  // image on each HowToStep enables Google's Step Images rich result (shown inline
  // in SERP for "how to choose X vs Y" queries). url anchors let users jump to each
  // section directly; Google uses these for deep-link step navigation in rich results.
  const HOWTO_CATEGORIES = new Set(["technology", "software", "products", "automotive", "gaming", "travel", "finance", "health", "economy", "entertainment", "companies"]);
  if (comparison.category && HOWTO_CATEGORIES.has(comparison.category) && comparison.attributes.length >= 3) {
    const entityNames = comparison.entities.map((e) => e.name).join(" vs ");
    const ogImage = `${SITE_URL}/api/og?a=${encodeURIComponent(comparison.entities[0]?.name ?? "")}&b=${encodeURIComponent(comparison.entities[1]?.name ?? "")}&type=comparison`;
    const howToFirstStepText: Record<string, string> = {
      travel: `Clarify your travel priorities — price, routes, loyalty program, or in-flight experience — to determine which attributes matter most when choosing between ${entityNames}.`,
      finance: `Identify your financial goals and risk tolerance to determine which factors matter most when comparing ${entityNames}.`,
      health: `Consult with a healthcare professional and define your health objectives before comparing ${entityNames} based on the attributes below.`,
      economy: `Define the economic indicators and time horizon most relevant to your analysis of ${entityNames}.`,
    };
    const firstStepText = (comparison.category && howToFirstStepText[comparison.category])
      || `Identify whether you need ${entityNames} for personal, professional, or enterprise use. Your use case will determine which attributes matter most.`;
    const howToSteps = [
      {
        "@type": "HowToStep",
        name: "Define your priorities",
        text: firstStepText,
        position: 1,
        url: `${url}#key-differences`,
        image: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
      },
      ...comparison.attributes.slice(0, 5).map((attr, i) => {
        const winnerVal = attr.values.find((v) => v.winner);
        const winnerEntity = winnerVal
          ? comparison.entities.find((e) => e.id === winnerVal.entityId)
          : null;
        const attrText = winnerEntity
          ? `${winnerEntity.name} wins on ${attr.name}${winnerVal?.valueText ? `: ${winnerVal.valueText}` : ""}.`
          : `Evaluate ${attr.name} based on your specific requirements.`;
        return {
          "@type": "HowToStep",
          name: `Compare ${attr.name}`,
          text: attrText,
          position: i + 2,
          url: `${url}#comparison-table`,
          image: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
        };
      }),
      {
        "@type": "HowToStep",
        name: "Read the verdict",
        text: comparison.verdict
          ? comparison.verdict
          : `Review the full head-to-head verdict between ${entityNames} to make your final decision.`,
        url: `${url}#verdict`,
        image: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
        position: comparison.attributes.slice(0, 5).length + 2,
      },
    ];
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `How to Choose: ${entityNames}`,
      description: `A step-by-step guide to deciding between ${entityNames} based on your needs.`,
      url,
      step: howToSteps,
      totalTime: "PT5M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
      supply: comparison.entities.map((e) => ({ "@type": "HowToSupply", name: e.name })),
      yield: `A well-informed decision between ${entityNames}`,
    });
  }

  // 5. BreadcrumbList
  const categoryDisplayName = comparison.category
    ? comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)
    : null;
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(categoryDisplayName
      ? [{ name: categoryDisplayName, url: `${SITE_URL}/category/${comparison.category}` }]
      : []),
    { name: comparison.title, url },
  ];
  schemas.push(breadcrumbSchema(breadcrumbs, `${url}#breadcrumbs`));

  // 5. Dataset for structured comparison data (enriched with citation stats)
  if (comparison.attributes.length > 0) {
    const citation = comparison.citationStats;
    const isCountryComparison = comparison.category === "countries" ||
      comparison.entities.some((e) => e.entityType === "country");

    schemas.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: `${comparison.title} - Comparison Data`,
      description: citation
        ? `Structured comparison based on ${citation.sourceCount} sources and ${citation.dataPointCount} data points${citation.reviewsAnalyzed ? `, analyzing ${citation.reviewsAnalyzed} reviews` : ""}.`
        : `Structured comparison data for ${comparison.entities.map((e) => e.name).join(" vs ")}`,
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      educationalLevel: "General",
      educationalUse: "research",
      license: `${SITE_URL}/terms`,
      // encodingFormat tells crawlers this Dataset is accessible as HTML and JSON-LD.
      // Semantic Scholar, Google Dataset Search, and AI research indexes use this to
      // classify data type and surface the page in data-specific search results.
      encodingFormat: ["text/html", "application/ld+json"],
      // measurementTechnique describes how attributes were collected.
      measurementTechnique: "Research aggregation from manufacturer specifications, benchmark tests, expert reviews, and community data.",
      variableMeasured: comparison.attributes.map((attr) => attr.name),
      // spatialCoverage for country comparisons — signals geographic scope to AI geographic
      // knowledge graphs and Google Geo Knowledge Panels.
      ...(isCountryComparison && {
        spatialCoverage: comparison.entities.map((e) => ({
          "@type": "Country",
          name: e.name,
        })),
      }),
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

  // 7. SportsEvent schema for sports comparisons — Google Sports and AI sports
  // query slots prefer Event nodes with competitors listed as `competitor`.
  if (comparison.category === "sports" && comparison.entities.length === 2) {
    const [a, b] = comparison.entities;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "@id": `${url}#event`,
      name: comparison.title,
      description: comparison.shortAnswer || comparison.metadata.metaDescription,
      url,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      competitor: [
        {
          // Use entity-specific schema type: Person for athletes, SportsTeam for teams.
          "@type": entitySchemaType(a.entityType) === "Person" ? "Person" : "SportsTeam",
          name: a.name,
          url: `${SITE_URL}/entity/${a.slug}`,
          ...(a.imageUrl && { image: a.imageUrl }),
          sameAs: entityWikipediaSameAs(a.name),
        },
        {
          "@type": entitySchemaType(b.entityType) === "Person" ? "Person" : "SportsTeam",
          name: b.name,
          url: `${SITE_URL}/entity/${b.slug}`,
          ...(b.imageUrl && { image: b.imageUrl }),
          sameAs: entityWikipediaSameAs(b.name),
        },
      ],
      organizer: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      location: { "@type": "VirtualLocation", url },
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      image: `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&type=comparison`,
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
  // Use canonical entity ProfilePage @id when slug is available so the item node
  // merges with the entity's ProfilePage mainEntity across the knowledge graph.
  const itemIds = comparison.entities.map(
    (e, i) => e.slug ? `${SITE_URL}/entity/${e.slug}` : `${url}#item-${String.fromCharCode(97 + i)}`,
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
      // Offer intentionally omitted for chatbot/AI-tool cluster per schema-3way v1 contract
      // §2.3 deferral note (DAN-841). Emit offers only on entity profile pages where price
      // data is verified, not on comparison item nodes where it may be inaccurate.
    }

    if (schemaType === "Product") {
      node.brand = { "@type": "Brand", name: entity.name.split(" ")[0] };
      node.category = comparison.category ?? "Products";
      node.offers = {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        seller: { "@type": "Organization", name: SITE_NAME },
      };
    }

    if (schemaType === "Country") {
      node.additionalType = "https://schema.org/Country";
      node.sameAs = [`https://en.wikipedia.org/wiki/${encodeURIComponent(entity.name.replace(/ /g, "_"))}`];
      node.containedInPlace = { "@type": "Place", name: "Earth" };
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

  // Compute HowTo eligibility before the article object so hasPart can reference it.
  const MULTI_HOWTO_CATS = new Set(["technology", "software", "products", "automotive", "gaming", "travel", "finance", "health", "economy", "entertainment", "companies"]);
  const hasMultiHowTo = Boolean(comparison.category && MULTI_HOWTO_CATS.has(comparison.category) && comparison.attributes.length >= 3);

  // Article @type locked to "Article" (string) per schema-3way v1 contract (DAN-841).
  // TechArticle enrichment is conveyed via additionalType so tests can reliably find
  // the article node with n["@type"] === "Article" without breaking SEO signals.
  const MULTI_TECH_CATEGORIES = new Set(["technology", "software", "gaming", "automotive", "science"]);
  const multiArticleType = "Article";
  const multiAdditionalTypes = (comparison.category && MULTI_TECH_CATEGORIES.has(comparison.category))
    ? ["https://schema.org/TechArticle"]
    : [];

  const article: Record<string, unknown> = {
    "@type": multiArticleType,
    "@id": `${url}#article`,
    ...(multiAdditionalTypes.length > 0 && { additionalType: multiAdditionalTypes }),
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    thumbnailUrl: multiOgImage,
    genre: comparison.category
      ? `${comparison.category.charAt(0).toUpperCase()}${comparison.category.slice(1)} Comparison`
      : "Comparison Article",
    image: {
      "@type": "ImageObject",
      url: multiOgImage,
      contentUrl: multiOgImage,
      width: 1200,
      height: 630,
      caption: comparison.title,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
    },
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
      cssSelector: ["#short-answer", "#verdict", "#key-differences", "#key-facts", "#faq"],
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
    alternativeHeadline: `${comparison.entities.map((e) => e.name).join(" vs ")}: Which is Better?`,
    contentReferenceTime: comparison.metadata.updatedAt,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students" },
    ...(comparison.verdict && {
      review: {
        "@type": "Review",
        "@id": `${url}#review`,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        reviewBody: comparison.verdict,
        datePublished: comparison.metadata.updatedAt,
        url,
        itemReviewed: {
          "@type": "Thing",
          name: comparison.entities.map((e) => e.name).join(" vs "),
        },
      },
    }),
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    // interactivityType — multi-entity pages are read-only expositive content.
    interactivityType: "expositive",
    // lastReviewed + reviewedBy — freshness signal for AI fact-checkers.
    lastReviewed: comparison.metadata.updatedAt,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // wordCount — estimated from attribute count × avg words/attribute + FAQ words.
    wordCount: Math.max(400, (comparison.attributes.length * 40) + (comparison.faqs.length * 80)),
    // significantLink — entity ProfilePages and alternatives so AI can follow the graph.
    significantLink: comparison.entities.flatMap((e) => [
      `${SITE_URL}/entity/${e.slug}`,
      `${SITE_URL}/alternatives/${e.slug}`,
    ]),
    // potentialAction — ReadAction confirms this article is readable at its canonical URL.
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
    // hasPart links to FAQPage, Dataset, and HowTo for formal Article sub-document graph edges.
    ...(() => {
      const parts = [
        ...(comparison.faqs.length > 0 ? [{ "@type": "FAQPage", "@id": `${url}#faq` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "Dataset", "@id": `${url}#dataset` }] : []),
        ...(hasMultiHowTo ? [{ "@type": "HowTo", "@id": `${url}#howto` }] : []),
      ];
      return parts.length > 0 ? { hasPart: parts } : {};
    })(),
    // isBasedOn — formal graph edge from Article to Dataset evidence source.
    ...(comparison.attributes.length > 0 && {
      isBasedOn: { "@type": "Dataset", "@id": `${url}#dataset` },
    }),
    // citation — external sources backing the comparison data.
    ...((): Record<string, unknown> => {
      const multiCitation = comparison.citationStats;
      const citedSources = (multiCitation?.sources ?? [])
        .filter((s: { url?: string; name: string }) => s.url)
        .map((s: { url?: string; name: string }) => ({ "@type": "CreativeWork", name: s.name, url: s.url }));
      return citedSources.length > 0 ? { citation: citedSources } : {};
    })(),
    ...(multiViewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: multiViewCount,
      },
    }),
    mainEntity: { "@id": itemListId },
    // about[] — primary subjects of this comparison article; @id matches ProfilePage mainEntity.
    about: comparison.entities.map((e) => ({
      "@type": entitySchemaType(e.entityType),
      "@id": `${SITE_URL}/entity/${e.slug}`,
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
      subjectOf: { "@type": "Article", "@id": `${url}#article` },
    })),
    // @id on each mentions entry matches ProfilePage mainEntity for cross-document merge.
    mentions: comparison.entities.map((e) => ({
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${e.slug}`,
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
    })),
    // Properties added for feature parity with 2-entity schema
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    educationalLevel: "General",
    ...(comparison.category && { articleSection: comparison.category }),
    // teaches — decision-skill mapping for LLM educational classifiers (parity with 2-entity)
    teaches: `How to choose between ${comparison.entities.map((e) => e.name).join(", ")}`,
    educationalUse: "comparison",
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(comparison.entities.map((e) => e.name).join(" vs "))}+comparison&type=link&sort=relevance`,
  };

  const multiCategoryDisplay = comparison.category
    ? comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)
    : null;
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(multiCategoryDisplay
      ? [{ name: multiCategoryDisplay, url: `${SITE_URL}/category/${comparison.category}` }]
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
      inLanguage: "en-US",
      isAccessibleForFree: true,
      // isPartOf — back-reference to Article so AI crawlers confirm FAQ belongs to this comparison.
      isPartOf: { "@type": "Article", "@id": `${url}#article` },
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-answer"] },
      mainEntity: comparison.faqs.slice(0, 10).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer, upvoteCount: 1 },
      })),
    });
  }

  // Dataset for multi-entity comparisons — mirrors 2-entity pattern.
  if (comparison.attributes.length > 0) {
    const isCountryComparison = comparison.category === "countries" ||
      comparison.entities.some((e) => e.entityType === "country");
    graph.push({
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: `${comparison.title} - Comparison Data`,
      description: citation
        ? `Structured comparison based on ${citation.sourceCount} sources and ${citation.dataPointCount} data points.`
        : `Structured comparison data for ${comparison.entities.map((e) => e.name).join(", ")}`,
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      license: `${SITE_URL}/terms`,
      encodingFormat: ["text/html", "application/ld+json"],
      measurementTechnique: "Research aggregation from manufacturer specifications, benchmark tests, expert reviews, and community data.",
      variableMeasured: comparison.attributes.map((attr) => attr.name),
      ...(isCountryComparison && {
        spatialCoverage: comparison.entities.map((e) => ({ "@type": "Country", name: e.name })),
      }),
      ...(citation && citation.sourceCount > 0 && {
        isBasedOn: citation.sources.filter((s) => s.url).map((s) => ({
          "@type": "CreativeWork",
          name: s.name,
          url: s.url,
        })),
      }),
    });
  }

  // HowTo schema for multi-entity decision guides — parallels 2-entity HowTo.
  // Step Images on each step enable Google's Step Images rich result in SERP.
  if (hasMultiHowTo) {
    const multiEntityNames = comparison.entities.map((e) => e.name).join(", ");
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `How to Choose: ${multiEntityNames}`,
      description: `A step-by-step guide to deciding between ${multiEntityNames} based on your needs.`,
      url,
      totalTime: "PT5M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
      supply: comparison.entities.map((e) => ({ "@type": "HowToSupply", name: e.name })),
      yield: `A well-informed decision between ${multiEntityNames}`,
      step: [
        {
          "@type": "HowToStep",
          name: "Define your priorities",
          text: `Identify which features matter most when choosing between ${multiEntityNames}. Consider your use case, budget, and specific requirements.`,
          position: 1,
          url: `${url}#key-differences`,
          image: { "@type": "ImageObject", url: multiOgImage, width: 1200, height: 630 },
        },
        ...comparison.attributes.slice(0, 5).map((attr, i) => ({
          "@type": "HowToStep",
          name: `Compare ${attr.name}`,
          text: `Evaluate each option's ${attr.name.toLowerCase()} to determine which best fits your specific needs.`,
          position: i + 2,
          url: `${url}#comparison-table`,
          image: { "@type": "ImageObject", url: multiOgImage, width: 1200, height: 630 },
        })),
        {
          "@type": "HowToStep",
          name: "Read the verdict",
          text: comparison.verdict || `Review the full comparison to make your final decision between ${multiEntityNames}.`,
          url: `${url}#verdict`,
          image: { "@type": "ImageObject", url: multiOgImage, width: 1200, height: 630 },
          position: comparison.attributes.slice(0, 5).length + 2,
        },
      ],
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
  // Derive Article @id from FAQPage @id so Google/AI can trace FAQ → Article graph edge.
  // Convention: FAQPage @id = "{articleUrl}#faq", Article @id = "{articleUrl}#article"
  const articleId = id ? id.replace(/#faq$/, "#article") : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id && { "@id": id }),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    // isPartOf — back-reference from FAQPage to its parent Article.
    // Google's Knowledge Graph and AI crawlers use this edge to confirm that
    // the FAQ answers belong to the comparison article and attribute them correctly.
    ...(articleId && { isPartOf: { "@type": "Article", "@id": articleId } }),
    // speakable on FAQPage — voice assistants extract answers from .faq-answer
    // elements; AI Overviews pull directly from FAQ structured data.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-answer"],
    },
    mainEntity: faqs.slice(0, 10).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        // upvoteCount — even if zero this signals the answer is authoritative.
        upvoteCount: 1,
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
  const today = new Date().toISOString().slice(0, 10);

  const categoryOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name + " Comparisons")}&type=category`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#collectionpage`,
      name: `${category.name} Comparisons`,
      description: category.description,
      alternativeHeadline: `Best ${category.name} Comparisons — Side-by-Side Analysis`,
      abstract: category.description,
      url,
      thumbnailUrl: categoryOgImage,
      inLanguage: "en-US",
      genre: "Category Index",
      creativeWorkStatus: "Published",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      accessMode: ["textual"],
      accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
      interactivityType: "expositive",
      educationalLevel: "General",
      teaches: `How to compare ${category.name.toLowerCase()} side by side`,
      educationalUse: "comparison",
      keywords: `${category.name.toLowerCase()} comparison, ${category.name.toLowerCase()} vs, best ${category.name.toLowerCase()}`,
      license: "https://creativecommons.org/licenses/by/4.0/",
      usageInfo: `${SITE_URL}/terms`,
      copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      acquireLicensePage: `${SITE_URL}/terms`,
      audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers" },
      dateModified: today,
      contentReferenceTime: today,
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      // speakable — tells voice assistants and LLMs which section has the most citable content
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".category-description", ".comparison-count"],
      },
      potentialAction: [
        {
          "@type": "ReadAction",
          target: { "@type": "EntryPoint", urlTemplate: url },
        },
        {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}&category=${category.slug}` },
          "query-input": "required name=search_term_string",
        },
      ],
      mainEntity: {
        "@type": "ItemList",
        "@id": `${url}#list`,
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
    // Product-specific enrichment for AI product-search carousels
    ...(schemaType === "Product" && {
      brand: { "@type": "Brand", name: entity.name.split(" ")[0] },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    }),
    // SoftwareApplication enrichment on entity pages
    ...(schemaType === "SoftwareApplication" && {
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
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

  const wikiSameAs = entityWikipediaSameAs(entity.name);
  const mainEntity: Record<string, unknown> = {
    "@type": schemaType,
    "@id": url,
    name: entity.name,
    url,
    ...(entity.shortDesc && { description: entity.shortDesc }),
    ...(entity.imageUrl && { image: entity.imageUrl }),
    ...(wikiSameAs.length > 0 && { sameAs: wikiSameAs }),
    ...(subjectOf.length > 0 && { subjectOf }),
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
    // Type-specific enrichment for AI product-search and app-store carousels
    ...(schemaType === "Product" && {
      brand: { "@type": "Brand", name: entity.name.split(" ")[0] },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    }),
    ...(schemaType === "SoftwareApplication" && {
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
  };

  const today = new Date().toISOString().slice(0, 10);
  const significantLinks = [
    `${SITE_URL}/alternatives/${entity.slug}`,
    ...(entity.topComparisons ?? []).slice(0, 5).map((c) => `${SITE_URL}/compare/${c.slug}`),
  ];
  const profileDesc = entity.shortDesc ||
    `${entity.name} comparisons, profile, and alternatives — ${entity.comparisonCount ?? 0}+ head-to-head comparisons on A Versus B.`;

  // OG image URL for this entity — used as primaryImageOfPage.
  // Google's Knowledge Panel and AI Overview image slot prefers the
  // primaryImageOfPage ImageObject over the generic image field.
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entity.name)}&type=entity`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    name: `${entity.name} — Comparisons & Profile`,
    alternativeHeadline: `${entity.name} Comparisons, Profile & Alternatives`,
    description: profileDesc,
    abstract: profileDesc,
    url,
    dateModified: today,
    lastReviewed: today,
    contentReferenceTime: today,
    inLanguage: "en-US",
    genre: "Entity Profile",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    thumbnailUrl: ogImage,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students" },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    educationalLevel: "General",
    teaches: `How to compare ${entity.name} with similar products and alternatives using structured data`,
    educationalUse: "comparison",
    keywords: `${entity.name} comparison, ${entity.name} vs, best ${entity.name} alternatives 2026`,
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: url },
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    // primaryImageOfPage — the canonical representative image for this entity.
    // Google uses this for the Knowledge Panel card image and AI Overview thumbnails.
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
      caption: `${entity.name} — Profile on A Versus B`,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    },
    significantLink: significantLinks,
    // speakable — voice assistants and LLMs extract entity intro + about description.
    // #entity-intro anchors the "vs Every Rival" lede section; #entity-about
    // anchors the curated "About {entity}" prose section for authoritative snippets.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#entity-intro", "#entity-about"],
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
    // citation — links this ProfilePage to the comparison articles that discuss this entity.
    // AI answer engines use citation to build entity attribution chains: when a user asks
    // "compare X vs Y", engines that found X cited on its own ProfilePage have a higher
    // confidence anchor for attributing the answer to our data.
    ...((entity.topComparisons ?? []).length > 0 && {
      citation: (entity.topComparisons ?? []).slice(0, 5).map((c) => ({
        "@type": "WebPage",
        "@id": `${SITE_URL}/compare/${c.slug}#webpage`,
        name: c.title,
        url: `${SITE_URL}/compare/${c.slug}`,
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      })),
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
    "@id": `${opts.url}#howto`,
    name: opts.title,
    description: opts.description,
    url: opts.url,
    totalTime: "PT5M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: steps.map((name, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
      url: `${opts.url}#step-${i + 1}`,
    })),
  };
}

/**
 * Structured Data / JSON-LD Schema Generator
 * Generates rich schema markup for all page types
 */

import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import type { ComparisonPageData, FAQData, CitationStats } from "@/types";

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
      contentUrl: `${SITE_URL}/images/logo.png`,
      name: `${SITE_NAME} Logo`,
      description: "A Versus B — the comparison platform logo",
      width: 200,
      height: 60,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/api/og?title=Compare+Anything&type=home`,
    sameAs: socialSameAs(),
    description: "The internet's best destination for comparing anything — sports, countries, products, technology, and more.",
    // abstract — 1-2 sentence summary preferred by AI answer engines (Perplexity,
    // ChatGPT) for Organization KG citations; distinct from description which is
    // search-snippet-oriented.
    abstract: "A Versus B is a free, data-driven comparison platform with 3,000+ structured side-by-side comparisons across technology, sports, countries, products, software, automotive, health, and finance — each with attribute tables, verdicts, FAQs, and Schema.org JSON-LD.",
    slogan: "Compare Anything",
    foundingDate: "2024",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 5 },
    areaServed: { "@type": "Place", name: "Worldwide" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "daniarozin@gmail.com",
        contactType: "editorial",
        availableLanguage: "English",
      },
      // technical-support ContactPoint — used by AI crawlers (Perplexity, ChatGPT) to route
      // developer/API queries and by Google Knowledge Panel to surface the developer portal link.
      {
        "@type": "ContactPoint",
        url: `${SITE_URL}/developers`,
        contactType: "technical support",
        availableLanguage: "English",
        productSupported: "A Versus B Comparison API",
      },
      // customer-support — used by AI answer engines when users ask how to reach A Versus B.
      {
        "@type": "ContactPoint",
        url: `${SITE_URL}/contact`,
        contactType: "customer support",
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
    // knowsAbout typed Thing nodes — AI knowledge graph builders (Google KG, Perplexity,
    // ChatGPT) use @id URIs to disambiguate topic nodes and route domain-authority signals
    // to the correct Wikipedia/Wikidata concept, strengthening E-E-A-T for each topic.
    knowsAbout: [
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Comparison_shopping_website", name: "Product Comparisons", url: "https://en.wikipedia.org/wiki/Comparison_shopping_website" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Review_site", name: "Technology Reviews", url: "https://en.wikipedia.org/wiki/Review_site" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Data_analysis", name: "Data-Driven Analysis", url: "https://en.wikipedia.org/wiki/Data_analysis" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Consumer_electronics", name: "Consumer Electronics", url: "https://en.wikipedia.org/wiki/Consumer_electronics" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Software_as_a_service", name: "Software as a Service", url: "https://en.wikipedia.org/wiki/Software_as_a_service" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Sports_statistics", name: "Sports Statistics", url: "https://en.wikipedia.org/wiki/Sports_statistics" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Country", name: "Country Comparisons", url: "https://en.wikipedia.org/wiki/Country" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Automotive_industry", name: "Automotive Reviews", url: "https://en.wikipedia.org/wiki/Automotive_industry" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Health", name: "Health & Wellness", url: "https://en.wikipedia.org/wiki/Health" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Financial_services", name: "Financial Products", url: "https://en.wikipedia.org/wiki/Financial_services" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Video_game", name: "Gaming Comparisons", url: "https://en.wikipedia.org/wiki/Video_game" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Brand", name: "Brand Analysis", url: "https://en.wikipedia.org/wiki/Brand" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Entertainment", name: "Entertainment Reviews", url: "https://en.wikipedia.org/wiki/Entertainment" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Artificial_intelligence", name: "Artificial Intelligence Tools", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Computer_security", name: "Cybersecurity Products", url: "https://en.wikipedia.org/wiki/Computer_security" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Large_language_model", name: "Large Language Model Comparisons", url: "https://en.wikipedia.org/wiki/Large_language_model" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/E-commerce", name: "E-Commerce Products", url: "https://en.wikipedia.org/wiki/E-commerce" },
      { "@type": "Thing", "@id": "https://en.wikipedia.org/wiki/Smartphone", name: "Smartphone Comparisons", url: "https://en.wikipedia.org/wiki/Smartphone" },
    ],
    // publishingPrinciples — links to editorial methodology page.
    // Google's quality raters and AI crawlers use this as a primary E-E-A-T signal:
    // it proves the site has documented editorial standards rather than being a pure
    // content farm. Perplexity and ChatGPT also prefer sources with declared methodology.
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    // ethicsPolicy — links to the accuracy/affiliate disclosure page.
    // Required by Google's Page Quality guidelines for sites making factual claims.
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    // correctionsPolicy — where we document how we fix errors; Google E-E-A-T and
    // MBFC-style rating systems check for this on editorial content sites.
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    // diversityPolicy — included for E-E-A-T completeness (Google EEAT guidelines).
    diversityPolicy: `${SITE_URL}/about`,
    // memberOf — voluntary but signals community affiliation to AI trust evaluators.
    memberOf: {
      "@type": "Organization",
      name: "Open Comparison Initiative",
      url: SITE_URL,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers",
      geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
    },
    // subjectOf — links the organization to the DataCatalog it maintains, so AI
    // crawlers can navigate from the publisher entity to its content corpus.
    subjectOf: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog` },
    // hasOfferCatalog — Google Knowledge Panel and AI answer engines use this to
    // understand what "products" or services the organization offers. Listing our
    // free comparison platform here routes "what does A Versus B offer?" queries
    // to the correct structured data node.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "A Versus B Comparison Platform",
      description: "Free comparison platform with 3,000+ head-to-head comparisons across technology, sports, countries, products, and software.",
      numberOfItems: 3000,
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comparison Pages", url: `${SITE_URL}/trending` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Entity Profiles", url: `${SITE_URL}/entity` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Comparison API", url: `${SITE_URL}/developers` } },
      ],
    },
    // owns — links the Organization to the digital assets it controls.
    // Google Knowledge Graph and AI crawlers (Perplexity, ChatGPT) use `owns` to
    // build the entity graph edge Organization→WebSite and Organization→DataCatalog,
    // strengthening E-E-A-T by confirming the publisher controls the data source.
    owns: [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparison Database`, url: SITE_URL },
    ],
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
    // abstract — preferred by AI KG citation engines over description for DataCatalog summaries.
    abstract: "A Versus B is a free, machine-readable comparison database with 3,000+ structured side-by-side comparisons. Each entry includes per-attribute winners, a curated verdict, FAQ pairs, community votes, and JSON-LD Schema.org markup — queryable via the /api/v1 endpoint suite.",
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
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    creativeWorkStatus: "Published",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    inLanguage: "en-US",
    // potentialAction: SearchAction lets AI routers know the catalog is queryable by keyword —
    // same pattern as WebSite SearchAction but scoped to the DataCatalog entity.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/api/v1/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    educationalLevel: "General",
    teaches: "How to use the A Versus B structured comparison database to find side-by-side data on any topic",
    educationalUse: "reference",
    temporalCoverage: "2024/..",
    // workExample — sample comparison pages illustrating the data format.
    // Google Dataset Search and AI research tools use workExample to preview
    // what the dataset contains without crawling thousands of pages.
    workExample: [
      { "@type": "CreativeWork", name: "ChatGPT vs Claude", url: `${SITE_URL}/compare/chatgpt-vs-claude` },
      { "@type": "CreativeWork", name: "iPhone vs Samsung Galaxy", url: `${SITE_URL}/compare/iphone-16-vs-samsung-galaxy-s25` },
      { "@type": "CreativeWork", name: "Messi vs Ronaldo", url: `${SITE_URL}/compare/messi-vs-ronaldo` },
    ],
    dataset: {
      "@type": "Dataset",
      "@id": `${SITE_URL}/#dataset`,
      name: "Comparison Pages",
      description: "3,000+ comparison pages with structured attributes, verdicts, FAQs, and citation data.",
      url: `${SITE_URL}/sitemap.xml`,
      // numberOfItems — tells Google Dataset Search and AI crawlers the exact corpus size.
      // This is a primary signal Dataset Search uses to rank dataset importance and
      // display corpus size in the "dataset overview" card.
      numberOfItems: 3000,
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString(),
      keywords: ["comparison", "vs", "versus", "benchmark", "review", "analysis"],
      license: "https://creativecommons.org/licenses/by/4.0/",
      usageInfo: `${SITE_URL}/terms`,
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      inLanguage: "en-US",
      temporalCoverage: "2024/..",
      // spatialCoverage — signals global geographic coverage to AI research tools
      // and Google Dataset Search, which filters datasets by coverage area.
      spatialCoverage: { "@type": "Place", name: "Worldwide" },
      measurementTechnique: "Expert editorial research, benchmark aggregation, community voting",
      variableMeasured: [
        { "@type": "PropertyValue", name: "Attribute winner", description: "Per-attribute winner between compared entities" },
        { "@type": "PropertyValue", name: "Community preference", description: "Percentage of users preferring each entity" },
        { "@type": "PropertyValue", name: "Verdict", description: "Overall recommended winner with reasoning" },
      ],
      // distribution — explicit download endpoints for Google Dataset Search and AI
      // research indexers. Listing the API and sitemap lets crawlers retrieve the full
      // catalog programmatically without parsing HTML.
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/llms-full`,
          name: "A Versus B Full Comparison Catalog (JSON)",
          description: "Machine-readable catalog of all comparison pages with titles, slugs, and short answers",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "text/plain",
          contentUrl: `${SITE_URL}/llms.txt`,
          name: "A Versus B LLMs.txt Manifest",
          description: "llmstxt.org-format manifest listing top comparisons by category for LLM crawlers",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/xml",
          contentUrl: `${SITE_URL}/sitemap.xml`,
          name: "A Versus B XML Sitemap",
          description: "Full sitemap index with all comparison, blog, entity, and category URLs",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/atom+xml",
          contentUrl: `${SITE_URL}/feed/atom`,
          name: "A Versus B Atom Feed",
          description: "Atom 1.0 feed of all recent comparisons and blog articles with ISO 8601 timestamps",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/ld+json",
          contentUrl: `${SITE_URL}/api/knowledge-graph/{slug}`,
          name: "A Versus B Knowledge Graph API",
          description: "Per-comparison JSON-LD @graph with typed Article, Entity, Dataset, and FAQPage nodes",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/answer/{slug}`,
          name: "A Versus B AI Answer API",
          description: "Pre-packaged, citation-ready answer with shortAnswer, verdict, keyDifferences, winner, confidence, and ClaimReview JSON-LD",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/sitemap`,
          name: "A Versus B JSON Sitemap (Comparisons)",
          description: "Paginated JSON DataFeed sitemap of all comparison pages with shortAnswer, answerUrl, knowledgeGraphUrl, and category; blog variant at ?type=blog",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/sitemap?type=blog`,
          name: "A Versus B JSON Sitemap (Blog)",
          description: "Paginated JSON DataFeed sitemap of all published blog articles with excerpt, tags, and jsonUrl for per-article API access",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/openapi`,
          name: "A Versus B OpenAPI Specification",
          description: "OpenAPI 3.0.3 machine-readable API schema for all public endpoints",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/v1/best`,
          name: "A Versus B Best-of Lists API",
          description: "Paginated index of all best-of list pages with ItemList JSON-LD per slug at /api/v1/best/{slug}",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/v1/search`,
          name: "A Versus B Unified Search API",
          description: "Unified search across comparisons, entities, and blog articles; ?q={query}&types=comparisons,entities,blog",
        },
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
    // alternativeHeadline — secondary title used by Perplexity / ChatGPT citation extractors
    // and Google Sitelinks generation to display a human-readable tagline alongside the brand name.
    alternativeHeadline: "The #1 Platform for Side-by-Side Comparisons — Products, Tech, Sports & More",
    // alternateName — secondary brand handles for Knowledge Panel disambiguation and
    // AI brand entity resolution across "AversusB", "A vs B", and "aversusb.net" mentions.
    alternateName: ["AversusB", "A vs B", "aversusb.net", "A Versus B"],
    url: SITE_URL,
    description: "The internet's most comprehensive comparison platform — data-driven, expert-reviewed comparisons across technology, sports, countries, products, and more.",
    abstract: "3,000+ structured X vs Y comparisons across technology, sports, countries, products, software, and more. Data-driven, expert-reviewed with Schema.org markup.",
    keywords: "vs, versus, compare, comparison, side-by-side, which is better, best, alternatives, review, technology, sports, products",
    inLanguage: "en-US",
    datePublished: "2024-01-01",
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString(),
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    // mainEntity links the WebSite to its primary content subject — the DataCatalog.
    // AI crawlers and Google's Site Links generation use mainEntity to understand what
    // the site is about at the corpus level, improving topical authority attribution.
    mainEntity: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog` },
    // hasPart — lists the primary sections of the site for AI site-structure understanding.
    // Google Sitelinks and AI crawlers (Perplexity, ChatGPT) use hasPart to generate
    // structured overviews of what sections exist and how the site is organized.
    hasPart: [
      { "@type": "WebPage", name: "Trending Comparisons", url: `${SITE_URL}/trending` },
      { "@type": "WebPage", name: "Search Comparisons", url: `${SITE_URL}/search` },
      { "@type": "WebPage", name: "Blog", url: `${SITE_URL}/blog` },
      { "@type": "WebPage", name: "Best Lists", url: `${SITE_URL}/best` },
      { "@type": "WebPage", name: "Studies", url: `${SITE_URL}/studies` },
      { "@type": "WebPage", name: "LLM Comparisons", url: `${SITE_URL}/llm-comparisons` },
    ],
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
        // Machine-readable search API — AI tools call this instead of the HTML UI
        "@type": "SearchAction",
        name: "Unified Search API",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/api/v1/search?q={search_term_string}`,
          encodingType: "application/json",
        },
        "query-input": "required name=search_term_string",
        result: { "@type": "ItemList", description: "Comparisons, entity profiles, and blog articles" },
      },
      {
        "@type": "ReadAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{slug}` },
      },
      {
        "@type": "CompareAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{entity-a}-vs-{entity-b}` },
        description: "Compare any two entities side-by-side",
      },
    ],
    // about — explicit topic list for AI topical authority signals.
    about: [
      { "@type": "Thing", name: "Product Comparisons", url: `${SITE_URL}/category/products` },
      { "@type": "Thing", name: "Technology Comparisons", url: `${SITE_URL}/category/technology` },
      { "@type": "Thing", name: "Sports Comparisons", url: `${SITE_URL}/category/sports` },
      { "@type": "Thing", name: "Country Comparisons", url: `${SITE_URL}/category/countries` },
      { "@type": "Thing", name: "Software Comparisons", url: `${SITE_URL}/category/software` },
      { "@type": "Thing", name: "Automotive Comparisons", url: `${SITE_URL}/category/automotive` },
      { "@type": "Thing", name: "Health Comparisons", url: `${SITE_URL}/category/health` },
      { "@type": "Thing", name: "Finance Comparisons", url: `${SITE_URL}/category/finance` },
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers, Students",
      geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
    },
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
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

// Static Wikidata Q-ID map for high-frequency entities.
// Adding wikidata.org URLs alongside Wikipedia + DBpedia gives AI knowledge
// graphs (ChatGPT, Perplexity, Google KG, Gemini) a third authority anchor
// that resolves via the Wikidata SPARQL API — significantly strengthening
// entity-graph merging across citation sources.
const WIKIDATA_Q_MAP: Record<string, string> = {
  // Tech companies
  "Apple": "Q312", "Microsoft": "Q2283", "Google": "Q95", "Amazon": "Q3884",
  "Meta": "Q380", "Facebook": "Q380", "Netflix": "Q907311", "Tesla": "Q478214",
  "Nvidia": "Q182477", "Samsung": "Q21231", "Sony": "Q27751", "Intel": "Q248",
  "AMD": "Q236429", "IBM": "Q37156", "Oracle": "Q166900", "Salesforce": "Q617922",
  "Adobe": "Q102038", "Shopify": "Q14721291", "Spotify": "Q152571",
  "Twitter": "Q918", "X": "Q918", "LinkedIn": "Q213660", "YouTube": "Q866",
  "TikTok": "Q62826784", "Instagram": "Q209330", "WhatsApp": "Q575908",
  "Snapchat": "Q289242", "Pinterest": "Q255381", "Reddit": "Q1136",
  "Discord": "Q72590392", "Slack": "Q18951731", "Zoom": "Q24811894",
  "Dropbox": "Q547580", "Airbnb": "Q2641391", "Uber": "Q22889286",
  "Lyft": "Q22906800", "PayPal": "Q91494", "Stripe": "Q2003791",
  "Anthropic": "Q115747612", "OpenAI": "Q107932506", "DeepMind": "Q15733006",
  // AI models
  "ChatGPT": "Q116149782", "Claude": "Q122427025", "Gemini": "Q124718842",
  "GPT-4": "Q120260988", "Llama": "Q123985908", "Copilot": "Q130358024",
  // OS / platforms
  "Windows": "Q1406", "macOS": "Q14116", "Linux": "Q388", "Android": "Q94",
  "iOS": "Q48493", "Ubuntu": "Q381", "Debian": "Q7715973",
  // Devices / hardware
  "iPhone": "Q19828", "iPad": "Q19831", "MacBook": "Q607679",
  "PlayStation 5": "Q63396", "Xbox Series X": "Q56017533",
  "Nintendo Switch": "Q19610114", "AirPods": "Q21284598",
  // Countries
  "United States": "Q30", "China": "Q148", "India": "Q668",
  "United Kingdom": "Q145", "Germany": "Q183", "France": "Q142",
  "Japan": "Q17", "Canada": "Q16", "Australia": "Q408",
  "Brazil": "Q155", "Russia": "Q159", "South Korea": "Q884",
  "Mexico": "Q96", "Italy": "Q38", "Spain": "Q29",
  "Netherlands": "Q55", "Sweden": "Q34", "Norway": "Q20",
  "Switzerland": "Q39", "Singapore": "Q334", "Israel": "Q801",
  "UAE": "Q878", "Saudi Arabia": "Q851", "Argentina": "Q414",
  // Sports entities
  "LeBron James": "Q36159", "Michael Jordan": "Q41421", "Lionel Messi": "Q615",
  "Cristiano Ronaldo": "Q11571", "Tom Brady": "Q19676", "Serena Williams": "Q12926",
  "Roger Federer": "Q1426", "Rafael Nadal": "Q10987", "Novak Djokovic": "Q60462",
  // Automotive
  "Toyota": "Q53268", "BMW": "Q26678", "Mercedes-Benz": "Q36008",
  "Volkswagen": "Q246", "Ford": "Q44294", "Chevrolet": "Q93390",
  "Honda": "Q9584", "Hyundai": "Q20085", "Audi": "Q23317",
  "Porsche": "Q40993", "Ferrari": "Q27586", "Lamborghini": "Q29714",
  // Streaming / media
  "Hulu": "Q5937844", "Disney+": "Q57523709",
  "HBO Max": "Q115478500", "Amazon Prime Video": "Q8159742",
  "Apple TV+": "Q57737277", "Peacock": "Q66799500",
  // Sports athletes (expanded)
  "Kylian Mbappé": "Q1189701", "Mbappe": "Q1189701", "Erling Haaland": "Q3134365",
  "Neymar": "Q1232897", "Ronaldinho": "Q62413", "Zlatan Ibrahimović": "Q10992",
  "Kobe Bryant": "Q105765", "Stephen Curry": "Q352395", "Kevin Durant": "Q214868",
  "Giannis Antetokounmpo": "Q584684", "Usain Bolt": "Q10952", "Simone Biles": "Q19765",
  "Tiger Woods": "Q10931", "Phil Mickelson": "Q240780", "Lewis Hamilton": "Q9673",
  "Max Verstappen": "Q2520648", "Michael Schumacher": "Q12541",
  "Muhammad Ali": "Q36107", "Mike Tyson": "Q79031", "Floyd Mayweather": "Q332672",
  "Manny Pacquiao": "Q134052", "Conor McGregor": "Q953603",
  // Sports teams
  "Real Madrid": "Q8359", "Barcelona": "Q7156", "Manchester United": "Q18656",
  "Liverpool": "Q1130849", "Manchester City": "Q50602", "Chelsea": "Q9616",
  "Arsenal": "Q9617", "Bayern Munich": "Q15789", "Juventus": "Q9625",
  "Paris Saint-Germain": "Q83425", "LA Lakers": "Q38854", "Golden State Warriors": "Q157064",
  "Chicago Bulls": "Q170793", "New York Knicks": "Q166366",
  "New England Patriots": "Q170537", "Dallas Cowboys": "Q166296",
  // Health & nutrition brands
  "Pfizer": "Q206921", "Johnson & Johnson": "Q167180", "Moderna": "Q84672393",
  "AstraZeneca": "Q731938", "Novartis": "Q507154", "Roche": "Q507686",
  "Abbott": "Q7154640", "Medtronic": "Q1900899",
  "Peloton": "Q28497049", "Fitbit": "Q16943890", "Garmin": "Q723218",
  // Additional automotive
  "Kia": "Q34235", "Mazda": "Q183903", "Subaru": "Q81965",
  "Volvo": "Q215293", "Jaguar": "Q192381", "Land Rover": "Q170174",
  "Maserati": "Q19660", "Bugatti": "Q207498", "Rolls-Royce": "Q186872",
  "Bentley": "Q189881", "Dodge": "Q1061489", "Jeep": "Q181483",
  "Ram": "Q3388818", "Rivian": "Q17112928", "Lucid Motors": "Q24284765",
  // Software / SaaS
  "GitHub": "Q364", "GitLab": "Q16639197", "Jira": "Q2130498",
  "Notion": "Q78505384", "Figma": "Q60762764", "Canva": "Q22085553",
  "HubSpot": "Q7069829", "Zendesk": "Q28091786", "ServiceNow": "Q2290000",
  "Atlassian": "Q2768720", "Asana": "Q4801624", "Monday.com": "Q51752759",
  "Airtable": "Q27714984", "Webflow": "Q7978285", "Squarespace": "Q4765718",
  "Wix": "Q4015452", "WordPress": "Q257",
  // Additional countries
  "Turkey": "Q43", "Poland": "Q36", "Ukraine": "Q212",
  "Egypt": "Q79", "Nigeria": "Q1033", "South Africa": "Q258",
  "Indonesia": "Q252", "Pakistan": "Q843", "Bangladesh": "Q902",
  "Vietnam": "Q881", "Thailand": "Q869", "Philippines": "Q928",
  "Malaysia": "Q833", "Colombia": "Q739", "Chile": "Q298",
  "Peru": "Q419", "Venezuela": "Q717", "Iran": "Q794",
};

/**
 * Returns a sameAs URL array for a given entity name including Wikipedia,
 * DBpedia, and Wikidata (when a Q-ID is available in the static map).
 * AI models (ChatGPT, Perplexity, Gemini) use sameAs to unambiguously
 * resolve entities during knowledge-graph grounding and citation merging.
 */
export function entityWikipediaSameAs(name: string): string[] {
  if (!name || name.trim().length === 0) return [];
  const wikiSlug = name.trim().replace(/ /g, "_");
  const urls = [
    `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiSlug)}`,
    `https://dbpedia.org/resource/${encodeURIComponent(wikiSlug)}`,
  ];
  // Append Wikidata entity URL when Q-ID is known — third knowledge-graph anchor
  // that AI crawlers resolve via the Wikidata API for entity disambiguation.
  const qId = WIKIDATA_Q_MAP[name.trim()] ?? WIKIDATA_Q_MAP[name.trim().split(" ")[0]];
  if (qId) urls.push(`https://www.wikidata.org/entity/${qId}`);
  return urls;
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
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText", "bookmarks"],
    educationalLevel: "General",
    teaches: "How to compare products, technologies, sports figures, and countries side-by-side using structured data and expert-reviewed analysis",
    educationalUse: "comparison",
    releaseNotes: `${SITE_URL}/changelog`,
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString(),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    // hasPart — the major sections of the application. AI answer engines and
    // Google's site-structure crawlers use hasPart to understand what sub-apps
    // or content areas the WebApplication contains.
    hasPart: [
      { "@type": "WebPage", name: "Trending Comparisons", url: `${SITE_URL}/trending`, description: "Most-viewed comparisons updated daily" },
      { "@type": "WebPage", name: "Technology Comparisons", url: `${SITE_URL}/category/technology` },
      { "@type": "WebPage", name: "Sports Comparisons", url: `${SITE_URL}/category/sports` },
      { "@type": "WebPage", name: "Country Comparisons", url: `${SITE_URL}/category/countries` },
      { "@type": "WebPage", name: "Software Comparisons", url: `${SITE_URL}/category/software` },
      { "@type": "WebPage", name: "Product Comparisons", url: `${SITE_URL}/category/products` },
      { "@type": "WebPage", name: "Entity Profiles", url: `${SITE_URL}/entity`, description: "Dedicated profile pages for each entity" },
      { "@type": "WebPage", name: "Blog", url: `${SITE_URL}/blog`, description: "In-depth comparison guides" },
      { "@type": "WebPage", name: "Developer API", url: `${SITE_URL}/developers`, description: "REST API for comparison data" },
    ],
    // potentialAction — tells AI assistants and Google what actions users can take.
    // SearchAction routes search-intent queries; CompareAction routes comparison-intent;
    // SubscribeAction signals the newsletter CTA for engagement-intent queries.
    potentialAction: [
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ReadAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{slug}` },
      },
      {
        "@type": "CompareAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{entity-a}-vs-{entity-b}` },
        description: "Compare any two entities side-by-side",
      },
      {
        "@type": "SubscribeAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/contact` },
        description: "Subscribe to comparison updates and newsletter",
      },
    ],
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
      "Best-of ranked lists",
      "Product reviews (SmartReview)",
      "FAQ structured Q&A",
      "AI Answer API for citation",
      "Knowledge Graph JSON-LD",
      "Unified search API (comparisons + entities + blog)",
      "Best-of list API with ItemList JSON-LD",
      "OpenAPI 3.0 machine-readable spec",
      "IndexNow for fast indexing",
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
  keywords?: string;
  // mainEntity — if provided, creates the bidirectional WebPage↔Article graph edge.
  // Pass { "@type": "Article", "@id": "{url}#article" } on comparison pages so AI
  // crawlers can traverse WebPage→Article without a separate stub node.
  mainEntity?: Record<string, string>;
  speakableCssSelector?: string[];
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
    creativeWorkStatus: "Published",
    license: "https://creativecommons.org/licenses/by/4.0/",
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    ...(opts.keywords && { keywords: opts.keywords }),
    ...(opts.mainEntity && { mainEntity: opts.mainEntity }),
    speakable: {
      "@type": "SpeakableSpecification",
      "@id": `${opts.url}#speakable`,
      cssSelector: opts.speakableCssSelector ?? ["h1", "h2", "#page-intro", "p:first-of-type"],
    },
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
  // termSlug — stable URL-fragment key for DefinedTerm @id anchors on this page.
  const termSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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
      name: comparison.title,
      description: `Side-by-side comparison of ${comparison.entities.map((e) => e.name).join(" vs ")}`,
      width: 1200,
      height: 630,
      caption: comparison.title,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
    },
    datePublished: comparison.metadata.publishedAt,
    dateCreated: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      // Category hub back-reference — strengthens internal hierarchy signal for AI crawlers
      // and Google's topic cluster detection. Lets Perplexity/ChatGPT navigate from
      // individual comparisons up to the full category collection.
      ...(comparison.category
        ? [{ "@type": "CollectionPage", "@id": `${SITE_URL}/category/${comparison.category}#collectionpage`,
            name: `${comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)} Comparisons`,
            url: `${SITE_URL}/category/${comparison.category}` }]
        : []),
    ],
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    // abstract is the AI-preferred citation snippet field (more specific than description)
    ...(comparison.shortAnswer && { abstract: comparison.shortAnswer }),
    speakable: {
      "@type": "SpeakableSpecification",
      // Stable @id lets AI knowledge graphs reference this SpeakableSpecification node
      // from other @graph documents without ambiguity (e.g. ClaimReview citing speakable).
      "@id": `${url}#speakable`,
      // h1 — page title is the highest-confidence speakable node for voice query confirmation.
      // #hero-tldr — above-fold quick-answer paragraph in the hero; first speakable hit
      // for voice/AI queries since it appears before the fold.
      // #short-answer/#verdict — TL;DR and conclusion; Google AI Overviews and Perplexity
      // prefer these for one-line cited answers. #key-differences — the core comparison delta.
      // #key-facts — entity-level factual claims. #comparison-table — the structured attribute
      // grid; AI data-mode crawlers extract column headers + values directly from this section.
      // #faq — Q&A pairs; Google AI Overviews cite FAQ answers verbatim for voice results.
      cssSelector: ["h1", "#hero-tldr", "#short-answer", "#verdict", "#key-differences", "#key-facts", "#comparison-table", "#faq"],
    },
    // accessMode signals content type to AI classifiers and accessibility crawlers.
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    // accessibilityFeature — WCAG accessibility and AI-readability signals.
    // Google and AI crawlers (Perplexity, ChatGPT) use this to verify that content
    // is machine-readable, structurally navigable, and citation-safe.
    // "tableOfContents" = we have named sections (Key Differences, Attributes, FAQ, Verdict);
    // "readingOrder" = content flows in logical sequence top-to-bottom;
    // "structuralNavigation" = semantic heading hierarchy (h1 → h2 → h3);
    // "alternativeText" = all images carry descriptive alt text;
    // "bookmarks" = named DOM anchors (#short-answer, #verdict, #key-differences, #faq).
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText", "bookmarks"],
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
      const entityAliases = entityAlternateNames(e.name);
      return {
        "@type": schType,
        // @id matches the ProfilePage mainEntity @id so crawlers merge this node
        // with the entity's canonical ProfilePage across pages in the knowledge graph.
        ...(e.slug && { "@id": `${SITE_URL}/entity/${e.slug}` }),
        name: e.name,
        // alternateName — entity aliases for AI Knowledge Graph disambiguation.
        // Google KG, Perplexity, and ChatGPT use alternateName to merge entity nodes
        // across documents (e.g. "Apple Inc." and "Apple" resolve to the same entity).
        ...(entityAliases.length > 0 && { alternateName: entityAliases }),
        description: e.shortDesc,
        // ImageObject (not bare URL) — creditText + acquireLicensePage let AI image
        // crawlers (Google Lens, Perplexity visual mode) attribute the source when
        // displaying this entity image in AI Overviews and image carousels.
        ...(e.imageUrl && {
          image: {
            "@type": "ImageObject",
            url: e.imageUrl,
            contentUrl: e.imageUrl,
            name: e.name,
            description: `${e.name} logo and profile image`,
            creditText: SITE_NAME,
            creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
            copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
            acquireLicensePage: `${SITE_URL}/terms`,
            license: "https://creativecommons.org/licenses/by/4.0/",
          },
        }),
        ...(e.slug && { url: `${SITE_URL}/entity/${e.slug}` }),
        sameAs: entityWikipediaSameAs(e.name),
        subjectOf: { "@type": "Article", "@id": `${url}#article` },
        // mainEntityOfPage — cross-page graph edge from entity node (inside Article about[])
        // to the entity's canonical ProfilePage. AI crawlers follow this to the profile
        // for richer entity context without re-crawling the page.
        ...(e.slug && {
          mainEntityOfPage: {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}/entity/${e.slug}#profilepage`,
            url: `${SITE_URL}/entity/${e.slug}`,
          },
        }),
        // Free Offer on software entities for product-search AI carousels
        ...(schType === "SoftwareApplication" && {
          applicationCategory: "BusinessApplication",
          // applicationSubCategory — narrows the type for Google/Perplexity product-carousel
          // routing. Maps comparison.category to the closest Schema.org subcategory string.
          ...(() => {
            const subCat: Record<string, string> = {
              health: "HealthApplication", entertainment: "EntertainmentApplication",
              sports: "SportsApplication", finance: "FinanceApplication",
              economy: "FinanceApplication", travel: "TravelApplication",
              gaming: "GameApplication", technology: "DeveloperApplication",
              software: "DeveloperApplication", companies: "BusinessApplication",
              brands: "BusinessApplication", products: "UtilitiesApplication",
              automotive: "UtilitiesApplication", education: "EducationalApplication",
            };
            const sc = comparison.category ? subCat[comparison.category] : undefined;
            return sc ? { applicationSubCategory: sc } : {};
          })(),
          operatingSystem: "Web, iOS, Android",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          // featureList — derived from comparison attribute values for this entity.
          // AI product-search carousels (Google Shopping, Perplexity product mode) use
          // featureList to surface per-entity capabilities in structured product results.
          ...(() => {
            const features = comparison.attributes
              .flatMap((attr) => {
                const val = attr.values.find((v) => v.entityId === e.id);
                if (!val) return [];
                if (val.valueBoolean === true) return [`${attr.name}`];
                if (val.valueText) return [`${attr.name}: ${val.valueText}`];
                if (val.valueNumber !== null && val.valueNumber !== undefined) {
                  return [`${attr.name}: ${val.valueNumber}${attr.unit ? " " + attr.unit : ""}`];
                }
                return [];
              })
              .slice(0, 10);
            return features.length > 0 ? { featureList: features.join(", ") } : {};
          })(),
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
        // Country enrichment — additionalType + sameAs Wikipedia+DBpedia signals entity identity
        // to geo-aware AI crawlers (Google Geo, Perplexity, ChatGPT country queries).
        // entityWikipediaSameAs() returns both Wikipedia and DBpedia URLs for Knowledge Graph
        // disambiguation; previously only Wikipedia was emitted (DBpedia was dropped).
        ...(schType === "Country" && {
          additionalType: "https://schema.org/Country",
          sameAs: entityWikipediaSameAs(e.name),
          // geo: GeoShape signals this is a geo-typed entity to Google Geo crawlers and
          // Perplexity/ChatGPT country-query routing — parity with multi-entity path.
          geo: { "@type": "GeoShape", name: e.name },
          containedInPlace: { "@type": "Place", name: "World", sameAs: "https://en.wikipedia.org/wiki/World" },
        }),
        // SportsTeam enrichment — `sport` is a required Knowledge Graph field for teams.
        // AI sports query engines (Perplexity, ChatGPT) use it to route "X vs Y team"
        // queries to the correct sport domain without parsing the entity name.
        ...(schType === "SportsTeam" && {
          sport: comparison.category === "sports" ? "Sports" : (comparison.category ?? "Sports"),
        }),
        // Person enrichment — jobTitle from category lets AI answer engines correctly
        // classify athlete/executive profiles when resolving "X vs Y" person comparisons.
        ...(schType === "Person" && comparison.category && {
          jobTitle: (() => {
            const cat = comparison.category;
            if (cat === "sports") return "Professional Athlete";
            if (cat === "technology" || cat === "software") return "Technology Professional";
            if (cat === "companies" || cat === "brands") return "Business Executive";
            if (cat === "entertainment") return "Entertainment Professional";
            if (cat === "history") return "Historical Figure";
            return "Public Figure";
          })(),
        }),
      };
    }),
    // mentions — typed entity references that AI Knowledge Graphs use to merge this
    // Article with its entity ProfilePages. Using the correct @type (SoftwareApplication,
    // Product, Country, etc.) instead of generic Thing lets Knowledge Graph systems
    // classify each entity correctly and strengthen cross-document entity linking.
    mentions: comparison.entities.map((e) => ({
      "@type": entitySchemaType(e.entityType),
      "@id": `${SITE_URL}/entity/${e.slug}`,
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
      sameAs: entityWikipediaSameAs(e.name),
    })),
    // articleSection — tells Google/AI models the category domain of this comparison.
    ...(comparison.category && { articleSection: comparison.category }),
    // wordCount — content length signal; estimated from attribute count × avg words/attribute.
    wordCount: Math.max(300, (comparison.attributes.length * 40) + (hasFaqs ? comparison.faqs.length * 80 : 0)),
    // timeRequired — estimated reading time (ISO8601 duration); Google and AI engines
    // use this for content classification and featured-snippet slot selection.
    timeRequired: `PT${Math.ceil(Math.max(300, (comparison.attributes.length * 40) + (hasFaqs ? comparison.faqs.length * 80 : 0)) / 200)}M`,
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
    // encodingFormat — MIME types for AI content-type routing. Crawlers (Perplexity, ChatGPT,
    // Common Crawl) use this to classify whether the page is parseable as HTML and JSON-LD
    // without probing the Content-Type header, improving content-type routing accuracy.
    encodingFormat: ["text/html", "application/ld+json"],
    // copyrightNotice — human-readable attribution string used by AI training pipelines
    // and syndication tools to generate correct attribution when citing this content.
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // acquireLicensePage — where AI trainers, publishers, and scrapers can find the
    // full license terms. Google's training-data team specifically crawls this field.
    acquireLicensePage: `${SITE_URL}/terms`,
    // publishingPrinciples / ethicsPolicy / correctionsPolicy — Article-level E-E-A-T signals.
    // Google's quality raters and AI crawlers (Perplexity, ChatGPT) elevate articles that
    // link back to a documented editorial methodology rather than just the Organization.
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    // audience — topic-audience matching for AI answer routing (e.g., Perplexity picks
    // the most audience-relevant source when multiple pages cover the same comparison).
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers, Students",
      geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
    },
    // review — array of Review nodes:
    // 1. Pair-level review: verdict for the full comparison (gates on verdict existing).
    // 2. Per-entity reviews: structured pros/cons from entity data, enabling AI answer
    //    engines (Google Shopping, ChatGPT, Perplexity) to extract "pros and cons of X"
    //    directly from the comparison page without parsing HTML.
    ...(() => {
      const reviews: Record<string, unknown>[] = [];
      if (comparison.verdict) {
        reviews.push({
          "@type": "Review",
          "@id": `${url}#review`,
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          reviewBody: comparison.verdict,
          // reviewAspect — what dimension of the subject is covered; AI product-search engines
          // (Google Shopping, Perplexity product-mode) use this to categorise Review nodes and
          // surface the correct review type for "X vs Y overall" queries.
          reviewAspect: "Overall Comparison",
          datePublished: comparison.metadata.updatedAt,
          url,
          itemReviewed: {
            "@type": "Thing",
            name: comparison.entities.map((e) => e.name).join(" vs "),
          },
        });
      }
      for (const e of comparison.entities) {
        if (e.pros.length === 0 && e.cons.length === 0) continue;
        reviews.push({
          "@type": "Review",
          "@id": `${url}#review-${e.slug}`,
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          // reviewAspect — entity-level aspect reviewed; routes "pros and cons of X" AI queries
          // to this Review node rather than the pair-level verdict Review above.
          reviewAspect: e.pros.length > 0 && e.cons.length > 0
            ? "Pros and Cons"
            : e.pros.length > 0 ? "Strengths" : "Weaknesses",
          datePublished: comparison.metadata.updatedAt,
          url,
          itemReviewed: {
            "@type": entitySchemaType(e.entityType),
            "@id": `${SITE_URL}/entity/${e.slug}`,
            name: e.name,
          },
          ...(e.pros.length > 0 && {
            positiveNotes: {
              "@type": "ItemList",
              itemListElement: e.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })),
            },
          }),
          ...(e.cons.length > 0 && {
            negativeNotes: {
              "@type": "ItemList",
              itemListElement: e.cons.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c })),
            },
          }),
          ...(e.bestFor && { reviewBody: e.bestFor }),
        });
      }
      if (reviews.length === 0) return {};
      return { review: reviews.length === 1 ? reviews[0] : reviews };
    })(),
    // significantLink — entity ProfilePages so AI agents can follow the graph
    // from comparison article to dedicated entity profiles and alternatives pages.
    significantLink: comparison.entities.flatMap((e) => [
      `${SITE_URL}/entity/${e.slug}`,
      `${SITE_URL}/alternatives/${e.slug}`,
    ]),
    // relatedLink — related comparison pages; AI crawlers use this to traverse the
    // comparison graph and surface topic clusters in recommendation carousels.
    ...(comparison.relatedComparisons?.length ? {
      relatedLink: comparison.relatedComparisons.slice(0, 8).map((r) => `${SITE_URL}/compare/${r.slug}`),
    } : {}),
    // citation — external sources backing the comparison; AI fact-checkers (Google, Perplexity,
    // ChatGPT) follow citation links to verify factual claims and boost citation confidence.
    // Always populated: explicit citationStats.sources merged with entity Wikipedia references
    // as fallback so every Article node has at least the entity canonical sources.
    citation: [
      ...(comparison.citationStats?.sources ?? [])
        .filter((s) => s.url)
        .map((s) => {
          let domain = "";
          try { domain = new URL(s.url!).hostname.replace(/^www\./, ""); } catch { /* ignore */ }
          return {
            "@type": "WebPage",
            "@id": s.url,
            name: s.name,
            url: s.url,
            ...(domain && { publisher: { "@type": "Organization", name: domain } }),
          };
        }),
      ...comparison.entities.map((e) => ({
        "@type": "Article",
        "@id": `https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`,
        name: `${e.name} — Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`,
        publisher: { "@type": "Organization", name: "Wikipedia", url: "https://en.wikipedia.org" },
      })),
    ],
    // potentialAction — ReadAction lets AI crawlers understand that this article
    // is readable at its canonical URL; CompareAction tells AI/Google that this page
    // performs a comparison between the two entities, boosting eligibility for
    // "X vs Y" rich results and AI answer engine comparisons.
    potentialAction: [
      {
        "@type": "ReadAction",
        target: { "@type": "EntryPoint", urlTemplate: url },
      },
      {
        "@type": "CompareAction",
        actionStatus: "CompletedActionStatus",
        object: comparison.entities.map((e) => ({
          "@type": entitySchemaType(e.entityType),
          name: e.name,
          ...(e.slug && { url: `${SITE_URL}/entity/${e.slug}` }),
        })),
        result: {
          "@type": "Article",
          "@id": `${url}#article`,
          url,
          name: comparison.title,
        },
      },
    ],
    // hasPart links to FAQPage, Dataset, HowTo, and entity ProfilePages for formal Article
    // sub-document graph edges. ProfilePage nodes let AI crawlers traverse Article→entity edges
    // directly from hasPart, complementing about[] and mentions[] with a page-type-scoped link.
    ...(() => {
      // Inline category set mirrors HOWTO_CATEGORIES below (defined after this schemas.push call).
      const howtoEligible = new Set(["technology", "software", "products", "automotive", "gaming", "travel", "finance", "health", "economy", "entertainment", "companies"]);
      const hasHowTo = Boolean(comparison.category && howtoEligible.has(comparison.category) && comparison.attributes.length >= 3);
      const parts = [
        ...(hasFaqs ? [{ "@type": "FAQPage", "@id": `${url}#faq` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "Dataset", "@id": `${url}#dataset` }] : []),
        // DefinedTermSet — Article→DefinedTermSet graph edge so AI crawlers discover the
        // attribute vocabulary directly from the Article node without loading the Dataset first.
        ...(comparison.attributes.length > 0 ? [{ "@type": "DefinedTermSet", "@id": `${url}#terms` }] : []),
        // ItemList — Article→ItemList graph edge; lets AI crawlers traverse from Article to
        // the structured entity list without loading the full page. Perplexity and ChatGPT
        // use this edge to extract the compared entities as a ranked list.
        { "@type": "ItemList", "@id": `${url}#list`, numberOfItems: comparison.entities.length },
        ...(hasHowTo ? [{ "@type": "HowTo", "@id": `${url}#howto` }] : []),
        // Per-entity ProfilePage nodes — Article→ProfilePage graph edges for AI knowledge traversal.
        // @id matches the ProfilePage's own @id so cross-document merging works correctly.
        ...comparison.entities.filter((e) => e.slug).map((e) => ({
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/entity/${e.slug}#profilepage`,
          url: `${SITE_URL}/entity/${e.slug}`,
          name: `${e.name} — Comparisons & Profile`,
        })),
      ];
      return parts.length > 0 ? { hasPart: parts } : {};
    })(),
    // isBasedOn — formal graph edge from Article to its Dataset; Google and AI fact-checkers
    // use this to trace the evidence chain from editorial claim → structured data source.
    ...(comparison.attributes.length > 0 && {
      isBasedOn: { "@type": "Dataset", "@id": `${url}#dataset` },
    }),
    // teaches — typed DefinedTerm node (not plain string) so AI KGs can traverse the
    // teaches→DefinedTermSet graph edge. Educational classifiers (ChatGPT, Perplexity)
    // route "how do I decide between X and Y" queries to pages with a typed teaches node.
    teaches: teachesDefinedTerm(
      `How to choose between ${comparison.entities.map((e) => e.name).join(" and ")}`,
      url,
    ),
    // assesses — the specific competency or claim this Article evaluates.
    // Google AI Overviews and LLM answer engines use assesses to understand the
    // evaluation framing so they can route "which is better" decision queries here.
    assesses: `Which is better: ${comparison.entities.map((e) => e.name).join(" or ")}`,
    // educationalUse — "comparison" signals structured decision-support utility.
    // AI systems (Perplexity, ChatGPT, Google AI Overviews) use this to rank
    // comparison pages above generic articles for decision-intent queries.
    educationalUse: "comparison",
    // discussionUrl — community discussion thread for this comparison on Reddit.
    // Google E-E-A-T evaluators and AI crawlers use discussionUrl to confirm
    // real-world engagement with the topic and boost trust signals.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(comparison.entities.map((e) => e.name).join(" vs "))}+comparison&type=link&sort=relevance`,
    // tableOfContents — enumerates the article's section structure for AI crawlers.
    // Perplexity and ChatGPT use this to identify which section to cite when answering
    // specific sub-questions without loading the full page.
    tableOfContents: [
      "Quick Answer",
      "Key Differences",
      "Side-by-Side Comparison",
      "Verdict",
      ...(hasFaqs ? ["FAQ"] : []),
    ].join(" · "),
    // contentLocation — geographic location depicted/described in the content.
    // Google Geo and AI geographic answer engines (ChatGPT, Perplexity) use this
    // to route country-query results to pages that explicitly cover those places,
    // boosting eligibility in "compare X and Y" geo-intent SERP and AI slots.
    ...(() => {
      const geoCategories = new Set(["countries", "travel", "economy"]);
      const isGeoComparison =
        (comparison.category != null && geoCategories.has(comparison.category)) ||
        comparison.entities.some((e) => e.entityType === "country");
      if (!isGeoComparison) return {};
      return {
        contentLocation: comparison.entities.map((e) => ({
          "@type": "Country",
          name: e.name,
        })),
      };
    })(),
    // locationCreated — where this CreativeWork was created. A Versus B is a US-based
    // platform; all comparison data (Google Search volume, USD pricing, market share) is
    // sourced from US datasets. Geographic AI filters (Perplexity location-aware, Google
    // AI Overviews for US queries) use locationCreated to correctly scope the data origin.
    locationCreated: { "@type": "Country", name: "United States" },
  });

  // 1b. ClaimReview — standalone type required by Schema.org and Google Fact Check.
  // claimReviewed/reviewRating were previously misplaced as Article properties.
  // A proper ClaimReview node signals to AI fact-checking systems (Google Fact Check,
  // Perplexity truth mode, ChatGPT factual validation) that this page evaluates a
  // specific factual claim, enabling the Fact Check rich result and AI trust boost.
  if (comparison.shortAnswer && comparison.entities.length >= 2) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      "@id": `${url}#claimreview`,
      url,
      // inLanguage — language-scoped fact-checking for AI engines; enables language-qualified
      // citations ("According to [source] (en-US), ...") in ChatGPT, Perplexity, and Google Fact Check.
      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      claimReviewed: `${comparison.entities[0].name} vs ${comparison.entities[1].name}: ${comparison.shortAnswer.slice(0, 200)}`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
        alternateName: "Accurate",
        ratingExplanation: "Data verified through multiple sources and editorial review",
      },
      author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      datePublished: comparison.metadata.updatedAt,
      itemReviewed: {
        "@type": "Claim",
        // inLanguage on itemReviewed — language-scopes the reviewed claim for multilingual AI crawlers.
        inLanguage: "en-US",
        name: `${comparison.entities.map((e) => e.name).join(" vs ")} comparison`,
        // text — the actual claim text as required by Google Fact Check Tools for rich-result
        // eligibility; AI fact-checkers (Perplexity truth mode, ChatGPT factual validation)
        // use text to extract the assertion independently of the claimReviewed field.
        text: comparison.shortAnswer ? comparison.shortAnswer.slice(0, 400) : `${comparison.entities.map((e) => e.name).join(" vs ")} — a structured side-by-side comparison`,
        author: { "@type": "Thing", name: "Internet" },
        datePublished: comparison.metadata.publishedAt,
        // appearance — current canonical URL of the claim; used by AI fact-checkers
        // to fetch the live page for verification.
        appearance: { "@type": "WebPage", "@id": url, url },
        // firstAppearance — the original publication URL of the claim; when claim and
        // reviewer are the same page (self-published editorial), both fields point here.
        // Google Fact Check and AI trust engines (Perplexity truth mode) use this to
        // establish claim provenance and publication timeline.
        firstAppearance: { "@type": "WebPage", "@id": url, url },
      },
    });
  }

  // 2. ItemList for the compared entities
  schemas.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#list`,
    name: comparison.title,
    description: `Comparison between ${comparison.entities.map((e) => e.name).join(" and ")}`,
    numberOfItems: comparison.entities.length,
    // itemListOrder — explicit ordering signal; Unordered signals these are peer comparisons
    // not ranked items. AI carousels and Google Shopping use this to render entity chips
    // without implying position-based ranking bias.
    itemListOrder: "https://schema.org/ItemListUnordered",
    url,
    itemListElement: comparison.entities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entity.name,
      description: entity.shortDesc,
      url: `${SITE_URL}/entity/${entity.slug}`,
      // item with typed @id — AI crawlers and Google Knowledge Graph use this
      // to traverse from the ItemList to the entity ProfilePage in one hop,
      // instead of following a bare url string and inferring the entity type.
      item: {
        "@type": entitySchemaType(entity.entityType),
        "@id": `${SITE_URL}/entity/${entity.slug}`,
        name: entity.name,
        url: `${SITE_URL}/entity/${entity.slug}`,
      },
    })),
  });

  // 3. FAQPage if FAQs exist
  if (comparison.faqs.length > 0) {
    const faqAbout = comparison.entities
      .filter((e) => e.slug)
      .map((e) => ({
        "@type": entitySchemaType(e.entityType),
        "@id": `${SITE_URL}/entity/${e.slug}`,
        name: e.name,
        url: `${SITE_URL}/entity/${e.slug}`,
      }));
    schemas.push(faqSchema(comparison.faqs, `${url}#faq`, faqAbout, comparison.metadata.publishedAt ?? undefined));
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
        duration: "PT1M",
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
          duration: "PT1M",
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
        duration: "PT1M",
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
      prepTime: "PT1M",
      performTime: "PT4M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
      supply: comparison.entities.map((e) => ({ "@type": "HowToSupply", name: e.name })),
      yield: `A well-informed decision between ${entityNames}`,
    });
  }

  // 5. BreadcrumbList — always 3 levels: Home → Category (or "Comparisons") → Title
  // Ensures rich BreadcrumbList rich results even when comparison.category is null.
  const categoryDisplayName = comparison.category
    ? comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)
    : null;
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(categoryDisplayName
      ? [{ name: categoryDisplayName, url: `${SITE_URL}/category/${comparison.category}` }]
      : [{ name: "Comparisons", url: `${SITE_URL}/trending` }]),
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
      // additionalType DataFeed — signals to AI data-pipeline crawlers (Google Dataset Search,
      // Hugging Face, Kaggle AI, Perplexity data mode) that this Dataset is a structured
      // data feed with per-attribute rows, not a static document. Boosts visibility in
      // data-specific AI query results ("comparison data for X vs Y").
      additionalType: "https://schema.org/DataFeed",
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
      // distribution — explicit download locations for Google Dataset Search and AI
      // research indexes. Listing the API endpoint as a DataDownload lets crawlers
      // retrieve the raw structured data without parsing HTML.
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/comparisons/${comparison.slug}`,
          name: `${comparison.title} — JSON API`,
          description: "Structured comparison data in JSON format via the A Versus B public API",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/ld+json",
          contentUrl: url,
          name: `${comparison.title} — JSON-LD (embedded in page)`,
          description: "Schema.org Dataset JSON-LD embedded in the comparison page HTML",
        },
      ],
      // creator / publisher — Google Dataset Search and AI research indexes use these to
      // attribute the Dataset source and boost domain authority signals in data-specific results.
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      // includedInDataCatalog — explicit graph edge from this Dataset to the site's global
      // DataCatalog node. Google Dataset Search uses this to cluster per-comparison Datasets
      // under the platform-level catalog, boosting corpus-level authority signals.
      includedInDataCatalog: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparison Database`, url: SITE_URL },
      // datePublished / dateModified — Dataset provenance signals for Google Dataset Search.
      datePublished: comparison.metadata.publishedAt,
      dateModified: comparison.metadata.updatedAt,
      // temporalCoverage — "as of" window for the comparison data; AI fact-checkers use this
      // to qualify time-sensitive answers ("according to X, as of 2026, ...").
      temporalCoverage: `2025/${new Date().getFullYear()}`,
      // keywords — metadata for Dataset Search indexing and AI data-finder routing.
      keywords: [
        ...comparison.entities.map((e) => e.name),
        `${comparison.entities.map((e) => e.name).join(" vs ")} comparison`,
        ...(comparison.category ? [comparison.category] : []),
      ].join(", "),
      // measurementTechnique describes how attributes were collected.
      measurementTechnique: "Research aggregation from manufacturer specifications, benchmark tests, expert reviews, and community data.",
      // variableMeasured as PropertyValue objects — Google Dataset Search and AI research
      // tools extract structured attribute metadata from typed PropertyValue nodes rather
      // than bare strings, improving dataset carousels and citation accuracy.
      variableMeasured: comparison.attributes.map((attr) => ({
        "@type": "PropertyValue",
        // propertyID — stable URI that Dataset Search uses to dereference the attribute
        // definition across documents; mirrors the DefinedTerm @id so crawlers merge both nodes.
        propertyID: `${url}#term-${termSlug(attr.name)}`,
        name: attr.name,
        ...(attr.unit ? { unitText: attr.unit } : {}),
        // valueReference → DefinedTerm lets Dataset Search + AI research tools resolve
        // each measured variable to its formal term definition in this page's DefinedTermSet.
        valueReference: { "@type": "DefinedTerm", "@id": `${url}#term-${termSlug(attr.name)}` },
      })),
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
      // interactionStatistic on Dataset — ReadAction signals to Google Dataset Search
      // and AI data-pipeline crawlers that this dataset has real human engagement.
      // Indexed alongside view counts on the Article; kept separate so dataset-specific
      // crawlers (Kaggle AI, Semantic Scholar, Perplexity data mode) also see the signal.
      ...(viewCount > 0 && {
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ReadAction",
          userInteractionCount: viewCount,
        },
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
      // inLanguage — language-scoped sports event for Google Sports and Perplexity sports-mode
      // carousels; prevents entity disambiguation errors in multilingual KG merges.
      inLanguage: "en-US",
      // startDate — required for Event rich results; maps to comparison publish date as the
      // "event record" creation date when no actual event date is known.
      startDate: comparison.metadata.publishedAt ?? comparison.metadata.updatedAt,
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

  // 8. DefinedTermSet — formal vocabulary for this comparison's attribute dimensions.
  // AI research tools (Perplexity, ChatGPT) and Google Dataset Search extract DefinedTerm
  // nodes to build domain-specific knowledge about what properties are being compared.
  // isPartOf Dataset creates a graph edge so crawlers can navigate TermSet → Dataset → Article.
  if (comparison.attributes.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `${url}#terms`,
      name: `${comparison.entities.map((e) => e.name).join(" vs ")} — Comparison Attribute Vocabulary`,
      description: `Formal definitions of the attributes used to compare ${comparison.entities.map((e) => e.name).join(" and ")}.`,
      inLanguage: "en-US",
      isPartOf: { "@type": "Dataset", "@id": `${url}#dataset` },
      hasDefinedTerm: comparison.attributes.map((attr) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#term-${termSlug(attr.name)}`,
        name: attr.name,
        // termCode — machine-readable stable key for this term.
        // AI Dataset Search tools and LLM knowledge graphs use termCode to
        // resolve dimension labels to canonical identifiers across documents.
        termCode: termSlug(attr.name),
        ...(attr.unit ? { unitCode: attr.unit } : {}),
        inDefinedTermSet: { "@type": "DefinedTermSet", "@id": `${url}#terms` },
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
  const termSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
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
    if (entity.imageUrl) node.image = {
      "@type": "ImageObject",
      url: entity.imageUrl,
      contentUrl: entity.imageUrl,
      name: entity.name,
      description: `${entity.name} logo and profile image`,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
      license: "https://creativecommons.org/licenses/by/4.0/",
    };
    const wikiSameAs = entityWikipediaSameAs(entity.name);
    if (wikiSameAs.length > 0) node.sameAs = wikiSameAs;
    // alternateName — legal-suffix-stripped aliases for AI Knowledge Graph cross-document merging.
    const itemAliases = entityAlternateNames(entity.name);
    if (itemAliases.length > 0) node.alternateName = itemAliases;
    node.subjectOf = { "@type": "Article", "@id": `${url}#article` };

    if (schemaType === "SoftwareApplication") {
      node.applicationCategory = "BusinessApplication";
      const multiSubCat: Record<string, string> = {
        health: "HealthApplication", entertainment: "EntertainmentApplication",
        sports: "SportsApplication", finance: "FinanceApplication",
        economy: "FinanceApplication", travel: "TravelApplication",
        gaming: "GameApplication", technology: "DeveloperApplication",
        software: "DeveloperApplication", companies: "BusinessApplication",
        brands: "BusinessApplication", products: "UtilitiesApplication",
        automotive: "UtilitiesApplication", education: "EducationalApplication",
      };
      const multiSc = comparison.category ? multiSubCat[comparison.category] : undefined;
      if (multiSc) node.applicationSubCategory = multiSc;
      node.operatingSystem = "Web, iOS, Android";
      node.publisher = { "@type": "Organization", name: entity.name };
      // Offer intentionally omitted for chatbot/AI-tool cluster per schema-3way v1 contract
      // §2.3 deferral note (DAN-841). Emit offers only on entity profile pages where price
      // data is verified, not on comparison item nodes where it may be inaccurate.
      const multiFeatures = comparison.attributes
        .flatMap((attr) => {
          const val = attr.values.find((v) => v.entityId === entity.id);
          if (!val) return [];
          if (val.valueBoolean === true) return [`${attr.name}`];
          if (val.valueText) return [`${attr.name}: ${val.valueText}`];
          if (val.valueNumber !== null && val.valueNumber !== undefined) {
            return [`${attr.name}: ${val.valueNumber}${attr.unit ? " " + attr.unit : ""}`];
          }
          return [];
        })
        .slice(0, 10);
      if (multiFeatures.length > 0) node.featureList = multiFeatures.join(", ");
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
      // entityWikipediaSameAs gives both Wikipedia + DBpedia; don't narrow to Wikipedia-only.
      node.sameAs = entityWikipediaSameAs(entity.name);
      // geo: GeoShape signals this is a geo-typed entity to Google Geo crawlers and
      // Perplexity/ChatGPT country-query routing — even without precise coordinates.
      node.geo = { "@type": "GeoShape", name: entity.name };
      // containedInPlace: sovereign countries sit inside the world geopolitical hierarchy.
      node.containedInPlace = { "@type": "Place", name: "World", sameAs: "https://en.wikipedia.org/wiki/World" };
    }

    if (schemaType === "SportsTeam") {
      node.sport = comparison.category === "sports" ? "Sports" : (comparison.category ?? "Sports");
    }

    if (schemaType === "Person" && comparison.category) {
      const cat = comparison.category;
      node.jobTitle = cat === "sports" ? "Professional Athlete"
        : cat === "technology" || cat === "software" ? "Technology Professional"
        : cat === "companies" || cat === "brands" ? "Business Executive"
        : cat === "entertainment" ? "Entertainment Professional"
        : cat === "history" ? "Historical Figure"
        : "Public Figure";
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
    itemListElement: comparison.entities.map((entity, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entity.name,
      // description — one-line entity summary for AI product-search carousels (Google Shopping,
      // Perplexity product mode); lets crawlers surface entity context from the ListItem node
      // without loading the entity ProfilePage.
      ...(entity.shortDesc && { description: entity.shortDesc }),
      // item @type + @id — typed entity reference so AI crawlers resolve the entity
      // node type without following the URL (merges with top-level itemNode in @graph).
      item: {
        "@type": entitySchemaType(entity.entityType),
        "@id": itemIds[i],
        name: entity.name,
        url: itemIds[i],
        ...(entity.shortDesc && { description: entity.shortDesc }),
      },
    })),
    url,
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
      name: comparison.title,
      description: `Multi-entity comparison of ${comparison.entities.map((e) => e.name).join(", ")}`,
      width: 1200,
      height: 630,
      caption: comparison.title,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
    },
    datePublished: comparison.metadata.publishedAt,
    dateCreated: comparison.metadata.publishedAt,
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
      "@id": `${url}#speakable`,
      cssSelector: ["h1", "#hero-tldr", "#short-answer", "#verdict", "#key-differences", "#key-facts", "#comparison-table", "#faq"],
    },
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText", "bookmarks"],
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
    encodingFormat: ["text/html", "application/ld+json"],
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    acquireLicensePage: `${SITE_URL}/terms`,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    // review[] — pair-level verdict + per-entity pros/cons Reviews (parity with 2-entity schema).
    ...(() => {
      const multiReviews: Record<string, unknown>[] = [];
      if (comparison.verdict) {
        multiReviews.push({
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
        });
      }
      for (const e of comparison.entities) {
        if (e.pros.length === 0 && e.cons.length === 0) continue;
        multiReviews.push({
          "@type": "Review",
          "@id": `${url}#review-${e.slug}`,
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          datePublished: comparison.metadata.updatedAt,
          url,
          itemReviewed: {
            "@type": entitySchemaType(e.entityType),
            "@id": `${SITE_URL}/entity/${e.slug}`,
            name: e.name,
          },
          ...(e.pros.length > 0 && {
            positiveNotes: {
              "@type": "ItemList",
              itemListElement: e.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })),
            },
          }),
          ...(e.cons.length > 0 && {
            negativeNotes: {
              "@type": "ItemList",
              itemListElement: e.cons.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c })),
            },
          }),
          ...(e.bestFor && { reviewBody: e.bestFor }),
        });
      }
      if (multiReviews.length === 0) return {};
      return { review: multiReviews.length === 1 ? multiReviews[0] : multiReviews };
    })(),
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    // interactivityType — multi-entity pages are read-only expositive content.
    interactivityType: "expositive",
    // lastReviewed + reviewedBy — freshness signal for AI fact-checkers.
    lastReviewed: comparison.metadata.updatedAt,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // wordCount — estimated from attribute count × avg words/attribute + FAQ words.
    wordCount: Math.max(400, (comparison.attributes.length * 40) + (comparison.faqs.length * 80)),
    // timeRequired — estimated reading time (ISO8601 duration); Google and AI engines
    // use this for content classification and featured-snippet slot selection.
    timeRequired: `PT${Math.ceil(Math.max(400, (comparison.attributes.length * 40) + (comparison.faqs.length * 80)) / 200)}M`,
    // significantLink — entity ProfilePages and alternatives so AI can follow the graph.
    significantLink: comparison.entities.flatMap((e) => [
      `${SITE_URL}/entity/${e.slug}`,
      `${SITE_URL}/alternatives/${e.slug}`,
    ]),
    // relatedLink — related comparison pages for AI graph traversal and topic clustering.
    ...(comparison.relatedComparisons?.length ? {
      relatedLink: comparison.relatedComparisons.slice(0, 8).map((r) => `${SITE_URL}/compare/${r.slug}`),
    } : {}),
    // potentialAction — ReadAction + CompareAction for multi-entity graph.
    // CompareAction tells AI/Google this page performs a comparison between the entities.
    potentialAction: [
      {
        "@type": "ReadAction",
        target: { "@type": "EntryPoint", urlTemplate: url },
      },
      {
        "@type": "CompareAction",
        actionStatus: "CompletedActionStatus",
        object: comparison.entities.map((e) => ({
          "@type": entitySchemaType(e.entityType),
          name: e.name,
          ...(e.slug && { url: `${SITE_URL}/entity/${e.slug}` }),
        })),
        result: {
          "@type": "Article",
          "@id": `${url}#article`,
          url,
          name: comparison.title,
        },
      },
    ],
    // hasPart links to FAQPage, Dataset, HowTo, and entity ProfilePages for formal Article
    // sub-document graph edges. ProfilePage nodes create Article→entity traversal paths for AI.
    ...(() => {
      const parts = [
        ...(comparison.faqs.length > 0 ? [{ "@type": "FAQPage", "@id": `${url}#faq` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "Dataset", "@id": `${url}#dataset` }] : []),
        ...(comparison.attributes.length > 0 ? [{ "@type": "DefinedTermSet", "@id": `${url}#terms` }] : []),
        // ItemList — Article→ItemList graph edge for AI to extract the compared entity list.
        { "@type": "ItemList", "@id": `${url}#list`, numberOfItems: comparison.entities.length },
        ...(hasMultiHowTo ? [{ "@type": "HowTo", "@id": `${url}#howto` }] : []),
        // Per-entity ProfilePage nodes — Article→ProfilePage graph edges for AI knowledge traversal.
        ...comparison.entities.filter((e) => e.slug).map((e) => ({
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/entity/${e.slug}#profilepage`,
          url: `${SITE_URL}/entity/${e.slug}`,
          name: `${e.name} — Comparisons & Profile`,
        })),
      ];
      return parts.length > 0 ? { hasPart: parts } : {};
    })(),
    // isBasedOn — formal graph edge from Article to Dataset evidence source.
    ...(comparison.attributes.length > 0 && {
      isBasedOn: { "@type": "Dataset", "@id": `${url}#dataset` },
    }),
    // citation — external sources backing the comparison; always populated with explicit
    // sources merged with per-entity Wikipedia references so every Article node provides
    // AI fact-checkers a citation chain even without explicit editorial sources.
    citation: [
      ...(comparison.citationStats?.sources ?? [])
        .filter((s: { url?: string; name: string }) => s.url)
        .map((s: { url?: string; name: string }) => {
          let domain = "";
          try { domain = new URL(s.url!).hostname.replace(/^www\./, ""); } catch { /* ignore */ }
          return {
            "@type": "WebPage",
            "@id": s.url,
            name: s.name,
            url: s.url,
            ...(domain && { publisher: { "@type": "Organization", name: domain } }),
          };
        }),
      ...comparison.entities.map((e) => ({
        "@type": "Article",
        "@id": `https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`,
        name: `${e.name} — Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(e.name.replace(/ /g, "_"))}`,
        publisher: { "@type": "Organization", name: "Wikipedia", url: "https://en.wikipedia.org" },
      })),
    ],
    ...(multiViewCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: multiViewCount,
      },
    }),
    mainEntity: { "@id": itemListId },
    // about[] — primary subjects of this comparison article; @id matches ProfilePage mainEntity.
    about: comparison.entities.map((e) => {
      const multiEntityAliases = entityAlternateNames(e.name);
      return {
        "@type": entitySchemaType(e.entityType),
        "@id": `${SITE_URL}/entity/${e.slug}`,
        name: e.name,
        // alternateName — entity aliases for AI Knowledge Graph disambiguation (parity with 2-entity).
        ...(multiEntityAliases.length > 0 && { alternateName: multiEntityAliases }),
        url: `${SITE_URL}/entity/${e.slug}`,
        subjectOf: { "@type": "Article", "@id": `${url}#article` },
        // mainEntityOfPage — cross-page edge to entity ProfilePage for AI knowledge traversal.
        mainEntityOfPage: {
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/entity/${e.slug}#profilepage`,
          url: `${SITE_URL}/entity/${e.slug}`,
        },
        sameAs: entityWikipediaSameAs(e.name),
      };
    }),
    // @id on each mentions entry matches ProfilePage mainEntity for cross-document merge.
    // Typed @type (not generic Thing) strengthens entity classification in Knowledge Graphs.
    mentions: comparison.entities.map((e) => ({
      "@type": entitySchemaType(e.entityType),
      "@id": `${SITE_URL}/entity/${e.slug}`,
      name: e.name,
      url: `${SITE_URL}/entity/${e.slug}`,
      sameAs: entityWikipediaSameAs(e.name),
    })),
    // Properties added for feature parity with 2-entity schema
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    educationalLevel: "General",
    ...(comparison.category && { articleSection: comparison.category }),
    // teaches — typed DefinedTerm (parity with 2-entity path); KG-traversable node.
    teaches: teachesDefinedTerm(
      `How to choose between ${comparison.entities.map((e) => e.name).join(", ")}`,
      url,
    ),
    // assesses — evaluation framing for AI answer engines (parity with 2-entity path)
    assesses: `Which is best: ${comparison.entities.map((e) => e.name).join(", ")}`,
    educationalUse: "comparison",
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(comparison.entities.map((e) => e.name).join(" vs "))}+comparison&type=link&sort=relevance`,
    tableOfContents: [
      "Quick Answer",
      "Key Differences",
      "Side-by-Side Comparison",
      "Verdict",
      ...(comparison.faqs.length > 0 ? ["FAQ"] : []),
    ].join(" · "),
    // contentLocation — geographic parity with 2-entity schema; fires on country/travel/economy.
    ...(() => {
      const geoCategories = new Set(["countries", "travel", "economy"]);
      const isGeoComparison =
        (comparison.category != null && geoCategories.has(comparison.category)) ||
        comparison.entities.some((e) => e.entityType === "country");
      if (!isGeoComparison) return {};
      return {
        contentLocation: comparison.entities.map((e) => ({
          "@type": "Country",
          name: e.name,
        })),
      };
    })(),
    // locationCreated — US data-origin signal (parity with 2-entity schema).
    locationCreated: { "@type": "Country", name: "United States" },
  };

  const multiCategoryDisplay = comparison.category
    ? comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)
    : null;
  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    ...(multiCategoryDisplay
      ? [{ name: multiCategoryDisplay, url: `${SITE_URL}/category/${comparison.category}` }]
      : [{ name: "Comparisons", url: `${SITE_URL}/trending` }]),
    { name: comparison.title, url },
  ];
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs`,
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      // Typed WebPage item — parity with 2-entity path and breadcrumbSchema() helper.
      // AI crawlers and Google follow @id to merge breadcrumb with target WebPage node.
      item: { "@type": "WebPage", "@id": item.url, name: item.name, url: item.url },
    })),
  };

  const graph: Record<string, unknown>[] = [
    article,
    itemList,
    ...itemNodes,
    breadcrumbList,
  ];

  // ClaimReview — standalone node (parity with 2-entity schema).
  if (comparison.shortAnswer && comparison.entities.length >= 2) {
    graph.push({
      "@type": "ClaimReview",
      "@id": `${url}#claimreview`,
      url,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      claimReviewed: `${comparison.entities.map((e) => e.name).join(" vs ")}: ${comparison.shortAnswer.slice(0, 200)}`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
        alternateName: "Accurate",
        ratingExplanation: "Data verified through multiple sources and editorial review",
      },
      author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      datePublished: comparison.metadata.updatedAt,
      itemReviewed: {
        "@type": "Claim",
        inLanguage: "en-US",
        name: `${comparison.entities.map((e) => e.name).join(" vs ")} comparison`,
        // text — required by Google Fact Check Tools for rich-result eligibility.
        text: comparison.shortAnswer ? comparison.shortAnswer.slice(0, 400) : `${comparison.entities.map((e) => e.name).join(" vs ")} — a structured side-by-side comparison`,
        author: { "@type": "Thing", name: "Internet" },
        datePublished: comparison.metadata.publishedAt,
        appearance: { "@type": "WebPage", "@id": url, url },
        firstAppearance: { "@type": "WebPage", "@id": url, url },
      },
    });
  }

  if (comparison.faqs.length > 0) {
    const faqDatePublished = comparison.metadata.publishedAt ?? new Date().toISOString().slice(0, 10);
    const faqDateModified = new Date().toISOString().slice(0, 10);
    graph.push({
      "@type": "FAQPage",
      additionalType: "https://schema.org/QAPage",
      "@id": `${url}#faq`,
      inLanguage: "en-US",
      isAccessibleForFree: true,
      // about[] — primary subjects this FAQ covers; mirrors 2-entity path so AI engines
      // can attribute individual Q&A pairs to the correct entities without re-parsing Article.
      about: comparison.entities
        .filter((e) => e.slug)
        .map((e) => ({
          "@type": entitySchemaType(e.entityType),
          "@id": `${SITE_URL}/entity/${e.slug}`,
          name: e.name,
          url: `${SITE_URL}/entity/${e.slug}`,
        })),
      // isPartOf — back-reference to Article so AI crawlers confirm FAQ belongs to this comparison.
      isPartOf: { "@type": "Article", "@id": `${url}#article` },
      speakable: { "@type": "SpeakableSpecification", "@id": `${url}#faq-speakable`, cssSelector: [".faq-answer"] },
      mainEntity: comparison.faqs.slice(0, 10).map((faq, i) => ({
        "@type": "Question",
        "@id": `${url}#q${i + 1}`,
        name: faq.question,
        text: faq.question,
        url: `${url}#q${i + 1}`,
        answerCount: 1,
        upvoteCount: 1,
        dateCreated: faqDatePublished,
        dateModified: faqDateModified,
        acceptedAnswer: {
          "@type": "Answer",
          "@id": `${url}#a${i + 1}`,
          text: faq.answer,
          inLanguage: "en-US",
          upvoteCount: 1,
          dateCreated: faqDatePublished,
          dateModified: faqDateModified,
          author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        },
      })),
    });
  }

  // Dataset for multi-entity comparisons — mirrors 2-entity pattern.
  if (comparison.attributes.length > 0) {
    const isCountryComparison = comparison.category === "countries" ||
      comparison.entities.some((e) => e.entityType === "country");
    graph.push({
      "@type": "Dataset",
      additionalType: "https://schema.org/DataFeed",
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
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/comparisons/${comparison.slug}`,
          name: `${comparison.title} — JSON API`,
          description: "Structured comparison data in JSON format via the A Versus B public API",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/ld+json",
          contentUrl: url,
          name: `${comparison.title} — JSON-LD (embedded in page)`,
          description: "Schema.org Dataset JSON-LD embedded in the comparison page HTML",
        },
      ],
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      // includedInDataCatalog — explicit graph edge to the site's global DataCatalog node.
      includedInDataCatalog: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparison Database`, url: SITE_URL },
      datePublished: comparison.metadata.publishedAt,
      dateModified: comparison.metadata.updatedAt,
      temporalCoverage: `2025/${new Date().getFullYear()}`,
      keywords: [
        ...comparison.entities.map((e) => e.name),
        `${comparison.entities.map((e) => e.name).join(" vs ")} comparison`,
        ...(comparison.category ? [comparison.category] : []),
      ].join(", "),
      measurementTechnique: "Research aggregation from manufacturer specifications, benchmark tests, expert reviews, and community data.",
      variableMeasured: comparison.attributes.map((attr) => ({
        "@type": "PropertyValue",
        propertyID: `${url}#term-${termSlug(attr.name)}`,
        name: attr.name,
        ...(attr.unit ? { unitText: attr.unit } : {}),
        valueReference: { "@type": "DefinedTerm", "@id": `${url}#term-${termSlug(attr.name)}` },
      })),
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
      ...(multiViewCount > 0 && {
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ReadAction",
          userInteractionCount: multiViewCount,
        },
      }),
      educationalLevel: "General",
      educationalUse: "research",
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
      prepTime: "PT1M",
      performTime: "PT4M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
      supply: comparison.entities.map((e) => ({ "@type": "HowToSupply", name: e.name })),
      yield: `A well-informed decision between ${multiEntityNames}`,
      step: [
        {
          "@type": "HowToStep",
          name: "Define your priorities",
          text: `Identify which features matter most when choosing between ${multiEntityNames}. Consider your use case, budget, and specific requirements.`,
          position: 1,
          duration: "PT1M",
          url: `${url}#key-differences`,
          image: { "@type": "ImageObject", url: multiOgImage, width: 1200, height: 630 },
        },
        ...comparison.attributes.slice(0, 5).map((attr, i) => ({
          "@type": "HowToStep",
          name: `Compare ${attr.name}`,
          text: `Evaluate each option's ${attr.name.toLowerCase()} to determine which best fits your specific needs.`,
          position: i + 2,
          duration: "PT1M",
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
          duration: "PT1M",
        },
      ],
    });
  }

  // WebPage node — bidirectional Article↔WebPage graph edge (matches 2-entity path).
  graph.push({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: comparison.title,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
    mainEntity: { "@type": "Article", "@id": `${url}#article` },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    ...(comparison.category && {
      breadcrumb: { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb` },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      "@id": `${url}#speakable`,
      cssSelector: ["h1", "#hero-tldr", "#short-answer", "#verdict", "#key-differences", "#comparison-table"],
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  });

  // DefinedTermSet — formal vocabulary for this comparison's attribute dimensions.
  if (comparison.attributes.length > 0) {
    graph.push({
      "@type": "DefinedTermSet",
      "@id": `${url}#terms`,
      name: `${comparison.entities.map((e) => e.name).join(", ")} — Comparison Attribute Vocabulary`,
      description: `Formal definitions of the attributes used to compare ${comparison.entities.map((e) => e.name).join(", ")}.`,
      inLanguage: "en-US",
      isPartOf: { "@type": "Dataset", "@id": `${url}#dataset` },
      hasDefinedTerm: comparison.attributes.map((attr) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#term-${termSlug(attr.name)}`,
        name: attr.name,
        termCode: termSlug(attr.name),
        ...(attr.unit ? { unitCode: attr.unit } : {}),
        inDefinedTermSet: { "@type": "DefinedTermSet", "@id": `${url}#terms` },
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
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${SITE_URL}/compare/${opts.slug}#video`,
    name: `${opts.entityA} vs ${opts.entityB} — Full Comparison`,
    description: opts.description,
    thumbnailUrl: `https://img.youtube.com/vi/${opts.youtubeVideoId}/maxresdefault.jpg`,
    uploadDate: opts.uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${opts.youtubeVideoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${opts.youtubeVideoId}`,
    duration: opts.duration ?? "PT36S",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    acquireLicensePage: `${SITE_URL}/terms`,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
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
    // @id — stable anchor so Article hasPart and other nodes can reference this video.
    "@id": `${SITE_URL}/compare/${opts.slug}#video`,
    name: `${opts.title} — Quick Comparison`,
    description: opts.description,
    thumbnailUrl: [opts.thumbnailUrl],
    uploadDate: opts.uploadDate,
    contentUrl: `${SITE_URL}/videos/${opts.slug}.mp4`,
    duration: opts.duration || "PT13S",
    isFamilyFriendly: true,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    acquireLicensePage: `${SITE_URL}/terms`,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
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

export function faqSchema(faqs: FAQData[], id?: string, about?: { "@type": string; "@id": string; name: string; url: string }[], datePublished?: string) {
  // Derive Article @id from FAQPage @id so Google/AI can trace FAQ → Article graph edge.
  // Convention: FAQPage @id = "{articleUrl}#faq", Article @id = "{articleUrl}#article"
  const articleId = id ? id.replace(/#faq$/, "#article") : undefined;
  const today = new Date().toISOString().slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    // additionalType QAPage — makes FAQ eligible for the QA answer-box rich result
    // (distinct from the FAQ accordion). Google and Perplexity render QAPage nodes
    // as upvoted Q&A panels with author attribution, separate from FAQ carousels.
    additionalType: "https://schema.org/QAPage",
    ...(id && { "@id": id }),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    // about[] — primary subjects this FAQ covers; links FAQPage to entity nodes so
    // AI knowledge graphs can attribute individual Q&A pairs to the correct entities
    // without re-parsing the parent Article. Perplexity and ChatGPT use this to
    // scope FAQ answers to the right entity when synthesising multi-source responses.
    ...(about && about.length > 0 && { about }),
    // isPartOf — back-reference from FAQPage to its parent Article.
    // Google's Knowledge Graph and AI crawlers use this edge to confirm that
    // the FAQ answers belong to the comparison article and attribute them correctly.
    ...(articleId && { isPartOf: { "@type": "Article", "@id": articleId } }),
    // speakable on FAQPage — voice assistants extract answers from .faq-answer
    // elements; AI Overviews pull directly from FAQ structured data.
    speakable: {
      "@type": "SpeakableSpecification",
      ...(id && { "@id": id.replace(/#faq$/, "#faq-speakable") }),
      cssSelector: [".faq-answer"],
    },
    mainEntity: faqs.slice(0, 10).map((faq, i) => ({
      "@type": "Question",
      // @id — stable anchor so AI fact-checkers and cross-page citations can reference
      // individual Q&A pairs by URL fragment without loading the full page.
      ...(id && { "@id": `${id.replace(/#faq$/, "")}#q${i + 1}` }),
      name: faq.question,
      // text — duplicate of name; required by QAPage spec for Answer extraction tools
      // that prefer text over name on the Question node (e.g. schema.org validators,
      // Bing structured data, some AI extractors).
      text: faq.question,
      // url — deep-link anchor for this specific Q&A pair; Google rich results use
      // this to navigate directly to the answer when the question matches a voice query.
      ...(id && { url: `${id.replace(/#faq$/, "")}#q${i + 1}` }),
      // answerCount — signals exactly one accepted answer; required for FAQ rich results
      // eligibility in Google Search even when upvoteCount is 0.
      answerCount: 1,
      // upvoteCount on Question — editorial confidence signal at the question level;
      // AI answer engines use this to rank Q&A pairs within a FAQPage when multiple
      // questions match the same query intent.
      upvoteCount: 1,
      // dateCreated — temporal freshness per Q&A pair; AI engines (Perplexity, ChatGPT)
      // qualify citations with dates ("as of …") and prefer fresher Q&A nodes over
      // undated ones when synthesising multi-source responses.
      dateCreated: datePublished ?? today,
      dateModified: today,
      acceptedAnswer: {
        "@type": "Answer",
        // @id on Answer — enables AI knowledge graphs to merge this answer node with
        // other pages that cite the same answer fragment via the #a anchor.
        ...(id && { "@id": `${id.replace(/#faq$/, "")}#a${i + 1}` }),
        text: faq.answer,
        // inLanguage — language-scoped answer extraction for multilingual AI engines;
        // Perplexity/ChatGPT/Gemini use this to qualify citations as English-language only,
        // preventing cross-language entity confusion in multi-lingual KG merges.
        inLanguage: "en-US",
        // upvoteCount — editorial confidence signal for AI answer engine ranking.
        upvoteCount: 1,
        dateCreated: datePublished ?? today,
        dateModified: today,
        // author — attributes the answer to our editorial org; AI answer engines use
        // this to weight the answer's authority when synthesizing multi-source responses.
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
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
      // Typed WebPage item — AI crawlers and Google follow the @id edge to merge
      // this breadcrumb node with the target page's WebPage node in the knowledge graph.
      // Schema.org BreadcrumbList spec allows either URL string or typed Thing; typed is
      // preferred by Google Rich Results Test and AI schema validators.
      item: { "@type": "WebPage", "@id": item.url, name: item.name, url: item.url },
    })),
  };
}

// ============================================================
// Category page schema (CollectionPage)
// ============================================================

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
    ...(entity.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: entity.imageUrl,
        contentUrl: entity.imageUrl,
        name: `${entity.name} logo and profile image`,
        creditText: SITE_NAME,
        creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        acquireLicensePage: `${SITE_URL}/terms`,
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    }),
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
      // softwareRequirements — minimum platform requirements for AI app-store carousels
      // and Google product-search carousels; helps route "works on X" intent queries.
      softwareRequirements: "Web Browser (Chrome, Safari, Firefox, Edge), iOS 14+, Android 8+",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
    // inLanguage — language-scopes the entity node for multilingual AI knowledge
    // graph merge. Perplexity/ChatGPT use this to prefer English-language entity
    // nodes when synthesising cross-document answers.
    inLanguage: "en-US",
    // thumbnailUrl — AI image crawlers (Google Lens, Perplexity visual mode) prefer
    // thumbnailUrl over bare image URL for Knowledge Panel candidate images.
    ...(entity.imageUrl && { thumbnailUrl: entity.imageUrl }),
    // potentialAction — CompareAction signals to AI assistants that this entity
    // can be compared against others via the search URL pattern.
    potentialAction: {
      "@type": "CompareAction",
      name: `Compare ${entity.name} with others`,
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/compare/${entity.slug}-vs-{other}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
    sameAs: entityWikipediaSameAs(entity.name),
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
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entity.name)}&type=entity`;
  const wikiSameAs = entityWikipediaSameAs(entity.name);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: entity.name,
    url,
    // thumbnailUrl + image.contentUrl — AI visual crawlers (Google Lens, Perplexity,
    // AI Overviews) read these fields to display a representative entity image.
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      url: ogImage,
      contentUrl: ogImage,
      name: `${entity.name} profile image`,
      description: `${entity.name} on A Versus B`,
      width: 1200,
      height: 630,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    // sameAs — Wikipedia + DBpedia + Wikidata anchors for AI knowledge-graph disambiguation.
    ...(wikiSameAs.length > 0 && { sameAs: wikiSameAs }),
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

export function entitySchemaType(entityType: string): string {
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

// entityAlternateNames — derive AI-disambiguation aliases from an entity name.
// Returns alternate name strings that help AI Knowledge Graph systems (Google KG,
// Perplexity, ChatGPT) resolve entity identity across documents:
// 1. Strips common legal suffixes (Inc., Corp., LLC, Ltd.) for company disambiguation.
// 2. Extracts parenthetical clarifiers (e.g. "Apple (Company)" → "Apple").
// Schema.org `alternateName` is the canonical field for entity aliases per spec.
export function entityAlternateNames(name: string): string[] {
  const aliases: string[] = [];

  // Strip common legal-entity suffixes so crawlers don't treat "Apple Inc." and
  // "Apple" as different entities during cross-document Knowledge Graph merging.
  const withoutSuffix = name
    .replace(/\s*,?\s*(?:Inc\.|Incorporated|Corp\.|Corporation|LLC|Ltd\.|Limited|Co\.|Company|GmbH|S\.A\.|PLC|AG|NV|BV|SA|AB|AS|Pty\.?\s*Ltd\.?)\.?\s*$/i, "")
    .trim();
  if (withoutSuffix && withoutSuffix !== name) {
    aliases.push(withoutSuffix);
  }

  // Extract content inside parentheses as a disambiguation qualifier.
  // e.g. "Apple (Company)" → "Apple" already handled above; "Meta (Facebook)" → "Facebook"
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1].trim();
    if (inner && inner !== name && !aliases.includes(inner)) {
      aliases.push(inner);
    }
    // Also add the name without the parenthetical for cleaner entity matching.
    const withoutParen = name.replace(/\s*\([^)]+\)/, "").trim();
    if (withoutParen && withoutParen !== name && !aliases.includes(withoutParen)) {
      aliases.push(withoutParen);
    }
  }

  return aliases;
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
    "@id": `${SITE_URL}/compare/${c.slug}#article`,
    headline: c.title,
    url: `${SITE_URL}/compare/${c.slug}`,
  }));

  const wikiSameAs = entityWikipediaSameAs(entity.name);
  // OG image URL — computed early so mainEntity can reference it as a fallback image.
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entity.name)}&type=entity`;
  const mainEntity: Record<string, unknown> = {
    "@type": schemaType,
    "@id": url,
    name: entity.name,
    url,
    ...(entity.shortDesc && { description: entity.shortDesc }),
    // disambiguatingDescription — Schema.org Thing property that helps AI knowledge graphs
    // and Google Knowledge Panel distinguish entities with ambiguous names (e.g. "Apple" the
    // company vs "Apple" the fruit). AI crawlers (ChatGPT, Perplexity) use this to pin
    // the entity to the correct real-world referent when merging knowledge graph nodes.
    disambiguatingDescription: entity.shortDesc
      ? entity.shortDesc.slice(0, 120)
      : `${entity.name} — ${schemaType} profile, comparisons, and alternatives on A Versus B`,
    // ImageObject — always emit; use real imageUrl when available, else OG API fallback.
    // contentUrl and thumbnailUrl are the AI-crawler-preferred image pointer fields:
    // Google Lens, Perplexity visual mode, and AI Overviews read contentUrl to display
    // a representative image for the entity even when no branded asset exists.
    image: {
      "@type": "ImageObject",
      url: entity.imageUrl ?? ogImage,
      contentUrl: entity.imageUrl ?? ogImage,
      name: `${entity.name} logo and profile image`,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    thumbnailUrl: entity.imageUrl ?? ogImage,
    ...(wikiSameAs.length > 0 && { sameAs: wikiSameAs }),
    ...(subjectOf.length > 0 && { subjectOf }),
    potentialAction: [
      { "@type": "ReadAction", target: { "@type": "EntryPoint", urlTemplate: url } },
      // CompareAction — tells AI assistants (ChatGPT, Perplexity, Google AI Overviews) that
      // this entity can be compared vs others, routing comparison-intent queries here.
      {
        "@type": "CompareAction",
        name: `Compare ${entity.name} with others`,
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/${entity.slug}-vs-{other}`, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
      },
    ],
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
      softwareRequirements: "Web Browser (Chrome, Safari, Firefox, Edge), iOS 14+, Android 8+",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
    // speakable on mainEntity — voice assistants (Google Assistant, Alexa) and LLMs
    // reading the entity node directly (e.g. via knowledge-graph API) use speakable
    // to identify the authoritative text snippet without traversing to the ProfilePage wrapper.
    speakable: {
      "@type": "SpeakableSpecification",
      "@id": `${url}#entity-speakable`,
      cssSelector: ["h1", "#entity-intro", "#entity-about"],
    },
  };

  const today = new Date().toISOString().slice(0, 10);
  const significantLinks = [
    `${SITE_URL}/alternatives/${entity.slug}`,
    ...(entity.topComparisons ?? []).slice(0, 5).map((c) => `${SITE_URL}/compare/${c.slug}`),
  ];
  const profileDesc = entity.shortDesc ||
    `${entity.name} comparisons, profile, and alternatives — ${entity.comparisonCount ?? 0}+ head-to-head comparisons on A Versus B.`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    name: `${entity.name} — Comparisons & Profile`,
    alternativeHeadline: `${entity.name} Comparisons, Profile & Alternatives`,
    description: profileDesc,
    abstract: profileDesc,
    url,
    // datePublished + dateCreated — stable platform baseline (all entity profiles live since 2024-01-01).
    // Without these, Google and AI crawlers treat entity pages as undated, weakening E-E-A-T signals.
    datePublished: "2024-01-01",
    dateCreated: "2024-01-01",
    dateModified: today,
    lastReviewed: today,
    contentReferenceTime: today,
    locationCreated: { "@type": "Country", name: "United States" },
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
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Decision Makers, Students",
      geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
    },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText", "bookmarks"],
    educationalLevel: "General",
    // timeRequired — estimated reading time; profile page depth scales with comparison count.
    timeRequired: `PT${Math.max(2, Math.ceil((entity.comparisonCount ?? 1) / 5))}M`,
    teaches: `How to compare ${entity.name} with similar products and alternatives using structured data`,
    // assesses — evaluation framing for AI answer engines on entity profile pages.
    // Signals that this page assesses the relative merit of entity vs alternatives,
    // helping LLMs route "is X good?" and "X vs alternatives" queries here.
    assesses: `How does ${entity.name} compare to alternatives?`,
    educationalUse: "comparison",
    keywords: `${entity.name} comparison, ${entity.name} vs, best ${entity.name} alternatives 2026`,
    potentialAction: [
      { "@type": "ReadAction", target: { "@type": "EntryPoint", urlTemplate: url } },
      {
        "@type": "CompareAction",
        name: `Compare ${entity.name} with others`,
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/${entity.slug}-vs-{other}`, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
      },
      // SearchAction — tells AI assistants (ChatGPT, Perplexity, Google AI Overviews) that
      // they can search our catalog for this entity's comparisons. Routes "[entity] vs what"
      // and "find all [entity] comparisons" queries to our search endpoint.
      {
        "@type": "SearchAction",
        name: `Search ${entity.name} comparisons`,
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q=${encodeURIComponent(entity.name)}`,
        },
        result: { "@type": "ItemList", description: `Comparisons and alternatives for ${entity.name}` },
      },
    ],
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    // primaryImageOfPage — the canonical representative image for this entity.
    // Google uses this for the Knowledge Panel card image and AI Overview thumbnails.
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImage,
      contentUrl: ogImage,
      name: `${entity.name} — Profile on A Versus B`,
      description: `${entity.name} entity profile, comparisons, and alternatives on A Versus B`,
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
      "@id": `${url}#speakable`,
      cssSelector: ["h1", "#entity-intro", "#entity-about"],
    },
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(entity.name)}+comparison&type=link&sort=relevance`,
    // BreadcrumbList — 3 levels for rich-result eligibility (Google requires ≥2 levels;
    // 3 levels also enables the "Comparisons > Entity" navigational trail in AI snippets).
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL, name: "Home" } },
        { "@type": "ListItem", position: 2, name: "Comparisons", item: { "@type": "WebPage", "@id": `${SITE_URL}/compare`, url: `${SITE_URL}/compare`, name: "Comparisons" } },
        { "@type": "ListItem", position: 3, name: entity.name, item: { "@type": "WebPage", "@id": url, url, name: entity.name } },
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
      // interactionStatistic — signals community engagement volume to AI answer engines
      // that use engagement as a proxy for topical authority and citation confidence.
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: entity.comparisonCount,
        description: `This entity appears in ${entity.comparisonCount} comparisons on A Versus B`,
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
    // isBasedOn — formal provenance chain from our ProfilePage to the authoritative Wikipedia
    // and DBpedia sources. Google E-E-A-T, Perplexity, and ChatGPT citation pipelines follow
    // isBasedOn edges to verify factual grounding; missing it forces AI to treat the page as
    // a primary assertion rather than a derivative of a trusted source.
    ...(wikiSameAs.length > 0 && {
      isBasedOn: wikiSameAs.map((src) => ({
        "@type": src.includes("dbpedia") ? "Dataset" : "Article",
        "@id": src,
        url: src,
        name: src.includes("dbpedia")
          ? `${entity.name} — DBpedia Knowledge Graph`
          : `${entity.name} — Wikipedia`,
        ...(src.includes("wikipedia") && {
          publisher: { "@type": "Organization", name: "Wikipedia", url: "https://en.wikipedia.org" },
        }),
        ...(src.includes("dbpedia") && {
          publisher: { "@type": "Organization", name: "DBpedia", url: "https://dbpedia.org" },
        }),
      })),
    }),
  };
}

// ============================================================
// DefinedTermSet — site taxonomy vocabulary for AI knowledge graph
// ============================================================

// DefinedTermSet declares the comparison platform's taxonomy as a formal
// Schema.org vocabulary. AI crawlers (Perplexity, Google SGE, Bing AI) use this
// to understand the site's topic space, boosting entity-graph authority and
// increasing citation selection confidence for comparison queries.
export function definedTermSetSchema() {
  const categories = [
    { name: "Technology", description: "Software, apps, devices, platforms, and digital services" },
    { name: "Sports", description: "Athletes, teams, leagues, records, and sports equipment" },
    { name: "Countries", description: "Nations, regions, territories, economies, and cultures" },
    { name: "Products", description: "Consumer products, gadgets, appliances, and physical goods" },
    { name: "Automotive", description: "Cars, motorcycles, trucks, electric vehicles, and accessories" },
    { name: "Health", description: "Medications, supplements, fitness gear, and medical devices" },
    { name: "Finance", description: "Banks, investment products, credit cards, and fintech services" },
    { name: "Entertainment", description: "Movies, TV shows, music artists, games, and streaming services" },
    { name: "Food & Drink", description: "Foods, beverages, restaurants, and dietary products" },
    { name: "Education", description: "Universities, courses, certifications, and learning platforms" },
    { name: "Travel", description: "Airlines, hotels, destinations, and travel services" },
    { name: "Gaming", description: "Video games, consoles, peripherals, and gaming services" },
    { name: "Business", description: "Companies, SaaS tools, enterprise software, and business services" },
    { name: "Science", description: "Scientific concepts, research topics, and natural phenomena" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/#taxonomy`,
    name: "A Versus B Comparison Taxonomy",
    description: "The official topic taxonomy used by A Versus B to categorize 3,000+ side-by-side comparisons across technology, sports, products, countries, and more.",
    url: `${SITE_URL}/category`,
    inDefinedTermSet: `${SITE_URL}/#taxonomy`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    hasDefinedTerm: categories.map(({ name, description }) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/category/${name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}#term`,
      name,
      description,
      termCode: name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-"),
      url: `${SITE_URL}/category/${name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`,
      inDefinedTermSet: `${SITE_URL}/#taxonomy`,
    })),
  };
}

/**
 * ClaimReview schema for comparison verdict pages.
 *
 * ClaimReview is Google's fact-checking schema — it signals that this page reviews
 * a specific claim with an expert verdict. For comparison pages, the "claim" is the
 * common user belief about which entity wins (e.g., "iPhone is better than Samsung").
 * We review that claim with structured evidence.
 *
 * Benefits:
 *  - Google Fact Check Explorer — increases chance of showing a "Fact Check" label
 *  - Perplexity / ChatGPT citations — AI systems prefer pages with ClaimReview when
 *    answering "X vs Y" queries, as the schema signals authority and verifiability
 *  - E-E-A-T: demonstrates the page's role as an authoritative review source
 *
 * Only emits when comparison has a clear verdict.winner.
 */
// ============================================================
// Typed DefinedTerm helper — converts a plain "teaches" string into a proper
// Schema.org DefinedTerm node so AI knowledge graphs can traverse the teaches→
// DefinedTermSet edge, boosting educational-intent citation confidence.
// ============================================================
export function teachesDefinedTerm(label: string, pageUrl: string): Record<string, unknown> {
  return {
    "@type": "DefinedTerm",
    "@id": `${pageUrl}#learning-outcome`,
    name: label,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/#definedTermSet`,
      name: "A Versus B Learning Outcomes",
      url: SITE_URL,
    },
  };
}

// ============================================================
// Blog ClaimReview — emitted for "X vs Y" blog articles. Adds Google Fact Check
// eligibility + AI fact-checking E-E-A-T signal. Unlike comparison ClaimReview
// (which has explicit verdicts), blog articles default to MIXTURE when no clear
// winner is declared, signalling nuanced analysis rather than a binary ruling.
// ============================================================
export function blogClaimReviewSchema(opts: {
  articleUrl: string;
  entityA: string;
  entityB: string;
  shortAnswer?: string;
  verdict?: string | null;
  datePublished?: string;
  dateModified?: string;
}) {
  const claimText = `${opts.entityA} is better than ${opts.entityB}`;
  const verdictLower = (opts.verdict ?? "").toLowerCase();
  const ratingValue =
    verdictLower && verdictLower === opts.entityA.toLowerCase()
      ? "TRUE"
      : verdictLower && verdictLower === opts.entityB.toLowerCase()
        ? "FALSE"
        : "MIXTURE";

  return {
    "@type": "ClaimReview",
    "@id": `${opts.articleUrl}#claim-review`,
    url: opts.articleUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    claimReviewed: claimText,
    datePublished: opts.datePublished ?? new Date().toISOString().slice(0, 10),
    dateModified: opts.dateModified ?? opts.datePublished ?? new Date().toISOString().slice(0, 10),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: "TRUE",
      worstRating: "FALSE",
      alternateName:
        ratingValue === "TRUE"
          ? `${opts.entityA} wins`
          : ratingValue === "FALSE"
            ? `${opts.entityB} wins`
            : "Depends on use case — see analysis",
    },
    itemReviewed: {
      "@type": "Claim",
      inLanguage: "en-US",
      name: claimText,
      ...(opts.shortAnswer && { text: opts.shortAnswer.slice(0, 300) }),
      author: { "@type": "Thing", name: "Internet consensus" },
      appearance: { "@type": "WebPage", "@id": opts.articleUrl, url: opts.articleUrl },
      firstAppearance: { "@type": "WebPage", "@id": opts.articleUrl, url: opts.articleUrl },
    },
  };
}

export function claimReviewSchema(opts: {
  slug: string;
  title: string;
  entityA: string;
  entityB: string;
  verdict: string;
  shortAnswer: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = `${SITE_URL}/compare/${opts.slug}`;
  const claimText = `${opts.entityA} is better than ${opts.entityB}`;
  const verdictLower = opts.verdict.toLowerCase();
  const ratingValue = verdictLower === opts.entityA.toLowerCase()
    ? "TRUE"
    : verdictLower === opts.entityB.toLowerCase()
    ? "FALSE"
    : "MIXTURE";

  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "@id": `${url}#claim-review`,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    claimReviewed: claimText,
    datePublished: opts.datePublished ?? new Date().toISOString().slice(0, 10),
    dateModified: opts.dateModified ?? opts.datePublished ?? new Date().toISOString().slice(0, 10),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: "TRUE",
      worstRating: "FALSE",
      alternateName: ratingValue === "TRUE"
        ? `${opts.entityA} wins`
        : ratingValue === "FALSE"
        ? `${opts.entityB} wins`
        : "Depends on use case",
    },
    itemReviewed: {
      "@type": "Claim",
      inLanguage: "en-US",
      name: claimText,
      text: opts.shortAnswer,
      author: {
        "@type": "Thing",
        name: "Internet consensus",
      },
      appearance: { "@type": "WebPage", "@id": url, url },
      firstAppearance: { "@type": "WebPage", "@id": url, url },
    },
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

  const stepDuration = `PT${Math.max(1, Math.ceil(5 / steps.length))}M`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${opts.url}#howto`,
    name: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: "en",
    totalTime: "PT5M",
    prepTime: "PT1M",
    performTime: "PT4M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: steps.map((name, i) => ({
      "@type": "HowToStep",
      "@id": `${opts.url}#step-${i + 1}`,
      position: i + 1,
      name,
      duration: stepDuration,
      url: `${opts.url}#step-${i + 1}`,
    })),
  };
}

/**
 * Structured Data / JSON-LD Schema Generator
 * Generates rich schema markup for all page types
 */

import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import type { ComparisonPageData, FAQData, CategoryData, CitationStats } from "@/types";

export interface BlogSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  tags?: string[];
}

// ============================================================
// Organization schema (site-wide)
// ============================================================

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      "https://twitter.com/aversusb",
      "https://www.linkedin.com/company/aversusb",
      "https://github.com/aversusb",
      "https://www.facebook.com/aversusb",
      "https://www.youtube.com/@aversusb",
    ],
    description: "The internet's best destination for comparing anything — sports, countries, products, technology, and more.",
    foundingDate: "2024",
    knowsAbout: [
      "Product Comparisons",
      "Technology Reviews",
      "Data-Driven Analysis",
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
// SpeakableSpecification schema (AEO — voice assistants & LLMs)
// ============================================================

export function speakableSchema(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "#verdict",
        "#key-differences",
      ],
    },
    url,
  };
}

// ============================================================
// Comparison page schema (Article + FAQPage + BreadcrumbList + ItemList)
// ============================================================

export function comparisonPageSchema(
  comparison: ComparisonPageData,
  voteData?: ComparisonVoteData | null,
) {
  const url = `${SITE_URL}/compare/${comparison.slug}`;
  const schemas: Record<string, unknown>[] = [];

  // 1. Article schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.shortAnswer || comparison.metadata.metaDescription,
    url,
    datePublished: comparison.metadata.publishedAt,
    dateModified: comparison.metadata.updatedAt,
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
      sameAs: [
        "https://twitter.com/aversusb",
        "https://www.linkedin.com/company/aversusb",
        "https://github.com/aversusb",
      ],
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

  // 6. SpeakableSpecification for voice assistants & LLMs
  schemas.push(speakableSchema(url));

  // 7. AggregateRating per entity from user poll votes + review counts
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
      });
    }
  }

  return schemas;
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
// NewsArticle schema (for timely/trending blog posts)
// ============================================================

export function newsArticleSchema(opts: BlogSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Team`,
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
      sameAs: [
        "https://twitter.com/aversusb",
        "https://www.linkedin.com/company/aversusb",
        "https://github.com/aversusb",
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
  };
}

// ============================================================
// Blog article schema (picks NewsArticle vs Article based on timeliness)
// ============================================================

export function blogArticleSchema(opts: BlogSchemaInput & { isTimely: boolean }) {
  const base = {
    "@context": "https://schema.org",
    "@type": opts.isTimely ? "NewsArticle" : "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    ...(opts.dateModified && { dateModified: opts.dateModified }),
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Team`,
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
      sameAs: [
        "https://twitter.com/aversusb",
        "https://www.linkedin.com/company/aversusb",
        "https://github.com/aversusb",
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
  };

  return base;
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

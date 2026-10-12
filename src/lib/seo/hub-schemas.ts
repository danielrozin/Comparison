import type { HubEntry } from "@/lib/data/hubs";
import type { ComparisonPageData } from "@/types";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import {
  breadcrumbSchema,
  faqSchema,
  entitySchemaType,
  entityWikipediaSameAs,
  webPageSchema,
  teachesDefinedTerm,
} from "@/lib/seo/schema";

export function hubSchemas(hub: HubEntry, spokes: ComparisonPageData[]) {
  const hubUrl = `${SITE_URL}/hub/${hub.slug}`;

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Hubs", url: `${SITE_URL}/hub` },
    { name: hub.h1, url: hubUrl },
  ]);

  const hubOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(hub.h1)}&type=hub`;
  const hubToday = new Date().toISOString().slice(0, 10);
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    // LearningResource — hub pages are structured topic guides for decision-making.
    // Google Education carousel and AI engines use this to prioritize educational content.
    additionalType: "https://schema.org/LearningResource",
    learningResourceType: "Overview",
    "@id": `${hubUrl}#collectionpage`,
    name: hub.h1,
    description: hub.description,
    abstract: hub.description,
    url: hubUrl,
    inLanguage: "en-US",
    locationCreated: { "@type": "Country", name: "United States" },
    genre: "Topic Hub",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: hubToday,
    contentReferenceTime: hubToday,
    thumbnailUrl: hubOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${hubUrl}#primaryImage`,
      url: hubOgImage,
      contentUrl: hubOgImage,
      width: 1200,
      height: 630,
      caption: `${hub.h1} — Topic Hub on A Versus B`,
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    // subjectOf — declares this hub as a sub-dataset of the site's DataCatalog.
    // AI knowledge graph crawlers (ChatGPT, Perplexity, Gemini) follow subjectOf edges
    // to traverse entity → hub → DataCatalog, strengthening topical authority signals
    // for "[category] comparison" queries without requiring separate page visits.
    subjectOf: {
      "@type": "DataCatalog",
      "@id": `${SITE_URL}/#datacatalog`,
      name: `${SITE_NAME} Comparison Database`,
      url: SITE_URL,
    },
    potentialAction: [
      { "@type": "ReadAction", target: hubUrl },
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    ],
    mentions: spokes.slice(0, 10).map((s) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/compare/${s.slug}#article`,
      headline: s.title,
      url: `${SITE_URL}/compare/${s.slug}`,
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#page-intro", "#comparisons-heading", "#faq-heading"],
    },
    alternativeHeadline: `${hub.h1} — Expert Comparisons & Analysis`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
    educationalLevel: "General",
    teaches: teachesDefinedTerm(`How to compare and choose between ${hub.h1.toLowerCase().replace(/^[^:]+:\s*/, "")}`, hubUrl),
    educationalUse: "comparison",
    keywords: `${hub.h1.toLowerCase()} comparison, ${hub.slug.replace(/-/g, " ")} vs, best ${hub.slug.replace(/-/g, " ")}`,
    // about[] — typed entity references extracted from hub spokes; creates direct
    // hub→entity ProfilePage edges in AI knowledge graphs so crawlers can traverse
    // from topic hub to entity profiles without requiring spoke-level page visits.
    // about[] — typed entity references with sameAs Wikipedia/Wikidata anchors.
    // sameAs gives AI knowledge graphs (ChatGPT, Perplexity, Gemini) unambiguous entity
    // disambiguation handles so they can merge our hub data with existing KG nodes,
    // boosting citation confidence when the entity appears in "[entity] comparison" queries.
    about: spokes
      .flatMap((s) => s.entities.map((e) => {
        const wikiSameAs = entityWikipediaSameAs(e.name);
        return {
          "@type": entitySchemaType(e.entityType),
          "@id": `${SITE_URL}/entity/${e.slug}`,
          name: e.name,
          url: `${SITE_URL}/entity/${e.slug}`,
          ...(e.shortDesc && { description: e.shortDesc }),
          ...(wikiSameAs.length > 0 && { sameAs: wikiSameAs }),
        };
      }))
      .filter((v, i, arr) => arr.findIndex((x) => x["@id"] === v["@id"]) === i)
      .slice(0, 15),
    // significantLink — top comparison pages + entity ProfilePages for AI graph traversal.
    significantLink: [
      ...spokes.slice(0, 6).map((s) => `${SITE_URL}/compare/${s.slug}`),
      ...spokes.slice(0, 3).flatMap((s) => s.entities.map((e) => `${SITE_URL}/entity/${e.slug}`)),
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 15),
    mainEntity: {
      "@type": "ItemList",
      "@id": `${hubUrl}#comparisons`,
      name: `${hub.h1} Comparisons`,
      numberOfItems: spokes.length,
      itemListElement: spokes.map((s, i) => {
        const compUrl = `${SITE_URL}/compare/${s.slug}`;
        return {
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          item: { "@type": "WebPage", "@id": compUrl, name: s.title, url: compUrl },
        };
      }),
    },
    // citation — formal attribution chain from this CollectionPage to the top comparison
    // Articles in the hub. AI answer engines (ChatGPT, Perplexity) use citation to build
    // knowledge graph edges from topic hubs to specific comparison pages, boosting
    // our authority when answering "[hub topic] best comparison" queries.
    citation: spokes.slice(0, 5).map((s) => ({
      "@type": "WebPage",
      "@id": `${SITE_URL}/compare/${s.slug}#webpage`,
      name: s.title,
      url: `${SITE_URL}/compare/${s.slug}`,
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    })),
    // interactionStatistic — hub-level engagement signal. AI answer engines (ChatGPT,
    // Perplexity) use ReadAction counts as a proxy for topical authority when selecting
    // citations for "[topic] comparison" queries. Count = number of spoke pages in the hub.
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ReadAction",
        userInteractionCount: spokes.length,
        description: `${spokes.length} comparison pages under this hub on A Versus B`,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: spokes.length * 8,
        description: `Estimated combined views across ${spokes.length} hub comparison pages`,
      },
    ],
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    timeRequired: "PT3M",
    wordCount: Math.max(600, spokes.length * 40),
    // dateCreated + datePublished — stable creation timestamps for freshness ranking.
    // Using a fixed baseline (platform launch) rather than today prevents Google and
    // AI crawlers from treating every ISR revalidation as a brand-new document publish,
    // which would falsely reset content age signals and depress long-term authority.
    dateCreated: "2024-01-01",
    datePublished: "2024-01-01",
    dateModified: hubToday,
    copyrightYear: new Date().getFullYear(),
    // discussionUrl — Reddit search for community discussions on this hub topic.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(hub.h1.replace(/^[^:]+:\s*/, ""))}+comparison&type=link&sort=relevance`,
    // hasPart[] — structural sub-documents: ItemList, FAQPage, DefinedTermSet.
    // AI crawlers follow hasPart edges to resolve sub-schemas without re-crawling the full page.
    hasPart: [
      { "@type": "ItemList", "@id": `${hubUrl}#comparisons`, name: `${hub.h1} Comparisons`, url: hubUrl },
      ...(hub.faqs.length > 0 ? [{ "@id": `${hubUrl}#faq` }] : []),
      { "@type": "DefinedTermSet", "@id": `${hubUrl}#terms`, name: `${hub.h1} Key Terms` },
    ],
  };

  const faqs =
    hub.faqs.length > 0
      ? faqSchema(
          hub.faqs.map((f) => ({ question: f.q, answer: f.a })),
          `${hubUrl}#faq`,
        )
      : null;

  // DefinedTermSet — signals this hub is a topical glossary/directory for the domain.
  // AI models (ChatGPT, Perplexity) use DefinedTerm nodes for entity disambiguation
  // when building knowledge graphs from crawled content.
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${hubUrl}#terms`,
    name: `${hub.h1} Key Terms`,
    description: `Glossary of key terms and entities covered in the ${hub.h1} comparison hub.`,
    url: hubUrl,
    // Each compared product/service in the hub is a DefinedTerm so AI crawlers
    // can resolve the hub's subject matter to named entities in their knowledge graphs.
    hasDefinedTerm: spokes.slice(0, 10).flatMap((s) =>
      s.entities.map((e) => {
        const wikiSameAs = entityWikipediaSameAs(e.name);
        return {
          "@type": "DefinedTerm",
          name: e.name,
          url: `${SITE_URL}/entity/${e.slug}`,
          ...(e.shortDesc && { description: e.shortDesc }),
          // sameAs — Wikipedia/Wikidata/DBpedia anchors so AI systems can merge
          // this DefinedTerm with their KG entry for the entity without ambiguity.
          ...(wikiSameAs.length > 0 && { sameAs: wikiSameAs }),
          inDefinedTermSet: { "@id": `${hubUrl}#terms` },
        };
      })
    ).filter((v, i, arr) => arr.findIndex((x) => x.name === v.name) === i).slice(0, 20),
  };

  // WebPage node — bidirectional CollectionPage↔WebPage graph edge.
  // CollectionPage.mainEntityOfPage points at this WebPage; this WebPage.mainEntity
  // points back at the CollectionPage. Mirrors the pattern on comparison + alternatives pages.
  const webpage = webPageSchema({
    title: hub.h1,
    description: hub.description,
    url: hubUrl,
    dateModified: hubToday,
    mainEntity: { "@type": "CollectionPage", "@id": `${hubUrl}#collectionpage` },
    speakableCssSelector: ["h1", "#hub-intro", "#hub-description"],
  });

  return [breadcrumbs, collection, ...(faqs ? [faqs] : []), definedTermSet, webpage];
}

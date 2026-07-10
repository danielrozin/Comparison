import type { Metadata } from "next";

const SITE_URL = "https://www.aversusb.net";
const SITE_NAME = "A Versus B";
const PAGE_URL = `${SITE_URL}/search`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Search Comparisons")}&type=search`;
const PAGE_DESCRIPTION = "Search and compare anything — sports players, countries, products, technology, and more. Type any two things to get an instant, data-driven comparison.";
const PAGE_ABSTRACT = "Instant search across 3,000+ X vs Y comparisons — find any comparison by topic, product, person, or category. Type 'A vs B' to generate any comparison instantly.";

const searchResultsPageSchema = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  "@id": `${PAGE_URL}#searchresultspage`,
  name: "Search Comparisons — A Versus B",
  description: PAGE_DESCRIPTION,
  abstract: PAGE_ABSTRACT,
  alternativeHeadline: "Find Any Comparison Instantly — Type 'A vs B' to Generate Side-by-Side Analysis",
  url: PAGE_URL,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  interactivityType: "mixed",
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "How to find and compare anything side by side on A Versus B",
  educationalUse: "comparison",
  keywords: "search comparisons, compare anything, vs search, find comparison, side-by-side search",
  // thumbnailUrl + image — AI visual crawlers and Google rich results use these for
  // Knowledge Panel and AI Overview image slots on the search page.
  thumbnailUrl: OG_IMAGE,
  image: {
    "@type": "ImageObject",
    url: OG_IMAGE,
    contentUrl: OG_IMAGE,
    name: "Search Comparisons — A Versus B",
    description: "Search across 3,000+ side-by-side comparisons on A Versus B",
    width: 1200,
    height: 630,
    creditText: SITE_NAME,
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    acquireLicensePage: `${SITE_URL}/terms`,
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  // genre — content classification for AI indexers
  genre: "Search Interface",
  datePublished: "2024-01-01",
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  contentReferenceTime: new Date().toISOString(),
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  // copyrightNotice + copyrightHolder + acquireLicensePage — AI training attribution
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
  acquireLicensePage: `${SITE_URL}/terms`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  // audience — topic-audience matching for AI answer routing
  audience: {
    "@type": "Audience",
    audienceType: "Consumers, Researchers, Decision Makers, Students",
    geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" },
  },
  // potentialAction — SearchAction for sitelinks search box eligibility and AI router
  potentialAction: [
    {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${PAGE_URL}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
    {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: PAGE_URL },
    },
  ],
  // speakable — voice assistants and LLMs extract the h1 and intro paragraph
  speakable: {
    "@type": "SpeakableSpecification",
    "@id": `${PAGE_URL}#speakable`,
    cssSelector: ["h1", "p:first-of-type"],
  },
  // significantLink — points AI crawlers to the most important discovery paths
  significantLink: [
    `${SITE_URL}/trending`,
    `${SITE_URL}/category/technology`,
    `${SITE_URL}/category/sports`,
    `${SITE_URL}/api/v1/search`,
  ],
};

// BreadcrumbList for search page — enables breadcrumb rich results in SERP
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${PAGE_URL}#breadcrumbs`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL },
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Search",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Search Comparisons", url: PAGE_URL },
    },
  ],
};

// FAQPage for search page — AEO signal for "how do I find comparisons?" queries
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  additionalType: "https://schema.org/QAPage",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  isPartOf: { "@type": "SearchResultsPage", "@id": `${PAGE_URL}#searchresultspage` },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".faq-answer"],
  },
  mainEntity: [
    {
      "@type": "Question",
      "@id": `${PAGE_URL}#q1`,
      name: "How do I compare two things on A Versus B?",
      text: "How do I compare two things on A Versus B?",
      url: `${PAGE_URL}#q1`,
      answerCount: 1,
      upvoteCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${PAGE_URL}#a1`,
        text: "Type the names of the two things in the search box separated by 'vs' — for example 'iPhone vs Samsung' or 'Messi vs Ronaldo'. A Versus B will instantly show you a structured side-by-side comparison with attributes, a verdict, and FAQs.",
        inLanguage: "en-US",
        upvoteCount: 1,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
    },
    {
      "@type": "Question",
      "@id": `${PAGE_URL}#q2`,
      name: "What can I compare on A Versus B?",
      text: "What can I compare on A Versus B?",
      url: `${PAGE_URL}#q2`,
      answerCount: 1,
      upvoteCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${PAGE_URL}#a2`,
        text: "A Versus B covers 3,000+ comparisons across 17 categories: technology, sports, countries, products, software, automotive, health, finance, entertainment, gaming, brands, companies, history, celebrities, and more. You can compare AI models (ChatGPT vs Claude), smartphones (iPhone vs Samsung), athletes (Messi vs Ronaldo), countries (USA vs China), cloud platforms (AWS vs Azure), and virtually anything else.",
        inLanguage: "en-US",
        upvoteCount: 1,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
    },
    {
      "@type": "Question",
      "@id": `${PAGE_URL}#q3`,
      name: "Is the A Versus B comparison database free to use?",
      text: "Is the A Versus B comparison database free to use?",
      url: `${PAGE_URL}#q3`,
      answerCount: 1,
      upvoteCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${PAGE_URL}#a3`,
        text: "Yes — all comparisons on A Versus B are completely free to access with no registration required. The data is licensed under CC BY 4.0, meaning you can cite and share it freely with attribution to aversusb.net.",
        inLanguage: "en-US",
        upvoteCount: 1,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
    },
    {
      "@type": "Question",
      "@id": `${PAGE_URL}#q4`,
      name: "How does A Versus B generate comparisons?",
      text: "How does A Versus B generate comparisons?",
      url: `${PAGE_URL}#q4`,
      answerCount: 1,
      upvoteCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${PAGE_URL}#a4`,
        text: "Each comparison on A Versus B is researched and structured by our editorial team using verified data sources. Comparisons include attribute-by-attribute breakdowns with per-attribute winners, a structured verdict, community votes from real users, and FAQ pairs — all backed by cited sources and published with Schema.org JSON-LD markup for AI and search engine discoverability.",
        inLanguage: "en-US",
        upvoteCount: 1,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Search Comparisons | A Versus B",
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en": PAGE_URL,
      "x-default": PAGE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
      "application/atom+xml": `${SITE_URL}/feed/atom`,
    },
  },
  openGraph: {
    title: "Search Comparisons | A Versus B",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Search Comparisons — A Versus B" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: "Search Comparisons | A Versus B",
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: "Search Comparisons — A Versus B" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  },
  other: {
    "citation_title": "Search Comparisons — A Versus B",
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_ABSTRACT,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": "2024-01-01",
    "DC.title": "Search Comparisons — A Versus B",
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.subject": "Comparison Search, Side-by-Side Search Tool",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.description": PAGE_DESCRIPTION,
    "DC.type": "InteractiveResource",
    "DC.format": "text/html",
    "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
    "thumbnail": OG_IMAGE,
    "abstract": PAGE_ABSTRACT,
    "twitter:label1": "Comparisons Available",
    "twitter:data1": "3,000+",
    "twitter:label2": "License",
    "twitter:data2": "CC BY 4.0",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchResultsPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

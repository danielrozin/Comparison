import type { Metadata } from "next";

const SITE_URL = "https://www.aversusb.net";
const SITE_NAME = "A Versus B";

const searchResultsPageSchema = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  "@id": `${SITE_URL}/search#searchresultspage`,
  name: "Search Comparisons — A Versus B",
  description: "Search and compare anything — sports players, countries, products, technology, and more.",
  abstract: "Instant search across 3,000+ X vs Y comparisons — find any comparison by topic, product, person, or category.",
  url: `${SITE_URL}/search`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  interactivityType: "mixed",
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  educationalLevel: "General",
  teaches: "How to find and compare anything side by side on A Versus B",
  educationalUse: "comparison",
  accessibilityFeature: ["structuralNavigation", "readingOrder"],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  title: "Search Comparisons | A Versus B",
  description:
    "Search and compare anything — sports players, countries, products, technology, and more. Type any two things to get an instant, data-driven comparison.",
  alternates: {
    canonical: "https://www.aversusb.net/search",
  },
  openGraph: {
    title: "Search Comparisons | A Versus B",
    description:
      "Search and compare anything — sports players, countries, products, technology, and more.",
    url: "https://www.aversusb.net/search",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@aversusb",
    title: "Search Comparisons | A Versus B",
    description:
      "Search and compare anything — sports players, countries, products, technology, and more.",
  },
  robots: {
    index: true,
    follow: true,
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
      {children}
    </>
  );
}

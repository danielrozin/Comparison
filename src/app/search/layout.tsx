import type { Metadata } from "next";

const SITE_URL = "https://www.aversusb.net";
const SITE_NAME = "A Versus B";

const searchResultsPageSchema = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  name: "Search Comparisons — A Versus B",
  description: "Search and compare anything — sports players, countries, products, technology, and more.",
  url: `${SITE_URL}/search`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
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

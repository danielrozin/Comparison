import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { RequestForm } from "@/components/requests/RequestForm";
import { RequestList } from "@/components/requests/RequestList";
import { JsonLd } from "@/components/schema/JsonLd";

const REQ_TITLE = `Request a Comparison | ${SITE_NAME}`;
const REQ_DESC = "Suggest comparisons you'd like to see on A Versus B. Vote on existing requests to help us prioritize what to build next.";
const REQ_URL = `${SITE_URL}/requests`;

export const metadata: Metadata = {
  title: REQ_TITLE,
  description: REQ_DESC,
  alternates: { canonical: REQ_URL },
  openGraph: {
    title: REQ_TITLE,
    description: REQ_DESC,
    url: REQ_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: REQ_TITLE,
    description: REQ_DESC,
  },
  other: {
    "citation_title": REQ_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": REQ_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": REQ_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": REQ_URL,
  },
};

const requestsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${REQ_URL}#webpage`,
      name: REQ_TITLE,
      description: REQ_DESC,
      url: REQ_URL,

      locale: "en_US",      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      interactivityType: "mixed",
      accessMode: ["textual"],
      accessibilityFeature: ["readingOrder", "structuralNavigation"],
      accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      potentialAction: [
        { "@type": "ReadAction", target: REQ_URL },
        {
          "@type": "CommentAction",
          target: { "@type": "EntryPoint", urlTemplate: REQ_URL },
          name: "Request a comparison",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${REQ_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Request a Comparison", item: { "@type": "WebPage", "@id": REQ_URL, name: "Request a Comparison", url: REQ_URL } },
      ],
    },
  ],
};

export default function RequestsPage() {
  return (
    <>
      <JsonLd data={requestsPageSchema} />
    <div className="min-h-screen bg-surface-alt">
      {/* Hero */}
      <section aria-labelledby="requests-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-1.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Requests</li>
            </ol>
          </nav>
          <h1 id="requests-hero-heading" className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Request a Comparison
          </h1>
          <p className="text-primary-100 text-base sm:text-lg max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Suggest it and vote on others&apos;
            requests. Top-voted comparisons get built first!
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <section aria-labelledby="requests-suggest-heading" className="relative bg-white border border-border rounded-xl p-6 shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="requests-suggest-heading" className="text-lg font-bold text-text">Suggest a Comparison</h2>
                    <p className="text-xs text-text-secondary mt-0.5">Tell us what you&apos;d like to see compared</p>
                  </div>
                </div>
                <RequestForm />
              </section>
            </div>
          </div>

          {/* Request List */}
          <section aria-labelledby="requests-community-heading" className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 id="requests-community-heading" className="text-lg font-bold text-text">Community Requests</h2>
                <p className="text-xs text-text-secondary mt-0.5">Vote for what gets built next</p>
              </div>
            </div>
            <RequestList />
          </section>
        </div>
      </div>
    </div>
    </>
  );
}

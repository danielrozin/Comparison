import type { Metadata } from "next";
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
    siteName: SITE_NAME,
  },
  other: {
    "citation_title": REQ_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": REQ_DESC,
    "DC.title": REQ_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
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
      inLanguage: "en-US",
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
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Request a Comparison", item: REQ_URL },
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
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white py-14 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Request a Comparison
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Suggest it and vote on others&apos;
            requests. Top-voted comparisons get built first!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-text mb-1">
                  Suggest a Comparison
                </h2>
                <p className="text-sm text-text-secondary mb-5">
                  Tell us what you&apos;d like to see compared.
                </p>
                <RequestForm />
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-bold text-text mb-4">
              Community Requests
            </h2>
            <RequestList />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

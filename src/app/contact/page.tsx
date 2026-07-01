import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { ContactForm } from "./ContactForm";
import { JsonLd } from "@/components/schema/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE_NAME} team. Report errors, request new comparisons, ask general questions, or explore partnership opportunities.`,
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: { "en": `${SITE_URL}/contact`, "x-default": `${SITE_URL}/contact` },
  },
  openGraph: {
    title: `Contact ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team. We respond within 2 business days.`,
    url: `${SITE_URL}/contact`,
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#webpage`,
  name: `Contact ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team. Report errors, request new comparisons, ask general questions, or explore partnership opportunities.`,
  url: `${SITE_URL}/contact`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  interactivityType: "mixed",
  accessMode: ["textual"],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  potentialAction: { "@type": "ReadAction", target: `${SITE_URL}/contact` },
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "daniel@adgpt.com",
        availableLanguage: "English",
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        contactType: "partnerships",
        url: `${SITE_URL}/partnerships`,
        availableLanguage: "English",
        areaServed: "Worldwide",
      },
    ],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema} />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Contact</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Get in Touch
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Have a question, spotted an error, or want to suggest a new comparison? We respond within 2 business days.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Left — Info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-text">Contact Options</h2>
              <p className="text-xs text-text-secondary mt-0.5">We respond within 2 business days</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-1">
                Email
              </h3>
              <a
                href="mailto:contact@comparison.com"
                className="text-primary-600 hover:underline text-sm"
              >
                contact@comparison.com
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-2">
                What to Contact Us About
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  General questions about the site
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Reporting incorrect or outdated data
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Requesting a new comparison or category
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Partnership and collaboration inquiries
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Press and media requests
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-2">
                Response Time
              </h3>
              <p className="text-sm text-text-secondary">
                We aim to respond to all messages within 2 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
    </>
  );
}

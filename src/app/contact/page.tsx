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
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">Contact</li>
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
          <h2 className="text-2xl font-display font-bold text-text mb-4">Contact Options</h2>

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
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  General questions about the site
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Reporting incorrect or outdated data
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Requesting a new comparison or category
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
                  Partnership and collaboration inquiries
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600 font-bold">·</span>
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

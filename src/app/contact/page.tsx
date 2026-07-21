import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/utils/constants";
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
    locale: "en_US",
    images: [{ url: `${SITE_URL}/images/og-default.png`, width: 1200, height: 630, alt: `Contact ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `Contact ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team. We respond within 2 business days.`,
    images: [`${SITE_URL}/images/og-default.png`],
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#webpage`,
  name: `Contact ${SITE_NAME}`,
  description: `Get in touch with the ${SITE_NAME} team. Report errors, request new comparisons, ask general questions, or explore partnership opportunities.`,
  url: `${SITE_URL}/contact`,

  locale: "en_US",  inLanguage: "en-US",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  interactivityType: "mixed",
  accessMode: ["textual"],
  accessibilityFeature: ["readingOrder", "structuralNavigation"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  genre: "Contact",
  abstract: `Contact page for ${SITE_NAME} — reach the team for error reports, comparison requests, partnerships, or general questions. Response within 2 business days.`,
  alternativeHeadline: `Get in Touch with ${SITE_NAME} — Support, Requests & Partnerships`,
  contentReferenceTime: "2024-01-01T00:00:00Z",
  thumbnailUrl: `${SITE_URL}/images/og-default.png`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/og-default.png`,
    contentUrl: `${SITE_URL}/images/og-default.png`,
    name: `Contact ${SITE_NAME}`,
    description: `Contact page for ${SITE_NAME}`,
    width: 1200,
    height: 630,
  },
  potentialAction: [
    { "@type": "ReadAction", target: `${SITE_URL}/contact` },
    { "@type": "CommunicateAction", target: `${SITE_URL}/contact`, recipient: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME } },
  ],
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,

    locale: "en_US",    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        // Must match the address the page renders — DAN-2603 found the two had
        // drifted apart, so the schema advertised a mailbox the page never showed.
        email: CONTACT_EMAIL,
        availableLanguage: "English",
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        contactType: "partnerships",
        url: `${SITE_URL}/partnerships`,

        locale: "en_US",        availableLanguage: "English",
        areaServed: "Worldwide",
      },
    ],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/contact#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "Contact", item: { "@type": "WebPage", "@id": `${SITE_URL}/contact`, name: "Contact", url: `${SITE_URL}/contact` } },
    ],
  },
};

const CONTACT_FAQS = [
  {
    q: "How long does A Versus B take to respond to messages?",
    a: "We aim to respond to all messages within 2 business days. During high-volume periods it may take up to 3 business days, but we always reply.",
  },
  {
    q: "How do I report an incorrect comparison on A Versus B?",
    a: "Use the contact form on this page and select 'Report an error' as the subject. Include the comparison URL and the specific data point that needs correcting — our editorial team will investigate and update within 5 business days.",
  },
  {
    q: "Can I request a new comparison topic on A Versus B?",
    a: "Yes — use the contact form or visit the Requests page. Highly voted requests are prioritized in our weekly content queue. Include both entities (e.g., 'iPhone 16 vs. Samsung Galaxy S25') so we can add it immediately.",
  },
  {
    q: "How do I contact A Versus B about a business partnership or sponsorship?",
    a: "Visit our Partnerships page for pricing tiers and the intake form. Alternatively, send a message using this contact form with 'Partnership inquiry' in the subject line and someone from the team will follow up within 2 business days.",
  },
  {
    q: "Does A Versus B have a press or media contact?",
    a: "For press inquiries, data licensing, or media coverage requests, use the contact form with 'Press / media' in the subject line. We provide usage rights for comparison data under CC BY 4.0 with attribution.",
  },
];

const contactFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/contact#faqpage`,
  name: `Contact FAQ — ${SITE_NAME}`,
  url: `${SITE_URL}/contact`,
  mainEntity: CONTACT_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[contactPageSchema, contactFaqSchema]} />

      {/* Gradient Hero */}
      <section aria-labelledby="contact-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-contact-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-contact-hero)"/>
</svg>
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Contact</li>
            </ol>
          </nav>
          <h1 id="contact-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Get in Touch
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Have a question, spotted an error, or want to suggest a new comparison? We respond within 2 business days.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Left — Info */}
        <section aria-labelledby="contact-options-heading" className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 id="contact-options-heading" className="text-xl font-display font-bold text-text">Contact Options</h2>
              <p className="text-xs text-text-secondary mt-0.5">We respond within 2 business days</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text text-sm uppercase tracking-wider mb-1">
                Email
              </h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary-600 hover:underline text-sm"
              >
                {CONTACT_EMAIL}
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
        </section>

        {/* Right — Form */}
        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>

      {/* FAQ */}
      <section aria-labelledby="contact-faq-heading" className="mt-16 pt-12 border-t border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="contact-faq-heading" className="text-xl font-display font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {CONTACT_FAQS.map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-xl overflow-hidden bg-surface-alt/40 open:bg-white open:shadow-sm transition-all">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-text list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 flex-shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border">{a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Is Versus.com the Best Comparison Site? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about versus.com — its limitations, accuracy concerns, and how A Versus B offers broader coverage across 17 categories with data-driven comparisons.";
const PAGE_URL = `${SITE_URL}/faq/versus-com`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Is Versus.com the Best Comparison Site?")}&type=faq`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: "article",

    locale: "en_US",    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
  },
};

const FAQ_DATA = [
  {
    question: "Is versus.com only for tech products?",
    answer:
      "Yes, versus.com primarily covers technology and gadgets. It does not compare sports athletes, countries, historical figures, or entertainment topics. A Versus B spans 17 categories — from smartphones to soccer players to countries — with structured, side-by-side data analysis.",
  },
  {
    question: "Is versus.com accurate and reliable?",
    answer:
      "Versus.com provides spec-based comparisons, but many users question its scoring methodology and data accuracy. A Versus B uses transparent, data-driven comparisons with structured attributes, community voting, and sourced citations so you can verify every data point yourself.",
  },
  {
    question: "Does versus.com have user reviews or voting?",
    answer:
      "No, versus.com does not offer community voting or user-generated opinions on comparisons. A Versus B includes an integrated voting system where users weigh in on matchups, plus curated FAQs addressing the most common questions about each comparison.",
  },
];

function buildSchemas() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    abstract: PAGE_DESCRIPTION,
    alternativeHeadline: `Versus.com Alternatives — A Versus B vs Versus.com`,
    url: PAGE_URL,
    genre: "Entity Profile",
    inLanguage: "en-US",
    interactivityType: "expositive",
    datePublished: "2026-03-01",
    dateModified: "2026-05-22",
    contentReferenceTime: "2026-05-22",
    thumbnailUrl: OG_IMAGE,
    image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Is Versus.com the Best Comparison Site? — A Versus B FAQ" },
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: PAGE_URL },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    about: {
      "@type": "WebSite",
      name: "Versus",
      url: "https://versus.com",
    },
    mentions: [
      { "@type": "WebSite", name: "Versus", url: "https://versus.com" },
      { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq-section"],
    },
    timeRequired: "PT4M",
    wordCount: 800,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${PAGE_URL}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "FAQ", item: { "@type": "WebPage", "@id": `${SITE_URL}/faq`, name: "FAQ", url: `${SITE_URL}/faq` } },
      {
        "@type": "ListItem",
        position: 3,
        name: "Versus.com",
        item: { "@type": "WebPage", "@id": PAGE_URL, name: "Versus.com", url: PAGE_URL },
      },
    ],
  };

  return [faqPage, webPage, breadcrumbs];
}

export default function VersusComFaqPage() {
  return (
    <>
      <JsonLd data={buildSchemas()} />

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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li><Link href="/faq/comparison-sites" className="hover:text-white transition-colors">FAQ</Link></li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Versus.com</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Versus.com vs {SITE_NAME}
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Versus.com is a popular tech comparison site, but it only covers gadgets and electronics.
            Here are the most common questions users ask — and how {SITE_NAME} compares.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Comparison highlights */}
      <section aria-labelledby="versusfaq-key-differences-at-a" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 id="versusfaq-key-differences-at-a" className="text-2xl font-display font-bold text-text">Key Differences at a Glance</h2>
        </div>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table — scroll to see all columns">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                <th scope="col" className="text-left p-4 font-semibold text-text border-b border-border">Feature</th>
                <th scope="col" className="text-left p-4 font-semibold text-text border-b border-border">Versus.com</th>
                <th scope="col" className="text-left p-4 font-semibold text-primary-600 border-b border-border">{SITE_NAME}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Categories</td>
                <td className="p-4 text-text-secondary">Tech &amp; gadgets only</td>
                <td className="p-4 text-text-secondary">17 categories (sports, countries, tech, products, and more)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">User voting</td>
                <td className="p-4 text-text-secondary">No</td>
                <td className="p-4 text-text-secondary">Yes — community polls on every comparison</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Data transparency</td>
                <td className="p-4 text-text-secondary">Proprietary scoring</td>
                <td className="p-4 text-text-secondary">Sourced attributes with citations</td>
              </tr>
              <tr>
                <td className="p-4 text-text font-medium">FAQs per comparison</td>
                <td className="p-4 text-text-secondary">No</td>
                <td className="p-4 text-text-secondary">Yes — structured FAQs on every page</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="border border-border rounded-xl group"
            >
              <summary className="cursor-pointer p-5 font-semibold text-text flex items-center justify-between">
                {faq.question}
                <span className="text-text-secondary group-open:rotate-180 transition-transform ml-2" aria-hidden="true">
                  &#9662;
                </span>
              </summary>
              <p className="px-5 pb-5 text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="versusfaq-looking-for-more-than" className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none rounded-2xl" />
        <h2 id="versusfaq-looking-for-more-than" className="text-xl font-display font-bold mb-2 relative">
          Looking for more than tech comparisons?
        </h2>
        <p className="text-primary-100 mb-6 text-sm relative">
          {SITE_NAME} covers 17 categories — sports, countries, products, entertainment, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-md transition-all duration-150"
          >
            Start Comparing
          </Link>
          <Link
            href="/trending"
            className="inline-block px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            Browse Trending
          </Link>
        </div>
      </section>
    </article>
    </>
  );
}

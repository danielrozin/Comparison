import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Are G2 and Capterra Reviews Unbiased? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about G2 and Capterra — their pay-to-play review models, software-only coverage, and how A Versus B provides transparent, unbiased comparisons across all categories.";
const PAGE_URL = `${SITE_URL}/faq/g2-reviews`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Are G2 and Capterra Reviews Unbiased?")}&type=faq`;

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
    question: "Is G2 biased? Are G2 reviews pay-to-play?",
    answer:
      "G2 and Capterra operate on a paid listing model where vendors pay for premium placement and badges. For unbiased software comparisons, A Versus B provides transparent, data-driven side-by-side analysis without vendor influence — comparing features, pricing, and community sentiment.",
  },
  {
    question: "Can I compare non-software products on G2?",
    answer:
      "No, G2 only covers software products. A Versus B compares anything — technology, sports, countries, entertainment, health, finance, education, automotive, and more — all on one platform with consistent, structured data across 17 categories.",
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
    alternativeHeadline: `G2 & Capterra Review Alternatives — A Versus B Unbiased Comparisons`,
    url: PAGE_URL,
    genre: "Entity Profile",
    inLanguage: "en-US",
    interactivityType: "expositive",
    datePublished: "2026-03-01",
    dateModified: "2026-05-22",
    contentReferenceTime: "2026-05-22",
    thumbnailUrl: OG_IMAGE,
    image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Are G2 and Capterra Reviews Unbiased? — A Versus B FAQ" },
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
    about: [
      { "@type": "WebSite", name: "G2", url: "https://www.g2.com" },
      { "@type": "WebSite", name: "Capterra", url: "https://www.capterra.com" },
    ],
    mentions: [
      { "@type": "WebSite", name: "G2", url: "https://www.g2.com" },
      { "@type": "WebSite", name: "Capterra", url: "https://www.capterra.com" },
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
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
      {
        "@type": "ListItem",
        position: 3,
        name: "G2 & Capterra",
        item: PAGE_URL,
      },
    ],
  };

  return [faqPage, webPage, breadcrumbs];
}

export default function G2ReviewsFaqPage() {
  return (
    <>
      <JsonLd data={buildSchemas()} />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li><Link href="/faq/comparison-sites" className="hover:text-white transition-colors text-primary-200">FAQ</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">G2 &amp; Capterra</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            G2 &amp; Capterra vs {SITE_NAME}
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            G2 and Capterra are popular software review platforms, but their paid listing model raises bias
            concerns. Here&apos;s how {SITE_NAME} offers a transparent alternative.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Comparison highlights */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Key Differences at a Glance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                <th className="text-left p-4 font-semibold text-text border-b border-border">Feature</th>
                <th className="text-left p-4 font-semibold text-text border-b border-border">G2 / Capterra</th>
                <th className="text-left p-4 font-semibold text-primary-600 border-b border-border">{SITE_NAME}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Coverage</td>
                <td className="p-4 text-text-secondary">Software only</td>
                <td className="p-4 text-text-secondary">17 categories — software, sports, countries, and more</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Revenue model</td>
                <td className="p-4 text-text-secondary">Vendors pay for placement &amp; badges</td>
                <td className="p-4 text-text-secondary">No vendor payments — transparent data</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Comparison format</td>
                <td className="p-4 text-text-secondary">Review aggregation with star ratings</td>
                <td className="p-4 text-text-secondary">Structured side-by-side attribute tables</td>
              </tr>
              <tr>
                <td className="p-4 text-text font-medium">Community input</td>
                <td className="p-4 text-text-secondary">Written reviews (incentivized)</td>
                <td className="p-4 text-text-secondary">Community voting on every comparison</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="border border-border rounded-xl group"
            >
              <summary className="cursor-pointer p-5 font-semibold text-text flex items-center justify-between">
                {faq.question}
                <span className="text-text-secondary group-open:rotate-180 transition-transform ml-2">
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
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none rounded-2xl" />
        <h2 className="text-xl font-display font-bold mb-2 relative">
          Want unbiased comparisons?
        </h2>
        <p className="text-primary-100 mb-6 text-sm relative">
          {SITE_NAME} provides transparent, data-driven comparisons with no vendor influence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-md transition-all duration-150"
          >
            Start Comparing
          </Link>
          <Link
            href="/category/software"
            className="inline-block px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            Browse Software Comparisons
          </Link>
        </div>
      </section>
    </article>
    </>
  );
}

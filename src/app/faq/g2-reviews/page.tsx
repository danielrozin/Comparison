import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Are G2 and Capterra Reviews Unbiased? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about G2 and Capterra — their pay-to-play review models, software-only coverage, and how A Versus B provides transparent, unbiased comparisons across all categories.";
const PAGE_URL = `${SITE_URL}/faq/g2-reviews`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
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
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: [
      {
        "@type": "WebSite",
        name: "G2",
        url: "https://www.g2.com",
      },
      {
        "@type": "WebSite",
        name: "Capterra",
        url: "https://www.capterra.com",
      },
    ],
    mentions: [
      {
        "@type": "WebSite",
        name: "G2",
        url: "https://www.g2.com",
      },
      {
        "@type": "WebSite",
        name: "Capterra",
        url: "https://www.capterra.com",
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq-section"],
    },
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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={buildSchemas()} />

      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/faq/comparison-sites" className="hover:text-primary-600 transition-colors">
              FAQ
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">G2 &amp; Capterra</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          G2 &amp; Capterra vs {SITE_NAME}
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          G2 and Capterra are popular software review platforms, but their paid listing model raises bias
          concerns. Here&apos;s how {SITE_NAME} offers a transparent alternative.
        </p>
      </div>

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
      <section className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-text mb-2">
          Want unbiased comparisons?
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          {SITE_NAME} provides transparent, data-driven comparisons with no vendor influence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Start Comparing
          </Link>
          <Link
            href="/category/software"
            className="inline-block px-6 py-3 border border-border text-text font-semibold rounded-xl hover:bg-surface-alt transition-colors"
          >
            Browse Software Comparisons
          </Link>
        </div>
      </section>
    </article>
  );
}

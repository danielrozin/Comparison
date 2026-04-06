import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Is Versus.com the Best Comparison Site? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about versus.com — its limitations, accuracy concerns, and how A Versus B offers broader coverage across 17 categories with data-driven comparisons.";
const PAGE_URL = `${SITE_URL}/faq/versus-com`;

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
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "WebSite",
      name: "Versus",
      url: "https://versus.com",
    },
    mentions: [
      {
        "@type": "WebSite",
        name: "Versus",
        url: "https://versus.com",
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
        name: "Versus.com",
        item: PAGE_URL,
      },
    ],
  };

  return [faqPage, webPage, breadcrumbs];
}

export default function VersusComFaqPage() {
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
          <li className="text-text font-medium">Versus.com</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Versus.com vs {SITE_NAME}
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Versus.com is a popular tech comparison site, but it only covers gadgets and electronics.
          Here are the most common questions users ask — and how {SITE_NAME} compares.
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
                <th className="text-left p-4 font-semibold text-text border-b border-border">Versus.com</th>
                <th className="text-left p-4 font-semibold text-primary-600 border-b border-border">{SITE_NAME}</th>
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
          Looking for more than tech comparisons?
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          {SITE_NAME} covers 17 categories — sports, countries, products, entertainment, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Start Comparing
          </Link>
          <Link
            href="/trending"
            className="inline-block px-6 py-3 border border-border text-text font-semibold rounded-xl hover:bg-surface-alt transition-colors"
          >
            Browse Trending
          </Link>
        </div>
      </section>
    </article>
  );
}

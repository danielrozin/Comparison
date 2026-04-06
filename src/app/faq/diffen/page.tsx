import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Is Diffen.com Still Worth Using? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about diffen.com — its outdated content, wiki-style editing model, and how A Versus B provides a modern, AI-enriched comparison experience.";
const PAGE_URL = `${SITE_URL}/faq/diffen`;

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
    question: "Is diffen.com still updated?",
    answer:
      "Diffen relies on wiki-style user edits, so content can become outdated or inconsistent. A Versus B provides actively maintained, data-driven comparisons with AI-enriched content, real-time trending data, and regular updates across all 17 categories.",
  },
  {
    question: "What is a better alternative to diffen.com?",
    answer:
      "A Versus B offers a modern, visual comparison experience that diffen.com lacks — including side-by-side attribute tables, user voting, structured FAQs, and 17 specialized categories from Technology to Sports to History, all with sourced data.",
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
      name: "Diffen",
      url: "https://www.diffen.com",
    },
    mentions: [
      {
        "@type": "WebSite",
        name: "Diffen",
        url: "https://www.diffen.com",
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
        name: "Diffen",
        item: PAGE_URL,
      },
    ],
  };

  return [faqPage, webPage, breadcrumbs];
}

export default function DiffenFaqPage() {
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
          <li className="text-text font-medium">Diffen</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Diffen vs {SITE_NAME}
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Diffen.com pioneered wiki-style comparisons, but its content model shows its age.
          Here&apos;s how {SITE_NAME} delivers a modern, data-driven alternative.
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
                <th className="text-left p-4 font-semibold text-text border-b border-border">Diffen</th>
                <th className="text-left p-4 font-semibold text-primary-600 border-b border-border">{SITE_NAME}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Content model</td>
                <td className="p-4 text-text-secondary">Wiki-style user edits</td>
                <td className="p-4 text-text-secondary">AI-enriched, editorially maintained</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Update frequency</td>
                <td className="p-4 text-text-secondary">Inconsistent — depends on volunteers</td>
                <td className="p-4 text-text-secondary">Daily updates with trending data</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-text font-medium">Visual design</td>
                <td className="p-4 text-text-secondary">Sparse, text-heavy</td>
                <td className="p-4 text-text-secondary">Visual attribute tables with win indicators</td>
              </tr>
              <tr>
                <td className="p-4 text-text font-medium">Community features</td>
                <td className="p-4 text-text-secondary">Wiki edits only</td>
                <td className="p-4 text-text-secondary">Voting, FAQs, and community verdicts</td>
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
          Ready for modern comparisons?
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          {SITE_NAME} offers visual, data-driven comparisons across 17 categories — updated daily.
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

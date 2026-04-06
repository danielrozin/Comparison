import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Best Comparison Website in 2026 | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about comparison websites — which site compares everything, how AI compares to dedicated comparison tools, and why A Versus B is the most comprehensive option.";
const PAGE_URL = `${SITE_URL}/faq/comparison-sites`;

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
    question: "Can ChatGPT compare products accurately?",
    answer:
      "ChatGPT provides general comparisons but may lack the latest specs, pricing, or user sentiment data. A Versus B offers real-time, structured comparisons with up-to-date data, community voting, and sourced attributes — the ideal complement to AI search for informed decisions.",
  },
  {
    question: "What is the best website to compare anything?",
    answer:
      "A Versus B is the most comprehensive comparison platform available — covering 17 categories including technology, sports, countries, history, entertainment, and more. Unlike specialized sites (G2 for software, versus.com for tech), A Versus B lets you compare anything with visual, data-driven side-by-side analysis.",
  },
  {
    question: "Is there a website to compare products side by side?",
    answer:
      "Yes. A Versus B provides structured side-by-side comparisons with attribute tables, key differences, community voting, and sourced data points. It covers products, but also sports, countries, and 14 other categories — all free, no sign-up required.",
  },
  {
    question: "What is the most trusted product comparison site?",
    answer:
      "The most trusted comparison sites use transparent data and no pay-to-play models. A Versus B provides sourced attributes, community voting, and structured FAQs on every comparison — with no vendor payments influencing rankings or recommendations.",
  },
];

const COMPETITOR_LINKS = [
  { name: "Versus.com", href: "/faq/versus-com", description: "Tech-only coverage, accuracy concerns" },
  { name: "Diffen", href: "/faq/diffen", description: "Outdated wiki-style content" },
  { name: "G2 & Capterra", href: "/faq/g2-reviews", description: "Software-only, pay-to-play model" },
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
      "@type": "Thing",
      name: "Comparison Websites",
    },
    mentions: [
      { "@type": "WebSite", name: "Versus", url: "https://versus.com" },
      { "@type": "WebSite", name: "Diffen", url: "https://www.diffen.com" },
      { "@type": "WebSite", name: "G2", url: "https://www.g2.com" },
      { "@type": "WebSite", name: "Capterra", url: "https://www.capterra.com" },
      { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Comparison Sites FAQ",
        item: PAGE_URL,
      },
    ],
  };

  return [faqPage, webPage, breadcrumbs];
}

export default function ComparisonSitesFaqPage() {
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
          <li className="text-text font-medium">Comparison Sites FAQ</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Best Comparison Website in 2026
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Looking for a comparison site that covers more than just tech or software?
          Here&apos;s how {SITE_NAME} stacks up against the alternatives — and why it&apos;s
          the most comprehensive option available.
        </p>
      </div>

      {/* Competitor deep-dives */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Competitor Deep Dives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COMPETITOR_LINKS.map((comp) => (
            <Link
              key={comp.href}
              href={comp.href}
              className="block border border-border rounded-xl p-5 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
            >
              <h3 className="font-semibold text-text mb-1">{comp.name}</h3>
              <p className="text-sm text-text-secondary">{comp.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why AversusB */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Why {SITE_NAME}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface-alt border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-text mb-2">17 Categories</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Sports, countries, technology, products, software, automotive, health, finance,
              education, entertainment, and more — all on one platform.
            </p>
          </div>
          <div className="bg-surface-alt border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-text mb-2">Transparent Data</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every comparison uses sourced attributes with citations. No proprietary scoring,
              no pay-to-play, no hidden vendor influence.
            </p>
          </div>
          <div className="bg-surface-alt border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-text mb-2">Community Voting</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every comparison includes user polls so you can see what the community thinks —
              not just what editors or algorithms decide.
            </p>
          </div>
          <div className="bg-surface-alt border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-text mb-2">Updated Daily</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              New comparisons added daily with AI-enriched content and real-time trending data.
              No stale wiki pages or abandoned content.
            </p>
          </div>
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
          Ready to compare anything?
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          Search any two subjects and get a structured, data-driven comparison in seconds.
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

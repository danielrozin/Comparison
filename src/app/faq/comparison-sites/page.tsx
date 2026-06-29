import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Best Comparison Website in 2026 | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about comparison websites — which site compares everything, how AI compares to dedicated comparison tools, and why A Versus B is the most comprehensive option.";
const PAGE_URL = `${SITE_URL}/faq/comparison-sites`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Best Comparison Website in 2026")}&type=faq`;

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
    images: [OG_IMAGE],
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
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
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
    "@id": `${PAGE_URL}#webpage`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    abstract: PAGE_DESCRIPTION,
    alternativeHeadline: `Comparison Website FAQ — A Versus B vs Diffen, Versus.com & G2`,
    url: PAGE_URL,
    genre: "Topic Hub",
    inLanguage: "en-US",
    interactivityType: "expositive",
    datePublished: "2026-03-01",
    dateModified: "2026-05-22",
    contentReferenceTime: "2026-05-22",
    thumbnailUrl: OG_IMAGE,
    image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Comparison Website in 2026 — A Versus B FAQ" },
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers" },
    accessMode: ["textual"],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: PAGE_URL },
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
              <li className="text-white font-medium">Comparison Sites FAQ</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Best Comparison Website in 2026
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Looking for a comparison site that covers more than just tech or software?
            Here&apos;s how {SITE_NAME} stacks up against the alternatives — and why it&apos;s
            the most comprehensive option available.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none rounded-2xl" />
        <h2 className="text-xl font-display font-bold mb-2 relative">
          Ready to compare anything?
        </h2>
        <p className="text-primary-100 mb-6 text-sm relative">
          Search any two subjects and get a structured, data-driven comparison in seconds.
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

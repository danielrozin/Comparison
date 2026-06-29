import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_TITLE = `Is Diffen.com Still Worth Using? | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Frequently asked questions about diffen.com — its outdated content, wiki-style editing model, and how A Versus B provides a modern, AI-enriched comparison experience.";
const PAGE_URL = `${SITE_URL}/faq/diffen`;
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Is Diffen.com Still Worth Using?")}&type=faq`;

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
    "@id": `${PAGE_URL}#webpage`,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    abstract: PAGE_DESCRIPTION,
    alternativeHeadline: `Diffen.com Alternatives — Why A Versus B is Better`,
    url: PAGE_URL,
    genre: "Entity Profile",
    inLanguage: "en-US",
    interactivityType: "expositive",
    datePublished: "2026-03-01",
    dateModified: "2026-05-22",
    contentReferenceTime: "2026-05-22",
    thumbnailUrl: OG_IMAGE,
    image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Is Diffen.com Still Worth Using in 2026? — A Versus B" },
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
    potentialAction: { "@type": "ReadAction", target: PAGE_URL },
    about: {
      "@type": "WebSite",
      name: "Diffen",
      url: "https://www.diffen.com",
    },
    mentions: [
      { "@type": "WebSite", name: "Diffen", url: "https://www.diffen.com" },
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
              <li className="text-white font-medium">Diffen</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Diffen vs {SITE_NAME}
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Diffen.com pioneered wiki-style comparisons, but its content model shows its age.
            Here&apos;s how {SITE_NAME} delivers a modern, data-driven alternative.
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
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none rounded-2xl" />
        <h2 className="text-xl font-display font-bold mb-2 relative">
          Ready for modern comparisons?
        </h2>
        <p className="text-primary-100 mb-6 text-sm relative">
          {SITE_NAME} offers visual, data-driven comparisons across 17 categories — updated daily.
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

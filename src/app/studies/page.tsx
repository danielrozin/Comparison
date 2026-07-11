import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, teachesDefinedTerm } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export const revalidate = 86400;

const TITLE = "Data Studies — Comparison Trends & Reports";
const DESCRIPTION =
  "Original data studies from A Versus B: what brands, SaaS tools, and products people compare most. Free to cite and republish with attribution.";

const STUDIES_URL = `${SITE_URL}/studies`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: STUDIES_URL,
    languages: { "en": STUDIES_URL, "x-default": STUDIES_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: STUDIES_URL,
    type: "website",

    locale: "en_US",    siteName: SITE_NAME,
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.description": DESCRIPTION,
    "DC.subject": "Comparison Intelligence, Brand Research, Market Analysis, Consumer Behavior Studies",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": STUDIES_URL,
    "abstract": DESCRIPTION,
    "thumbnail": `${SITE_URL}/api/og?title=${encodeURIComponent("Data Studies — A Versus B")}&type=studies`,
    "twitter:label1": "Content Type",
    "twitter:data1": "Research Studies",
    "twitter:label2": "License",
    "twitter:data2": "CC BY 4.0",
  },
};

interface StudyEntry {
  slug: string;
  title: string;
  blurb: string;
  badge: string;
}

// Published studies. Add new entries here as the program scales.
const STUDIES: StudyEntry[] = [
  {
    slug: "b2b-saas-comparison-report-2026",
    title: "The B2B SaaS Comparison Report 2026",
    blurb:
      "384 head-to-head SaaS comparisons analyzed: the most-compared software tools, the hottest category rivalries, and where challengers are out-pacing incumbents.",
    badge: "Data Study",
  },
  {
    slug: "most-compared-brands-2026",
    title: "The Most-Compared Brands of 2026",
    blurb:
      "1,600+ head-to-head comparisons analyzed to rank the brands, SaaS tools, and matchups people research most this year.",
    badge: "Data Study",
  },
  {
    slug: "investing-comparison-report-2026",
    title: "The Investing & Finance Comparison Report 2026",
    blurb:
      "247 head-to-head finance comparisons analyzed: the most-researched brokerages, retirement accounts, credit cards, and investment products of 2026.",
    badge: "Data Study",
  },
];

export default function StudiesIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
  ]);

  const studiesToday = new Date().toISOString().slice(0, 10);
  const studiesOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(TITLE)}&type=studies`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${STUDIES_URL}#collectionpage`,
    name: TITLE,
    description: DESCRIPTION,
    abstract: DESCRIPTION,
    alternativeHeadline: "Original Comparison Data Studies — A Versus B Research Hub",
    url: STUDIES_URL,
    inLanguage: "en-US",
    genre: "Research Hub",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: studiesToday,
    contentReferenceTime: studiesToday,
    thumbnailUrl: studiesOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${STUDIES_URL}#primaryImage`,
      url: studiesOgImage,
      contentUrl: studiesOgImage,
      width: 1200,
      height: 630,
      caption: "Data Studies — A Versus B Research Hub",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, Business Analysts, Marketers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    educationalLevel: "General",
    teaches: teachesDefinedTerm("Original data studies on which brands, SaaS tools, and investment products are compared most frequently by consumers", `${SITE_URL}/studies`),
    educationalUse: "research",
    keywords: `comparison data study, brand comparison report, SaaS comparison data ${new Date().getFullYear()}, comparison trends`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "p:first-of-type", ".faq-answer"] },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: STUDIES_URL },
    hasPart: [
      ...STUDIES.map((s) => ({ "@type": "Article", name: s.title, url: `${STUDIES_URL}/${s.slug}`, description: s.blurb })),
      { "@type": "FAQPage", "@id": `${STUDIES_URL}#faq` },
    ],
    timeRequired: "PT2M",
    wordCount: 400,
    // datePublished + dateCreated — stable creation timestamps for E-E-A-T freshness.
    dateCreated: "2024-01-01",
    datePublished: "2024-01-01",
    dateModified: studiesToday,
    // interactionStatistic — study-page engagement signal for AI citation authority.
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReadAction",
      userInteractionCount: STUDIES.length,
      description: `${STUDIES.length} original data studies published on A Versus B`,
    },
  };

  const studiesFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    additionalType: "https://schema.org/QAPage",
    "@id": `${STUDIES_URL}#faq`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    isPartOf: { "@type": "CollectionPage", "@id": `${STUDIES_URL}#collectionpage` },
    speakable: { "@type": "SpeakableSpecification", "@id": `${STUDIES_URL}#faq-speakable`, cssSelector: [".faq-answer"] },
    about: [{ "@type": "Thing", name: "Consumer Comparison Research" }, { "@type": "Thing", name: "Brand Comparison Data" }],
    mainEntity: [
      {
        "@type": "Question", "@id": `${STUDIES_URL}#q1`, name: "What are the A Versus B data studies?", text: "What are the A Versus B data studies?",
        answerCount: 1, upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday,
        acceptedAnswer: { "@type": "Answer", "@id": `${STUDIES_URL}#a1`, inLanguage: "en-US", upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME }, text: "A Versus B data studies are original research reports built from our database of 1,600+ head-to-head comparisons. Each study reveals which brands, SaaS tools, and products consumers research most frequently, backed by real comparison-query data rather than surveys." },
      },
      {
        "@type": "Question", "@id": `${STUDIES_URL}#q2`, name: "Can I cite or republish findings from A Versus B data studies?", text: "Can I cite or republish findings from A Versus B data studies?",
        answerCount: 1, upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday,
        acceptedAnswer: { "@type": "Answer", "@id": `${STUDIES_URL}#a2`, inLanguage: "en-US", upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME }, text: "Yes. All A Versus B data studies are published under the Creative Commons CC BY 4.0 license. You can freely cite, quote, and republish findings as long as you credit A Versus B and include a link back to the original study URL." },
      },
      {
        "@type": "Question", "@id": `${STUDIES_URL}#q3`, name: "What methodology does A Versus B use for its data studies?", text: "What methodology does A Versus B use for its data studies?",
        answerCount: 1, upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday,
        acceptedAnswer: { "@type": "Answer", "@id": `${STUDIES_URL}#a3`, inLanguage: "en-US", upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME }, text: "Each study is built from our internal database of structured head-to-head comparison pages. We analyze search volume, comparison frequency, and on-page engagement signals across thousands of matchups to identify which rivalries attract the most consumer research activity in a given category or year." },
      },
      {
        "@type": "Question", "@id": `${STUDIES_URL}#q4`, name: "What topics do the current A Versus B data studies cover?", text: "What topics do the current A Versus B data studies cover?",
        answerCount: 1, upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday,
        acceptedAnswer: { "@type": "Answer", "@id": `${STUDIES_URL}#a4`, inLanguage: "en-US", upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME }, text: "Current studies cover B2B SaaS comparison trends (384 matchups analyzed), the most-compared brands of 2026 (1,600+ comparisons ranked), and investing & finance products (247 head-to-head finance comparisons). New topics are added as our database grows." },
      },
      {
        "@type": "Question", "@id": `${STUDIES_URL}#q5`, name: "How often does A Versus B publish new data studies?", text: "How often does A Versus B publish new data studies?",
        answerCount: 1, upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday,
        acceptedAnswer: { "@type": "Answer", "@id": `${STUDIES_URL}#a5`, inLanguage: "en-US", upvoteCount: 1, dateCreated: "2024-01-01", dateModified: studiesToday, author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME }, text: "New studies are published periodically — typically when enough comparison data accumulates to support statistically meaningful insights, or when major market shifts create a timely research opportunity. Subscribe to the A Versus B newsletter to be notified when a new study is published." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studiesFaqSchema) }} />

      {/* Gradient Hero */}
      <section aria-labelledby="studies-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-studies-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-studies-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
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
              <li className="text-white font-medium" aria-current="page">Data Studies</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 id="studies-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
              Data Studies
            </h1>
          </div>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Original research built from our database of {SITE_NAME} comparisons. Every study is free
            to cite, quote, and republish with attribution and a link back.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ul role="list" className="grid grid-cols-1 gap-4 list-none p-0 m-0">
          {STUDIES.map((s) => (
            <li key={s.slug}>
            <Link
              href={`/studies/${s.slug}`}
              className="group flex items-start gap-5 rounded-xl border border-border bg-surface p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 w-full"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60 mb-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  {s.badge}
                </span>
                <h2 className="text-xl font-display font-bold text-text mb-2 group-hover:text-primary-700 transition-colors">{s.title}</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{s.blurb}</p>
              </div>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            </li>
          ))}
        </ul>

        {/* FAQ Section — FAQPage JSON-LD speakable target for AEO/voice extraction */}
        <section id="faq" aria-labelledby="studies-faq-heading" className="mt-16 border-t border-border pt-12">
          <h2 id="studies-faq-heading" className="text-2xl font-display font-bold text-text mb-8">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-base font-semibold text-text mb-1">What are the A Versus B data studies?</dt>
              <dd className="text-sm text-text-secondary leading-relaxed faq-answer">A Versus B data studies are original research reports built from our database of 1,600+ head-to-head comparisons. Each study reveals which brands, SaaS tools, and products consumers research most frequently, backed by real comparison-query data rather than surveys.</dd>
            </div>
            <div>
              <dt className="text-base font-semibold text-text mb-1">Can I cite or republish findings from A Versus B data studies?</dt>
              <dd className="text-sm text-text-secondary leading-relaxed faq-answer">Yes. All A Versus B data studies are published under the Creative Commons CC BY 4.0 license. You can freely cite, quote, and republish findings as long as you credit A Versus B and include a link back to the original study URL.</dd>
            </div>
            <div>
              <dt className="text-base font-semibold text-text mb-1">What methodology does A Versus B use for its data studies?</dt>
              <dd className="text-sm text-text-secondary leading-relaxed faq-answer">Each study is built from our internal database of structured head-to-head comparison pages. We analyze search volume, comparison frequency, and on-page engagement signals across thousands of matchups to identify which rivalries attract the most consumer research activity in a given category or year.</dd>
            </div>
            <div>
              <dt className="text-base font-semibold text-text mb-1">What topics do the current A Versus B data studies cover?</dt>
              <dd className="text-sm text-text-secondary leading-relaxed faq-answer">Current studies cover B2B SaaS comparison trends (384 matchups analyzed), the most-compared brands of 2026 (1,600+ comparisons ranked), and investing &amp; finance products (247 head-to-head finance comparisons). New topics are added as our database grows.</dd>
            </div>
            <div>
              <dt className="text-base font-semibold text-text mb-1">How often does A Versus B publish new data studies?</dt>
              <dd className="text-sm text-text-secondary leading-relaxed faq-answer">New studies are published periodically — typically when enough comparison data accumulates to support statistically meaningful insights, or when major market shifts create a timely research opportunity. Subscribe to the A Versus B newsletter to be notified when a new study is published.</dd>
            </div>
          </dl>
        </section>

        <div className="mt-16">
          <NewsletterSignup source="studies-listing" />
        </div>
      </div>
    </>
  );
}

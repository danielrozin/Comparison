import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { BATTLES, HEADLINE_TOTAL, BATTLE_COUNT } from "./data";

const PAGE_PATH = "/q1-2026-ai-battles";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const CSV_PATH = "/data/q1-2026-ai-battles/dan423_top50_2026-06-12.csv";
const PUBLICATION_DATE = "2026-06-12";

const nf = new Intl.NumberFormat("en-US");
const fmtPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
const pctClass = (v: number) =>
  v > 0 ? "text-green-700" : v < 0 ? "text-red-700" : "text-text-secondary";

const Q1_TITLE = `Q1 2026 AI Tool Battles — ${nf.format(HEADLINE_TOTAL)} US comparison searches, ranked`;
const Q1_DESC = `Methodology and data for the Q1 2026 AI Tool Battles Index: ${nf.format(HEADLINE_TOTAL)} US Google Search comparison queries across ${BATTLE_COUNT} head-to-head battles (Jan–Mar 2026). Source, ranking method, limitations, and downloadable CSV.`;

export const metadata: Metadata = {
  title: Q1_TITLE,
  description: Q1_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: {
    title: `Q1 2026 AI Tool Battles — ${SITE_NAME}`,
    description: `${nf.format(HEADLINE_TOTAL)} US comparison searches across ${BATTLE_COUNT} AI tool battles (Jan–Mar 2026). Full methodology and downloadable dataset.`,
    url: PAGE_URL,
    type: "article",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent("Q1 2026 AI Tool Battles")}&type=article`, width: 1200, height: 630, alt: "Q1 2026 AI Tool Battles — A Versus B" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `Q1 2026 AI Tool Battles — ${SITE_NAME}`,
    description: `${nf.format(HEADLINE_TOTAL)} US comparison searches across ${BATTLE_COUNT} AI tool battles (Jan–Mar 2026).`,
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent("Q1 2026 AI Tool Battles")}&type=article`],
  },
  other: {
    "citation_title": Q1_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": Q1_DESC,
    "citation_publication_date": "2026-04-15",
    "citation_online_date": "2026-04-15",
    "citation_keywords": "AI tool comparison, Q1 2026 AI battles, ChatGPT search volume, Claude vs GPT-4, AI market share, LLM comparison data",
    "citation_fulltext_world_readable": "",
    "DC.title": Q1_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
    "DC.date": "2026-04-15",
    "DC.subject": "Artificial Intelligence; AI Comparison; Search Trends; LLM Market; Technology Research",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "United States",
  },
};

export default function Q1AiBattlesPage() {
  const description = `${nf.format(HEADLINE_TOTAL)} US Google Search comparison queries across ${BATTLE_COUNT} head-to-head AI tool battles, Jan–Mar 2026.`;
  const q1OgImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Q1 2026 AI Tool Battles")}&type=article`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle"],
    "@id": `${PAGE_URL}#article`,
    headline: "Q1 2026 AI Tool Battles Index — Methodology and Data",
    description,
    abstract: description,
    url: PAGE_URL,
    inLanguage: "en-US",
    genre: "Data Study",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: PUBLICATION_DATE,
    dateModified: PUBLICATION_DATE,
    lastReviewed: PUBLICATION_DATE,
    contentReferenceTime: PUBLICATION_DATE,
    thumbnailUrl: q1OgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${PAGE_URL}#primaryImage`,
      url: q1OgImage,
      contentUrl: q1OgImage,
      width: 1200,
      height: 630,
      caption: "Q1 2026 AI Tool Battles Index — A Versus B",
    },
    keywords: "AI tool comparison 2026, ChatGPT vs Claude, AI battles data, Q1 2026 search trends",
    alternativeHeadline: "Q1 2026 AI Chatbot Search Battle Rankings & Dataset",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, AI Enthusiasts, Marketers, Analysts", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual", "visual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual", "visual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    educationalLevel: "General",
    teaches: "How to analyze AI tool comparison search trends using quarterly US Google Search volume data and year-over-year growth rates",
    educationalUse: "research",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: PAGE_URL },
    timeRequired: "PT8M",
    wordCount: 1600,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    locationCreated: { "@type": "Country", name: "United States" },
    countryOfOrigin: { "@type": "Country", name: "United States" },
    discussionUrl: "https://www.reddit.com/search/?q=AI+tool+comparison+2026&type=link&sort=relevance",
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Q1 2026 AI Tool Battles — Top 50 comparison-search volumes (US Google)",
    description:
      "Ranked head-to-head comparison-search query volumes (US Google Search, exact-match) for AI and consumer-software product pairs, Q1 2026 (Jan–Mar 2026), with Q4 2025 and Q1 2025 comparators and QoQ/YoY change.",
    url: PAGE_URL,
    inLanguage: "en-US",
    keywords: "AI tool comparison 2026, ChatGPT vs Claude, search volume data, Q1 2026, Google Search trends, AI battles dataset",
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
    datePublished: PUBLICATION_DATE,
    dateModified: PUBLICATION_DATE,
    spatialCoverage: "United States",
    temporalCoverage: "2026-01-01/2026-03-31",
    variableMeasured: "Monthly Google Search volume (exact-match) for head-to-head AI tool comparison queries in the United States",
    measurementTechnique: "DataForSEO Labs API (Google Ads Keyword Planner data + clickstream); location_code 2840, language_code en, exact-match only",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: `${SITE_URL}/terms`,
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}${CSV_PATH}`,
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "Q1 2026 AI Tool Battles", item: { "@type": "WebPage", "@id": PAGE_URL, name: "Q1 2026 AI Tool Battles", url: PAGE_URL } },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
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
              <li className="text-white font-medium" aria-current="page">Q1 2026 AI Tool Battles</li>
            </ol>
          </nav>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-2">
            AI Tool Battles Index · Q1 2026 (Jan 1 – Mar 31, 2026)
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            The most-compared AI tools on US Google Search, Q1 2026
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-2xl">
            {nf.format(HEADLINE_TOTAL)} US comparison searches across {BATTLE_COUNT} head-to-head battles (Jan–Mar 2026) — documented with full methodology and downloadable dataset.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Headline figure callout */}
      <section aria-label="Report highlights" className="mb-12 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 p-6 sm:p-8">
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center list-none">
          <li>
            <div className="text-3xl sm:text-4xl font-display font-black text-primary-700">
              {nf.format(HEADLINE_TOTAL)}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              US comparison searches, Q1 2026
            </div>
          </li>
          <li>
            <div className="text-3xl sm:text-4xl font-display font-black text-primary-700">
              {BATTLE_COUNT}
            </div>
            <div className="text-sm text-text-secondary mt-1">head-to-head battles ranked</div>
          </li>
          <li>
            <div className="text-3xl sm:text-4xl font-display font-black text-primary-700">US</div>
            <div className="text-sm text-text-secondary mt-1">
              Google Search only · exact-match
            </div>
          </li>
        </ul>
      </section>

      <article className="prose prose-lg max-w-none space-y-12">
        {/* What this measures */}
        <section aria-labelledby="q1-what-measures-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 id="q1-what-measures-heading" className="text-2xl font-display font-bold text-text">What this report measures</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            This report ranks the most-compared software and consumer products on{" "}
            <strong className="text-text">US Google Search</strong> during{" "}
            <strong className="text-text">Q1 2026 (Jan 1 – Mar 31, 2026)</strong>.
            &ldquo;Most-compared&rdquo; means ranked by{" "}
            <strong className="text-text">observed search-engine query volume</strong> for
            head-to-head comparison phrases of the form &ldquo;X vs Y&rdquo; — for example,{" "}
            <em>&ldquo;chatgpt vs claude&rdquo;</em> or <em>&ldquo;1password vs bitwarden&rdquo;</em>.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            The goal is to surface, with public-data transparency, which buyer-decision battles
            people actually researched on Google during the quarter — not which tools we like, which
            raised money, or which brands trended on social.
          </p>
        </section>

        {/* Top 10 chart */}
        <section aria-labelledby="q1-top10-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 id="q1-top10-heading" className="text-2xl font-display font-bold text-text">Top 10 battles by Q1 2026 volume</h2>
          </div>
          <Image
            src="/data/q1-2026-ai-battles/chart-top10.png"
            alt="Bar chart of the top 10 most-compared AI and software tool battles by Q1 2026 US Google Search volume, led by claude code vs cursor and chatgpt vs claude."
            width={1350}
            height={780}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 2rem), 1280px"
            priority={true}
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Data source */}
        <section aria-labelledby="q1-data-source-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h2 id="q1-data-source-heading" className="text-2xl font-display font-bold text-text">Data source</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Keyword search-volume figures come from the{" "}
            <strong className="text-text">DataForSEO Labs API</strong> (endpoint{" "}
            <code>/dataforseo_labs/google/bulk_keyword_difficulty/live</code>), which derives volume
            estimates from Google Ads&rsquo; Keyword Planner data plus DataForSEO&rsquo;s own
            clickstream and SERP scraping. We use:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <code>location_code: 2840</code> (United States) — every figure in this report,
              including the headline figure, is US Google Search. We do not publish a worldwide
              aggregate.
            </li>
            <li>
              <code>language_code: &quot;en&quot;</code> throughout.
            </li>
            <li>
              Exact-match keyword volumes only (no broad/phrase variants). This produces conservative
              numbers — the true comparison-search universe is larger because of synonyms
              (&ldquo;comparison,&rdquo; &ldquo;better,&rdquo; &ldquo;difference between&rdquo;) that
              we exclude here for citation cleanliness.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            Month-by-month trend curves used for chart generation come from{" "}
            <strong className="text-text">Google Trends</strong> via DataForSEO&rsquo;s{" "}
            <code>/keywords_data/google_trends/explore/live</code> endpoint, which proxies the same
            Google Trends Explorer surface published at trends.google.com.
          </p>
        </section>

        {/* Ranking methodology */}
        <section aria-labelledby="q1-methodology-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h2 id="q1-methodology-heading" className="text-2xl font-display font-bold text-text">Ranking methodology</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            For the <strong className="text-text">Top 50 list:</strong>
          </p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              We define a candidate pool of 50 head-to-head pairs across 10 product categories — the
              universe is published as a sibling artifact on this report.
            </li>
            <li>For each pair we sum monthly search volume for Jan + Feb + Mar 2026.</li>
            <li>
              The Top 50 is ranked by that sum, descending. Ties are broken by absolute QoQ delta
              (largest mover wins the higher slot).
            </li>
            <li>
              Categories are not balanced — if a category over-represents the Top 50 by raw volume,
              that&rsquo;s the finding, not a flaw to correct for.
            </li>
          </ol>
          <p className="text-text-secondary leading-relaxed mt-3">
            For <strong className="text-text">QoQ percentages:</strong> Q1 2026 sum vs Q4 2025 sum
            (Oct + Nov + Dec). For <strong className="text-text">YoY percentages:</strong> Q1 2026
            sum vs Q1 2025 sum.
          </p>
        </section>

        {/* Fastest-rising chart */}
        <section aria-labelledby="q1-rising-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 id="q1-rising-heading" className="text-2xl font-display font-bold text-text">Fastest-rising battles</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            The quarter&rsquo;s growth is Claude-centric. <em>claude code vs cursor</em> (+1,388%
            YoY) was the single biggest battle, and <em>claude vs gemini</em> (+1,436% YoY) and{" "}
            <em>chatgpt vs claude</em> (+403% YoY) round out the genuine breakouts.
          </p>
          <Image
            src="/data/q1-2026-ai-battles/chart-fastest-rising.png"
            alt="Line chart of the fastest-rising AI tool comparison battles in Q1 2026 by year-over-year growth, led by Claude-centric matchups."
            width={1350}
            height={780}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 2rem), 1280px"
            loading="lazy"
            decoding="async"
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Biggest decliners chart */}
        <section aria-labelledby="q1-decliners-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <h2 id="q1-decliners-heading" className="text-2xl font-display font-bold text-text">Biggest decliners</h2>
          </div>
          <Image
            src="/data/q1-2026-ai-battles/chart-biggest-decliners.png"
            alt="Bar chart of the AI and software comparison battles with the steepest year-over-year decline in US Google Search volume in Q1 2026."
            width={1350}
            height={780}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) calc(100vw - 2rem), 1280px"
            loading="lazy"
            decoding="async"
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Full ranked table */}
        <section aria-labelledby="q1-full-ranked-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 id="q1-full-ranked-heading" className="text-2xl font-display font-bold text-text mb-0">
                Full ranked slate
              </h2>
            </div>
            <a
              href={CSV_PATH}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors no-underline"
            >
              <span aria-hidden="true">↓</span> Download CSV
            </a>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            All figures are US Google Search volume (exact-match), Q1 2026 vs Q4 2025 (QoQ) and Q1
            2025 (YoY). The same data is available as a{" "}
            <a href={CSV_PATH} download className="text-primary-600 hover:underline">
              downloadable CSV
            </a>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-border not-prose" tabIndex={0} role="region" aria-label="AI battles comparison table — scroll to see all columns">
            <table className="w-full text-sm">
              <caption className="sr-only">Full Q1 2026 AI battles comparison table — battle rank, matchup, and comparison volume</caption>
              <thead>
                <tr className="bg-surface-alt text-left">
                  <th scope="col" className="px-3 py-2 font-semibold text-text">#</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text">Battle</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text text-right">Q1 2026</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text text-right">Q4 2025</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text text-right">Q1 2025</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text text-right">QoQ</th>
                  <th scope="col" className="px-3 py-2 font-semibold text-text text-right">YoY</th>
                </tr>
              </thead>
              <tbody>
                {BATTLES.map((b) => (
                  <tr key={b.rank} className="border-t border-border">
                    <td className="px-3 py-2 text-text-secondary">{b.rank}</td>
                    <td className="px-3 py-2 text-text font-medium whitespace-nowrap">
                      {b.battle}
                    </td>
                    <td className="px-3 py-2 text-right text-text tabular-nums">
                      {nf.format(b.q1)}
                    </td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                      {nf.format(b.q4)}
                    </td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                      {nf.format(b.q1Prev)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${pctClass(b.qoq)}`}>
                      {fmtPct(b.qoq)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${pctClass(b.yoy)}`}>
                      {fmtPct(b.yoy)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What this does NOT measure */}
        <section aria-labelledby="q1-not-measure-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 id="q1-not-measure-heading" className="text-2xl font-display font-bold text-text">What this report does NOT measure</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">For honesty in citation:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Not actual product usage</strong> — we measure search
              behavior, which is upstream of usage. A tool can be heavily compared and never adopted
              (or vice versa).
            </li>
            <li>
              <strong className="text-text">Not revenue, market share, or user counts</strong> —
              those require company disclosures we don&rsquo;t have.
            </li>
            <li>
              <strong className="text-text">Not {SITE_NAME}&rsquo;s own page traffic</strong> — we
              don&rsquo;t use our internal analytics to rank external comparison demand. Our own
              traffic numbers are excluded from this dataset.
            </li>
            <li>
              <strong className="text-text">Not predictive</strong> — past-quarter comparison volume
              doesn&rsquo;t forecast adoption or market outcomes.
            </li>
            <li>
              <strong className="text-text">Not exhaustive of all comparison searches</strong> — we
              measure exact-match &ldquo;X vs Y&rdquo; only. Synonym variants (&ldquo;X versus
              Y,&rdquo; &ldquo;X or Y,&rdquo; &ldquo;difference between X and Y&rdquo;) are excluded
              for measurement cleanliness.
            </li>
          </ul>
        </section>

        {/* Confidence and limitations */}
        <section aria-labelledby="q1-confidence-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 id="q1-confidence-heading" className="text-2xl font-display font-bold text-text">Confidence and limitations</h2>
          </div>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Volume estimates carry ±15–25% margin</strong>{" "}
              (DataForSEO&rsquo;s documented accuracy band on volumes &lt; 100k/month). Headline
              figures are rounded to two significant figures to avoid implying false precision.
            </li>
            <li>
              <strong className="text-text">
                DataForSEO updates monthly volumes with a 1–3 month lag.
              </strong>{" "}
              Q1 2026 data is fully settled as of the publication date below; April 2026 onward is
              partial and will not appear in this report.
            </li>
            <li>
              <strong className="text-text">US-only geographic scope.</strong> All figures are US
              Google Search (<code>location_code: 2840</code>). Comparison demand outside the US, and
              in non-English markets (e.g. Chinese-market AI tools), is out of scope and
              underrepresented here.
            </li>
            <li>
              <strong className="text-text">&ldquo;Bard&rdquo; <span aria-hidden="true">→</span> &ldquo;Gemini&rdquo; rebrand:</strong>{" "}
              Google rebranded Bard to Gemini in early 2024. Residual &ldquo;bard vs chatgpt&rdquo;
              search volume reflects users whose mental model still uses the legacy name; we report it
              as a <em>legacy</em> term, not a current product.
            </li>
          </ul>
        </section>

        {/* Reproducibility */}
        <section aria-labelledby="q1-reproducibility-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="q1-reproducibility-heading" className="text-2xl font-display font-bold text-text">Reproducibility</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            We publish the{" "}
            <a href={CSV_PATH} download className="text-primary-600 hover:underline">
              per-pair Q1 volume CSV
            </a>{" "}
            and the chart source data as downloadable artifacts on this page. Anyone with a
            DataForSEO subscription (or comparable tool — Ahrefs, SEMrush) can reproduce the volume
            reads with the keywords and date range above. We invite corrections and will post
            correction notes inline.
          </p>
        </section>

        {/* Citations and corrections */}
        <section aria-labelledby="q1-citations-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 id="q1-citations-heading" className="text-2xl font-display font-bold text-text">Citations and corrections</h2>
          </div>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>Author: {SITE_NAME} data team. Lead analyst: Daniel Rozin (founder).</li>
            <li>Last updated: <time dateTime="2026-06-12">June 12, 2026</time>.</li>
            <li>Methodology version: 1.1 (US-only scope reconciled with press release).</li>
            <li>
              Corrections: contact{" "}
              <a href="mailto:pr@aversusb.net" className="text-primary-600 hover:underline">
                pr@aversusb.net
              </a>
              . Material corrections trigger a new methodology version + dated changelog entry on
              this page.
            </li>
          </ul>
        </section>

        {/* Versioning */}
        <section aria-labelledby="q1-versioning-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 id="q1-versioning-heading" className="text-2xl font-display font-bold text-text">Versioning</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            This is the inaugural quarterly report. Future quarters will be published at{" "}
            <code>/q2-2026-ai-battles</code>, <code>/q3-2026-ai-battles</code>, etc., each with its
            own methodology snapshot. If the methodology changes between quarters, we will say so and
            explain why.
          </p>
        </section>
      </article>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getFinanceStudy } from "@/lib/services/studies-service";
import { personAuthorNode, breadcrumbSchema, contentAuthorArray } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export const revalidate = 86400;

const PATH = "/studies/investing-comparison-report-2026";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "The Investing & Finance Comparison Report 2026 — Data Study";
const DESCRIPTION =
  "We analyzed every published head-to-head finance comparison in our database to rank the most-researched brokerages, retirement accounts, credit cards, and investment products in 2026.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Investing & Finance Comparison Report 2026")}&type=trending`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" , "max-video-preview": -1 },
  },
  alternates: {
    canonical: CANONICAL,
    languages: { "en": CANONICAL, "x-default": CANONICAL },
    types: { "application/rss+xml": SITE_URL + "/feed", "application/atom+xml": SITE_URL + "/feed/atom" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Investing & Finance Comparison Report 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImage, alt: "Investing & Finance Comparison Report 2026" }],
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
    "citation_publication_date": "2026-06-10",
    "citation_online_date": "2026-06-10",
    "citation_keywords": "investing, stock comparison, investment platforms, brokerage comparison, financial research 2026",
    "citation_fulltext_world_readable": "",
    "DC.title": TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": CANONICAL,
    "DC.date": "2026-06-10",
    "DC.subject": "Investing; Financial Comparison; Brokerage; Personal Finance; Market Research",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "United States; Global",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function InvestingStudyPage() {
  const study = await getFinanceStudy();

  const updatedLabel = new Date(study.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxCluster = Math.max(...study.clusters.map((c) => c.count), 1);
  const topTopic = study.topTopics[0];

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
    { name: "Investing & Finance Comparison Report 2026", url: CANONICAL },
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "The Investing & Finance Comparison Report 2026",
    description: DESCRIPTION,
    url: CANONICAL,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    datePublished: "2026-06-10",
    dateModified: study.updatedAt,
    measurementTechnique:
      "Aggregation of published finance and investing head-to-head comparison pages on aversusb.net",
    variableMeasured: "Number of comparison pages each financial product or institution appears in",
    keywords: ["investing", "brokerages", "retirement accounts", "credit cards", "personal finance", "crypto"],
    encodingFormat: ["text/html", "application/ld+json"],
    spatialCoverage: { "@type": "Place", name: "United States" },
    temporalCoverage: "2026",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle", "ScholarlyArticle"],
    "@id": `${CANONICAL}#article`,
    headline: TITLE,
    description: DESCRIPTION,
    abstract: DESCRIPTION,
    mainEntityOfPage: CANONICAL,
    url: CANONICAL,
    genre: "Data Study",
    inLanguage: "en-US",
    alternativeHeadline: "Which Investing & Finance Products Are Compared Most in 2026? — A Versus B Data Study",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: "2026-06-10",
    dateModified: study.updatedAt,
    lastReviewed: study.updatedAt,
    contentReferenceTime: study.updatedAt,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${CANONICAL}#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: "Investing & Finance Comparison Report 2026 — A Versus B Data Study",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Investors, Researchers, Financial Analysts, Consumers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
    educationalLevel: "General",
    teaches: "How to compare investment products and financial instruments using structured benchmark data",
    educationalUse: "research",
    keywords: "investing comparison, finance comparison report 2026, stock vs ETF, investment benchmarks, data study",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: contentAuthorArray(),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: CANONICAL },
    timeRequired: "PT7M",
    wordCount: 1400,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    locationCreated: { "@type": "Country", name: "United States" },
    countryOfOrigin: { "@type": "Country", name: "United States" },
    discussionUrl: "https://www.reddit.com/search/?q=investing+finance+comparison+broker&type=link&sort=relevance",
  };

  const citation = `${SITE_NAME}, "The Investing & Finance Comparison Report 2026," aversusb.net, ${updatedLabel}. ${CANONICAL}`;
  const embedHtml = `<a href="${CANONICAL}">The Investing &amp; Finance Comparison Report 2026 — A Versus B</a>`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Gradient Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-studies-investing-comparison-report-2026-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-studies-investing-comparison-report-2026-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200 flex-wrap">
              <li>
                <Link href="/" className="text-primary-200 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/studies" className="text-primary-200 hover:text-white transition-colors">Studies</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Investing Report 2026</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1">
                Data Study · Updated <time dateTime={new Date(study.updatedAt).toISOString()}>{updatedLabel}</time>
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
                The Investing &amp; Finance Comparison Report 2026
              </h1>
              <p id="page-intro" className="mt-2 text-primary-100 text-sm sm:text-base leading-relaxed">
                We analyzed <strong>{fmt(study.totalFinanceComparisons)} head-to-head finance comparisons</strong> published
                on A Versus B to rank the most-researched brokerages, retirement accounts, credit cards, and investment
                products. {study.fromSnapshot ? "" : "Data is live-queried daily and refreshed automatically."}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Headline stats */}
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12 list-none p-0 m-0">
          {[
            { label: "Finance Comparisons", value: fmt(study.totalFinanceComparisons) },
            { label: "Distinct Topics", value: fmt(study.distinctTopics) },
            { label: "#1 Most Researched", value: topTopic?.name ?? "—" },
          ].map((s) => (
            <li key={s.label} className="bg-surface-alt border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-text">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1">{s.label}</div>
            </li>
          ))}
        </ul>

        {/* Top 12 finance topics */}
        <section aria-labelledby="investing-top-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 id="investing-top-heading" className="text-2xl font-bold text-text">Most-Compared Finance Topics</h2>
          </div>
          <p className="text-text-secondary text-sm mb-5">
            Ranked by number of published head-to-head comparisons on aversusb.net.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label="Investing comparison table — scroll to see all columns">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <caption className="sr-only">Top investing comparison topics — ranked by search volume</caption>
              <thead className="bg-surface-alt">
                <tr>
                  <th scope="col" className="pl-4 pr-3 py-3 text-left font-semibold text-text-secondary">#</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold text-text-secondary">Topic / Product</th>
                  <th scope="col" className="px-3 py-3 text-left font-semibold text-text-secondary">Category</th>
                  <th scope="col" className="px-3 py-3 text-right font-semibold text-text-secondary">Comparisons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {study.topTopics.map((t) => (
                  <tr key={t.slug} className="hover:bg-surface-alt/60 transition-colors">
                    <td className="pl-4 pr-3 py-3 text-text-secondary/60 font-mono">{t.rank}</td>
                    <td className="px-3 py-3">
                      <Link href={`/entity/${t.slug}`} className="font-medium text-text hover:text-blue-600">
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{t.category}</td>
                    <td className="px-3 py-3 text-right font-semibold text-text">{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Category clusters */}
        <section aria-labelledby="investing-categories-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h2 id="investing-categories-heading" className="text-2xl font-bold text-text">Finance Categories Compared</h2>
          </div>
          <p className="text-text-secondary text-sm mb-5">
            How comparison activity breaks down across financial product categories.
          </p>
          <div className="space-y-3">
            {study.clusters.map((cl) => {
              const pct = Math.round((cl.count / maxCluster) * 100);
              return (
                <div key={cl.slug} className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-text">
                      {cl.icon} {cl.label}
                    </span>
                    <span className="text-sm font-mono text-text-secondary">{cl.count} comparisons</span>
                  </div>
                  <div className="w-full bg-surface-alt rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {cl.topMatchup && (
                    <p className="text-xs text-text-secondary">
                      Top matchup:{" "}
                      <Link href={`/compare/${cl.topMatchup.slug}`} className="text-blue-600 hover:underline">
                        {cl.topMatchup.title}
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Top 10 matchups */}
        <section aria-labelledby="investing-matchups-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 id="investing-matchups-heading" className="text-2xl font-bold text-text">Most-Connected Finance Matchups</h2>
          </div>
          <p className="text-text-secondary text-sm mb-5">
            Ranked by comparison centrality — the matchups whose two sides are each weighed against the
            widest field of alternatives.
          </p>
          <div className="space-y-3">
            {study.topMatchups.map((m) => (
              <div key={m.slug} className="bg-white border border-border rounded-xl p-4 flex items-start gap-4">
                <span className="text-2xl font-bold text-border w-8 shrink-0">{m.rank}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/compare/${m.slug}`} className="font-semibold text-text hover:text-blue-600">
                    {m.title}
                  </Link>
                  {m.insight && <p className="text-sm text-text-secondary mt-1">{m.insight}</p>}
                </div>
                {m.centrality > 0 && (
                  <span className="text-xs text-text-secondary/60 shrink-0 whitespace-nowrap">
                    {fmt(m.centrality)} linked comparisons
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section aria-labelledby="investing-methodology-heading" className="mb-12 bg-surface-alt border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 id="investing-methodology-heading" className="text-xl font-bold text-text">Methodology</h2>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary list-disc pl-4">
            <li>
              Dataset: all published comparison pages on aversusb.net in the <em>finance</em> and{" "}
              <em>economy</em> categories as of {updatedLabel}.
            </li>
            <li>
              Topic rankings count distinct comparison pages in which each financial product or institution
              appears — regardless of whether it is the subject or the challenger.
            </li>
            <li>
              Category clusters are determined by keyword matching against entity slugs and comparison titles.
            </li>
            <li>
              Matchup rankings use comparison centrality — the combined number of published comparisons
              each side appears in. Every figure on this page is a count of published comparison pages;
              we do not publish traffic or readership numbers.
            </li>
            <li>
              Data refreshes daily. The live dataset may differ slightly from this snapshot.
            </li>
          </ul>
        </section>

        {/* Citation + embed */}
        <section aria-labelledby="investing-cite-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h2 id="investing-cite-heading" className="text-xl font-bold text-text">Cite This Study</h2>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Free to use with attribution. Copy the citation or embed link below.
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wide">Citation</p>
              <div className="bg-surface-alt border border-border rounded-lg p-3 text-xs text-text font-mono break-all select-all">
                {citation}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wide">Embed Link</p>
              <div className="bg-surface-alt border border-border rounded-lg p-3 text-xs text-text font-mono break-all select-all">
                {embedHtml}
              </div>
            </div>
          </div>
        </section>

        {/* Back */}
        <div className="pt-4 border-t border-border/50">
          <Link href="/studies" className="text-sm text-blue-600 hover:underline">
            <span aria-hidden="true">← </span>All Data Studies
          </Link>
        </div>
      </article>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsletterSignup source="study-investing" />
      </div>
    </>
  );
}

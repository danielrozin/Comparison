import type { Metadata } from "next";
import Link from "next/link";
import { getFinanceStudy } from "@/lib/services/studies-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 86400;

const PATH = "/studies/investing-comparison-report-2026";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "The Investing & Finance Comparison Report 2026 — Data Study";
const DESCRIPTION =
  "We analyzed 247 head-to-head finance comparisons to rank the most-researched brokerages, retirement accounts, credit cards, and investment products in 2026.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Investing & Finance Comparison Report 2026")}&type=trending`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",
    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Investing & Finance Comparison Report 2026" }],
  },
  twitter: {
    card: "summary_large_image",
      site: "@aversusb",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImage],
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
    "citation_publication_date": "2026-06-10",
    "citation_online_date": "2026-06-10",
    "DC.title": TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": CANONICAL,
    "DC.date": "2026-06-10",
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
    copyrightNotice: `© 2026 ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Investors, Researchers, Financial Analysts, Consumers" },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
    educationalLevel: "General",
    teaches: "How to compare investment products and financial instruments using structured benchmark data",
    educationalUse: "research",
    keywords: "investing comparison, finance comparison report 2026, stock vs ETF, investment benchmarks, data study",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: CANONICAL },
    timeRequired: "PT7M",
    wordCount: 1400,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  };

  const citation = `${SITE_NAME}, "The Investing & Finance Comparison Report 2026," aversusb.net, ${updatedLabel}. ${CANONICAL}`;
  const embedHtml = `<a href="${CANONICAL}">The Investing &amp; Finance Comparison Report 2026 — A Versus B</a>`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-text">Home</Link>
          <span>/</span>
          <Link href="/studies" className="hover:text-text">Studies</Link>
          <span>/</span>
          <span className="text-text">Investing Report 2026</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full mb-4">
            Data Study
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight">
            The Investing &amp; Finance Comparison Report 2026
          </h1>
          <p id="page-intro" className="text-lg text-text-secondary leading-relaxed">
            We analyzed <strong>{fmt(study.totalFinanceComparisons)} head-to-head finance comparisons</strong> published
            on A Versus B to rank the most-researched brokerages, retirement accounts, credit cards, and investment
            products. {study.fromSnapshot ? "" : "Data is live-queried daily and refreshed automatically."}
          </p>
          <p className="text-sm text-text-secondary/60 mt-3">Last updated: {updatedLabel}</p>
        </div>

        {/* Headline stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Finance Comparisons", value: fmt(study.totalFinanceComparisons) },
            { label: "Distinct Topics", value: fmt(study.distinctTopics) },
            { label: "#1 Most Researched", value: topTopic?.name ?? "—" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-alt border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-text">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Top 12 finance topics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-2">Most-Compared Finance Topics</h2>
          <p className="text-text-secondary text-sm mb-5">
            Ranked by number of published head-to-head comparisons on aversusb.net.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="pl-4 pr-3 py-3 text-left font-semibold text-text-secondary">#</th>
                  <th className="px-3 py-3 text-left font-semibold text-text-secondary">Topic / Product</th>
                  <th className="px-3 py-3 text-left font-semibold text-text-secondary">Category</th>
                  <th className="px-3 py-3 text-right font-semibold text-text-secondary">Comparisons</th>
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
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-2">Finance Categories Compared</h2>
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
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-2">Most-Read Finance Matchups</h2>
          <p className="text-text-secondary text-sm mb-5">
            Ranked by reader traffic — the specific comparisons people research most.
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
                {m.viewCount > 0 && (
                  <span className="text-xs text-text-secondary/60 shrink-0">{fmt(m.viewCount)} views</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12 bg-surface-alt border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-text mb-3">Methodology</h2>
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
            <li>Readership figures are cumulative page views since publication.</li>
            <li>
              Data refreshes daily. The live dataset may differ slightly from this snapshot.
            </li>
          </ul>
        </section>

        {/* Citation + embed */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-text mb-4">Cite This Study</h2>
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
            ← All Data Studies
          </Link>
        </div>
      </div>
    </>
  );
}

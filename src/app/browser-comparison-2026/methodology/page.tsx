import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/browser-comparison-2026/methodology`;
const PAGE_TITLE = `How We Test Browsers — Methodology | ${SITE_NAME}`;
const BROWSER_METHOD_OG = `${SITE_URL}/api/og?title=${encodeURIComponent("Browser Comparison Methodology")}&type=trending`;
const PAGE_DESCRIPTION =
  "Our scoring rubric, data sources, recency policy, conflict-of-interest disclosure, and correction process for the A Versus B browser comparison guide 2026.";
const LAST_UPDATED = "2026-05-22";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: BROWSER_METHOD_OG, width: 1200, height: 630, alt: "How We Test Browsers — A Versus B Methodology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [BROWSER_METHOD_OG],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  genre: "Methodology",
  inLanguage: "en-US",
  interactivityType: "expositive",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: BROWSER_METHOD_OG,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: BROWSER_METHOD_OG,
    contentUrl: BROWSER_METHOD_OG,
    width: 1200,
    height: 630,
    caption: "How We Test Browsers — A Versus B Methodology",
  },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "How A Versus B tests and benchmarks web browsers for speed, privacy, and compatibility",
  educationalUse: "guide",
  keywords: "browser testing methodology, how we test browsers, browser benchmark methodology, Chrome Firefox testing",
  audience: { "@type": "Audience", audienceType: "Consumers, Developers, IT Professionals, Privacy Researchers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebPage", "@id": `${SITE_URL}/browser-comparison-2026#article`, url: `${SITE_URL}/browser-comparison-2026` },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  timeRequired: "PT3M",
  wordCount: 600,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

export default function BrowserMethodologyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={schema} />

      <nav className="mb-8">
        <ol className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          <li aria-hidden="true"><svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
          <li><Link href="/browser-comparison-2026" className="hover:text-primary-600 transition-colors">Browser Comparison</Link></li>
          <li aria-hidden="true"><svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
          <li className="text-text font-medium" aria-current="page">Methodology</li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="text-sm text-text-secondary mb-2">
          Last updated:{" "}
          <time dateTime={LAST_UPDATED}>
            {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          {" "}· Author:{" "}
          <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline">Daniel Rozin</Link>
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-4">
          How We Test &amp; Score Web Browsers
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          This page describes every attribute, data source, and editorial decision behind the{" "}
          <Link href="/browser-comparison-2026" className="text-primary-600 hover:underline">
            browser comparison guide
          </Link>.
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-display font-bold text-text">1. Scoring dimensions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                <th className="text-left p-3 font-semibold text-text border-b border-border">Attribute</th>
                <th className="text-left p-3 font-semibold text-text border-b border-border">What we measure</th>
                <th className="text-left p-3 font-semibold text-text border-b border-border">Primary source type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Engine / renderer", "Rendering engine, JavaScript engine", "Vendor developer docs / Chromium blog / MDN"],
                ["Version (current stable)", "Stable channel version number", "Vendor release notes (official blog or changelog)"],
                ["Platforms", "OS and mobile coverage", "Vendor system-requirements or download page"],
                ["Market share", "Desktop + mobile % share", "StatCounter GlobalStats (gs.statcounter.com), monthly"],
                ["Privacy posture", "Telemetry defaults, tracker blocking, fingerprinting protection", "Vendor privacy whitepaper or policy"],
                ["Extension ecosystem", "Store availability, estimated item count", "Official extension store front page (dated snapshot)"],
                ["Memory usage", "RAM under standardized tab load", "Methodology-disclosed independent benchmark (browserbench.org / Tom's Hardware)"],
                ["Standards compliance", "Web Platform Tests pass rate, Acid3 score", "wpt.fyi dashboard (permalink snapshot)"],
                ["Pricing / license", "Cost to end-user, open-source status", "Vendor download page + GitHub license file"],
              ].map(([attr, what, source]) => (
                <tr key={attr}>
                  <td className="p-3 font-medium text-text">{attr}</td>
                  <td className="p-3 text-text-secondary">{what}</td>
                  <td className="p-3 text-text-secondary">{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-display font-bold text-text">2. Data sources</h2>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li><strong className="text-text">Tier 1:</strong> Vendor official documentation, release notes, or privacy whitepaper — cited with URL and access date.</li>
          <li><strong className="text-text">Tier 1:</strong> StatCounter GlobalStats for market share — monthly CSV download, methodology publicly disclosed at <a href="https://gs.statcounter.com/methodology" rel="nofollow" className="text-primary-600 hover:underline">gs.statcounter.com/methodology</a>.</li>
          <li><strong className="text-text">Tier 1:</strong> web-platform-tests.org (wpt.fyi) for standards compliance — open public dataset.</li>
          <li><strong className="text-text">Tier 2:</strong> Methodology-disclosed benchmark publications (Tom&apos;s Hardware, PCMag) for memory/performance data.</li>
          <li><strong className="text-text">Disallowed:</strong> SimilarWeb (panel bias, methodology undisclosed), G2/Capterra user scores, our own pages.</li>
          <li><strong className="text-text">Wikipedia and any Wikipedia mirror/fork</strong> — never a cite-worthy source for a cell value. The <code className="text-sm bg-surface-alt px-1 rounded">about.sameAs</code> Wikipedia link (schema §1) is an entity reference only, never a citation. This prevents circular sourcing (WP:CIRCULAR).</li>
        </ol>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">3. Recency policy</h2>
        <p className="text-text-secondary leading-relaxed">
          Market share figures carry &ldquo;as of [YYYY-MM]&rdquo; labels referencing the StatCounter monthly data release.
          Version numbers are updated when a new stable channel release is announced. The page{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> stamp reflects the last real-content edit.
        </p>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">4. Conflict-of-interest disclosure</h2>
        <p className="text-text-secondary leading-relaxed">
          {SITE_NAME} has no paid relationships with any browser vendor. No browser vendor reviewed
          or approved this guide before publication. Affiliate links, if present, are clearly labeled
          and do not influence any data or ranking.
        </p>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">5. Correction policy</h2>
        <p className="text-text-secondary leading-relaxed">
          Errors can be reported to{" "}
          <a href="mailto:contact@aversusb.net" className="text-primary-600 hover:underline">contact@aversusb.net</a>.
          Please include the specific claim, your correction, and a primary source. We aim to respond
          within 48 hours and publish corrections with a visible notice and updated{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code>.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary mb-4">
          CC-BY-4.0 covers aversusb.net editorial text and table layout; vendor names, logos, and marks remain the property of their owners.
        </p>
        <Link href="/browser-comparison-2026" className="text-primary-600 hover:underline font-medium">
          ← Back to browser comparison
        </Link>
      </div>
    </article>
  );
}

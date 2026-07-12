import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { personAuthorNode } from "@/lib/seo/schema";

const PAGE_URL = `${SITE_URL}/browser-comparison-2026/methodology`;
const PAGE_TITLE = `How We Test Browsers — Methodology | ${SITE_NAME}`;
const BROWSER_METHOD_OG = `${SITE_URL}/api/og?title=${encodeURIComponent("Browser Comparison Methodology")}&type=trending`;
const PAGE_DESCRIPTION =
  "Our scoring rubric, data sources, recency policy, conflict-of-interest disclosure, and correction process for the A Versus B browser comparison guide 2026.";
const LAST_UPDATED = "2026-07-11";

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
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
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
  datePublished: "2026-07-11",
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
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: "How A Versus B tests and benchmarks web browsers for speed, privacy, and compatibility",
  educationalUse: "guide",
  keywords: "browser testing methodology, how we test browsers, browser benchmark methodology, Chrome Firefox testing",
  audience: { "@type": "Audience", audienceType: "Consumers, Developers, IT Professionals, Privacy Researchers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
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
    <>
      <JsonLd data={schema} />

      {/* Gradient Hero */}
      <section aria-labelledby="browser-method-heading" className="bg-gradient-to-br from-cyan-900 via-teal-900 to-primary-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-browser-comparison-2026-methodology-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-browser-comparison-2026-methodology-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-cyan-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-cyan-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/browser-comparison-2026" className="hover:text-white transition-colors">Browser Comparison</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-cyan-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Methodology</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm ring-1 ring-white/20" aria-hidden="true">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Methodology</span>
              <h1 id="browser-method-heading" className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                How We Test &amp; Score Web Browsers
              </h1>
              <p className="text-cyan-100 mt-2 leading-relaxed">
                Every attribute, data source, and editorial decision behind the{" "}
                <Link href="/browser-comparison-2026" className="text-white underline underline-offset-2 hover:no-underline">
                  browser comparison guide
                </Link>.
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

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10">
        <p className="text-sm text-text-secondary mb-2">
          Last updated:{" "}
          <time dateTime={LAST_UPDATED}>
            {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          {" "}· Author:{" "}
          <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline">Daniel Rozin</Link>
        </p>
      </header>

      <section aria-labelledby="browsmethod-1-scoring-dimensions" className="mb-10 space-y-4">
        <h2 id="browsmethod-1-scoring-dimensions" className="text-2xl font-display font-bold text-text">1. Scoring dimensions</h2>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Scrollable table">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">Browser scoring dimensions — attribute, what we measure, and primary source type</caption>
            <thead>
              <tr className="bg-surface-alt">
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Attribute</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">What we measure</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Primary source type</th>
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

      <section aria-labelledby="browsmethod-2-data-sources" className="mb-10 space-y-4">
        <h2 id="browsmethod-2-data-sources" className="text-2xl font-display font-bold text-text">2. Data sources</h2>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li><strong className="text-text">Tier 1:</strong> Vendor official documentation, release notes, or privacy whitepaper — cited with URL and access date.</li>
          <li><strong className="text-text">Tier 1:</strong> StatCounter GlobalStats for market share — monthly CSV download, methodology publicly disclosed at <a href="https://gs.statcounter.com/methodology" rel="nofollow" className="text-primary-600 hover:underline">gs.statcounter.com/methodology</a>.</li>
          <li><strong className="text-text">Tier 1:</strong> web-platform-tests.org (wpt.fyi) for standards compliance — open public dataset.</li>
          <li><strong className="text-text">Tier 2:</strong> Methodology-disclosed benchmark publications (Tom&apos;s Hardware, PCMag) for memory/performance data.</li>
          <li><strong className="text-text">Disallowed:</strong> SimilarWeb (panel bias, methodology undisclosed), G2/Capterra user scores, our own pages.</li>
          <li><strong className="text-text">Wikipedia and any Wikipedia mirror/fork</strong> — never a cite-worthy source for a cell value. The <code className="text-sm bg-surface-alt px-1 rounded">about.sameAs</code> Wikipedia link (schema §1) is an entity reference only, never a citation. This prevents circular sourcing (WP:CIRCULAR).</li>
        </ol>
      </section>

      <section aria-labelledby="browsmethod-3-recency-policy" className="mb-10 space-y-3">
        <h2 id="browsmethod-3-recency-policy" className="text-2xl font-display font-bold text-text">3. Recency policy</h2>
        <p className="text-text-secondary leading-relaxed">
          Market share figures carry &ldquo;as of [YYYY-MM]&rdquo; labels referencing the StatCounter monthly data release.
          Version numbers are updated when a new stable channel release is announced. The page{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> stamp reflects the last real-content edit.
        </p>
      </section>

      <section aria-labelledby="browsmethod-4-conflictofinterest-disclosure" className="mb-10 space-y-3">
        <h2 id="browsmethod-4-conflictofinterest-disclosure" className="text-2xl font-display font-bold text-text">4. Conflict-of-interest disclosure</h2>
        <p className="text-text-secondary leading-relaxed">
          {SITE_NAME} has no paid relationships with any browser vendor. No browser vendor reviewed
          or approved this guide before publication. Affiliate links, if present, are clearly labeled
          and do not influence any data or ranking.
        </p>
      </section>

      <section aria-labelledby="browsmethod-5-correction-policy" className="mb-10 space-y-3">
        <h2 id="browsmethod-5-correction-policy" className="text-2xl font-display font-bold text-text">5. Correction policy</h2>
        <p className="text-text-secondary leading-relaxed">
          Errors can be reported to{" "}
          <a href="mailto:daniarozin@gmail.com" className="text-primary-600 hover:underline">daniarozin@gmail.com</a>.
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
          <span aria-hidden="true">← </span>Back to browser comparison
        </Link>
      </div>
    </article>
    </>
  );
}

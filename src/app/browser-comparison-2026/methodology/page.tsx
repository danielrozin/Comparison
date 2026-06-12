import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/browser-comparison-2026/methodology`;
const PAGE_TITLE = `How We Test Browsers — Methodology | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Our scoring rubric, data sources, recency policy, conflict-of-interest disclosure, and correction process for the A Versus B browser comparison guide 2026.";
const LAST_UPDATED = "2026-05-22";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  author: { "@type": "Person", name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebPage", url: `${SITE_URL}/browser-comparison-2026` },
  license: "https://creativecommons.org/licenses/by/4.0/",
};

export default function BrowserMethodologyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={schema} />

      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary flex-wrap">
          <li><Link href="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/browser-comparison-2026" className="hover:text-primary-600 transition-colors">Browser Comparison</Link></li>
          <li>/</li>
          <li className="text-text font-medium">Methodology</li>
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

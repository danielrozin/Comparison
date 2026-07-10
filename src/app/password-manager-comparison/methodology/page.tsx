import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/password-manager-comparison/methodology`;
const PAGE_TITLE = `How We Test Password Managers — Methodology | ${SITE_NAME}`;
const PM_METHOD_OG = `${SITE_URL}/api/og?title=${encodeURIComponent("Password Manager Methodology")}&type=trending`;
const PAGE_DESCRIPTION =
  "Our scoring rubric, data sources, recency policy, conflict-of-interest disclosure, and correction process for the A Versus B password manager comparison guide.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: PM_METHOD_OG, width: 1200, height: 630, alt: "How We Test Password Managers — A Versus B Methodology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [PM_METHOD_OG],
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

const LAST_UPDATED = "2026-05-22";

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
  thumbnailUrl: PM_METHOD_OG,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: PM_METHOD_OG,
    contentUrl: PM_METHOD_OG,
    width: 1200,
    height: 630,
    caption: "How We Test Password Managers — A Versus B Methodology",
  },
  keywords: "password manager methodology, how we test password managers, security benchmark, review methodology",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  author: {
    "@type": "Person",
    "@id": `${SITE_URL}/authors/daniel-rozin#person`,
    name: "Daniel Rozin",
    url: `${SITE_URL}/authors/daniel-rozin`,
  },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebPage", "@id": `${SITE_URL}/password-manager-comparison#article`, url: `${SITE_URL}/password-manager-comparison` },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  accessibilityFeature: ["readingOrder", "structuralNavigation", "alternativeText"],
  timeRequired: "PT3M",
  wordCount: 600,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

export default function PasswordManagerMethodologyPage() {
  return (
    <>
      <JsonLd data={schema} />

      {/* Gradient Hero */}
      <section aria-labelledby="pm-method-heading" className="bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-password-manager-comparison-methodology-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-password-manager-comparison-methodology-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-teal-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-teal-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/password-manager-comparison" className="hover:text-white transition-colors">Password Managers</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-teal-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Methodology</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm ring-1 ring-white/20" aria-hidden="true">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Methodology</span>
              <h1 id="pm-method-heading" className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                How We Test &amp; Score Password Managers
              </h1>
              <p className="text-teal-100 mt-2 leading-relaxed">
                Every scoring dimension, data source, and editorial decision behind the{" "}
                <Link href="/password-manager-comparison" className="text-white underline underline-offset-2 hover:no-underline">
                  password manager comparison guide
                </Link>. Published so you — and independent fact-checkers — can verify every claim.
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

      <section aria-labelledby="method-scoring-heading" className="mb-10 space-y-4">
        <h2 id="method-scoring-heading" className="text-2xl font-display font-bold text-text">1. Scoring dimensions</h2>
        <p className="text-text-secondary leading-relaxed">
          Each password manager is evaluated on nine attributes. Scores are not weighted into a single
          composite number; we present raw per-attribute data so you can weight by your own priorities.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">Password manager scoring dimensions — attribute, what we measure, and primary source type</caption>
            <thead>
              <tr className="bg-surface-alt">
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Attribute</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">What we measure</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Primary source type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Encryption standard", "Algorithm, key length, key derivation function (PBKDF2/Argon2)", "Vendor security whitepaper or documentation"],
                ["Zero-knowledge architecture", "Whether the vendor can access plaintext vault data", "Vendor privacy/security whitepaper"],
                ["Independent security audit", "Third-party audit firm, audit date, scope, public report availability", "Published audit report (Cure53, Bishopfox, etc.)"],
                ["Breach history", "Confirmed security incidents, CVE records, vendor response", "CVE database, vendor incident disclosures"],
                ["Platforms supported", "OS and browser coverage", "Vendor download/compatibility page"],
                ["Pricing (per-user/yr)", "Current published price for individual plan", "Vendor pricing page (dated)"],
                ["Free tier limits", "Devices, items, features included free", "Vendor pricing page (dated)"],
                ["2FA / passkey support", "Supported second-factor methods, passkey compatibility", "Vendor feature documentation"],
                ["Open-source status", "Client-side code availability, license", "GitHub repository or vendor statement"],
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

      <section aria-labelledby="method-sources-heading" className="mb-10 space-y-4">
        <h2 id="method-sources-heading" className="text-2xl font-display font-bold text-text">2. Data sources</h2>
        <p className="text-text-secondary leading-relaxed">
          We accept only primary or independently audited sources. The hierarchy:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li><strong className="text-text">Tier 1 (required):</strong> Vendor security whitepaper, official documentation, or pricing page — cited with URL and access date.</li>
          <li><strong className="text-text">Tier 1 (required):</strong> Published third-party security audit (PDF from audit firm&apos;s own domain).</li>
          <li><strong className="text-text">Tier 2 (acceptable):</strong> CVE database (cve.mitre.org) for breach history; vendor incident disclosure blog post for context.</li>
          <li><strong className="text-text">Tier 3 (crosscheck only):</strong> Methodology-disclosed independent reviews (e.g., Wirecutter, PCMag) used to flag discrepancies, not as primary citations.</li>
          <li><strong className="text-text">Disallowed:</strong> User-review aggregators (G2, Trustpilot, Capterra), anonymous blog posts, our own pages, AI-generated summaries.</li>
          <li><strong className="text-text">Wikipedia and any Wikipedia mirror/fork</strong> — never a cite-worthy source for a cell value. The <code className="text-sm bg-surface-alt px-1 rounded">about.sameAs</code> Wikipedia link (schema §1) is an entity reference only, never a citation. This prevents circular sourcing (WP:CIRCULAR).</li>
        </ol>
      </section>

      <section aria-labelledby="method-recency-heading" className="mb-10 space-y-4">
        <h2 id="method-recency-heading" className="text-2xl font-display font-bold text-text">3. Recency policy</h2>
        <p className="text-text-secondary leading-relaxed">
          All time-sensitive data cells (pricing, audit dates, breach history) carry a visible
          &ldquo;as of [YYYY-MM]&rdquo; label. We review and update pricing data monthly and audit
          data quarterly. The page&apos;s <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code>{" "}
          field reflects the last real-content edit — not cache refreshes or layout changes.
        </p>
      </section>

      <section aria-labelledby="method-coi-heading" className="mb-10 space-y-4">
        <h2 id="method-coi-heading" className="text-2xl font-display font-bold text-text">4. Conflict-of-interest disclosure</h2>
        <p className="text-text-secondary leading-relaxed">
          {SITE_NAME} does not accept payment from vendors to influence comparison scores or rankings.
          We may display affiliate links for some products; these are clearly labeled and do not affect
          the comparison data. No vendor has reviewed or approved this guide prior to publication.
          The author ({" "}
          <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline">Daniel Rozin</Link>
          ) holds no financial stake in any of the reviewed products.
        </p>
      </section>

      <section aria-labelledby="method-corrections-heading" className="mb-10 space-y-4">
        <h2 id="method-corrections-heading" className="text-2xl font-display font-bold text-text">5. Correction policy</h2>
        <p className="text-text-secondary leading-relaxed">
          If you identify an error — factual, numerical, or attributional — email{" "}
          <a href="mailto:contact@aversusb.net" className="text-primary-600 hover:underline">contact@aversusb.net</a>{" "}
          with the claim, your proposed correction, and a primary source. We aim to respond within
          48 hours and publish corrections with a visible correction notice and updated{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> timestamp.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary mb-4">
          CC-BY-4.0 covers aversusb.net editorial text and table layout; vendor names, logos, and marks remain the property of their owners.
        </p>
        <Link href="/password-manager-comparison" className="text-primary-600 hover:underline font-medium">
          <span aria-hidden="true">← </span>Back to password manager comparison
        </Link>
      </div>
    </article>
    </>
  );
}

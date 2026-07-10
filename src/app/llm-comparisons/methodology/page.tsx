import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { personAuthorNode } from "@/lib/seo/schema";

const PAGE_URL = `${SITE_URL}/llm-comparisons/methodology`;
const PAGE_TITLE = `How We Compare Large Language Models — Methodology | ${SITE_NAME}`;
const LLM_METHOD_OG = `${SITE_URL}/api/og?title=${encodeURIComponent("LLM Comparison Methodology")}&type=trending`;
const PAGE_DESCRIPTION =
  "Our column definitions, source tier hierarchy, recency policy, COI disclosure, and correction process for the A Versus B LLM comparison guide — structured to mirror the Wikipedia Comparison of large language models table.";
const LAST_UPDATED = "2026-05-22";

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
    images: [{ url: LLM_METHOD_OG, width: 1200, height: 630, alt: "How We Compare Large Language Models — A Versus B Methodology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [LLM_METHOD_OG],
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
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: LLM_METHOD_OG,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: LLM_METHOD_OG,
    contentUrl: LLM_METHOD_OG,
    width: 1200,
    height: 630,
    caption: "How We Compare Large Language Models — A Versus B Methodology",
  },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "How A Versus B tests and benchmarks large language models for comparative analysis",
  educationalUse: "guide",
  keywords: "LLM methodology, how we compare language models, AI benchmark methodology, GPT vs Claude testing",
  audience: { "@type": "Audience", audienceType: "AI Researchers, Developers, Consumers, Analysts", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  author: { "@type": "Person", "@id": `${SITE_URL}/authors/daniel-rozin#person`, name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
  isPartOf: { "@type": "WebPage", "@id": `${SITE_URL}/llm-comparisons#article`, url: `${SITE_URL}/llm-comparisons` },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  license: "https://creativecommons.org/licenses/by/4.0/",
  timeRequired: "PT3M",
  wordCount: 600,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

export default function LLMMethodologyPage() {
  return (
    <>
      <JsonLd data={schema} />

      {/* Gradient Hero */}
      <section aria-labelledby="llm-method-heading" className="bg-gradient-to-br from-violet-900 via-purple-900 to-primary-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-llm-comparisons-methodology-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-llm-comparisons-methodology-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-violet-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-violet-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/llm-comparisons" className="hover:text-white transition-colors">LLM Comparisons</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-violet-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Methodology</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm ring-1 ring-white/20" aria-hidden="true">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.703-1.352 2.703H4.15c-1.38 0-2.35-1.703-1.35-2.703L4.2 15.3" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Methodology</span>
              <h1 id="llm-method-heading" className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                How We Compare Large Language Models
              </h1>
              <p className="text-violet-100 mt-2 leading-relaxed">
                Every column, data source, and editorial decision behind the{" "}
                <Link href="/llm-comparisons" className="text-white underline underline-offset-2 hover:no-underline">LLM comparison guide</Link>.
                Column structure mirrors the Wikipedia &ldquo;Comparison of large language models&rdquo; article.
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

      <section aria-labelledby="llmmethod-1-column-definitions-wikipediaparity" className="mb-10 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
            </svg>
          </div>
          <h2 id="llmmethod-1-column-definitions-wikipediaparity" className="text-2xl font-display font-bold text-text">1. Column definitions (Wikipedia-parity)</h2>
        </div>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Methodology table — scroll to see all columns">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">LLM methodology — column definitions, definitions, and primary source types</caption>
            <thead>
              <tr className="bg-surface-alt">
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Column</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Definition</th>
                <th scope="col" className="text-left p-3 font-semibold text-text border-b border-border">Primary source type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Model name", "Official model identifier as used in vendor API", "Vendor API model list or release announcement"],
                ["Vendor", "Organization that trained and maintains the model", "Vendor corporate page"],
                ["Parameters", "Total parameter count (MoE: total / active); 'Undisclosed' when vendor has not published", "Vendor technical report (arXiv) or model card; NOT leaked or estimated figures"],
                ["Context window", "Maximum input+output token window per inference call; definition varies by vendor — see note", "Vendor API documentation (capability table)"],
                ["Modality (input)", "Input types: text, image, audio, video, code", "Vendor API capabilities table or model card"],
                ["Modality (output)", "Output types: text, image, audio, code", "Vendor API capabilities table or model card"],
                ["License", "End-user license; 'Open weights' if weights are downloadable", "Vendor Terms of Service or GitHub license file"],
                ["Knowledge cutoff", "Nominal training data cutoff date published by vendor; 'Undisclosed' when not published", "Vendor API documentation or model card"],
              ].map(([col, def, src]) => (
                <tr key={col}>
                  <td className="p-3 font-medium text-text">{col}</td>
                  <td className="p-3 text-text-secondary">{def}</td>
                  <td className="p-3 text-text-secondary">{src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-secondary">
          <strong>Context window note:</strong> Some vendors report context as input-only tokens; others report combined input+output.
          We report the figure stated in the vendor&apos;s API documentation and flag the definition used in the table footnote.
        </p>
      </section>

      <section aria-labelledby="llmmethod-2-data-sources" className="mb-10 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7a8 8 0 0116 0c0 4.418-3.582 8-8 8S4 11.418 4 7zM4 7v10a8 8 0 0016 0V7" />
            </svg>
          </div>
          <h2 id="llmmethod-2-data-sources" className="text-2xl font-display font-bold text-text">2. Data sources</h2>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-text-secondary">
          <li><strong className="text-text">Tier 1 (required):</strong> Vendor API documentation, model card, or official release blog post — cited with URL and access date.</li>
          <li><strong className="text-text">Tier 1 (required):</strong> arXiv technical report authored by the vendor research team — used for parameter counts and architecture details.</li>
          <li><strong className="text-text">Tier 2 (acceptable for benchmarks):</strong> LMSYS Chatbot Arena leaderboard (chat.lmsys.org) — public, community-run, cited with snapshot date. HuggingFace Open LLM Leaderboard for open-weight models.</li>
          <li><strong className="text-text">Disallowed:</strong> Vendor self-reported benchmark numbers without independent reproduction, Twitter/X announcements as sole source, leaked parameter estimates, AI-generated summaries.</li>
          <li><strong className="text-text">Wikipedia and any Wikipedia mirror/fork</strong> — never a cite-worthy source for a cell value. The <code className="text-sm bg-surface-alt px-1 rounded">about.sameAs</code> Wikipedia link (schema §1) is an entity reference only, never a citation. This prevents circular sourcing (WP:CIRCULAR).</li>
        </ol>
        <p className="text-text-secondary text-sm">
          <strong>Undisclosed values:</strong> When a vendor (e.g., OpenAI for GPT-4 parameters, Anthropic for Claude 3 parameters)
          has not published a figure, the cell reads &ldquo;Undisclosed&rdquo; and cites the Tier 1 model card
          or documentation that makes the same non-disclosure. We do not substitute estimated or leaked numbers.
        </p>
      </section>

      <section aria-labelledby="llmmethod-3-recency-policy" className="mb-10 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="llmmethod-3-recency-policy" className="text-2xl font-display font-bold text-text">3. Recency policy</h2>
        </div>
        <p className="text-text-secondary leading-relaxed">
          Context windows, knowledge cutoffs, and model versions are updated within 2 weeks of a vendor
          releasing a new stable model. The page&apos;s{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> stamp reflects the last
          real-content edit. All time-sensitive cells carry an &ldquo;as of [YYYY-MM]&rdquo; note in the table footer.
        </p>
      </section>

      <section aria-labelledby="llmmethod-4-conflictofinterest-disclosure" className="mb-10 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 id="llmmethod-4-conflictofinterest-disclosure" className="text-2xl font-display font-bold text-text">4. Conflict-of-interest disclosure</h2>
        </div>
        <p className="text-text-secondary leading-relaxed">
          {SITE_NAME} has no paid relationships with any AI vendor. No model vendor reviewed or approved
          this guide before publication. {SITE_NAME} does not license or resell any of the APIs in this table.
          The author (
          <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline">Daniel Rozin</Link>
          ) holds no equity in any listed organization.
        </p>
      </section>

      <section aria-labelledby="llmmethod-5-correction-policy" className="mb-10 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="llmmethod-5-correction-policy" className="text-2xl font-display font-bold text-text">5. Correction policy</h2>
        </div>
        <p className="text-text-secondary leading-relaxed">
          Corrections with a primary source may be submitted to{" "}
          <a href="mailto:contact@aversusb.net" className="text-primary-600 hover:underline">contact@aversusb.net</a>.
          We aim to respond within 48 hours and publish corrections with a visible correction notice
          and updated <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> timestamp.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary mb-4">
          CC-BY-4.0 covers aversusb.net editorial text and table layout; vendor names, logos, and marks remain the property of their owners.
        </p>
        <Link href="/llm-comparisons" className="text-primary-600 hover:underline font-medium">
          <span aria-hidden="true">← </span>Back to LLM comparisons
        </Link>
      </div>
    </article>
    </>
  );
}

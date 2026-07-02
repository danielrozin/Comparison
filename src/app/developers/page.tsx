import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

// WebAPI + DataFeed schema for GEO: AI answer engines like Perplexity and
// ChatGPT browse structured schema to discover machine-readable data sources.
// Declaring our API as a WebAPI with DataFeed surfaces it in "data source"
// citations and improves entity-graph signals for our comparison dataset.
const apiSchema = {
  "@context": "https://schema.org",
  "@type": "WebAPI",
  name: `${SITE_NAME} Comparison API`,
  description: "REST API providing structured comparison data, entity profiles, trending topics, and search across 3,000+ comparisons in 17+ categories.",
  url: `${SITE_URL}/developers`,

  locale: "en_US",  documentation: `${SITE_URL}/developers`,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,

    locale: "en_US",  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  creativeWorkStatus: "Published",
  datePublished: "2024-06-01",
  dateModified: new Date().toISOString().slice(0, 10),
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Software Developers, Researchers, Data Scientists", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessibilityFeature: ["readingOrder", "structuralNavigation", "alternativeText"],
  educationalLevel: "Intermediate",
  teaches: "How to integrate the A Versus B REST API to access structured comparison data, entity profiles, and search results",
  educationalUse: "guide",
  offers: [
    {
      "@type": "Offer",
      name: "Free Tier",
      price: "0",
      priceCurrency: "USD",
      description: "100 API requests per day",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "29",
      priceCurrency: "USD",
      description: "Unlimited requests, priority support",
    },
  ],
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", "#api-overview"] },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  hasPart: {
    "@type": "DataFeed",
    name: "A Versus B Comparison Dataset",
    description: `Structured comparison data for ${SITE_NAME}'s full catalog: 3,000+ X vs Y comparisons with attributes, verdicts, FAQs, and entity profiles across 17+ categories.`,
    url: `${SITE_URL}/api/llms?format=txt`,

    locale: "en_US",    encodingFormat: "text/plain",
    inLanguage: "en-US",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    about: {
      "@type": "Thing",
      name: "Product and entity comparisons",
    },
  },
};

const DEV_TITLE = `${SITE_NAME} Developer API — Comparison Data REST API`;
const DEV_DESC = `Access ${SITE_NAME}'s comparison data via our REST API. Free tier with 100 requests/day, Pro and Enterprise plans available. JSON endpoints for 3,000+ comparisons, entity profiles, and search.`;
const DEV_URL = `${SITE_URL}/developers`;

export const metadata: Metadata = {
  title: DEV_TITLE,
  description: DEV_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: DEV_URL,
    languages: { "en": DEV_URL, "x-default": DEV_URL },
  },
  openGraph: {
    title: DEV_TITLE,
    description: DEV_DESC,
    url: DEV_URL,

    locale: "en_US",  },
  other: {
    "citation_title": DEV_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DEV_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": DEV_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": DEV_URL,
  },
};

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-surface-alt">
      {title && (
        <div className="px-4 py-2 border-b border-border bg-surface text-xs font-mono text-text-secondary">
          {title}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-text leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apiSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Developers</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Developer API
              </h1>
              <p className="text-primary-200 mt-1.5 text-sm sm:text-base">
                Integrate {SITE_NAME}&apos;s comparison data into your applications.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Pricing Tiers */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Pricing</h2>
        </div>
        <ul className="grid sm:grid-cols-3 gap-4 list-none">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              limit: "100 requests/day",
              features: ["All comparison endpoints", "JSON responses", "CORS enabled", "Community support"],
            },
            {
              name: "Pro",
              price: "$99",
              period: "/month",
              limit: "10,000 requests/day",
              features: ["Everything in Free", "Priority support", "Usage analytics dashboard", "Bulk search endpoints"],
              highlighted: true,
            },
            {
              name: "Enterprise",
              price: "$499",
              period: "/month",
              limit: "Unlimited requests",
              features: ["Everything in Pro", "Custom categories", "Dedicated support", "SLA guarantee", "White-label embed"],
            },
          ].map((tier) => (
            <li
              key={tier.name}
              className={`rounded-xl border p-6 ${
                tier.highlighted
                  ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20"
                  : "border-border bg-surface"
              }`}
            >
              <h3 className="text-lg font-bold text-text mb-1">{tier.name}</h3>
              <div className="mb-3">
                <span className="text-3xl font-black text-text">{tier.price}</span>
                <span className="text-text-secondary text-sm">{tier.period}</span>
              </div>
              <p className="text-sm font-medium text-primary-600 mb-4">{tier.limit}</p>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Getting Started */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Getting Started</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text mb-3">1. Get your API key</h3>
            <p className="text-text-secondary mb-3">
              Create a free API key by sending a POST request:
            </p>
            <CodeBlock title="Create API Key">{`curl -X POST ${SITE_URL}/api/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email": "you@example.com", "name": "My App"}'`}</CodeBlock>
            <p className="text-sm text-text-secondary mt-2">
              Save the returned API key securely — it will only be shown once.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text mb-3">2. Make your first request</h3>
            <CodeBlock title="List Comparisons">{`curl ${SITE_URL}/api/v1/comparisons?limit=5 \\
  -H "X-API-Key: avsb_your_key_here"`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text mb-3">3. Get a specific comparison</h3>
            <CodeBlock title="Get Comparison">{`curl ${SITE_URL}/api/v1/comparisons/messi-vs-ronaldo \\
  -H "X-API-Key: avsb_your_key_here"`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Authentication</h2>
        </div>
        <p className="text-text-secondary mb-4">
          Pass your API key in one of three ways:
        </p>
        <div className="space-y-3">
          <CodeBlock title="Header (recommended)">{`X-API-Key: avsb_your_key_here`}</CodeBlock>
          <CodeBlock title="Bearer token">{`Authorization: Bearer avsb_your_key_here`}</CodeBlock>
          <CodeBlock title="Query parameter">{`?api_key=avsb_your_key_here`}</CodeBlock>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">API Endpoints</h2>
        </div>

        <div className="space-y-8">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-surface-alt border-b border-border">
              <code className="text-sm">
                <span className="text-green-600 font-bold">GET</span>{" "}
                <span className="text-text">/api/v1/comparisons</span>
              </code>
            </div>
            <div className="p-4">
              <p className="text-text-secondary text-sm mb-3">
                List and search comparisons. Supports pagination, search, and category filtering.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-secondary font-medium">Parameter</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Type</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs">q</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Search query</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs">category</td>
                    <td className="py-2">string</td>
                    <td className="py-2">Filter by category slug</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 font-mono text-xs">limit</td>
                    <td className="py-2">number</td>
                    <td className="py-2">Results per page (max 100, default 20)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">offset</td>
                    <td className="py-2">number</td>
                    <td className="py-2">Pagination offset (default 0)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-surface-alt border-b border-border">
              <code className="text-sm">
                <span className="text-green-600 font-bold">GET</span>{" "}
                <span className="text-text">/api/v1/comparisons/:slug</span>
              </code>
            </div>
            <div className="p-4">
              <p className="text-text-secondary text-sm">
                Get a single comparison by slug. Returns full structured data including
                entities, key differences, verdict, FAQs, and metadata.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-surface-alt border-b border-border">
              <code className="text-sm">
                <span className="text-green-600 font-bold">GET</span>{" "}
                <span className="text-text">/api/v1/embed/:slug</span>
              </code>
            </div>
            <div className="p-4">
              <p className="text-text-secondary text-sm">
                Get an embeddable HTML widget for a comparison. Returns HTML that can be
                rendered in an iframe. No API key required for embed endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Rate Limiting</h2>
        </div>
        <p className="text-text-secondary mb-4">
          Every response includes rate limit headers:
        </p>
        <CodeBlock>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95`}</CodeBlock>
        <p className="text-text-secondary mt-4">
          When you exceed your rate limit, you&apos;ll receive a <code className="text-sm bg-surface-alt px-1.5 py-0.5 rounded">429 Too Many Requests</code> response.
          Limits reset daily at midnight UTC.
        </p>
      </section>

      {/* Response Format */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Response Format</h2>
        </div>
        <CodeBlock title="Example: GET /api/v1/comparisons/messi-vs-ronaldo">{`{
  "id": "clx...",
  "slug": "messi-vs-ronaldo",
  "title": "Messi vs Ronaldo",
  "shortAnswer": "Messi excels in playmaking...",
  "keyDifferences": [
    {
      "label": "Goals",
      "entityAValue": "838",
      "entityBValue": "900",
      "winner": "b"
    }
  ],
  "verdict": "Both are all-time greats...",
  "category": "sports",
  "entities": [...],
  "faqs": [...]
}`}</CodeBlock>
      </section>

      {/* Errors */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Error Codes</h2>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Status</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-border/50">
                <td className="px-4 py-2 font-mono">401</td>
                <td className="px-4 py-2">Missing or invalid API key</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-4 py-2 font-mono">404</td>
                <td className="px-4 py-2">Comparison not found</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-4 py-2 font-mono">429</td>
                <td className="px-4 py-2">Rate limit exceeded</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono">500</td>
                <td className="px-4 py-2">Internal server error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Management */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Key Management</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">List your keys</h3>
            <CodeBlock>{`GET /api/v1/keys?email=you@example.com`}</CodeBlock>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">Revoke a key</h3>
            <CodeBlock>{`DELETE /api/v1/keys
{ "keyId": "clx...", "email": "you@example.com" }`}</CodeBlock>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text mb-2">View usage</h3>
            <CodeBlock>{`GET /api/v1/keys/usage?email=you@example.com&keyId=clx...&days=30`}</CodeBlock>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 border-t border-border">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Ready to get started?</h2>
        </div>
        <p className="text-text-secondary mb-6">
          Create your free API key and start building in minutes.
        </p>
        <Link
          href="/developers/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl hover:shadow-md transition-all duration-150"
        >
          Go to Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
    </>
  );
}

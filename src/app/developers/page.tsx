import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Developer API — A Versus B",
  description: `Access ${SITE_NAME}'s comparison data via our REST API. Free tier with 100 requests/day, Pro and Enterprise plans available.`,
  alternates: { canonical: `${SITE_URL}/developers` },
  openGraph: {
    title: `${SITE_NAME} Developer API`,
    description: `Integrate comparison data into your apps with our REST API.`,
    url: `${SITE_URL}/developers`,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Developers</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Developer API
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Integrate {SITE_NAME}&apos;s comparison data into your applications.
          Search, retrieve, and embed thousands of structured comparisons.
        </p>
      </div>

      {/* Pricing Tiers */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">Pricing</h2>
        <div className="grid sm:grid-cols-3 gap-4">
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
            <div
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
                    <span className="text-green-500 mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">Getting Started</h2>

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
        <h2 className="text-2xl font-display font-bold text-text mb-6">Authentication</h2>
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">API Endpoints</h2>

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
        <h2 className="text-2xl font-display font-bold text-text mb-6">Rate Limiting</h2>
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">Response Format</h2>
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">Error Codes</h2>
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">Key Management</h2>
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
        <h2 className="text-2xl font-display font-bold text-text mb-4">
          Ready to get started?
        </h2>
        <p className="text-text-secondary mb-6">
          Create your free API key and start building in minutes.
        </p>
        <Link
          href="/developers/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
}

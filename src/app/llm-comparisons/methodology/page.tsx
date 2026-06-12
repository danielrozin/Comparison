import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/llm-comparisons/methodology`;
const PAGE_TITLE = `How We Compare Large Language Models — Methodology | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Our column definitions, source tier hierarchy, recency policy, COI disclosure, and correction process for the A Versus B LLM comparison guide — structured to mirror the Wikipedia Comparison of large language models table.";
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
  isPartOf: { "@type": "WebPage", url: `${SITE_URL}/llm-comparisons` },
  license: "https://creativecommons.org/licenses/by/4.0/",
};

export default function LLMMethodologyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={schema} />

      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary flex-wrap">
          <li><Link href="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/llm-comparisons" className="hover:text-primary-600 transition-colors">LLM Comparisons</Link></li>
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
          How We Compare Large Language Models
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          This page describes every column, data source, and editorial decision behind the{" "}
          <Link href="/llm-comparisons" className="text-primary-600 hover:underline">LLM comparison guide</Link>.
          Column structure mirrors the Wikipedia &ldquo;Comparison of large language models&rdquo; article
          so editors can cross-reference our data directly.
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-display font-bold text-text">1. Column definitions (Wikipedia-parity)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                <th className="text-left p-3 font-semibold text-text border-b border-border">Column</th>
                <th className="text-left p-3 font-semibold text-text border-b border-border">Definition</th>
                <th className="text-left p-3 font-semibold text-text border-b border-border">Primary source type</th>
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

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-display font-bold text-text">2. Data sources</h2>
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

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">3. Recency policy</h2>
        <p className="text-text-secondary leading-relaxed">
          Context windows, knowledge cutoffs, and model versions are updated within 2 weeks of a vendor
          releasing a new stable model. The page&apos;s{" "}
          <code className="text-sm bg-surface-alt px-1 rounded">dateModified</code> stamp reflects the last
          real-content edit. All time-sensitive cells carry an &ldquo;as of [YYYY-MM]&rdquo; note in the table footer.
        </p>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">4. Conflict-of-interest disclosure</h2>
        <p className="text-text-secondary leading-relaxed">
          {SITE_NAME} has no paid relationships with any AI vendor. No model vendor reviewed or approved
          this guide before publication. {SITE_NAME} does not license or resell any of the APIs in this table.
          The author (
          <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline">Daniel Rozin</Link>
          ) holds no equity in any listed organization.
        </p>
      </section>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-display font-bold text-text">5. Correction policy</h2>
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
          ← Back to LLM comparisons
        </Link>
      </div>
    </article>
  );
}

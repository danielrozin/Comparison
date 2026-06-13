import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { BATTLES, HEADLINE_TOTAL, BATTLE_COUNT } from "./data";

const PAGE_PATH = "/q1-2026-ai-battles";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const CSV_PATH = "/data/q1-2026-ai-battles/dan423_top50_2026-06-12.csv";
const PUBLICATION_DATE = "2026-06-12";

const nf = new Intl.NumberFormat("en-US");
const fmtPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
const pctClass = (v: number) =>
  v > 0 ? "text-green-700" : v < 0 ? "text-red-700" : "text-text-secondary";

export const metadata: Metadata = {
  title: `Q1 2026 AI Tool Battles — ${nf.format(HEADLINE_TOTAL)} US comparison searches, ranked`,
  description: `Methodology and data for the Q1 2026 AI Tool Battles Index: ${nf.format(
    HEADLINE_TOTAL,
  )} US Google Search comparison queries across ${BATTLE_COUNT} head-to-head battles (Jan–Mar 2026). Source, ranking method, limitations, and downloadable CSV.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Q1 2026 AI Tool Battles — ${SITE_NAME}`,
    description: `${nf.format(
      HEADLINE_TOTAL,
    )} US comparison searches across ${BATTLE_COUNT} AI tool battles (Jan–Mar 2026). Full methodology and downloadable dataset.`,
    url: PAGE_URL,
    type: "article",
  },
};

export default function Q1AiBattlesPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Q1 2026 AI Tool Battles Index — Methodology and Data",
    description: `${nf.format(
      HEADLINE_TOTAL,
    )} US Google Search comparison queries across ${BATTLE_COUNT} head-to-head AI tool battles, Jan–Mar 2026.`,
    datePublished: PUBLICATION_DATE,
    dateModified: PUBLICATION_DATE,
    author: { "@type": "Person", name: "Daniel Rozin" },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    isAccessibleForFree: true,
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Q1 2026 AI Tool Battles — Top 50 comparison-search volumes (US Google)",
    description:
      "Ranked head-to-head comparison-search query volumes (US Google Search, exact-match) for AI and consumer-software product pairs, Q1 2026 (Jan–Mar 2026), with Q4 2025 and Q1 2025 comparators and QoQ/YoY change.",
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    datePublished: PUBLICATION_DATE,
    spatialCoverage: "United States",
    temporalCoverage: "2026-01-01/2026-03-31",
    isAccessibleForFree: true,
    license: `${SITE_URL}/terms`,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}${CSV_PATH}`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Q1 2026 AI Tool Battles</li>
        </ol>
      </nav>

      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 mb-2">
          AI Tool Battles Index · Q1 2026 (Jan 1 – Mar 31, 2026)
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-4">
          The most-compared AI and software tools on US Google Search, Q1 2026
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          We measured{" "}
          <strong className="text-text">
            {nf.format(HEADLINE_TOTAL)} US comparison searches across the {BATTLE_COUNT} battles
          </strong>{" "}
          in Q1 2026 — head-to-head &ldquo;X vs Y&rdquo; queries people ran on US Google Search to
          decide between two AI and software products. This page documents how the Index is built,
          what it counts, what it does not, and links the full downloadable dataset so anyone can
          reproduce the figures.
        </p>
      </header>

      {/* Headline figure callout */}
      <section className="mb-12 rounded-2xl border border-border bg-surface-alt p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-text">
              {nf.format(HEADLINE_TOTAL)}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              US comparison searches, Q1 2026
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-text">
              {BATTLE_COUNT}
            </div>
            <div className="text-sm text-text-secondary mt-1">head-to-head battles ranked</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-black text-text">US</div>
            <div className="text-sm text-text-secondary mt-1">
              Google Search only · exact-match
            </div>
          </div>
        </div>
      </section>

      <article className="prose prose-lg max-w-none space-y-12">
        {/* What this measures */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            What this report measures
          </h2>
          <p className="text-text-secondary leading-relaxed">
            This report ranks the most-compared software and consumer products on{" "}
            <strong className="text-text">US Google Search</strong> during{" "}
            <strong className="text-text">Q1 2026 (Jan 1 – Mar 31, 2026)</strong>.
            &ldquo;Most-compared&rdquo; means ranked by{" "}
            <strong className="text-text">observed search-engine query volume</strong> for
            head-to-head comparison phrases of the form &ldquo;X vs Y&rdquo; — for example,{" "}
            <em>&ldquo;chatgpt vs claude&rdquo;</em> or <em>&ldquo;1password vs bitwarden&rdquo;</em>.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            The goal is to surface, with public-data transparency, which buyer-decision battles
            people actually researched on Google during the quarter — not which tools we like, which
            raised money, or which brands trended on social.
          </p>
        </section>

        {/* Top 10 chart */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Top 10 battles by Q1 2026 volume
          </h2>
          <Image
            src="/data/q1-2026-ai-battles/chart-top10.png"
            alt="Bar chart of the top 10 most-compared AI and software tool battles by Q1 2026 US Google Search volume, led by claude code vs cursor and chatgpt vs claude."
            width={1350}
            height={780}
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Data source */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Data source</h2>
          <p className="text-text-secondary leading-relaxed">
            Keyword search-volume figures come from the{" "}
            <strong className="text-text">DataForSEO Labs API</strong> (endpoint{" "}
            <code>/dataforseo_labs/google/bulk_keyword_difficulty/live</code>), which derives volume
            estimates from Google Ads&rsquo; Keyword Planner data plus DataForSEO&rsquo;s own
            clickstream and SERP scraping. We use:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <code>location_code: 2840</code> (United States) — every figure in this report,
              including the headline figure, is US Google Search. We do not publish a worldwide
              aggregate.
            </li>
            <li>
              <code>language_code: &quot;en&quot;</code> throughout.
            </li>
            <li>
              Exact-match keyword volumes only (no broad/phrase variants). This produces conservative
              numbers — the true comparison-search universe is larger because of synonyms
              (&ldquo;comparison,&rdquo; &ldquo;better,&rdquo; &ldquo;difference between&rdquo;) that
              we exclude here for citation cleanliness.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed mt-3">
            Month-by-month trend curves used for chart generation come from{" "}
            <strong className="text-text">Google Trends</strong> via DataForSEO&rsquo;s{" "}
            <code>/keywords_data/google_trends/explore/live</code> endpoint, which proxies the same
            Google Trends Explorer surface published at trends.google.com.
          </p>
        </section>

        {/* Ranking methodology */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Ranking methodology</h2>
          <p className="text-text-secondary leading-relaxed">
            For the <strong className="text-text">Top 50 list:</strong>
          </p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              We define a candidate pool of 50 head-to-head pairs across 10 product categories — the
              universe is published as a sibling artifact on this report.
            </li>
            <li>For each pair we sum monthly search volume for Jan + Feb + Mar 2026.</li>
            <li>
              The Top 50 is ranked by that sum, descending. Ties are broken by absolute QoQ delta
              (largest mover wins the higher slot).
            </li>
            <li>
              Categories are not balanced — if a category over-represents the Top 50 by raw volume,
              that&rsquo;s the finding, not a flaw to correct for.
            </li>
          </ol>
          <p className="text-text-secondary leading-relaxed mt-3">
            For <strong className="text-text">QoQ percentages:</strong> Q1 2026 sum vs Q4 2025 sum
            (Oct + Nov + Dec). For <strong className="text-text">YoY percentages:</strong> Q1 2026
            sum vs Q1 2025 sum.
          </p>
        </section>

        {/* Fastest-rising chart */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Fastest-rising battles</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The quarter&rsquo;s growth is Claude-centric. <em>claude code vs cursor</em> (+1,388%
            YoY) was the single biggest battle, and <em>claude vs gemini</em> (+1,436% YoY) and{" "}
            <em>chatgpt vs claude</em> (+403% YoY) round out the genuine breakouts.
          </p>
          <Image
            src="/data/q1-2026-ai-battles/chart-fastest-rising.png"
            alt="Line chart of the fastest-rising AI tool comparison battles in Q1 2026 by year-over-year growth, led by Claude-centric matchups."
            width={1350}
            height={780}
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Biggest decliners chart */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Biggest decliners</h2>
          <Image
            src="/data/q1-2026-ai-battles/chart-biggest-decliners.png"
            alt="Bar chart of the AI and software comparison battles with the steepest year-over-year decline in US Google Search volume in Q1 2026."
            width={1350}
            height={780}
            className="rounded-xl border border-border w-full h-auto"
          />
        </section>

        {/* Full ranked table */}
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h2 className="text-2xl font-display font-bold text-text mb-0">
              Full ranked slate
            </h2>
            <a
              href={CSV_PATH}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors no-underline"
            >
              ↓ Download CSV
            </a>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            All figures are US Google Search volume (exact-match), Q1 2026 vs Q4 2025 (QoQ) and Q1
            2025 (YoY). The same data is available as a{" "}
            <a href={CSV_PATH} download className="text-primary-600 hover:underline">
              downloadable CSV
            </a>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-border not-prose">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-alt text-left">
                  <th className="px-3 py-2 font-semibold text-text">#</th>
                  <th className="px-3 py-2 font-semibold text-text">Battle</th>
                  <th className="px-3 py-2 font-semibold text-text text-right">Q1 2026</th>
                  <th className="px-3 py-2 font-semibold text-text text-right">Q4 2025</th>
                  <th className="px-3 py-2 font-semibold text-text text-right">Q1 2025</th>
                  <th className="px-3 py-2 font-semibold text-text text-right">QoQ</th>
                  <th className="px-3 py-2 font-semibold text-text text-right">YoY</th>
                </tr>
              </thead>
              <tbody>
                {BATTLES.map((b) => (
                  <tr key={b.rank} className="border-t border-border">
                    <td className="px-3 py-2 text-text-secondary">{b.rank}</td>
                    <td className="px-3 py-2 text-text font-medium whitespace-nowrap">
                      {b.battle}
                    </td>
                    <td className="px-3 py-2 text-right text-text tabular-nums">
                      {nf.format(b.q1)}
                    </td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                      {nf.format(b.q4)}
                    </td>
                    <td className="px-3 py-2 text-right text-text-secondary tabular-nums">
                      {nf.format(b.q1Prev)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${pctClass(b.qoq)}`}>
                      {fmtPct(b.qoq)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${pctClass(b.yoy)}`}>
                      {fmtPct(b.yoy)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What this does NOT measure */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            What this report does NOT measure
          </h2>
          <p className="text-text-secondary leading-relaxed">For honesty in citation:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Not actual product usage</strong> — we measure search
              behavior, which is upstream of usage. A tool can be heavily compared and never adopted
              (or vice versa).
            </li>
            <li>
              <strong className="text-text">Not revenue, market share, or user counts</strong> —
              those require company disclosures we don&rsquo;t have.
            </li>
            <li>
              <strong className="text-text">Not {SITE_NAME}&rsquo;s own page traffic</strong> — we
              don&rsquo;t use our internal analytics to rank external comparison demand. Our own
              traffic numbers are excluded from this dataset.
            </li>
            <li>
              <strong className="text-text">Not predictive</strong> — past-quarter comparison volume
              doesn&rsquo;t forecast adoption or market outcomes.
            </li>
            <li>
              <strong className="text-text">Not exhaustive of all comparison searches</strong> — we
              measure exact-match &ldquo;X vs Y&rdquo; only. Synonym variants (&ldquo;X versus
              Y,&rdquo; &ldquo;X or Y,&rdquo; &ldquo;difference between X and Y&rdquo;) are excluded
              for measurement cleanliness.
            </li>
          </ul>
        </section>

        {/* Confidence and limitations */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Confidence and limitations
          </h2>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Volume estimates carry ±15–25% margin</strong>{" "}
              (DataForSEO&rsquo;s documented accuracy band on volumes &lt; 100k/month). Headline
              figures are rounded to two significant figures to avoid implying false precision.
            </li>
            <li>
              <strong className="text-text">
                DataForSEO updates monthly volumes with a 1–3 month lag.
              </strong>{" "}
              Q1 2026 data is fully settled as of the publication date below; April 2026 onward is
              partial and will not appear in this report.
            </li>
            <li>
              <strong className="text-text">US-only geographic scope.</strong> All figures are US
              Google Search (<code>location_code: 2840</code>). Comparison demand outside the US, and
              in non-English markets (e.g. Chinese-market AI tools), is out of scope and
              underrepresented here.
            </li>
            <li>
              <strong className="text-text">&ldquo;Bard&rdquo; → &ldquo;Gemini&rdquo; rebrand:</strong>{" "}
              Google rebranded Bard to Gemini in early 2024. Residual &ldquo;bard vs chatgpt&rdquo;
              search volume reflects users whose mental model still uses the legacy name; we report it
              as a <em>legacy</em> term, not a current product.
            </li>
          </ul>
        </section>

        {/* Reproducibility */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Reproducibility</h2>
          <p className="text-text-secondary leading-relaxed">
            We publish the{" "}
            <a href={CSV_PATH} download className="text-primary-600 hover:underline">
              per-pair Q1 volume CSV
            </a>{" "}
            and the chart source data as downloadable artifacts on this page. Anyone with a
            DataForSEO subscription (or comparable tool — Ahrefs, SEMrush) can reproduce the volume
            reads with the keywords and date range above. We invite corrections and will post
            correction notes inline.
          </p>
        </section>

        {/* Citations and corrections */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Citations and corrections
          </h2>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>Author: {SITE_NAME} data team. Lead analyst: Daniel Rozin (founder).</li>
            <li>Last updated: June 12, 2026.</li>
            <li>Methodology version: 1.1 (US-only scope reconciled with press release).</li>
            <li>
              Corrections: contact{" "}
              <a href="mailto:pr@aversusb.net" className="text-primary-600 hover:underline">
                pr@aversusb.net
              </a>
              . Material corrections trigger a new methodology version + dated changelog entry on
              this page.
            </li>
          </ul>
        </section>

        {/* Versioning */}
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">Versioning</h2>
          <p className="text-text-secondary leading-relaxed">
            This is the inaugural quarterly report. Future quarters will be published at{" "}
            <code>/q2-2026-ai-battles</code>, <code>/q3-2026-ai-battles</code>, etc., each with its
            own methodology snapshot. If the methodology changes between quarters, we will say so and
            explain why.
          </p>
        </section>
      </article>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { personAuthorNode } from "@/lib/seo/schema";

const PAGE_URL = `${SITE_URL}/probability-vs-statistics`;
const PAGE_TITLE = `Probability vs Statistics: The Difference | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Probability predicts outcomes from known rules; statistics infers rules from data. See the difference, worked expected-value math, and the gambler's fallacy.";
const PUBLISHED = "2026-07-30";
const LAST_UPDATED = "2026-07-30";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Probability vs Statistics")}&type=article`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: "article", locale: "en_US", siteName: SITE_NAME, images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }] },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
    "citation_publication_date": PUBLISHED,
    "citation_online_date": PUBLISHED,
    "citation_keywords": "probability vs statistics, expected value, gambler's fallacy, law of large numbers, independent events, house edge",
    "citation_fulltext_world_readable": "",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
    "DC.date": PUBLISHED,
    "DC.subject": "Probability; Statistics; Expected Value; Randomness; Mathematics",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Global",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "ScholarlyArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: "Probability vs Statistics: What's the Difference?",
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-US",
  genre: "Explainer",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  interactivityType: "expositive",
  datePublished: PUBLISHED,
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: OG_IMAGE,
    contentUrl: OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "Probability vs Statistics — A Versus B",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: 2026,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Students, Analysts, Data Scientists, General Readers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  accessibilitySummary: "Structured explainer with heading navigation, a captioned comparison table with row and column headers, and logical reading order.",
  educationalLevel: "Introductory undergraduate",
  teaches: "The difference between probability and statistics, how to compute expected value, and why independent random draws have no exploitable memory",
  educationalUse: "explanation",
  alternativeHeadline: "Probability vs Statistics — Forward Reasoning vs Backward Inference",
  keywords: "probability vs statistics, expected value, gambler's fallacy, law of large numbers, independent events, frequency analysis, house edge",
  author: { "@type": "Person", name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
  about: [
    { "@type": "Thing", name: "Probability theory", sameAs: "https://en.wikipedia.org/wiki/Probability_theory" },
    { "@type": "Thing", name: "Statistics", sameAs: "https://en.wikipedia.org/wiki/Statistics" },
  ],
  mentions: [
    { "@type": "Thing", name: "Expected value", sameAs: "https://en.wikipedia.org/wiki/Expected_value" },
    { "@type": "Thing", name: "Gambler's fallacy", sameAs: "https://en.wikipedia.org/wiki/Gambler%27s_fallacy" },
    { "@type": "Thing", name: "Law of large numbers", sameAs: "https://en.wikipedia.org/wiki/Law_of_large_numbers" },
    { "@type": "Thing", name: "Independence (probability theory)", sameAs: "https://en.wikipedia.org/wiki/Independence_(probability_theory)" },
  ],
  timeRequired: "PT7M",
  wordCount: 1600,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

type Row = {
  dimension: string;
  probability: string;
  statistics: string;
};

const ROWS: Row[] = [
  {
    dimension: "Direction of reasoning",
    probability: "Deductive — from a known model to expected outcomes",
    statistics: "Inductive — from observed outcomes back to a plausible model",
  },
  {
    dimension: "What you're given",
    probability: "The rules of the process (e.g. 10 equally likely digits)",
    statistics: "A sample of results (e.g. 500 recorded draws)",
  },
  {
    dimension: "What you produce",
    probability: "The chance of a future event, exactly",
    statistics: "An estimate of the underlying rule, with uncertainty attached",
  },
  {
    dimension: "Core question",
    probability: "“Given this process, what should I see?”",
    statistics: "“Given what I saw, what is the process?”",
  },
  {
    dimension: "Typical tools",
    probability: "Sample spaces, combinatorics, distributions, expected value",
    statistics: "Estimators, confidence intervals, hypothesis tests, regression",
  },
  {
    dimension: "Answer quality",
    probability: "Exact, if the model is correct",
    statistics: "Approximate, and never certain — only more or less precise",
  },
  {
    dimension: "Failure mode",
    probability: "Assuming the wrong model (e.g. treating a biased die as fair)",
    statistics: "Reading signal into noise (overfitting a small sample)",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is statistics just applied probability?",
    a: "Statistics uses probability as its language, but the two run in opposite directions. Probability assumes the model and derives the data distribution. Statistics observes the data and infers the model. You need probability to do statistics; you do not need statistics to do probability.",
  },
  {
    q: "Can frequency analysis predict a random draw?",
    a: "No. If successive draws are independent, the process has no memory: yesterday's result changes nothing about today's distribution. Frequency analysis on independent draws can only estimate the underlying probabilities — which, for a fair mechanism, you already knew. It cannot forecast the next result.",
  },
  {
    q: "What is the difference between the law of large numbers and the gambler's fallacy?",
    a: "The law of large numbers says the observed average converges to the true mean as the sample grows — imbalances get diluted by volume. The gambler's fallacy assumes imbalances get corrected by an opposite result. Convergence by dilution is real mathematics; correction by compensation is not.",
  },
  {
    q: "Why does expected value matter more than the odds of winning?",
    a: "Odds tell you how often you win; expected value tells you what an average attempt is worth once payout size is included. A 1-in-10 shot is attractive at a payout above 9:1 and a losing proposition below it. Two games with identical win rates can have completely different expected values.",
  },
  {
    q: "Which should you learn first, probability or statistics?",
    a: "Probability. Statistical inference is built on probability distributions, so learning inference first means memorising procedures you cannot justify. A one-semester probability course makes most of introductory statistics feel like a consequence rather than a list of recipes.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  isPartOf: { "@id": `${PAGE_URL}#article` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function ProbabilityVsStatisticsPage() {
  return (
    <>
      <JsonLd data={[articleSchema, faqSchema]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-primary-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="grid-probability-vs-statistics-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4" />
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-probability-vs-statistics-hero)" />
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-indigo-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-indigo-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Probability vs Statistics</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20 mt-1">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Probability vs Statistics: What&rsquo;s the Difference?
              </h1>
              <p id="page-intro" className="mt-2 text-indigo-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                They use the same equations and answer opposite questions. Probability reasons forward from a known
                process to expected outcomes; statistics reasons backward from observed outcomes to the process that
                produced them.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-indigo-200">
                <span>
                  By{" "}
                  <Link href="/authors/daniel-rozin" className="text-white hover:underline font-medium">
                    Daniel Rozin
                  </Link>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Updated:{" "}
                  <time dateTime={LAST_UPDATED}>
                    {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </span>
                <span aria-hidden="true">·</span>
                <span>7 min read</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Short answer */}
        <section aria-labelledby="prob-stat-short-answer" className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="prob-stat-short-answer" className="font-display font-bold text-text">Short answer</h2>
          </div>
          <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
            <li><strong className="text-text">Probability</strong> starts with the rules and predicts the data. You know the process; you compute what it should produce.</li>
            <li><strong className="text-text">Statistics</strong> starts with the data and infers the rules. You observe the output; you estimate what produced it.</li>
            <li><strong className="text-text">The shared machinery</strong> — distributions, expected value, variance — is identical. Only the direction of the arrow changes.</li>
            <li><strong className="text-text">Practical consequence:</strong> probability gives exact answers to hypothetical questions; statistics gives uncertain answers to real ones.</li>
          </ul>
        </section>

        {/* Comparison table */}
        <section aria-labelledby="prob-stat-table" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <h2 id="prob-stat-table" className="text-2xl font-display font-bold text-text">Side-by-side comparison</h2>
          </div>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Probability vs statistics comparison table — scroll to see all columns">
            <table className="w-full border border-border rounded-xl text-sm">
              <caption className="sr-only">Probability compared with statistics across reasoning direction, inputs, outputs, tools, and failure modes</caption>
              <thead>
                <tr className="bg-surface-alt">
                  {["Dimension", "Probability", "Statistics"].map((h) => (
                    <th scope="col" key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROWS.map((r) => (
                  <tr key={r.dimension} className="hover:bg-surface-alt/50 transition-colors">
                    <th scope="row" className="p-3 font-medium text-text text-left align-top">{r.dimension}</th>
                    <td className="p-3 text-text-secondary align-top">{r.probability}</td>
                    <td className="p-3 text-text-secondary align-top">{r.statistics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Worked example */}
        <section aria-labelledby="prob-stat-worked-example" className="mb-12">
          <h2 id="prob-stat-worked-example" className="text-2xl font-display font-bold text-text mb-4">
            A worked example: one digit, drawn at random
          </h2>
          <p className="text-text-secondary mb-4 leading-relaxed">
            The cleanest way to see the split is to take a process simple enough that both disciplines can be applied to
            it in full. Consider a mechanism that produces a single digit from 0 to 9, with every digit equally likely
            and every draw independent of the last — the structure behind most lottery-style number games, raffle
            draws, and randomised digit selection in sampling.
          </p>
          <p className="text-text-secondary mb-4 leading-relaxed">
            <strong className="text-text">The probability question</strong> is settled before any draw happens. The
            sample space has ten equally likely outcomes, so the chance of any specific digit is 1/10, or 10%. The chance
            of matching two independent digits in a row is 1/10 × 1/10 = 1/100. Three digits: 1/1,000. No data collection
            is required, because the model was handed to us.
          </p>
          <p className="text-text-secondary mb-4 leading-relaxed">
            <strong className="text-text">The statistical question</strong> only arises if we <em>don&rsquo;t</em> trust
            that model. Suppose we record 1,000 draws and the digit 7 appears 121 times instead of the expected 100. Is
            the mechanism biased? Under a fair model, the count of any digit across 1,000 draws has standard deviation
            roughly √(1000 × 0.1 × 0.9) ≈ 9.5. An observation of 121 sits about 2.2 standard deviations above
            expectation — noticeable, but the kind of deviation that shows up by chance reasonably often once you check
            all ten digits. That is statistics doing its actual job: quantifying how surprised to be, not declaring a
            verdict.
          </p>
          <div className="p-5 rounded-2xl border border-border bg-surface-alt">
            <p className="text-sm text-text-secondary">
              <strong className="text-text">The trap:</strong> people apply the statistical question&rsquo;s tools to
              the probability question&rsquo;s situation. Tracking which digits are &ldquo;hot&rdquo; or
              &ldquo;overdue&rdquo; is frequency analysis pointed at a process whose distribution is already known and
              fixed. Even a perfect frequency table tells you nothing about the next draw — it can only re-estimate a
              parameter you were given for free.
            </p>
          </div>
        </section>

        {/* Independence */}
        <section aria-labelledby="prob-stat-independence" className="mb-12">
          <h2 id="prob-stat-independence" className="text-2xl font-display font-bold text-text mb-4">
            Independence: why random draws have no memory
          </h2>
          <p className="text-text-secondary mb-4 leading-relaxed">
            Two events are independent when knowing one occurred does not change the probability of the other —
            formally, P(A ∩ B) = P(A) × P(B).<sup><a href="#cite-mathworld-ind" className="text-primary-600">[1]</a></sup> A
            physical draw mechanism has no state carried between trials: the balls, the wheel, or the generator do not
            record what came out last time. So P(digit 7 today | digit 7 appeared five times this week) = P(digit 7
            today) = 1/10. The conditioning information is real, and it is irrelevant.
          </p>
          <p className="text-text-secondary mb-4 leading-relaxed">
            The <strong className="text-text">gambler&rsquo;s fallacy</strong> is the belief that a streak makes the
            opposite outcome more likely — that a run of low digits leaves the high digits
            &ldquo;due.&rdquo;<sup><a href="#cite-mathworld-gf" className="text-primary-600">[2]</a></sup> For
            independent trials this is simply false, and it survives because it is often confused with a theorem that
            is true.
          </p>
          <p className="text-text-secondary leading-relaxed">
            That theorem is the <strong className="text-text">law of large numbers</strong>: as the number of trials
            grows, the observed <em>average</em> converges to the expected
            value.<sup><a href="#cite-eom-lln" className="text-primary-600">[3]</a></sup> But convergence happens by
            <em>dilution</em>, not correction. If digit 7 runs 21 ahead of expectation after 1,000 draws, nothing pushes
            it back down; after 1,000,000 draws that same absolute surplus of 21 is a rounding error against a base of
            100,000. The ratio converges while the raw gap does not shrink — and may well grow. Nothing owes you a
            correction.
          </p>
        </section>

        {/* Expected value */}
        <section aria-labelledby="prob-stat-expected-value" className="mb-12">
          <h2 id="prob-stat-expected-value" className="text-2xl font-display font-bold text-text mb-4">
            Expected value: the number that decides whether a bet is worth taking
          </h2>
          <p className="text-text-secondary mb-4 leading-relaxed">
            Expected value (EV) is the probability-weighted average of every outcome&rsquo;s payoff. It is the single
            most useful quantity probability produces, because win rate alone is not decision-relevant — payout size has
            to enter the calculation.
          </p>
          <p className="text-text-secondary mb-4 leading-relaxed">
            Take the 1-in-10 digit draw with a 1-unit stake. If a correct pick returns 9 units of profit and a wrong
            pick loses the 1 unit staked:
          </p>
          <div className="overflow-x-auto mb-4" tabIndex={0} role="region" aria-label="Expected value by payout table">
            <table className="w-full border border-border rounded-xl text-sm">
              <caption className="sr-only">Expected value of a 1-in-10 draw at different payout ratios, per 1 unit staked</caption>
              <thead>
                <tr className="bg-surface-alt">
                  {["Payout on a win", "EV per 1 unit staked", "Return over 1,000 units staked", "Verdict"].map((h) => (
                    <th scope="col" key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <th scope="row" className="p-3 font-medium text-text text-left">9 : 1</th>
                  <td className="p-3 text-text-secondary">(0.1 × +9) + (0.9 × −1) = 0.00</td>
                  <td className="p-3 text-text-secondary">1,000 units</td>
                  <td className="p-3 text-text-secondary">Break-even — a &ldquo;fair&rdquo; game</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 font-medium text-text text-left">8 : 1</th>
                  <td className="p-3 text-text-secondary">(0.1 × +8) + (0.9 × −1) = −0.10</td>
                  <td className="p-3 text-text-secondary">900 units</td>
                  <td className="p-3 text-text-secondary">10% edge to the operator</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 font-medium text-text text-left">7 : 1</th>
                  <td className="p-3 text-text-secondary">(0.1 × +7) + (0.9 × −1) = −0.20</td>
                  <td className="p-3 text-text-secondary">800 units</td>
                  <td className="p-3 text-text-secondary">20% edge to the operator</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary mb-4 leading-relaxed">
            The win rate is 10% in all three rows. Only the payout moves, and it moves the entire economics of the game.
            This is why commercial numbers games — lotteries, matka-style digit games, casino table bets — pay below the
            fair ratio: the gap between true odds and offered payout <em>is</em> the operator&rsquo;s margin, often
            called the house edge. It is a fixed structural property of the payout table, not something that varies with
            skill, timing, or number selection.
          </p>
          <p className="text-text-secondary leading-relaxed">
            And because each draw is independent, EV is additive: playing more rounds multiplies a negative expectation
            rather than offsetting it. The law of large numbers, which cannot help you predict a single draw, is
            perfectly happy to guarantee the long-run result of a negative-EV game.
          </p>
        </section>

        {/* Which discipline answers which question */}
        <section aria-labelledby="prob-stat-which-tool" className="mb-12">
          <h2 id="prob-stat-which-tool" className="text-2xl font-display font-bold text-text mb-4">
            Which discipline answers your question?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-2xl border border-border">
              <h3 className="font-display font-bold text-text mb-2">Reach for probability when&hellip;</h3>
              <ul className="space-y-1 text-sm text-text-secondary list-disc list-inside">
                <li>The mechanism is specified — a shuffled deck, a fair die, a defined random generator</li>
                <li>You need the chance of a future event before observing anything</li>
                <li>You are pricing risk: insurance, options, expected loss</li>
                <li>You are checking whether a game or contract is fair by construction</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl border border-border">
              <h3 className="font-display font-bold text-text mb-2">Reach for statistics when&hellip;</h3>
              <ul className="space-y-1 text-sm text-text-secondary list-disc list-inside">
                <li>The mechanism is unknown or only partly known — customers, patients, markets</li>
                <li>You have a sample and want to say something about the population</li>
                <li>You need to test whether an observed effect could be noise</li>
                <li>You are auditing a supposedly random process for bias</li>
              </ul>
            </div>
          </div>
          <p className="text-text-secondary text-sm mt-4 leading-relaxed">
            The auditing case is the one people most often get backwards. Statistics can absolutely detect a rigged
            wheel or a biased generator, given enough draws — that is a legitimate inference problem. What it cannot do
            is convert a <em>correctly</em> random process into a predictable one. Confirming fairness and gaining an
            edge are opposite outcomes of the same test.
          </p>
        </section>

        {/* FAQs */}
        <section aria-labelledby="prob-stat-faq" className="mb-12">
          <h2 id="prob-stat-faq" className="text-2xl font-display font-bold text-text mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="p-5 rounded-2xl border border-border">
                <h3 className="font-display font-bold text-text mb-2">{f.q}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section aria-labelledby="prob-stat-sources" className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 id="prob-stat-sources" className="text-xl font-display font-bold text-text">Sources</h2>
          </div>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li id="cite-mathworld-ind">
              [1] Weisstein, Eric W. &ldquo;Independent Events.&rdquo; Wolfram MathWorld.{" "}
              <a href="https://mathworld.wolfram.com/IndependentEvents.html" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                mathworld.wolfram.com/IndependentEvents.html<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
            <li id="cite-mathworld-gf">
              [2] Weisstein, Eric W. &ldquo;Gambler&rsquo;s Fallacy.&rdquo; Wolfram MathWorld.{" "}
              <a href="https://mathworld.wolfram.com/GamblersFallacy.html" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                mathworld.wolfram.com/GamblersFallacy.html<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
            <li id="cite-eom-lln">
              [3] &ldquo;Law of large numbers.&rdquo; Encyclopedia of Mathematics, European Mathematical Society.{" "}
              <a href="https://encyclopediaofmath.org/wiki/Law_of_large_numbers" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                encyclopediaofmath.org/wiki/Law_of_large_numbers<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
            <li id="cite-nist">
              [4] NIST/SEMATECH. <em>e-Handbook of Statistical Methods</em>, Chapter 1: Exploratory Data Analysis.{" "}
              <a href="https://www.itl.nist.gov/div898/handbook/" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                itl.nist.gov/div898/handbook/<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
            <li id="cite-mit">
              [5] Orloff, Jeremy and Jonathan Bloom. <em>18.05 Introduction to Probability and Statistics</em>, Spring 2014. MIT OpenCourseWare.{" "}
              <a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2014/" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                ocw.mit.edu/courses/18-05<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
            <li id="cite-sep">
              [6] Hájek, Alan. &ldquo;Interpretations of Probability.&rdquo; <em>Stanford Encyclopedia of Philosophy</em>.{" "}
              <a href="https://plato.stanford.edu/entries/probability-interpret/" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
                plato.stanford.edu/entries/probability-interpret/<span className="sr-only"> (opens in new tab)</span>
              </a>. Accessed July 2026.
            </li>
          </ol>
        </section>

        {/* Related */}
        <section aria-labelledby="prob-stat-related" className="mb-4">
          <h2 id="prob-stat-related" className="text-xl font-display font-bold text-text mb-3">Related</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/how-we-write-verdicts" className="text-primary-600 hover:underline">
                How we write verdicts — our sourcing and correction policy
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-primary-600 hover:underline">
                All explainers and comparison guides
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema, contentAuthorArray } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/how-we-write-verdicts`;
const PAGE_TITLE = `How We Write Verdicts — ${SITE_NAME}`;
const PAGE_DESC = `How ${SITE_NAME} produces the AI-assisted verdict at the top of every comparison page — sourcing, the role of the AI model, the role of human editors, and how your feedback shapes future verdicts.`;
const VERDICTS_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("How We Write Verdicts")}&type=home`;
const VERDICTS_TODAY = new Date().toISOString().split("T")[0];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: VERDICTS_OG_IMAGE, width: 1200, height: 630, alt: "How We Write Verdicts — A Versus B" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [VERDICTS_OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESC,
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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${PAGE_URL}#howto`,
  name: "How A Versus B Writes a Comparison Verdict",
  description: PAGE_DESC,
  url: PAGE_URL,
  inLanguage: "en-US",
  totalTime: "PT2M",
  author: contentAuthorArray(),
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Source structured data",
      text: "We pull specs, pricing, and attributes from manufacturer pages, official datasheets, and curated reference sources for both entities in a comparison.",
      url: `${PAGE_URL}#how-we-source-data`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Aggregate public reviews",
      text: "We collect and normalize public reviews from Reddit, G2, Capterra, Trustpilot, and Product Hunt into ratings and recurring pros/cons.",
      url: `${PAGE_URL}#how-we-source-data`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Generate AI-assisted verdict draft",
      text: "Claude (Anthropic's AI model) reads the structured data and reviews to produce a first draft of the verdict, 'Choose X if' cards, and supporting summary.",
      url: `${PAGE_URL}#the-role-of-the-ai-model-vs-our-human-editor`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Human editorial review",
      text: "A human editor reviews drafts that fall below quality thresholds or cover sensitive categories (health, finance, legal, safety) — checking accuracy, removing unsupported claims, and adjusting tone.",
      url: `${PAGE_URL}#the-role-of-the-ai-model-vs-our-human-editor`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Incorporate user feedback",
      text: "The thumbs up/down widget under each verdict collects signals. Pages with persistent negative feedback get prioritized for human review and regeneration.",
      url: `${PAGE_URL}#how-feedback-influences-future-verdicts`,
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESC,
  abstract: PAGE_DESC,
  url: PAGE_URL,
  genre: "Methodology",
  inLanguage: "en-US",
  interactivityType: "expositive",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: "2026-03-15",
  dateModified: VERDICTS_TODAY,
  lastReviewed: VERDICTS_TODAY,
  contentReferenceTime: VERDICTS_TODAY,
  thumbnailUrl: VERDICTS_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: VERDICTS_OG_IMAGE,
    contentUrl: VERDICTS_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "How We Write Verdicts — A Versus B",
  },
  alternativeHeadline: `${SITE_NAME} Verdict Methodology — AI-Assisted Comparison Verdicts`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Journalists, AI Developers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: "How A Versus B sources comparison data and writes AI-assisted verdicts with structured human editorial oversight",
  educationalUse: "guide",
  author: contentAuthorArray(),
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
      ethicsPolicy: `${SITE_URL}/disclaimer`,
      correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "p:first-of-type"] },
  timeRequired: "PT4M",
  wordCount: 800,
};

const verdictsBreadcrumb = breadcrumbSchema(
  [
    { name: "Home", url: SITE_URL },
    { name: "How We Write Verdicts", url: PAGE_URL },
  ],
  `${PAGE_URL}#breadcrumb`
);

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faqpage`,
  url: PAGE_URL,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
  mainEntity: [
    {
      "@type": "Question",
      name: "How does A Versus B source data for its comparisons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Verdicts are grounded in three layers of data: structured specs and pricing pulled from manufacturer pages and official datasheets; verified public reviews aggregated from Reddit, G2, Capterra, Trustpilot, and Product Hunt; and live web context from recent search results and news snippets to surface anything that has changed since the page was last refreshed.",
      },
    },
    {
      "@type": "Question",
      name: "What role does AI play in writing comparison verdicts at A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use Claude (Anthropic's large language model) to read the structured data and reviews and produce a first draft of the verdict, the 'Choose X if' cards, and the supporting summary. The model only sees data we have already collected — it does not browse the open web at write time. A human editor then reviews drafts that fall below an internal quality threshold or cover sensitive categories such as health, finance, legal, or safety.",
      },
    },
    {
      "@type": "Question",
      name: "How does user feedback influence future verdicts on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The thumbs-up / thumbs-down widget under each verdict collects signals. Pages with persistent negative feedback are prioritized for human review. Common categories of complaint feed back into the prompt and data pipeline so the next regeneration covers them. We also sample reader feedback when evaluating new model versions — a verdict that wins on human reads but loses on reader feedback gets rolled back.",
      },
    },
    {
      "@type": "Question",
      name: "How do I disagree with a specific verdict on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the 'Was this verdict helpful?' buttons directly under the verdict on any comparison page. Tap the thumbs-down button and a short text box will appear where you can describe what is wrong — a recent release, missing context, a factual error, or biased framing. Reasons go straight into our editorial queue. You can also reach us via the contact page.",
      },
    },
  ],
};

export default function HowWeWriteVerdictsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(verdictsBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-how-we-write-verdicts-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-how-we-write-verdicts-hero)"/>
</svg>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">How we write verdicts</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            How we write verdicts
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Every &ldquo;Our Verdict&rdquo; section on {SITE_NAME} is AI-assisted. This page explains
            where the data comes from, what the AI does, what humans do, and how your feedback shapes
            future verdicts.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose prose-lg max-w-none space-y-10">
        <section aria-labelledby="how-source-data-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h2 id="how-source-data-heading" className="text-2xl font-display font-bold text-text">How we source data</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Verdicts are grounded in three layers of data:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>
              <strong className="text-text">Specs.</strong> Structured attributes (price, size,
              performance numbers, release dates, etc.) pulled from manufacturer pages, official
              datasheets, and curated reference sources.
            </li>
            <li>
              <strong className="text-text">Verified reviews.</strong> Aggregated public reviews
              from sources like Reddit, G2, Capterra, Trustpilot, and Product Hunt — normalized into
              ratings and recurring pros/cons.
            </li>
            <li>
              <strong className="text-text">Live web context.</strong> Recent search-engine results
              and news snippets used to surface anything that&apos;s changed since the page was last
              refreshed.
            </li>
          </ul>
        </section>

        <section aria-labelledby="ai-role-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 id="ai-role-heading" className="text-2xl font-display font-bold text-text">The role of the AI model vs. our human editor</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            We use Claude (Anthropic&apos;s large language model) to read the structured data and
            reviews above and produce a first draft of the verdict, the &ldquo;Choose X if&rdquo;
            cards, and the supporting summary. The model only sees data we&apos;ve already
            collected — it does not browse the open web at write time.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            A human editor then reviews drafts that fall below an internal quality threshold or that
            cover sensitive categories (health, finance, legal, safety). Editors check for
            accuracy, remove unsupported claims, and adjust tone. Pages that have been
            human-reviewed are flagged in our internal system.
          </p>
        </section>

        <section aria-labelledby="feedback-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 id="feedback-heading" className="text-2xl font-display font-bold text-text">How feedback influences future verdicts</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            The 👍 / 👎 widget under each verdict is the fastest way to tell us when something is
            off. We use those votes — and the optional written reasons — in three ways:
          </p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-text-secondary leading-relaxed">
            <li>Pages with persistent negative feedback get prioritized for human review.</li>
            <li>
              Common categories of complaint (&ldquo;misses recent release,&rdquo; &ldquo;ignores
              battery life,&rdquo; etc.) feed back into the prompt and data pipeline so the next
              regeneration covers them.
            </li>
            <li>
              We sample reader feedback when we evaluate new model versions — a verdict that wins on
              human reads but loses on reader feedback gets rolled back.
            </li>
          </ol>
        </section>

        <section aria-labelledby="disagree-heading">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 id="disagree-heading" className="text-2xl font-display font-bold text-text">Disagree with a specific verdict?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Use the <strong className="text-text">&ldquo;Was this verdict helpful?&rdquo;</strong>{" "}
            buttons directly under the verdict on any comparison page. Tap{" "}
            <span aria-hidden="true">👎</span> &ldquo;No,&rdquo; and a short text box will appear where you
            can tell us what we got wrong — recent release, missing context, factual error, biased
            framing, anything. Reasons go straight into our editorial queue.
          </p>
          <p className="text-text-secondary leading-relaxed mt-3">
            Prefer email? Reach us at{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              our contact page
            </Link>
            .
          </p>
        </section>
      </article>

      <div className="mt-12">
        <NewsletterSignup source="how-we-write-verdicts" />
      </div>
      </div>
    </>
  );
}

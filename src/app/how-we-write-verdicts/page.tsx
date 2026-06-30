import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

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
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const },
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
    siteName: SITE_NAME,
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
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESC,
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
  },
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
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Journalists, AI Developers" },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
  educationalLevel: "General",
  teaches: "How A Versus B sources comparison data and writes AI-assisted verdicts with structured human editorial oversight",
  educationalUse: "guide",
  author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
      ethicsPolicy: `${SITE_URL}/disclaimer`,
      correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  timeRequired: "PT4M",
  wordCount: 800,
};

export default function HowWeWriteVerdictsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">How we write verdicts</li>
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
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose prose-lg max-w-none space-y-10">
        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            How we source data
          </h2>
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

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            The role of the AI model vs. our human editor
          </h2>
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

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            How feedback influences future verdicts
          </h2>
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

        <section>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Disagree with a specific verdict?
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Use the <strong className="text-text">&ldquo;Was this verdict helpful?&rdquo;</strong>{" "}
            buttons directly under the verdict on any comparison page. Tap{" "}
            <span aria-hidden>👎</span> &ldquo;No,&rdquo; and a short text box will appear where you
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
      </div>
    </>
  );
}

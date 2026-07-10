import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const ABOUT_TITLE = `About ${SITE_NAME} — Mission, Team & Methodology`;
const ABOUT_DESC = `Learn about ${SITE_NAME} — our mission to democratize comparisons and help people make better decisions through clear, data-driven insights.`;
const ABOUT_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESC,
  alternates: {
    canonical: ABOUT_URL,
    languages: { "en": ABOUT_URL, "x-default": ABOUT_URL },
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
    url: ABOUT_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
  },
  other: {
    "citation_title": ABOUT_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": ABOUT_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": ABOUT_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": ABOUT_URL,
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: ABOUT_TITLE,
  description: ABOUT_DESC,
  abstract: ABOUT_DESC,
  url: ABOUT_URL,

  locale: "en_US",  inLanguage: "en-US",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  alternativeHeadline: `${SITE_NAME} — Compare Anything, Data-Driven & Free`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Potential Partners, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "How A Versus B produces data-driven side-by-side comparisons and the mission behind the platform",
  educationalUse: "reference",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  // mainEntity — Organization node that represents the company behind this About page.
  // Google's Knowledge Panel and AI crawlers (Perplexity, ChatGPT) use mainEntity to
  // resolve "About" pages to the canonical Organization in their knowledge graphs.
  mainEntity: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,

    locale: "en_US",    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    founder: [
      {
        "@type": "Person",
        name: "Daniel Rozin",
        url: `${SITE_URL}/authors/daniel-rozin`,

        locale: "en_US",        jobTitle: "Founder & Editor-in-Chief",
        sameAs: [
          "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
          "https://www.facebook.com/daniel.rozin.94",
        ],
      },
      {
        "@type": "Person",
        name: "Shai And",
        jobTitle: "Co-Founder & CTO",
        sameAs: ["https://www.facebook.com/shai.and1"],
      },
    ],
  },
  timeRequired: "PT3M",
  wordCount: 600,
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/about#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "About", item: { "@type": "WebPage", "@id": `${SITE_URL}/about`, name: "About", url: `${SITE_URL}/about` } },
    ],
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/about#faqpage`,
  url: `${SITE_URL}/about`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
  mainEntity: [
    {
      "@type": "Question",
      name: "Is A Versus B free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All comparisons, verdicts, and data on A Versus B are completely free. There is no paywall, login requirement, or usage limit for readers.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are the comparison verdicts on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Verdicts are AI-assisted and grounded in structured specs, pricing, and aggregated public reviews. A human editorial layer reviews pages that fall below quality thresholds or cover sensitive topics. Users can flag inaccuracies directly on any comparison page using the feedback widget.",
      },
    },
    {
      "@type": "Question",
      name: "Can I request a comparison that does not exist yet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Visit the Comparison Requests page to suggest any comparison you would like to see. You can also upvote existing requests — top-voted comparisons are built first.",
      },
    },
    {
      "@type": "Question",
      name: "Does A Versus B accept paid placements or sponsored comparisons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A Versus B does not accept payment to influence comparison verdicts or rankings. All verdicts are produced by our AI and editorial process without commercial interference.",
      },
    },
    {
      "@type": "Question",
      name: "How often is comparison data updated on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comparison pages are refreshed automatically on a rolling schedule and re-ranked daily based on trending activity. You can trigger an update on any page by using the thumbs-down feedback widget to flag outdated information.",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[aboutPageSchema, faqPageSchema]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">About</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
              About {SITE_NAME}
            </h1>
          </div>
          <p className="text-primary-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            We believe everyone deserves clear, unbiased information to make confident decisions —
            whether you&apos;re choosing a smartphone, understanding world history, or settling a
            debate with friends.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Mission */}
      <section aria-labelledby="about-mission-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h2 id="about-mission-heading" className="text-2xl font-display font-bold text-text">Our Mission</h2>
        </div>
        <p className="text-text-secondary leading-relaxed mb-4">
          {SITE_NAME} was founded on a simple idea: comparisons should be easy, fast, and trustworthy.
          Every day, millions of people search the internet to understand the difference between two
          things — two athletes, two countries, two products, two ideas. Too often, they find walls of
          text, biased reviews, or incomplete data scattered across dozens of tabs.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          We set out to fix that. Our mission is to <strong className="text-text">democratize comparisons</strong> —
          making high-quality, structured, visual comparison data freely available to anyone, anywhere,
          on any topic that matters to them.
        </p>
        <p className="text-text-secondary leading-relaxed">
          From Messi vs. Ronaldo to Japan vs. China, from the iPhone to the latest Android flagship,
          {SITE_NAME} surfaces the facts that matter most — organized, visual, and instantly understandable.
        </p>
      </section>

      {/* How It Works */}
      <section aria-labelledby="about-how-it-works-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 id="about-how-it-works-heading" className="text-2xl font-display font-bold text-text">How It Works</h2>
        </div>
        <ol role="list" className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none">
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Search Anything</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Type any two subjects — people, places, products, brands, or ideas — into our search bar
              and get a structured comparison instantly.
            </p>
          </li>
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-text mb-2">See the Data</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our system aggregates data from reliable sources, organizes it into clear tables, highlights
              key differences, and surfaces pros and cons for both sides.
            </p>
          </li>
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Make a Decision</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Walk away with a clear understanding of the strengths and weaknesses of each subject,
              empowered to form your own informed opinion.
            </p>
          </li>
        </ol>
      </section>

      {/* What Makes Us Different */}
      <section aria-labelledby="about-differentiators-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 id="about-differentiators-heading" className="text-2xl font-display font-bold text-text">What Makes Us Different</h2>
        </div>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Visual-first design</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Data is presented in clean tables, side-by-side cards, and visual indicators — not
                walls of text. You see the answer at a glance.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Broad coverage</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We cover sports, countries, technology, products, celebrities, history, military, economy,
                companies, and more — and we&apos;re constantly expanding.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">No hidden agendas</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We present data objectively. We are not paid to favor one product or entity over another.
                Where affiliate relationships exist, we disclose them transparently.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Always up to date</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Our team and systems continuously monitor sources to ensure comparison data stays
                current, accurate, and relevant.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Free for everyone</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Every comparison on {SITE_NAME} is completely free to access. No paywalls, no sign-ups
                required, no data locked behind subscriptions.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Categories */}
      <section aria-labelledby="about-categories-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 id="about-categories-heading" className="text-2xl font-display font-bold text-text">What We Compare</h2>
        </div>
        <p className="text-text-secondary leading-relaxed mb-6">
          {SITE_NAME} covers a wide and growing range of comparison categories:
        </p>
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
          {[
            { label: "Sports & Athletes", gradient: "from-green-500 to-emerald-600", path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            { label: "Countries & Nations", gradient: "from-blue-500 to-cyan-600", path: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Technology & Gadgets", gradient: "from-indigo-500 to-blue-600", path: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
            { label: "Products & Consumer Goods", gradient: "from-violet-500 to-purple-600", path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { label: "Celebrities & Public Figures", gradient: "from-amber-400 to-orange-500", path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            { label: "History & Events", gradient: "from-rose-500 to-pink-600", path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Military & Defense", gradient: "from-slate-600 to-gray-700", path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { label: "Economy & Finance", gradient: "from-teal-500 to-emerald-600", path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { label: "Companies & Brands", gradient: "from-primary-500 to-indigo-600", path: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 bg-surface-alt border border-border rounded-xl p-3 hover:border-primary-200 hover:bg-white transition-colors duration-150"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                </svg>
              </div>
              <span className="text-sm font-medium text-text">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Founders */}
      <section aria-labelledby="about-team-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 id="about-team-heading" className="text-2xl font-display font-bold text-text">Who We Are</h2>
        </div>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none">
          {/* Daniel */}
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl font-display font-black text-white shrink-0 ring-2 ring-white shadow-sm">
                DR
              </div>
              <div>
                <p className="font-semibold text-text">Daniel Rozin</p>
                <p className="text-sm text-text-secondary">Founder &amp; Editor-in-Chief</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Daniel started {SITE_NAME} out of a lifelong curiosity about comparing things — from economics
              and history to sports, technology, and products. When he couldn&apos;t find a single tool that
              let him explore all those comparisons in one place, he decided to build it himself.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/daniel-rozin-56a066b0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                LinkedIn<span className="sr-only"> (opens in new tab)</span>
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="https://www.facebook.com/daniel.rozin.94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Facebook<span className="sr-only"> (opens in new tab)</span>
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <Link href="/authors/daniel-rozin" className="text-xs text-primary-600 hover:underline font-medium">
                Author page
              </Link>
            </div>
          </li>
          {/* Shai */}
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl font-display font-black text-white shrink-0 ring-2 ring-white shadow-sm">
                SA
              </div>
              <div>
                <p className="font-semibold text-text">Shai And</p>
                <p className="text-sm text-text-secondary">Co-Founder &amp; CTO</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Shai is the technical co-founder and engineering lead. He designed and built the platform&apos;s
              infrastructure, data pipeline, and AI integration layer. Daniel and Shai have worked
              together since the beginning, combining curiosity with engineering to make the idea real.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/shai.and1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Facebook<span className="sr-only"> (opens in new tab)</span>
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="mailto:Shai.and1@gmail.com"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Email
              </a>
            </div>
          </li>
        </ul>
      </section>

      {/* Team Vision */}
      <section aria-labelledby="about-vision-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 id="about-vision-heading" className="text-2xl font-display font-bold text-text">Our Vision</h2>
        </div>
        <p className="text-text-secondary leading-relaxed mb-4">
          We envision a world where information asymmetry is no longer a barrier to good decision-making.
          Whether you&apos;re a student researching a school project, a professional evaluating enterprise
          software, a parent choosing the right product, or simply a curious person exploring the world —
          {SITE_NAME} is built for you.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We are a small, dedicated team of engineers, researchers, and content specialists who care deeply
          about information quality and user experience. We are committed to continuous improvement and
          always welcome feedback from our community.
        </p>
      </section>

      {/* FAQ */}
      <section aria-labelledby="about-faq-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="about-faq-heading" className="text-2xl font-display font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <dl className="space-y-4">
          {[
            {
              q: "Is A Versus B free to use?",
              a: "Yes. All comparisons, verdicts, and data are completely free — no paywall, login, or usage limit.",
            },
            {
              q: "How accurate are the comparison verdicts?",
              a: "Verdicts are AI-assisted and grounded in structured specs, pricing, and aggregated public reviews. A human editorial layer reviews pages below quality thresholds or covering sensitive topics. You can flag inaccuracies using the feedback widget on any comparison page.",
            },
            {
              q: "Can I request a comparison that doesn't exist yet?",
              a: "Yes — visit our Comparison Requests page, suggest any pairing you'd like to see, and upvote existing requests. Top-voted comparisons are built first.",
            },
            {
              q: "Does A Versus B accept paid placements or sponsored comparisons?",
              a: "No. We don't accept payment to influence verdicts or rankings. All verdicts are produced by our AI and editorial process without commercial interference.",
            },
            {
              q: "How often is comparison data updated?",
              a: "Comparison pages refresh automatically on a rolling schedule and re-rank daily based on trending activity. You can also trigger an update by flagging outdated information via the thumbs-down widget.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-border rounded-xl p-5 bg-surface-alt/40">
              <dt className="font-semibold text-text mb-1.5">{q}</dt>
              <dd className="text-sm text-text-secondary leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section aria-labelledby="about-contact-cta-heading" className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 id="about-contact-cta-heading" className="text-xl font-display font-bold text-text mb-2">Have a question or suggestion?</h2>
        <p className="text-text-secondary mb-6 text-sm">
          We&apos;d love to hear from you. Reach out to our team any time.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl hover:shadow-md transition-all duration-150"
        >
          Contact Us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
    </>
  );
}

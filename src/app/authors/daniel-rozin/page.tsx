import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/schema/JsonLd";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const AUTHOR_NAME = "Daniel Rozin";
const AUTHOR_TITLE = "Founder & Editor-in-Chief";
const PAGE_URL = `${SITE_URL}/authors/daniel-rozin`;
const PAGE_TITLE = `${AUTHOR_NAME} — ${AUTHOR_TITLE}`;
const PAGE_DESCRIPTION = `${AUTHOR_NAME} is the founder of ${SITE_NAME}, a data-driven comparison platform covering AI/LLMs, browsers, password managers, and 17 other product categories. He writes and edits all primary comparison hub pages.`;
const AUTHOR_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(PAGE_TITLE)}&type=author`;
const AUTHOR_TODAY = new Date().toISOString().split("T")[0];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,

    locale: "en_US",    type: "profile",
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(PAGE_TITLE)}&type=author`, width: 1200, height: 630, alt: `${AUTHOR_NAME} — Founder of A Versus B` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  other: {
    "citation_author": AUTHOR_NAME,
    "citation_title": PAGE_TITLE,
    "citation_journal_title": SITE_NAME,
    "citation_language": "en",
    "citation_publication_date": "2024-01-01",
    "citation_online_date": AUTHOR_TODAY,
    "DC.creator": AUTHOR_NAME,
    "DC.title": PAGE_TITLE,
    "DC.publisher": SITE_NAME,
    "DC.language": "en",
    "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
  },
};

const ARTICLES = [
  {
    title: "Best Password Managers Compared (2026)",
    url: "/password-manager-comparison",

    locale: "en_US",    date: "2026-05-22",
  },
  {
    title: "Best Browsers Compared (2026)",
    url: "/browser-comparison-2026",

    locale: "en_US",    date: "2026-05-22",
  },
  {
    title: "LLM Comparison: GPT-4o vs Claude vs Gemini (2026)",
    url: "/llm-comparisons",

    locale: "en_US",    date: "2026-05-22",
  },
];

const authorBreadcrumb = breadcrumbSchema(
  [
    { name: "Home", url: SITE_URL },
    { name: "Authors", url: `${SITE_URL}/authors` },
    { name: AUTHOR_NAME, url: PAGE_URL },
  ],
  `${PAGE_URL}#breadcrumb`
);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${PAGE_URL}#person`,
  name: AUTHOR_NAME,
  givenName: "Daniel",
  familyName: "Rozin",
  url: PAGE_URL,

  locale: "en_US",  email: "daniarozin@gmail.com",
  jobTitle: AUTHOR_TITLE,
  worksFor: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,

    locale: "en_US",  },
  description: PAGE_DESCRIPTION,
  hasOccupation: {
    "@type": "Occupation",
    name: "Technology Editor",
    occupationLocation: { "@type": "Country", name: "United States" },
    skills: "AI/LLM comparisons, browser benchmarking, SaaS analysis, data-driven journalism",
  },
  knowsAbout: [
    "AI language models",
    "web browsers",
    "password managers",
    "technology comparisons",
    "data-driven journalism",
    "SEO",
    "SaaS",
    "consumer electronics",
    "startup product comparisons",
  ],
  sameAs: [
    SITE_URL,
    "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
    "https://www.facebook.com/daniel.rozin.94",
    "https://twitter.com/aversusb",
  ],
  mainEntityOfPage: {
    "@type": "ProfilePage",
    "@id": PAGE_URL,
  },
  publishedWork: ARTICLES.map((a) => ({
    "@type": "Article",
    name: a.title,
    url: `${SITE_URL}${a.url}`,

    locale: "en_US",    datePublished: a.date,
    author: { "@type": "Person", "@id": `${PAGE_URL}#person` },
  })),
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${PAGE_URL}#profilepage`,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  alternativeHeadline: `${AUTHOR_NAME} — Founder & Editor-in-Chief of A Versus B`,
  url: PAGE_URL,

  locale: "en_US",  genre: "Author Profile",
  inLanguage: "en-US",
  interactivityType: "expositive",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: "2026-03-15",
  dateModified: AUTHOR_TODAY,
  lastReviewed: AUTHOR_TODAY,
  contentReferenceTime: AUTHOR_TODAY,
  thumbnailUrl: AUTHOR_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: AUTHOR_OG_IMAGE,

    locale: "en_US",    contentUrl: AUTHOR_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: `${AUTHOR_NAME} — Founder & Editor-in-Chief of A Versus B`,
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Journalists, Potential Partners", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "Editorial methodology and expertise behind A Versus B comparison hub articles authored by Daniel Rozin",
  educationalUse: "biography",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  mainEntity: { "@type": "Person", "@id": `${PAGE_URL}#person` },
  timeRequired: "PT3M",
  wordCount: 600,
};

export default function DanielRozinPage() {
  return (
    <>
      <JsonLd data={[authorBreadcrumb, personSchema, profilePageSchema]} />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="author-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#author-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-6" aria-label="Breadcrumb">
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
              <li className="text-primary-200">Authors</li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">{AUTHOR_NAME}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-display font-black text-white shrink-0 ring-2 ring-white/30 shadow-lg">
              DR
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight">{AUTHOR_NAME}</h1>
              <p className="text-primary-100 font-medium">{AUTHOR_TITLE}, {SITE_NAME}</p>
            </div>
          </div>
          <p className="text-primary-100 text-sm sm:text-base mt-5 max-w-2xl leading-relaxed">
            Daniel Rozin founded {SITE_NAME} to bring transparent, data-driven comparisons to the web.
            He personally researches, writes, and maintains the primary comparison hub pages — including
            the LLM, browser, and password-manager comparison guides. All factual claims in his articles
            are cited to primary sources (vendor documentation, academic papers, or independently audited datasets).
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <section aria-labelledby="author-expertise-heading" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 id="author-expertise-heading" className="text-xl font-display font-bold text-text">Expertise</h2>
        </div>
        <ul className="list-disc list-inside space-y-1 text-text-secondary">
          <li>AI / large language models — architecture, benchmarks, licensing</li>
          <li>Web browser security, privacy, and performance</li>
          <li>Password manager security models and audit history</li>
          <li>Data-driven product comparisons and editorial methodology</li>
        </ul>
      </section>

      <section aria-labelledby="author-editorial-heading" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 id="author-editorial-heading" className="text-xl font-display font-bold text-text">Editorial Standards</h2>
        </div>
        <p className="text-text-secondary leading-relaxed mb-3">
          All comparison hub pages authored by Daniel follow the{" "}
          <Link href="/password-manager-comparison/methodology" className="text-primary-600 hover:underline">
            {SITE_NAME} Comparison Methodology
          </Link>
          : primary-source citations only, visible &ldquo;as of&rdquo; dates on all time-sensitive figures,
          and a public correction policy. No vendor relationships influence scores or rankings.
        </p>
        <p className="text-text-secondary leading-relaxed">
          For corrections or source disputes, contact:{" "}
          <a href="mailto:contact@aversusb.net" className="text-primary-600 hover:underline">
            contact@aversusb.net
          </a>
        </p>
      </section>

      <section aria-labelledby="author-articles-heading" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 id="author-articles-heading" className="text-xl font-display font-bold text-text">Published Articles</h2>
        </div>
        <ul className="space-y-3">
          {ARTICLES.map((a) => (
            <li key={a.url} className="border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150">
              <Link href={a.url} className="text-primary-600 hover:underline font-medium">
                {a.title}
              </Link>
              <time dateTime={a.date} className="text-sm text-text-secondary ml-4 shrink-0">
                {new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </li>
          ))}
        </ul>
      </section>
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NewsletterSignup source="author-daniel-rozin" />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 86400;

const TITLE = "Data Studies — Comparison Trends & Reports";
const DESCRIPTION =
  "Original data studies from A Versus B: what brands, SaaS tools, and products people compare most. Free to cite and republish with attribution.";

const STUDIES_URL = `${SITE_URL}/studies`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const },
  },
  alternates: {
    canonical: STUDIES_URL,
    languages: { "en": STUDIES_URL, "x-default": STUDIES_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: STUDIES_URL,
    type: "website",
    siteName: SITE_NAME,
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
    "DC.title": TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": STUDIES_URL,
  },
};

interface StudyEntry {
  slug: string;
  title: string;
  blurb: string;
  badge: string;
}

// Published studies. Add new entries here as the program scales.
const STUDIES: StudyEntry[] = [
  {
    slug: "b2b-saas-comparison-report-2026",
    title: "The B2B SaaS Comparison Report 2026",
    blurb:
      "384 head-to-head SaaS comparisons analyzed: the most-compared software tools, the hottest category rivalries, and where challengers are out-pacing incumbents.",
    badge: "Data Study",
  },
  {
    slug: "most-compared-brands-2026",
    title: "The Most-Compared Brands of 2026",
    blurb:
      "1,600+ head-to-head comparisons analyzed to rank the brands, SaaS tools, and matchups people research most this year.",
    badge: "Data Study",
  },
  {
    slug: "investing-comparison-report-2026",
    title: "The Investing & Finance Comparison Report 2026",
    blurb:
      "247 head-to-head finance comparisons analyzed: the most-researched brokerages, retirement accounts, credit cards, and investment products of 2026.",
    badge: "Data Study",
  },
];

export default function StudiesIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
  ]);

  const studiesToday = new Date().toISOString().slice(0, 10);
  const studiesOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(TITLE)}&type=studies`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${STUDIES_URL}#collectionpage`,
    name: TITLE,
    description: DESCRIPTION,
    abstract: DESCRIPTION,
    alternativeHeadline: "Original Comparison Data Studies — A Versus B Research Hub",
    url: STUDIES_URL,
    inLanguage: "en-US",
    genre: "Research Hub",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: studiesToday,
    contentReferenceTime: studiesToday,
    thumbnailUrl: studiesOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${STUDIES_URL}#primaryImage`,
      url: studiesOgImage,
      contentUrl: studiesOgImage,
      width: 1200,
      height: 630,
      caption: "Data Studies — A Versus B Research Hub",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, Business Analysts, Marketers, Students" },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
    educationalLevel: "General",
    teaches: "Original data studies on which brands, SaaS tools, and investment products are compared most frequently by consumers",
    educationalUse: "research",
    keywords: `comparison data study, brand comparison report, SaaS comparison data ${new Date().getFullYear()}, comparison trends`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: STUDIES_URL },
    hasPart: STUDIES.map((s) => ({
      "@type": "Article",
      name: s.title,
      url: `${STUDIES_URL}/${s.slug}`,
      description: s.blurb,
    })),
    timeRequired: "PT2M",
    wordCount: 400,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">Data Studies</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Data Studies
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Original research built from our database of {SITE_NAME} comparisons. Every study is free
            to cite, quote, and republish with attribution and a link back.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-4">
          {STUDIES.map((s) => (
            <Link
              key={s.slug}
              href={`/studies/${s.slug}`}
              className="block rounded-xl border border-border bg-surface p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{s.badge}</span>
              <h2 className="text-xl font-display font-bold text-text mt-1 mb-2">{s.title}</h2>
              <p className="text-text-secondary text-sm">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

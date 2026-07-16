import type { Metadata } from "next";
import Link from "next/link";
import { getMostComparedStudy } from "@/lib/services/studies-service";
import { personAuthorNode, breadcrumbSchema, contentAuthorArray } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export const revalidate = 86400; // refresh the dataset once a day

const PATH = "/studies/most-compared-brands-2026";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "The Most-Compared Brands of 2026 — Data Study";
const DESCRIPTION =
  "We mapped every published head-to-head comparison in our database into a rivalry graph to see which brands, SaaS tools, and matchups sit at the centre of the most buyer research in 2026. Full data study and methodology.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Most-Compared Brands of 2026")}&type=trending`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" , "max-video-preview": -1 },
  },
  alternates: {
    canonical: CANONICAL,
    languages: { "en": CANONICAL, "x-default": CANONICAL },
    types: { "application/rss+xml": SITE_URL + "/feed", "application/atom+xml": SITE_URL + "/feed/atom" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Most-Compared Brands of 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImage, alt: "The Most-Compared Brands of 2026 — Data Study" }],
  },
  other: {
    "citation_title": TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": DESCRIPTION,
    "citation_publication_date": "2026-05-15",
    "citation_online_date": "2026-05-15",
    "citation_keywords": "brand comparison, most compared brands, consumer research, brand awareness, market comparison 2026",
    "citation_fulltext_world_readable": "",
    "DC.title": TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": CANONICAL,
    "DC.date": "2026-05-15",
    "DC.subject": "Brand Comparison; Consumer Research; Market Analysis; Brand Awareness; Product Research",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "United States; Global",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// The entity taxonomy carries singular and plural forms of the same type, plus
// several ways of saying "streaming service". Both spellings need a label or the
// table prints a raw slug.
const TYPE_LABELS: Record<string, string> = {
  software: "SaaS",
  company: "Company",
  product: "Product",
  products: "Product",
  brand: "Brand",
  technology: "Technology",
  platform: "Platform",
  streaming: "Streaming",
  entertainment: "Streaming",
  team: "Sports team",
};

export default async function MostComparedStudyPage() {
  const study = await getMostComparedStudy();

  const updatedLabel = new Date(study.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxCat = Math.max(...study.categories.map((c) => c.count), 1);

  // The distribution, not a winner. Every dedup rule we tried produced a
  // different "#1" — the spread is the finding that survives all of them
  // (DAN-2047 / DAN-2059).
  const spreadTotal = study.rivalSpread.reduce((n, b) => n + b.entities, 0);
  const narrowRivals = study.rivalSpread
    .filter((b) => b.rivals <= 2)
    .reduce((n, b) => n + b.entities, 0);
  const narrowPct = spreadTotal ? Math.round((narrowRivals / spreadTotal) * 100) : 0;
  const maxSpread = Math.max(...study.rivalSpread.map((b) => b.entities), 1);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Studies", url: `${SITE_URL}/studies` },
    { name: "Most-Compared Brands of 2026", url: CANONICAL },
  ]);

  // Dataset + Article schema so the study is eligible for rich results and
  // citation by AI overviews / answer engines.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Most-Compared Brands of 2026",
    description: DESCRIPTION,
    url: CANONICAL,
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    datePublished: "2026-05-15",
    dateModified: study.updatedAt,
    measurementTechnique:
      "Published head-to-head comparison pages on aversusb.net, normalised to an order-insensitive pair of canonical entities so that reverse-duplicate pages and alias entity records collapse to a single rivalry. Pages comparing three or more entities are excluded.",
    variableMeasured:
      "Number of distinct rivals each brand is matched against (not the number of comparison pages it appears on)",
    encodingFormat: ["text/html", "application/ld+json"],
    spatialCoverage: { "@type": "Place", name: "Global" },
    temporalCoverage: "2026",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle", "ScholarlyArticle"],
    "@id": `${CANONICAL}#article`,
    headline: TITLE,
    description: DESCRIPTION,
    abstract: DESCRIPTION,
    mainEntityOfPage: CANONICAL,
    url: CANONICAL,
    genre: "Data Study",
    inLanguage: "en-US",
    alternativeHeadline: "What Brands Do People Compare Most in 2026? — A Versus B Data Study",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: "2026-05-15",
    dateModified: study.updatedAt,
    lastReviewed: study.updatedAt,
    contentReferenceTime: study.updatedAt,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${CANONICAL}#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: "Most-Compared Brands of 2026 — A Versus B Data Study",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightYear: 2026,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Researchers, Marketers, Business Analysts, Consumers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
    educationalLevel: "General",
    teaches: "How to identify which brands are compared most and why they dominate consumer research",
    educationalUse: "research",
    keywords: "most compared brands 2026, brand comparison data, popular comparisons, data study, top brands",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
    author: contentAuthorArray(),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: { "@type": "ReadAction", target: CANONICAL },
    timeRequired: "PT8M",
    wordCount: 1600,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    locationCreated: { "@type": "Country", name: "United States" },
    countryOfOrigin: { "@type": "Country", name: "United States" },
    discussionUrl: "https://www.reddit.com/search/?q=most+compared+brands+comparison&type=link&sort=relevance",
  };

  const citation = `${SITE_NAME}, "The Most-Compared Brands of 2026," aversusb.net, ${updatedLabel}. ${CANONICAL}`;
  const embedHtml = `<a href="${CANONICAL}">The Most-Compared Brands of 2026 — A Versus B</a>`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Gradient Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-studies-most-compared-brands-2026-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-studies-most-compared-brands-2026-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200 flex-wrap">
              <li>
                <Link href="/" className="text-primary-200 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/studies" className="text-primary-200 hover:text-white transition-colors">Studies</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Most-Compared Brands 2026</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1">
                Data Study · Updated <time dateTime={new Date(study.updatedAt).toISOString()}>{updatedLabel}</time>
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
                The Most-Compared Brands of 2026
              </h1>
              <p id="page-intro" className="mt-2 text-primary-100 text-sm sm:text-base leading-relaxed">
                Which brands does the internet argue about most? We took{" "}
                <strong>{fmt(study.totalComparisons)}</strong> published comparison pages, collapsed the
                duplicates, and mapped what is left — <strong>{fmt(study.distinctRivalries)}</strong>{" "}
                distinct rivalries between <strong>{fmt(study.distinctBrands)}</strong> entities — into a
                single graph of who gets compared against whom.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Key stat cards */}
        <section aria-label="Study statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.distinctRivalries)}</div>
            <div className="text-sm text-text-secondary mt-1">
              Distinct rivalries
              <span className="block text-xs mt-0.5">
                from {fmt(study.totalComparisons)} published pages
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{fmt(study.distinctBrands)}</div>
            <div className="text-sm text-text-secondary mt-1">
              Distinct brands &amp; entities
              <span className="block text-xs mt-0.5">
                after merging alias entries
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="text-3xl font-black text-text">{narrowPct}%</div>
            <div className="text-sm text-text-secondary mt-1">
              of brands have only 1&ndash;2 rivals
              <span className="block text-xs mt-0.5">
                comparison demand is a long tail, not a top 10
              </span>
            </div>
          </div>
        </section>

        {/* Top brands overall */}
        <section aria-labelledby="brands-overall-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 id="brands-overall-heading" className="text-2xl font-display font-bold text-text">Brands with the widest rivalry webs</h2>
          </div>
          <p className="text-text-secondary mb-5">
            Ranked by <strong>distinct rivals</strong> — how many different brands each one is actually
            matched against, once pages covering the same rivalry twice are collapsed into one. The
            table has a clear leader: Xbox Series X tops the ranking with 6 distinct rivals, ahead of a
            seven-brand cluster tied at 5. We publish the rank as it falls, but treat the gap as soft —
            rival counts are sensitive to how finely each market is modelled (see methodology).
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm" aria-label="Brands with the widest rivalry webs — rank, brand, type, distinct rival count">
              <thead className="bg-surface text-text-secondary">
                <tr>
                  <th scope="col" className="text-left font-semibold px-4 py-3 w-12">#</th>
                  <th scope="col" className="text-left font-semibold px-4 py-3">Brand</th>
                  <th scope="col" className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Type</th>
                  <th scope="col" className="text-right font-semibold px-4 py-3">Distinct rivals</th>
                </tr>
              </thead>
              <tbody>
                {study.topBrands.map((b, i) => {
                  const tied =
                    (i > 0 && study.topBrands[i - 1].count === b.count) ||
                    (i < study.topBrands.length - 1 && study.topBrands[i + 1].count === b.count);
                  return (
                    <tr key={b.slug} className="border-t border-border">
                      <td className="px-4 py-3 text-text-secondary font-medium">
                        {b.rank}
                        {tied && <span className="ml-1 text-xs font-normal">(tie)</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/entity/${b.slug}`} className="font-medium text-text hover:text-primary-600">
                          {b.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                        {TYPE_LABELS[b.type] || b.type}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-text">{b.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Distribution — the claim that survives every dedup rule */}
        <section aria-labelledby="brands-spread-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 id="brands-spread-heading" className="text-2xl font-display font-bold text-text">How many rivals does a brand actually have?</h2>
          </div>
          <p className="text-text-secondary mb-5">
            Almost all of them have one. <strong>{narrowPct}%</strong> of the{" "}
            {fmt(spreadTotal)} brands in the dataset are compared against just one or two rivals; only
            a handful reach five. Comparison demand is a long tail of two-horse races, not a
            leaderboard — which is the most robust thing this dataset says, and the finding we would
            stand behind over any individual ranking.
          </p>
          <div className="space-y-3">
            {study.rivalSpread.map((b) => (
              <div key={b.rivals}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-text">
                    {b.rivals} {b.rivals === 1 ? "rival" : "rivals"}
                  </span>
                  <span className="text-text-secondary">
                    {fmt(b.entities)} {b.entities === 1 ? "brand" : "brands"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${Math.max(2, Math.round((b.entities / maxSpread) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top SaaS */}
        {study.topSaaS.length > 0 && (
          <section aria-labelledby="brands-saas-heading" className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <h2 id="brands-saas-heading" className="text-2xl font-display font-bold text-text">Most-compared B2B SaaS tools</h2>
            </div>
            <p className="text-text-secondary mb-5">
              Software buyers comparison-shop harder than anyone. These are the SaaS products matched
              against the widest field of rivals. Consumer streaming services are excluded here even
              where our database types them as software — they belong in the brands table above, not
              in a B2B tool ranking.
            </p>
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
              {study.topSaaS.map((b) => (
                <li key={b.slug}>
                <Link
                  href={`/entity/${b.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-600 transition-colors w-full h-full"
                >
                  <span className="font-medium text-text">
                    <span className="text-text-secondary mr-2">{b.rank}.</span>
                    {b.name}
                  </span>
                  <span className="text-sm font-semibold text-primary-600">
                    {b.count} {b.count === 1 ? "rival" : "rivals"}
                  </span>
                </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Biggest matchups */}
        <section aria-labelledby="brands-readership-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 id="brands-readership-heading" className="text-2xl font-display font-bold text-text">The most-connected matchups</h2>
          </div>
          <p className="text-text-secondary mb-5">
            The marquee rivalries of 2026 — the matchups whose two sides are each compared against the
            widest field of rivals, so they sit at the centre of the most buyer research. Each rivalry
            appears once, however many pages we have published about it.
          </p>
          <ol className="space-y-2">
            {study.topMatchups.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/compare/${m.slug}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary-600 transition-colors"
                >
                  <span className="font-medium text-text">
                    <span className="text-text-secondary mr-2">{m.rank}.</span>
                    {m.title}
                  </span>
                  <span className="text-sm text-text-secondary whitespace-nowrap">
                    {fmt(m.centrality)} combined rivals
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Category breakdown */}
        <section aria-labelledby="brands-cluster-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h2 id="brands-cluster-heading" className="text-2xl font-display font-bold text-text">Where the comparisons cluster</h2>
          </div>
          <p className="text-text-secondary mb-5">
            Comparison demand is concentrated in consumer products, software, and technology — the
            categories where switching costs are real and the choice actually matters.
          </p>
          <div className="space-y-3">
            {study.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <Link href={`/category/${c.category}`} className="font-medium text-text hover:text-primary-600">
                    {c.label}
                  </Link>
                  <span className="text-text-secondary">{fmt(c.count)} comparisons</span>
                </div>
                <div className="h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${Math.max(4, Math.round((c.count / maxCat) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section aria-labelledby="brands-methodology-heading" className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 id="brands-methodology-heading" className="text-2xl font-display font-bold text-text">Methodology</h2>
          </div>
          <div className="prose-sm text-text-secondary space-y-3">
            <p>
              We started from every published comparison on {SITE_NAME} as of {updatedLabel}:{" "}
              <strong>{fmt(study.totalComparisons)}</strong> pages. Of those,{" "}
              {fmt(study.multiWayPages)} compare three or more things at once and are set aside — they
              are not head-to-head matchups — leaving {fmt(study.headToHeadPages)} two-way pages.
            </p>
            <p>
              Those pages are then reduced to <strong>rivalries</strong>, because a page count is not a
              rivalry count. Two things inflate it. First, we publish some matchups in both directions:{" "}
              <em>Netflix vs Disney+</em> and <em>Disney+ vs Netflix</em> are two pages about one
              rivalry. Second, some brands exist in our database under more than one entry (Netflix and
              &ldquo;Netflix, Inc.&rdquo;; HBO Max and &ldquo;Max&rdquo;). We normalise each page to an
              order-insensitive pair of canonical entities and count each pair once. That takes{" "}
              {fmt(study.headToHeadPages)} pages down to <strong>{fmt(study.distinctRivalries)}</strong>{" "}
              distinct rivalries, and {fmt(study.rawEntityRows)} database entries down to{" "}
              <strong>{fmt(study.distinctBrands)}</strong> entities.
            </p>
            <p>
              A brand&rsquo;s score is its number of <strong>distinct rivals</strong> in that graph — the
              brands it is actually matched against, not the pages it appears on. Netflix, for example,
              appears on nine published pages but has five distinct rivals. The brands ranking covers
              companies, products, software, platforms, streaming services and teams; countries, people
              and historical entities are excluded.
            </p>
            <p>
              <strong>Why we treat the leader&rsquo;s margin as soft.</strong> We deliberately do
              not merge product generations — PlayStation 5, PS5 Pro and PlayStation 6 stay three
              entities, as do iPhone 16 and iPhone 16 Pro. That means a brand&rsquo;s rival count partly
              reflects how finely its market happens to be modelled in our catalog: the console at the
              top of the table reaches its total via three PlayStation models, its own sibling console
              and a &ldquo;PC gaming&rdquo; category, while Netflix reaches five via five separate
              services. Those are not the same measurement. We publish the rank as it falls — Xbox
              Series X leads at 6, a seven-brand cluster follows at 5 — but we would not defend a
              one-rival gap as structurally meaningful. The distribution — that {narrowPct}% of brands
              have only one or two rivals — is stable under every deduplication rule we tested, and
              is the number we would defend.
            </p>
            <p>
              All figures are counts of published comparison content. We do not publish traffic or
              readership figures. Data is refreshed daily from our live database, and the
              deduplication rules above are applied at query time — you can reproduce any number here
              by pulling{" "}
              <Link href="/sitemap.xml" className="text-primary-600 hover:underline">our sitemap</Link>{" "}
              and collapsing reversed pairs.
            </p>
            <p className="text-xs">
              {study.fromSnapshot
                ? "Figures shown are from our most recent published snapshot."
                : "Figures shown reflect live data as of page generation."}
            </p>
          </div>
        </section>

        {/* Cite / reuse box — the link-earning hook */}
        <section aria-labelledby="brands-cite-heading" className="rounded-xl border border-primary-600/30 bg-primary-600/5 p-6 mb-12">
          <h2 id="brands-cite-heading" className="text-xl font-display font-bold text-text mb-2">Cite or republish this study</h2>
          <p className="text-text-secondary text-sm mb-4">
            This data is free to reference, quote, and republish with attribution and a link back to{" "}
            {SITE_NAME}. Journalists and bloggers — reach out via our{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">contact page</Link> for
            a custom data cut or a high-res chart.
          </p>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">Citation</div>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-surface border border-border p-3 text-xs text-text">{citation}</pre>
            </div>
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">Link / embed</div>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-surface border border-border p-3 text-xs text-text">{embedHtml}</pre>
            </div>
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-sm text-text-secondary">
          <p>
            Want the raw data behind a specific category or a comparison embed for your site? See our{" "}
            <Link href="/partnerships" className="text-primary-600 hover:underline">partnerships page</Link>{" "}
            or browse <Link href="/trending" className="text-primary-600 hover:underline">trending comparisons</Link>.
          </p>
        </footer>
      </article>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsletterSignup source="study-most-compared-brands" />
      </div>
    </>
  );
}

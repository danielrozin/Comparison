import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { TrendingCard } from "@/components/home/TrendingCard";
import { Pagination } from "@/components/ui/Pagination";
import { TrendingSortSelect } from "@/components/ui/TrendingSortSelect";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export const revalidate = 300; // ISR: revalidate trending page every 5 minutes

const ITEMS_PER_PAGE = 20;

const trendingDescription = "See the most popular comparisons right now — sports, countries, products, technology, and more.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Trending Comparisons")}&type=trending`;

export const metadata: Metadata = {
  title: "Trending Comparisons",
  description: trendingDescription,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${SITE_URL}/trending`,
    languages: { "en": `${SITE_URL}/trending`, "x-default": `${SITE_URL}/trending` },
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
      "application/atom+xml": `${SITE_URL}/feed/atom`,
    },
  },
  openGraph: {
    title: "Trending Comparisons",
    description: trendingDescription,
    url: `${SITE_URL}/trending`,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Trending Comparisons" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: "Trending Comparisons",
    description: trendingDescription,
    images: [{ url: ogImage, alt: "Trending Comparisons" }],
  },
  other: {
    "citation_title": "Trending Comparisons — A Versus B",
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": trendingDescription,
    "abstract": trendingDescription,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": "Trending Comparisons — A Versus B",
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.subject": "Trending Comparisons 2026, Popular Side-by-Side Comparisons",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.description": trendingDescription,
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": `${SITE_URL}/trending`,
    "thumbnail": ogImage,
    "twitter:label1": "Content Type",
    "twitter:data1": "Trending Feed",
    "twitter:label2": "Updated",
    "twitter:data2": "Every 5 minutes",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  sports: "⚽", countries: "🌍", technology: "💻", products: "📦",
  health: "💊", finance: "💰", entertainment: "🎬", history: "📜",
  companies: "🏢", brands: "🏷️", celebrities: "⭐", software: "🖥️",
  automotive: "🚗",
};

const CATEGORY_COLORS: Record<string, string> = {
  sports: "bg-green-100 text-green-800 border-green-200 ring-green-400",
  countries: "bg-orange-100 text-orange-800 border-orange-200 ring-orange-400",
  technology: "bg-blue-100 text-blue-800 border-blue-200 ring-blue-400",
  products: "bg-violet-100 text-violet-800 border-violet-200 ring-violet-400",
  health: "bg-rose-100 text-rose-800 border-rose-200 ring-rose-400",
  finance: "bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-400",
  entertainment: "bg-purple-100 text-purple-800 border-purple-200 ring-purple-400",
  history: "bg-amber-100 text-amber-800 border-amber-200 ring-amber-400",
  companies: "bg-indigo-100 text-indigo-800 border-indigo-200 ring-indigo-400",
  brands: "bg-pink-100 text-pink-800 border-pink-200 ring-pink-400",
  celebrities: "bg-yellow-100 text-yellow-800 border-yellow-200 ring-yellow-400",
  software: "bg-cyan-100 text-cyan-800 border-cyan-200 ring-cyan-400",
  automotive: "bg-slate-100 text-slate-800 border-slate-200 ring-slate-400",
};

const SORT_OPTIONS = [
  { value: "views", label: "Most Views" },
  { value: "newest", label: "Newest" },
  { value: "alpha", label: "A → Z" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const activeCategory = sp.category?.toLowerCase() || "";
  const activeSort: SortValue = (SORT_OPTIONS.find((o) => o.value === sp.sort)?.value) ?? "views";

  // Fetch enough items for pagination (up to 100)
  const allTrending = await getTrendingComparisons(100);

  // Collect unique categories from data
  const categoryCounts: Record<string, number> = {};
  for (const item of allTrending) {
    const cat = item.category?.toLowerCase();
    if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // Filter by category if selected
  let filtered = activeCategory
    ? allTrending.filter((item) => item.category?.toLowerCase() === activeCategory)
    : [...allTrending];

  // Sort
  if (activeSort === "newest") {
    filtered = filtered.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });
  } else if (activeSort === "alpha") {
    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  }
  // "views" is the default from getTrendingComparisons (already sorted by viewCount)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const trending = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Trending", url: `${SITE_URL}/trending` },
  ]);

  const trendingToday = new Date().toISOString().slice(0, 10);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/trending#collectionpage`,
    name: "Trending Comparisons on A Versus B",
    description: trendingDescription,
    abstract: "The most-viewed X vs Y comparisons right now — ranked by views, votes, and social signals.",
    url: `${SITE_URL}/trending`,
    inLanguage: "en-US",
    genre: "Trending Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    // dateCreated + datePublished — stable baseline so ISR revalidation does not
    // reset content age. dateModified updates on each revalidation (correct).
    dateCreated: "2024-01-01",
    datePublished: "2024-01-01",
    dateModified: trendingToday,
    lastReviewed: trendingToday,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    contentReferenceTime: trendingToday,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/trending#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: "Trending Comparisons — A Versus B",
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: [
      { "@type": "ReadAction", target: `${SITE_URL}/trending` },
      // SearchAction lets Google/AI surface search-within-trending UX in sidebars and AI Overviews.
      { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
      // SubscribeAction — follow/bookmark intent for trending content discovery.
      { "@type": "SubscribeAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/contact` }, object: { "@type": "WebPage", name: "Trending Comparisons", url: `${SITE_URL}/trending` } },
    ],
    alternativeHeadline: "Most Popular X vs Y Comparisons Right Now — A Versus B Trending",
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    educationalLevel: "General",
    teaches: "How to discover trending comparison topics and make informed decisions",
    educationalUse: "comparison",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#trending-description", ".trending-intro"] },
    keywords: `trending comparisons, most popular comparisons, top vs comparisons ${new Date().getFullYear()}`,
    timeRequired: "PT2M",
    wordCount: 400,
    // mentions[] — top-10 trending Article nodes; AI crawlers use this to enumerate
    // which comparisons are featured without parsing the rendered HTML list.
    mentions: trending.slice(0, 10).map((item) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/compare/${item.slug}#article`,
      name: item.title,
      url: `${SITE_URL}/compare/${item.slug}`,
    })),
    // about[] — subject-level classification for AI topic-routing and Google Discover.
    about: [
      { "@type": "Thing", name: "Comparison Articles" },
      { "@type": "Thing", name: "Trending Topics" },
      { "@type": "Thing", name: "Consumer Decisions" },
    ],
    // hasPart[] — structural sub-documents: the ItemList is a formal part of this CollectionPage.
    hasPart: [{ "@type": "ItemList", "@id": `${SITE_URL}/trending#itemlist` }],
    locationCreated: { "@type": "Country", name: "United States" },
  };

  // Dataset node — Google Dataset Search and AI research tools index Dataset nodes
  // independently from CollectionPage. Emitting one on the trending hub gives it a
  // machine-readable data fingerprint with numberOfItems, distribution, and DataCatalog
  // membership — same pattern applied to category pages in HB347.
  const trendingDatasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE_URL}/trending#dataset`,
    name: "Trending Comparisons Dataset — A Versus B",
    description: `Real-time dataset of the ${allTrending.length} most-viewed X vs Y comparisons on A Versus B, ranked by views, votes, and social signals.`,
    url: `${SITE_URL}/trending`,
    identifier: `${SITE_URL}/trending#dataset`,
    inLanguage: "en-US",
    datePublished: "2024-01-01",
    dateModified: trendingToday,
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    numberOfItems: allTrending.length,
    keywords: "trending comparisons, most popular comparisons, top vs comparisons, viral comparisons",
    about: [
      { "@type": "Thing", name: "Trending Topics" },
      { "@type": "Thing", name: "Comparison Articles" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/api/sitemap-data?type=comparison&format=json`,
        name: "Comparisons JSON DataFeed",
        description: "Paginated JSON feed of all comparison pages with slugs, titles, and verdicts",
        potentialAction: { "@type": "ReadAction", target: `${SITE_URL}/api/sitemap-data?type=comparison&format=json` },
      },
    ],
    isPartOf: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparisons Dataset`, url: SITE_URL },
    includedInDataCatalog: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparisons Dataset`, url: SITE_URL },
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/trending` },
    },
  };

  // ItemList schema — lets AI answer engines enumerate the trending comparisons
  // directly from structured data, without parsing the rendered HTML.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/trending#itemlist`,
    name: "Trending Comparisons on A Versus B",
    description: trendingDescription,
    url: `${SITE_URL}/trending`,
    numberOfItems: trending.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: trending.map((item, index) => ({
      "@type": "ListItem",
      position: startIdx + index + 1,
      name: item.title,
      url: `${SITE_URL}/compare/${item.slug}`,
      item: {
        "@type": "Article",
        "@id": `${SITE_URL}/compare/${item.slug}#article`,
        url: `${SITE_URL}/compare/${item.slug}`,
        name: item.title,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trendingDatasetSchema) }}
      />

      {/* Trending Hero */}
      <section aria-labelledby="trending-hero-heading" className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-500 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="trending-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trending-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-orange-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-orange-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Trending</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <div>
              <h1 id="trending-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Trending Comparisons
              </h1>
              <p id="trending-description" className="text-orange-100 mt-1.5 text-sm sm:text-base">
                The most popular comparisons right now
                {allTrending.length > ITEMS_PER_PAGE && (
                  <span className="ml-1">· Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, allTrending.length)} of {allTrending.length}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Category filter chips */}
        {categories.length > 1 && (
          <nav aria-label="Filter by category" className="mb-6 -mx-1">
            <div className="flex flex-wrap gap-2 px-1">
              <Link
                href="/trending"
                aria-current={!activeCategory ? "true" : undefined}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                  !activeCategory
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                    : "bg-white text-text-secondary border-border hover:border-orange-300 hover:text-text hover:bg-orange-50"
                }`}
              >
                All
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${!activeCategory ? "bg-white/20 text-white" : "bg-surface-alt text-text-secondary"}`}>
                  {allTrending.length}
                </span>
              </Link>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const colorClass = CATEGORY_COLORS[cat] || "bg-surface-alt text-text-secondary border-border ring-gray-400";
                const [bg, text, border, ring] = colorClass.split(" ");
                return (
                  <Link
                    key={cat}
                    href={`/trending?category=${encodeURIComponent(cat)}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                      isActive
                        ? `${bg} ${text} ${border} ring-2 ${ring} shadow-sm`
                        : "bg-white text-text-secondary border-border hover:border-current hover:bg-opacity-50"
                    }`}
                  >
                    <span aria-hidden="true">{CATEGORY_ICONS[cat] || "📊"}</span>
                    <span className="capitalize">{cat}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/30" : "bg-surface-alt"}`}>
                      {categoryCounts[cat]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* Sort + active label row */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          {activeCategory ? (
            <p className="text-sm text-text-secondary">
              Showing <span className="font-semibold text-text capitalize">{activeCategory}</span> comparisons
              <span className="text-text-secondary/60"> · {filtered.length} total</span>
            </p>
          ) : (
            <p className="text-sm text-text-secondary">{allTrending.length} comparisons</p>
          )}

          {/* Sort select — client component (needs useSearchParams for URL-aware navigation) */}
          <Suspense fallback={<div className="h-8 w-28 bg-surface-alt rounded-lg animate-pulse" />}>
            <TrendingSortSelect activeSort={activeSort} />
          </Suspense>
        </div>

        {/* Legacy active-category clear link (still needed when both category + sort active) */}
        {activeCategory && (
          <div className="mb-3 flex items-center gap-2">
            <Link href="/trending" className="text-xs text-primary-600 hover:underline ml-2">Clear filter</Link>
          </div>
        )}

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none">
          {trending.map((item, index) => (
            <li key={item.slug} className="flex">
              <TrendingCard comparison={item} rank={startIdx + index + 1} />
            </li>
          ))}
        </ul>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          basePath="/trending"
          extraParams={{
            ...(activeCategory ? { category: activeCategory } : {}),
            ...(activeSort !== "views" ? { sort: activeSort } : {}),
          }}
        />

        {/* Newsletter CTA — only on first page to avoid duplicate on pagination */}
        {safePage === 1 && (
          <div className="mt-16">
            <NewsletterSignup source="trending" />
          </div>
        )}
      </div>
    </>
  );
}

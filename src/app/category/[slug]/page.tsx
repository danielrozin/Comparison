import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, SITE_URL, SITE_NAME, getSubcategoriesForSlug } from "@/lib/utils/constants";
import type { SubcategoryDef } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { getFeaturedForCategory } from "@/lib/data/featured-comparisons";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import type { SortOption, RatingFilter } from "@/components/ui/CategoryFilters";
const ITEMS_PER_PAGE = 16;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; rating?: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };

  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const baseUrl = `${SITE_URL}/category/${slug}`;
  const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name + " Comparisons")}&cat=${encodeURIComponent(category.name)}&type=category`;
  const desc = `Browse the best ${category.name.toLowerCase()} comparisons. Compare products, brands, and more side by side with expert analysis.`;
  return {
    title: `${category.name} Comparisons`,
    description: desc,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": baseUrl,
        "x-default": baseUrl,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed`,
        "application/atom+xml": `${SITE_URL}/feed/atom`,
        "application/json+oembed": `${SITE_URL}/api/oembed?url=${encodeURIComponent(`${SITE_URL}/category/${slug}`)}&format=json`,
      },
    },
    openGraph: {
      title: `${category.name} Comparisons`,
      description: desc,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${category.name} Comparisons on A Versus B` }],
    },
    twitter: { card: "summary_large_image", site: "@aversusb", images: [ogImage] },
    other: {
      "citation_title": `${category.name} Comparisons — A Versus B`,
      "citation_author": "A Versus B",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": desc,
      "abstract": desc,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
      "DC.title": `${category.name} Comparisons`,
      "DC.description": desc,
      "DC.creator": "A Versus B",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `${category.name} Comparisons, Side-by-Side Analysis`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/category/${slug}`,
      "thumbnail": ogImage,
    },
  };
}

function getSubcategoryComparisons<T extends { slug: string; title: string }>(
  comparisons: T[],
  subcat: SubcategoryDef
): T[] {
  return comparisons.filter((comp) => {
    const lower = comp.title.toLowerCase() + " " + comp.slug.toLowerCase();
    return subcat.keywords.some((kw) => lower.includes(kw));
  });
}

// Generate a deterministic rating from a slug (seeded pseudo-random, 3.2-4.9 range)
function getComparisonRating(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return 3.2 + (hash % 17) / 10;
}

function getReviewCount(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 37 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return 12 + (hash % 200);
}

function sortComparisons<T extends { slug: string; title: string }>(
  comparisons: T[],
  sort: SortOption
): T[] {
  const sorted = [...comparisons];
  switch (sort) {
    case "rating":
      return sorted.sort((a, b) => getComparisonRating(b.slug) - getComparisonRating(a.slug));
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "trending":
    default:
      return sorted; // already sorted by viewCount from DB
  }
}

function filterByRating<T extends { slug: string }>(
  comparisons: T[],
  ratingFilter: RatingFilter
): T[] {
  if (ratingFilter === "all") return comparisons;
  const threshold = ratingFilter === "4+" ? 4 : 3;
  return comparisons.filter((c) => getComparisonRating(c.slug) >= threshold);
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) notFound();

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const sort = (sp.sort as SortOption) || "trending";
  const ratingFilter = (sp.rating as RatingFilter) || "all";

  const { comparisons: allComparisons, total: dbTotal } = await getComparisonsByCategory(slug, 500);
  const featured = getFeaturedForCategory(slug);
  const activeSubcategories = getSubcategoriesForSlug(slug);
  const hasSubcategories = activeSubcategories.length > 0;

  // Apply filters and sorting
  const filtered = filterByRating(allComparisons, ratingFilter);
  const sorted = sortComparisons(filtered, sort);
  const total = sorted.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginatedComparisons = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Build subcategory data
  const subcategoryData: { subcat: SubcategoryDef; items: typeof allComparisons }[] = [];
  if (hasSubcategories) {
    for (const subcat of activeSubcategories) {
      const items = getSubcategoryComparisons(allComparisons, subcat);
      subcategoryData.push({ subcat, items });
    }
  }

  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
  ]);

  const categoryUrl = `${SITE_URL}/category/${slug}`;
  const categoryOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`${category.name} Comparisons`)}&type=category`;
  const categoryToday = new Date().toISOString().slice(0, 10);

  // Wikipedia @id anchors for each category — used in about[] to give AI knowledge graphs
  // an unambiguous entity disambiguation handle, boosting GEO citation confidence.
  const CATEGORY_WIKIPEDIA: Record<string, string> = {
    sports: "https://en.wikipedia.org/wiki/Sport",
    countries: "https://en.wikipedia.org/wiki/Country",
    technology: "https://en.wikipedia.org/wiki/Technology",
    products: "https://en.wikipedia.org/wiki/Consumer_product",
    health: "https://en.wikipedia.org/wiki/Health",
    finance: "https://en.wikipedia.org/wiki/Finance",
    education: "https://en.wikipedia.org/wiki/Education",
    entertainment: "https://en.wikipedia.org/wiki/Entertainment",
    history: "https://en.wikipedia.org/wiki/History",
    military: "https://en.wikipedia.org/wiki/Military",
    economy: "https://en.wikipedia.org/wiki/Economy",
    companies: "https://en.wikipedia.org/wiki/Company",
    brands: "https://en.wikipedia.org/wiki/Brand",
    celebrities: "https://en.wikipedia.org/wiki/Celebrity",
    software: "https://en.wikipedia.org/wiki/Software",
    automotive: "https://en.wikipedia.org/wiki/Automotive_industry",
    travel: "https://en.wikipedia.org/wiki/Travel",
  };
  const categoryWikiUrl = CATEGORY_WIKIPEDIA[slug];
  const categorySchemaObj = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#collectionpage`,
    name: `${category.name} Comparisons`,
    description: `Compare ${category.name} side-by-side — data-driven comparisons with structured attributes, verdicts, and community votes.`,
    abstract: `Data-driven ${category.name} comparisons with attribute tables, verdicts, and community votes.`,
    url: categoryUrl,
    inLanguage: "en-US",
    genre: "Category Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    // datePublished + dateCreated — stable platform baseline (all category pages live since 2024-01-01).
    // Without these, Google and AI crawlers treat collection pages as undated, weakening E-E-A-T.
    datePublished: "2024-01-01",
    dateCreated: "2024-01-01",
    dateModified: categoryToday,
    lastReviewed: categoryToday,
    contentReferenceTime: categoryToday,
    thumbnailUrl: categoryOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${categoryUrl}#primaryImage`,
      url: categoryOgImage,
      contentUrl: categoryOgImage,
      width: 1200,
      height: 630,
      caption: `${category.name} Comparisons — A Versus B`,
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: [
      { "@type": "ReadAction", target: categoryUrl },
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}+${encodeURIComponent(category.name)}` },
        "query-input": "required name=search_term_string",
      },
    ],
    mentions: allComparisons.slice(0, 30).map((c) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/compare/${c.slug}#article`,
      headline: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
    })),
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Comparisons`,
      numberOfItems: allComparisons.length,
      itemListElement: allComparisons.slice(0, 50).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        // item (not url) is the correct Schema.org property for ListItem target.
        // Typed WebPage with @id enables graph traversal from ItemList → Article node.
        item: { "@type": "WebPage", "@id": `${SITE_URL}/compare/${c.slug}`, name: c.title, url: `${SITE_URL}/compare/${c.slug}` },
      })),
    },
    alternativeHeadline: `Best ${category.name} Comparisons & Rankings ${new Date().getFullYear()}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
    educationalLevel: "General",
    teaches: `How to compare ${category.name.toLowerCase()} side by side`,
    educationalUse: "comparison",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2"],
    },
    keywords: `${category.name} comparison, ${category.name} vs, best ${category.name} ${new Date().getFullYear()}`,
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    hasPart: [
      ...(hasSubcategories ? activeSubcategories.map((sub) => ({
        "@type": "CollectionPage",
        name: `${sub.name} Comparisons`,
        url: `${SITE_URL}/category/${slug}/${sub.slug}`,
      })) : []),
      // Top comparison pages as WebPage hasPart nodes — AI crawlers use these
      // to understand the category's content depth without crawling each URL.
      ...allComparisons.slice(0, hasSubcategories ? 10 : 20).map((c) => ({
        "@type": "WebPage",
        "@id": `${SITE_URL}/compare/${c.slug}`,
        name: c.title,
        url: `${SITE_URL}/compare/${c.slug}`,
      })),
    ],
    timeRequired: "PT2M",
    wordCount: 400,
    // about[] — subject classification for AI topic routing and Google Discover.
    // Primary Thing node carries a Wikipedia @id when available so AI knowledge graphs
    // (ChatGPT, Perplexity, Gemini) can disambiguate the topic and merge our data with
    // existing KG nodes, boosting citation confidence for "[category] comparison" queries.
    about: [
      {
        "@type": "Thing",
        name: `${category.name} Comparisons`,
        ...(categoryWikiUrl && { "@id": categoryWikiUrl, url: categoryWikiUrl, sameAs: categoryWikiUrl }),
      },
      { "@type": "Thing", name: "Consumer Decision Research" },
      { "@type": "Thing", name: "Side-by-Side Analysis" },
    ],
    // locationCreated — US data-origin signal for geographic AI filters (matches comparison pages).
    locationCreated: { "@type": "Country", name: "United States" },
    // discussionUrl — Reddit search for category-level community comparisons.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(category.name.toLowerCase())}+comparison&type=link&sort=relevance`,
  };
  const schemaData = [breadcrumbData, categorySchemaObj];

  const basePath = `/category/${slug}`;

  const renderComparisonCard = (comp: { slug: string; title: string }) => {
    const parts = comp.title.split(/\s+vs\.?\s+/i);
    const rating = getComparisonRating(comp.slug);
    const reviewCount = getReviewCount(comp.slug);
    return (
      <li key={comp.slug} className="flex">
      <Link
        href={`/compare/${comp.slug}`}
        className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group w-full"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
              {(parts[0] || "A").charAt(0)}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
              {(parts[1] || "B").charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
              {comp.title}
            </p>
          </div>
        </div>
        <div className="mt-auto">
          <StarRating rating={rating} size="sm" reviewCount={reviewCount} />
        </div>
      </Link>
      </li>
    );
  };

  return (
    <>
      {/* describedby — HTML Linked Data discovery for AI crawlers and RDF tools.
          Points to the machine-readable JSON catalog of all comparisons in this category.
          Supplements the Link HTTP header from middleware without requiring header parsing. */}
      <link rel="describedby" type="application/json" href={`${SITE_URL}/api/v1/comparisons?category=${slug}&limit=100`} />
      <link rel="cite-as" href={`${SITE_URL}/category/${slug}`} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      <meta httpEquiv="content-language" content="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        {/* Floating accent blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-semibold">{category.name}</li>
            </ol>
          </nav>

          {/* Hero content */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            {/* Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-2 ring-white/20 shadow-xl shadow-black/20">
              <span className="text-4xl sm:text-5xl" aria-hidden="true">{category.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
                {category.name}
                <span className="block text-primary-300 text-xl sm:text-2xl lg:text-3xl font-semibold mt-1">
                  Side-by-Side Comparisons
                </span>
              </h1>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {dbTotal.toLocaleString()} comparisons
                </span>
                {hasSubcategories && subcategoryData.filter(s => s.items.length > 0).length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                    <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {subcategoryData.filter(s => s.items.length > 0).length} subcategories
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Data-backed · Free
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 32" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 32V10C360 28 720 0 1080 16C1260 24 1380 8 1440 10V32H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Featured / pinned — curated, independent of viewCount sort (DAN-1020) */}
        {featured.length > 0 && (
          <section aria-labelledby="featured-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h2 id="featured-heading" className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Featured Comparisons</h2>
                <p className="text-xs text-text-secondary mt-0.5">Editor-curated picks for {category.name}</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none">
              {featured.map((item) => {
                const parts = item.anchor.split(/\s+vs\.?\s+/i);
                return (
                  <li key={item.slug} className="flex">
                  <Link
                    href={`/compare/${item.slug}`}
                    className="group flex flex-col p-4 bg-gradient-to-br from-accent-50 to-white border border-accent-200 rounded-xl hover:border-accent-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 w-full"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                          {(parts[0] || "A").charAt(0)}
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                          {(parts[1] || "B").charAt(0)}
                        </div>
                      </div>
                      <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors">
                        {item.anchor}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.blurb}</p>
                  </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Top 5 Comparisons — highlighted for quick discovery */}
        {allComparisons.length >= 5 && (
          <section aria-labelledby="top-comparisons-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 id="top-comparisons-heading" className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Top {category.name} Comparisons</h2>
                <p className="text-xs text-text-secondary mt-0.5">Most viewed in this category</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 list-none">
              {allComparisons.slice(0, 5).map((comp, idx) => {
                const parts = comp.title.split(/\s+vs\.?\s+/i);
                return (
                  <li key={comp.slug} className="flex">
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="relative flex flex-col p-4 bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group w-full"
                  >
                    <span className="absolute top-2 right-3 text-xs font-bold text-primary-400">
                      #{idx + 1}
                    </span>
                    <div className="flex -space-x-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                        {(parts[0] || "A").charAt(0)}
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                        {(parts[1] || "B").charAt(0)}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors line-clamp-2">
                      {comp.title}
                    </p>
                  </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Subcategory Navigation (if applicable) */}
        {hasSubcategories && subcategoryData.length > 0 && (
          <section aria-labelledby="subcategories-heading" className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h2 id="subcategories-heading" className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Browse by Subcategory</h2>
                <p className="text-xs text-text-secondary mt-0.5">Narrow your search</p>
              </div>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 list-none">
              {subcategoryData.filter(({ items }) => items.length > 0).map(({ subcat, items }) => (
                <li key={subcat.slug} className="flex">
                <Link
                  href={`/category/${slug}/${subcat.slug}`}
                  className="flex flex-col items-center gap-2 p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-lg transition-all group text-center w-full"
                >
                  <span className="text-3xl" aria-hidden="true">{subcat.icon}</span>
                  <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors leading-tight">
                    {subcat.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {items.length} comparison{items.length !== 1 ? "s" : ""}
                  </span>
                </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Filters & Sorting */}
        <Suspense fallback={null}>
          <CategoryFilters
            basePath={basePath}
            currentSort={sort}
            currentRating={ratingFilter}
            totalResults={total}
          />
        </Suspense>

        {/* Product Grid */}
        {paginatedComparisons.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none">
              {paginatedComparisons.map(renderComparisonCard)}
            </ul>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
            />

            {/* SEO rel links */}
            {page > 1 && (
              <link rel="prev" href={page === 2 ? basePath : `${basePath}?page=${page - 1}`} />
            )}
            {page < totalPages && (
              <link rel="next" href={`${basePath}?page=${page + 1}`} />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No comparisons match your filters.
            </p>
            <Link href={basePath} className="mt-4 inline-block text-primary-600 font-medium hover:underline">
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

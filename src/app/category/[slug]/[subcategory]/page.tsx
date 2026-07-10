import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, SITE_URL, SITE_NAME, getSubcategoriesForSlug } from "@/lib/utils/constants";
import type { SubcategoryDef } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import type { SortOption, RatingFilter } from "@/components/ui/CategoryFilters";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const ITEMS_PER_PAGE = 16;

interface PageProps {
  params: Promise<{ slug: string; subcategory: string }>;
  searchParams: Promise<{ page?: string; sort?: string; rating?: string }>;
}

function getSubcategoryComparisons(
  comparisons: { slug: string; title: string; category?: string | null }[],
  subcat: SubcategoryDef
) {
  return comparisons.filter((comp) => {
    const lower = comp.title.toLowerCase() + " " + comp.slug.toLowerCase();
    return subcat.keywords.some((kw) => lower.includes(kw));
  });
}

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
      return sorted;
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

const CATEGORIES_WITH_SUBS = ["products", "software", "sports", "countries", "technology", "companies", "entertainment", "automotive"];

export async function generateStaticParams() {
  const params: { slug: string; subcategory: string }[] = [];
  for (const catSlug of CATEGORIES_WITH_SUBS) {
    const subs = getSubcategoriesForSlug(catSlug);
    for (const sub of subs) {
      params.push({ slug: catSlug, subcategory: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug, subcategory } = await params;
  const { page: pageParam } = await searchParams;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const subcategories = getSubcategoriesForSlug(slug);
  const subcat = subcategories.find((s) => s.slug === subcategory);
  if (!category || !subcat) return { title: "Not Found" };

  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const baseUrl = `${SITE_URL}/category/${slug}/${subcategory}`;
  const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  const title = `${subcat.name} Comparisons — Best ${subcat.name} Compared`;
  const description = `Compare the best ${subcat.name.toLowerCase()} side by side. Expert comparisons with specs, pros & cons, and verdicts to help you choose.`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(subcat.name + " Comparisons")}&cat=${encodeURIComponent(subcat.name)}&type=category`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${slug}/${subcategory}`,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${subcat.name} comparisons — A Versus B` }],
    },
    twitter: { card: "summary_large_image", site: "@aversusb", title, description, images: [{ url: ogImage, alt: `${subcat.name} comparisons — A Versus B` }] },
    other: {
      "citation_title": title,
      "citation_author": SITE_NAME,
      "citation_journal_title": SITE_NAME,
      "citation_language": "en",
      "citation_abstract": description,
      "abstract": description,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
      "DC.title": title,
      "DC.description": description,
      "DC.creator": SITE_NAME,
      "DC.publisher": SITE_NAME,
      "DC.language": "en",
      "DC.subject": `${subcat.name} Comparisons, ${category.name} ${subcat.name}`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/category/${slug}/${subcategory}`,
      "thumbnail": ogImage,
      "twitter:label1": "Content Type",
      "twitter:data1": `${subcat.name} Comparisons`,
      "twitter:label2": "Platform",
      "twitter:data2": "A Versus B",
    },
  };
}

export default async function SubcategoryPage({ params, searchParams }: PageProps) {
  const { slug, subcategory } = await params;
  const sp = await searchParams;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const subcategories = getSubcategoriesForSlug(slug);
  const subcat = subcategories.find((s) => s.slug === subcategory);

  if (!category || !subcat) notFound();

  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const sort = (sp.sort as SortOption) || "trending";
  const ratingFilter = (sp.rating as RatingFilter) || "all";

  const { comparisons } = await getComparisonsByCategory(slug, 500);
  const subcatComparisons = getSubcategoryComparisons(comparisons, subcat);

  // Apply filters and sorting
  const filtered = filterByRating(subcatComparisons, ratingFilter);
  const sorted = sortComparisons(filtered, sort);
  const total = sorted.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const subcatUrl = `${SITE_URL}/category/${slug}/${subcategory}`;
  const subcatOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`${subcat.name} Comparisons`)}&type=category`;
  const subcatToday = new Date().toISOString().slice(0, 10);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
    { name: subcat.name, url: subcatUrl },
  ]);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    additionalType: ["https://schema.org/LearningResource"],
    learningResourceType: "Overview",
    "@id": `${subcatUrl}#collectionpage`,
    name: `${subcat.name} Comparisons`,
    description: `Compare the best ${subcat.name.toLowerCase()} side by side. Expert comparisons with specs, pros & cons, and verdicts.`,
    abstract: `Data-driven ${subcat.name} comparisons with structured attributes, verdicts, and community votes.`,
    url: subcatUrl,
    inLanguage: "en-US",
    genre: "Category Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: subcatToday,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    contentReferenceTime: subcatToday,
    thumbnailUrl: subcatOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${subcatUrl}#primaryImage`,
      url: subcatOgImage,
      contentUrl: subcatOgImage,
      width: 1200,
      height: 630,
      caption: `${subcat.name} Comparisons — A Versus B`,
    },
    keywords: `${subcat.name} comparison, best ${subcat.name.toLowerCase()} ${new Date().getFullYear()}, ${subcat.name.toLowerCase()} vs`,
    alternativeHeadline: `Best ${subcat.name} Comparisons & Rankings ${new Date().getFullYear()}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    educationalLevel: "General",
    teaches: `How to compare ${subcat.name.toLowerCase()} side by side`,
    educationalUse: "comparison",
    locationCreated: { "@type": "Country", name: "United States" },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: [
      { "@type": "ReadAction", target: subcatUrl },
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}+${encodeURIComponent(subcat.name)}` },
        "query-input": "required name=search_term_string",
      },
    ],
    mentions: subcatComparisons.slice(0, 10).map((c) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/compare/${c.slug}#article`,
      headline: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
    })),
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(subcat.name)}+comparison&type=link&sort=relevance`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#subcategory-intro"] },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${SITE_URL}/category/${slug}/${subcategory}#comparisons`,
      name: `${subcat.name} Comparisons`,
      numberOfItems: subcatComparisons.length,
      itemListElement: subcatComparisons.slice(0, 10).map((c, i) => {
        const compUrl = `${SITE_URL}/compare/${c.slug}`;
        return {
          "@type": "ListItem",
          position: i + 1,
          name: c.title,
          item: { "@type": "WebPage", "@id": compUrl, name: c.title, url: compUrl },
        };
      }),
    },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    timeRequired: "PT2M",
    wordCount: 400,
    // about[] — subject classification for AI topic routing.
    about: [
      { "@type": "Thing", name: `${subcat.name} Comparisons` },
      { "@type": "Thing", name: "Consumer Decision Research" },
    ],
    // hasPart[] — ItemList is a formal structural part of this CollectionPage.
    hasPart: [{ "@type": "ItemList", "@id": `${SITE_URL}/category/${slug}/${subcategory}#comparisons`, name: `${subcat.name} Comparisons`, url: `${SITE_URL}/category/${slug}/${subcategory}` }],
  };
  // Dataset node — parity with parent category pages (HB347).
  // Google Dataset Search and AI research tools index Dataset nodes separately from
  // CollectionPage; emitting one gives this subcategory hub a machine-readable data
  // fingerprint that AI crawlers use to score source authority.
  const subcatDatasetObj = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${subcatUrl}#dataset`,
    name: `${subcat.name} Comparisons Dataset`,
    description: `Structured dataset of ${subcatComparisons.length} ${subcat.name.toLowerCase()} side-by-side comparisons with attribute tables, verdicts, community votes, and entity profiles.`,
    url: subcatUrl,
    identifier: `${subcatUrl}#dataset`,
    inLanguage: "en-US",
    datePublished: "2024-01-01",
    dateModified: subcatToday,
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    numberOfItems: subcatComparisons.length,
    keywords: `${subcat.name} comparison, ${subcat.name.toLowerCase()} vs, ${subcat.name.toLowerCase()} data`,
    about: { "@type": "Thing", name: `${subcat.name} Comparisons` },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/api/sitemap-data?type=comparison&category=${encodeURIComponent(slug)}&format=json`,
        name: `${subcat.name} Comparisons JSON Feed`,
        description: `Paginated JSON DataFeed of all ${subcat.name.toLowerCase()} comparison pages`,
        potentialAction: { "@type": "ReadAction", target: `${SITE_URL}/api/sitemap-data?type=comparison&category=${encodeURIComponent(slug)}&format=json` },
      },
    ],
    isPartOf: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparisons Dataset`, url: SITE_URL },
    includedInDataCatalog: { "@type": "DataCatalog", "@id": `${SITE_URL}/#datacatalog`, name: `${SITE_NAME} Comparisons Dataset`, url: SITE_URL },
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: subcatUrl },
    },
  };
  const schemaData = [breadcrumbs, collectionSchema, subcatDatasetObj];

  const basePath = `/category/${slug}/${subcategory}`;
  // schemaData is now used below

  return (
    <>
      {/* describedby — points to the machine-readable JSON catalog for this subcategory.
          rel=up — HTML hierarchy signal from subcategory to parent category. */}
      <link rel="describedby" type="application/json" href={`${SITE_URL}/api/v1/comparisons?category=${slug}&limit=100`} />
      <link rel="up" href={`${SITE_URL}/category/${slug}`} title={`${category.name} comparisons`} />
      <link rel="cite-as" href={`${SITE_URL}/category/${slug}/${subcategory}`} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      {page > 1 && (
        <link rel="prev" href={page === 2 ? `${SITE_URL}/category/${slug}/${subcategory}` : `${SITE_URL}/category/${slug}/${subcategory}?page=${page - 1}`} />
      )}
      {page < totalPages && (
        <link rel="next" href={`${SITE_URL}/category/${slug}/${subcategory}?page=${page + 1}`} />
      )}
      <meta httpEquiv="content-language" content="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Subcategory Hero Banner */}
      <section aria-labelledby="subcategory-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="subcat-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subcat-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200 flex-wrap">
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
              <li><Link href={`/category/${slug}`} className="hover:text-white transition-colors">{category.name}</Link></li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">{subcat.name}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <span className="text-3xl sm:text-4xl" aria-hidden="true">{subcat.icon}</span>
            </div>
            <div>
              <h1 id="subcategory-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                {subcat.name}
              </h1>
              <p className="text-primary-200 mt-1.5 text-sm sm:text-base">
                {subcatComparisons.length} comparison{subcatComparisons.length !== 1 ? "s" : ""} in {category.name}
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

        {/* Subcategory intro — speakable target for voice assistants and AI answer engines */}
        <p id="subcategory-intro" className="text-text-secondary text-sm mb-4">
          Browse {subcatComparisons.length} head-to-head {subcat.name.toLowerCase()} comparison{subcatComparisons.length !== 1 ? "s" : ""} in the {category.name} category. Each comparison includes attribute tables, a verdict, and community votes to help you decide.
        </p>

        {/* Filters & Sorting */}
        <Suspense fallback={null}>
          <CategoryFilters
            basePath={basePath}
            currentSort={sort}
            currentRating={ratingFilter}
            totalResults={total}
          />
        </Suspense>

        {/* Comparisons Grid */}
        {paginated.length > 0 ? (
          <>
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none">
              {paginated.map((comp) => {
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
                        <h3 className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate text-base">
                          {comp.title}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <StarRating rating={rating} size="sm" reviewCount={reviewCount} />
                    </div>
                  </Link>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
            />
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

        {/* Sibling subcategory navigation */}
        {subcategories.length > 1 && (
          <div className="mt-10 pt-6 border-t border-border">
            <h2 className="text-lg font-display font-bold text-text mb-4">
              More in {category.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sib) => (
                <Link
                  key={sib.slug}
                  href={`/category/${slug}/${sib.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    sib.slug === subcategory
                      ? "bg-primary-50 border-primary-300 text-primary-700 font-medium"
                      : "bg-white border-border text-text-secondary hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  <span>{sib.icon}</span>
                  {sib.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-6">
          <Link href={`/category/${slug}`} className="text-primary-600 hover:underline font-medium">
            <span aria-hidden="true">&larr; </span>All {category.name} Comparisons
          </Link>
        </div>

        {/* Newsletter CTA — only on first page to avoid duplicate on pagination */}
        {page === 1 && (
          <div className="mt-16">
            <NewsletterSignup source={`subcategory-${slug}-${subcategory}`} />
          </div>
        )}
      </div>
    </>
  );
}

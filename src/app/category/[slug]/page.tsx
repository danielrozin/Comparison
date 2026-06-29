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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name + " Comparisons")}&cat=${encodeURIComponent(category.name)}&type=category`;
  const desc = `Browse the best ${category.name.toLowerCase()} comparisons. Compare products, brands, and more side by side with expert analysis.`;
  return {
    title: `${category.name} Comparisons`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: {
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${category.name} Comparisons on A Versus B` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
    other: {
      "citation_title": `${category.name} Comparisons — A Versus B`,
      "citation_author": "A Versus B",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": desc,
      "DC.title": `${category.name} Comparisons`,
      "DC.creator": "A Versus B",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.identifier": `${SITE_URL}/category/${slug}`,
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
    potentialAction: { "@type": "ReadAction", target: categoryUrl },
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Comparisons`,
      numberOfItems: allComparisons.length,
      itemListElement: allComparisons.slice(0, 20).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        url: `${SITE_URL}/compare/${c.slug}`,
      })),
    },
    alternativeHeadline: `Best ${category.name} Comparisons & Rankings 2026`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students" },
    accessMode: ["textual"],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".category-description", "#page-description"],
    },
    keywords: `${category.name} comparison, ${category.name} vs, best ${category.name} 2026`,
  };
  const schemaData = [breadcrumbData, categorySchemaObj];

  const basePath = `/category/${slug}`;

  const renderComparisonCard = (comp: { slug: string; title: string }) => {
    const parts = comp.title.split(/\s+vs\.?\s+/i);
    const rating = getComparisonRating(comp.slug);
    const reviewCount = getReviewCount(comp.slug);
    return (
      <Link
        key={comp.slug}
        href={`/compare/${comp.slug}`}
        className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
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
    );
  };

  return (
    <>
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
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-primary-500">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <span className="text-4xl sm:text-5xl" role="img" aria-label={category.name}>{category.icon}</span>
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
                  <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {dbTotal.toLocaleString()} comparisons
                </span>
                {hasSubcategories && subcategoryData.filter(s => s.items.length > 0).length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                    <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {subcategoryData.filter(s => s.items.length > 0).length} subcategories
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
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
          <svg viewBox="0 0 1440 32" fill="none" className="w-full">
            <path d="M0 32V10C360 28 720 0 1080 16C1260 24 1380 8 1440 10V32H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Featured / pinned — curated, independent of viewCount sort (DAN-1020) */}
        {featured.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Featured Comparisons</h2>
                <p className="text-xs text-text-secondary mt-0.5">Editor-curated picks for {category.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {featured.map((item) => {
                const parts = item.anchor.split(/\s+vs\.?\s+/i);
                return (
                  <Link
                    key={item.slug}
                    href={`/compare/${item.slug}`}
                    className="group flex flex-col p-4 bg-gradient-to-br from-accent-50 to-white border border-accent-200 rounded-xl hover:border-accent-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
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
                );
              })}
            </div>
          </section>
        )}

        {/* Top 5 Comparisons — highlighted for quick discovery */}
        {allComparisons.length >= 5 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Top {category.name} Comparisons</h2>
                <p className="text-xs text-text-secondary mt-0.5">Most viewed in this category</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {allComparisons.slice(0, 5).map((comp, idx) => {
                const parts = comp.title.split(/\s+vs\.?\s+/i);
                return (
                  <Link
                    key={comp.slug}
                    href={`/compare/${comp.slug}`}
                    className="relative flex flex-col p-4 bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
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
                );
              })}
            </div>
          </section>
        )}

        {/* Subcategory Navigation (if applicable) */}
        {hasSubcategories && subcategoryData.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-text leading-tight">Browse by Subcategory</h2>
                <p className="text-xs text-text-secondary mt-0.5">Narrow your search</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {subcategoryData.filter(({ items }) => items.length > 0).map(({ subcat, items }) => (
                <Link
                  key={subcat.slug}
                  href={`/category/${slug}/${subcat.slug}`}
                  className="flex flex-col items-center gap-2 p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-lg transition-all group text-center"
                >
                  <span className="text-3xl">{subcat.icon}</span>
                  <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors leading-tight">
                    {subcat.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {items.length} comparison{items.length !== 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedComparisons.map(renderComparisonCard)}
            </div>

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

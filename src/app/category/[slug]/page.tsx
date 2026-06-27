import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, SITE_URL, getSubcategoriesForSlug } from "@/lib/utils/constants";
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
  return {
    title: `${category.name} Comparisons`,
    description: `Browse the best ${category.name.toLowerCase()} comparisons. Compare products, brands, and more side by side with expert analysis.`,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [ogImage] },
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

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
  ]);

  const basePath = `/category/${slug}`;

  const renderComparisonCard = (comp: { slug: string; title: string }) => {
    const parts = comp.title.split(/\s+vs\.?\s+/i);
    const rating = getComparisonRating(comp.slug);
    const reviewCount = getReviewCount(comp.slug);
    return (
      <Link
        key={comp.slug}
        href={`/compare/${comp.slug}`}
        className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
              {(parts[0] || "A").charAt(0)}
            </div>
            <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">{category.name}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <span className="text-3xl sm:text-4xl" role="img" aria-label={category.name}>{category.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                {category.name} Comparisons
              </h1>
              <p className="text-primary-200 mt-1.5 text-sm sm:text-base">
                {dbTotal} comparison{dbTotal !== 1 ? "s" : ""} available
                {hasSubcategories && subcategoryData.filter(s => s.items.length > 0).length > 0 && ` · ${subcategoryData.filter(s => s.items.length > 0).length} subcategories`}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
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
                    className="group flex flex-col p-4 bg-gradient-to-br from-accent-50 to-white border border-accent-200 rounded-xl hover:border-accent-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                          {(parts[0] || "A").charAt(0)}
                        </div>
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
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
                    className="relative flex flex-col p-4 bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl hover:border-primary-400 hover:shadow-md transition-all group"
                  >
                    <span className="absolute top-2 right-3 text-xs font-bold text-primary-400">
                      #{idx + 1}
                    </span>
                    <div className="flex -space-x-2 mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                        {(parts[0] || "A").charAt(0)}
                      </div>
                      <div className="w-8 h-8 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
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

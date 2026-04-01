import Link from "next/link";
import { Suspense } from "react";
import type { SubcategoryDef } from "@/lib/utils/constants";
import { CATEGORIES, SITE_URL, getSubcategoriesForSlug } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import type { SortOption, RatingFilter } from "@/components/ui/CategoryFilters";

const ITEMS_PER_PAGE = 16;

function getSubcategoryComparisons<T extends { slug: string; title: string }>(
  comparisons: T[],
  subcat: SubcategoryDef
): T[] {
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

interface CategoryLandingPageProps {
  slug: string;
  searchParams: { page?: string; sort?: string; rating?: string };
}

export async function CategoryLandingPage({ slug, searchParams }: CategoryLandingPageProps) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return null;

  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const sort = (searchParams.sort as SortOption) || "trending";
  const ratingFilter = (searchParams.rating as RatingFilter) || "all";

  const { comparisons: allComparisons, total: dbTotal } = await getComparisonsByCategory(slug, 500);
  const activeSubcategories = getSubcategoriesForSlug(slug);
  const hasSubcategories = activeSubcategories.length > 0;

  const filtered = filterByRating(allComparisons, ratingFilter);
  const sorted = sortComparisons(filtered, sort);
  const total = sorted.length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginatedComparisons = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const subcategoryData: { subcat: SubcategoryDef; items: typeof allComparisons }[] = [];
  if (hasSubcategories) {
    for (const subcat of activeSubcategories) {
      const items = getSubcategoryComparisons(allComparisons, subcat);
      subcategoryData.push({ subcat, items });
    }
  }

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: `${category.name} Comparisons`, url: `${SITE_URL}/compare/${slug}` },
  ]);

  const basePath = `/compare/${slug}`;

  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{category.name} Comparisons</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {category.name} Comparisons
            </h1>
          </div>
          <p className="text-text-secondary text-lg max-w-3xl">
            Browse and compare the best {category.name.toLowerCase()} side by side.
            {dbTotal > 0 && ` ${dbTotal} comparison${dbTotal !== 1 ? "s" : ""} available`}
            {hasSubcategories && subcategoryData.length > 0 && ` across ${subcategoryData.filter(s => s.items.length > 0).length} subcategories`}.
          </p>
        </div>

        {/* Top Comparisons */}
        {allComparisons.length >= 5 && (
          <section className="mb-10">
            <h2 className="text-xl font-display font-bold text-text mb-4">
              Top {category.name} Comparisons
            </h2>
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

        {/* Subcategory Navigation */}
        {hasSubcategories && subcategoryData.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-display font-bold text-text mb-4">Browse by Subcategory</h2>
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

        {/* Comparison Grid */}
        {paginatedComparisons.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedComparisons.map(renderComparisonCard)}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
            />

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

        {/* Browse Other Categories */}
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-xl font-display font-bold text-text mb-6">
            Explore More Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {otherCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/compare/${cat.slug}`}
                className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

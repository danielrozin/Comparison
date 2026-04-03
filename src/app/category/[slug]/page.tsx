import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, SITE_URL, getSubcategoriesForSlug } from "@/lib/utils/constants";
import type { SubcategoryDef } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { categoryPageSchema } from "@/lib/seo/schema";
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

  const schemaData = categoryPageSchema(
    {
      slug,
      name: category.name,
      description: `Browse the best ${category.name.toLowerCase()} comparisons side by side.`,
      icon: category.icon,
      comparisonCount: dbTotal,
      topComparisons: allComparisons.slice(0, 5).map((c) => ({ slug: c.slug, title: c.title, category: slug })),
      subcategories: activeSubcategories.map((s) => ({
        slug: s.slug,
        name: s.name,
        count: getSubcategoryComparisons(allComparisons, s).length,
      })),
    },
    new Date().toISOString(),
  );

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {category.name} Comparisons
            </h1>
            <p className="text-text-secondary mt-1">
              {dbTotal} comparison{dbTotal !== 1 ? "s" : ""} available
              {hasSubcategories && subcategoryData.length > 0 && ` across ${subcategoryData.filter(s => s.items.length > 0).length} subcategories`}
            </p>
          </div>
        </div>

        {/* Top 5 Comparisons — highlighted for quick discovery */}
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

        {/* Subcategory Navigation (if applicable) */}
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

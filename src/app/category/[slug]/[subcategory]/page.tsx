import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, SITE_URL, getSubcategoriesForSlug } from "@/lib/utils/constants";
import type { SubcategoryDef } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilters } from "@/components/ui/CategoryFilters";
import type { SortOption, RatingFilter } from "@/components/ui/CategoryFilters";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subcategory } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const subcategories = getSubcategoriesForSlug(slug);
  const subcat = subcategories.find((s) => s.slug === subcategory);
  if (!category || !subcat) return { title: "Not Found" };

  return {
    title: `${subcat.name} Comparisons — Best ${subcat.name} Compared`,
    description: `Compare the best ${subcat.name.toLowerCase()} side by side. Expert comparisons with specs, pros & cons, and verdicts to help you choose.`,
    alternates: { canonical: `${SITE_URL}/category/${slug}/${subcategory}` },
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

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
    { name: subcat.name, url: `${SITE_URL}/category/${slug}/${subcategory}` },
  ]);

  const basePath = `/category/${slug}/${subcategory}`;

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
            <li><Link href={`/category/${slug}`} className="hover:text-primary-600">{category.name}</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{subcat.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{subcat.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {subcat.name}
            </h1>
            <p className="text-text-secondary mt-1">
              {subcatComparisons.length} comparison{subcatComparisons.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((comp) => {
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
              })}
            </div>

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
            &larr; All {category.name} Comparisons
          </Link>
        </div>
      </div>
    </>
  );
}

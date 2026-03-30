import type { Metadata } from "next";
import Link from "next/link";
import { getTrendingComparisonsPaginated, type TrendingSortOption } from "@/lib/services/comparison-service";
import { TrendingCard } from "@/components/home/TrendingCard";
import { Pagination } from "@/components/ui/Pagination";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/utils/constants";
import { COMPARISON_CATEGORIES } from "@/lib/utils/categories";

export const metadata: Metadata = {
  title: "Trending Comparisons",
  description: "See the most popular comparisons right now — sports, countries, products, technology, and more.",
  alternates: { canonical: `${SITE_URL}/trending` },
};

const SORT_OPTIONS: { value: TrendingSortOption; label: string }[] = [
  { value: "views", label: "Most Viewed" },
  { value: "newest", label: "Newest" },
  { value: "score", label: "Highest Rated" },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  sports: "Sports",
  countries: "Countries",
  technology: "Technology",
  software: "Software",
  products: "Products",
  companies: "Companies",
  brands: "Brands",
  history: "History",
  economy: "Economy",
  military: "Military",
  science: "Science",
  entertainment: "Entertainment",
  automotive: "Automotive",
  general: "General",
};

function buildBasePath(category: string, sort: TrendingSortOption): string {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (sort !== "views") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/trending?${qs}` : "/trending";
}

function buildFilterUrl(category: string, sort: TrendingSortOption): string {
  // Filter URLs always reset to page 1
  return buildBasePath(category, sort);
}

interface TrendingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page || "1"), 10) || 1);
  const rawCategory = String(params.category || "all");
  const category = rawCategory === "all" || COMPARISON_CATEGORIES.includes(rawCategory as typeof COMPARISON_CATEGORIES[number])
    ? rawCategory
    : "all";
  const rawSort = String(params.sort || "views");
  const sort: TrendingSortOption = (["views", "newest", "score"] as const).includes(rawSort as TrendingSortOption)
    ? (rawSort as TrendingSortOption)
    : "views";

  const result = await getTrendingComparisonsPaginated({ page, pageSize: 20, category, sort });
  const basePath = buildBasePath(category, sort);

  const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Trending", url: `${SITE_URL}/trending` },
  ]);

  const startIndex = (page - 1) * 20;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">Trending</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">
          Trending Comparisons
        </h1>
        <p className="text-text-secondary mb-8">
          The most popular comparisons being viewed right now.
        </p>

        {/* Category Filter Tabs */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 min-w-max">
            {["all", ...COMPARISON_CATEGORIES].map((cat) => {
              const isActive = cat === category;
              return (
                <Link
                  key={cat}
                  href={buildFilterUrl(cat, sort)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sort + Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <p className="text-sm text-text-secondary">
            Showing {result.items.length > 0 ? startIndex + 1 : 0}–{startIndex + result.items.length} of {result.total} trending
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-text-secondary">
              Sort by:
            </label>
            {SORT_OPTIONS.map((opt) => {
              const isActive = opt.value === sort;
              return (
                <Link
                  key={opt.value}
                  href={buildFilterUrl(category, opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        {result.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.items.map((item, index) => (
              <TrendingCard key={item.slug} comparison={item} rank={startIndex + index + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-text-secondary">No comparisons found for this category.</p>
            <Link href="/trending" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
              View all trending
            </Link>
          </div>
        )}

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={result.totalPages} basePath={basePath} />
      </div>
    </>
  );
}

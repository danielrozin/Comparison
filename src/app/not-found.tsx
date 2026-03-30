import Link from "next/link";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { CATEGORIES } from "@/lib/utils/constants";

export default async function NotFound() {
  let trending: { slug: string; title: string; category: string }[] = [];
  try {
    trending = (await getTrendingComparisons(6)).map((t) => ({
      slug: t.slug,
      title: t.title,
      category: t.category,
    }));
  } catch {
    // Trending unavailable — show static fallback
  }

  return (
    <div className="min-h-[60vh] px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-primary-600">?</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-3">
            Comparison Not Found
          </h1>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            We couldn&apos;t find that comparison. Try searching below or browse
            our popular comparisons.
          </p>

          {/* Search box */}
          <form
            action="/search"
            method="GET"
            className="max-w-lg mx-auto mb-8"
          >
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                name="q"
                placeholder='Try "iPhone vs Samsung" or "Tesla vs BMW"...'
                className="w-full pl-12 pr-28 py-3.5 border border-border rounded-xl text-base focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/trending"
              className="px-6 py-3 bg-surface-alt text-text font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-border"
            >
              Browse Trending
            </Link>
          </div>
        </div>

        {/* Trending comparisons */}
        {trending.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-display font-bold text-text mb-4 text-center">
              Popular Comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trending.map((item) => {
                const parts = item.title.split(/\s+vs\.?\s+/i);
                return (
                  <Link
                    key={item.slug}
                    href={`/compare/${item.slug}`}
                    className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                        {(parts[0] || "A").charAt(0)}
                      </div>
                      <div className="w-9 h-9 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
                        {(parts[1] || "B").charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {item.category}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse categories */}
        <div className="text-center">
          <h2 className="text-lg font-display font-bold text-text mb-4">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 bg-surface-alt hover:bg-primary-50 border border-border hover:border-primary-300 rounded-full text-sm font-medium text-text-secondary hover:text-primary-700 transition-colors capitalize"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

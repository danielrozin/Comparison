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
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative text-center">
          {/* 404 display */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 mb-6 mx-auto">
            <span className="text-3xl font-black text-white">404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            Comparison Not Found
          </h1>
          <p className="text-primary-200 text-base sm:text-lg mb-8 max-w-md mx-auto">
            We couldn&apos;t find that comparison. Search below or browse popular ones.
          </p>

          {/* Search form */}
          <form action="/search" method="GET" role="search" className="max-w-lg mx-auto">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoComplete="off"
                type="search"
                inputMode="search"
                name="q"
                aria-label="Search comparisons"
                placeholder='Try "iPhone vs Samsung" or "Tesla vs BMW"...'
                className="w-full pl-12 pr-28 py-4 rounded-xl text-base bg-white text-text placeholder:text-text-secondary/50 focus:ring-4 focus:ring-primary-400/60 outline-none border-2 border-transparent focus:border-primary-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-150 hover:shadow-md text-sm"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/"
              className="px-6 py-2.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              <span aria-hidden="true">← </span>Go Home
            </Link>
            <Link
              href="/trending"
              className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm ring-1 ring-white/20"
            >
              Browse Trending
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Trending comparisons */}
        {trending.length > 0 && (
          <section aria-labelledby="popular-comparisons-heading" className="mb-10">
            <h2 id="popular-comparisons-heading" className="text-xl font-display font-bold text-text mb-4">
              Popular Comparisons
            </h2>
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none">
              {trending.map((item) => {
                const parts = item.title.split(/\s+vs\.?\s+/i);
                return (
                  <li key={item.slug}>
                  <Link
                    href={`/compare/${item.slug}`}
                    className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
                  >
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                        {(parts[0] || "A").charAt(0)}
                      </div>
                      <div className="w-9 h-9 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
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
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Browse categories */}
        <section aria-labelledby="browse-categories-heading">
          <h2 id="browse-categories-heading" className="text-xl font-display font-bold text-text mb-4">
            Browse by Category
          </h2>
          <ul role="list" className="flex flex-wrap gap-2 list-none">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-primary-50 border border-border hover:border-primary-300 rounded-full text-sm font-medium text-text-secondary hover:text-primary-700 transition-colors"
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.name}
              </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

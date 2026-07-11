"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { trackComparisonSearch } from "@/lib/utils/analytics";
import { saveSearchContext } from "@/lib/utils/recently-viewed";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<{ slug: string; title: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareWith, setCompareWith] = useState("");
  const [trending, setTrending] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/v1/trending?limit=8")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.comparisons)) {
          setTrending(data.comparisons.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      saveSearchContext(query);
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => {
          const items = data.results || [];
          setResults(items);
          setLoading(false);
          trackComparisonSearch(query, items.length > 0 ? "results" : "no_results");
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if it's a comparison query
    const patterns = [
      /^compare\s+(.+?)\s+(?:to|and|with|vs\.?)\s+(.+)$/i,
      /^differences?\s+between\s+(.+?)\s+and\s+(.+)$/i,
      /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
      /^(.+?)\s+(?:vs\.?|versus|compared\s+to|against)\s+(.+)$/i,
      /^(.+?)\s+[-–—]\s+(.+)$/,
      /^(.{2,40}?)\s+or\s+(.{2,40})$/i,
    ];

    for (const pattern of patterns) {
      const match = searchQuery.match(pattern);
      if (match && match[1].trim() && match[2].trim()) {
        const slug = `${slugify(match[1].trim())}-vs-${slugify(match[2].trim())}`;
        router.push(`/compare/${slug}`);
        return;
      }
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div>
      {/* Search Hero */}
      <section aria-labelledby="search-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="search-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#search-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200">
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
              <li className="text-white font-medium" aria-current="page">Search</li>
            </ol>
          </nav>
          <h1 id="search-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            Search Comparisons
          </h1>
          <p className="text-primary-200 text-sm sm:text-base mb-8">
            Find any comparison or type &ldquo;A vs B&rdquo; to generate one instantly.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} role="search">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoComplete="off"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try "Messi vs Ronaldo" or "Python vs JavaScript"...'
                aria-label="Search comparisons"
                className="w-full pl-12 pr-28 py-4 rounded-xl text-lg bg-white text-text placeholder:text-text-secondary/50 focus:ring-4 focus:ring-primary-400/60 outline-none border-2 border-transparent focus:border-primary-500 transition-all"
                autoFocus={!query}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-150 hover:shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

      {/* Results */}
      <div role="region" aria-label="Search results" aria-live="polite" aria-atomic="false">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading results…</span>
        </div>
      ) : query && results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          <ul role="list" className="space-y-3 list-none" aria-label="Search results">
          {results.map((result) => {
            const parts = result.title.split(/\s+vs\.?\s+/i);
            return (
              <li key={result.slug}>
              <Link
                href={`/compare/${result.slug}?from=${encodeURIComponent(query)}`}
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div className="relative flex flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm z-10">
                    {(parts[0] || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute left-6 top-0 w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm z-0">
                    {(parts[1] || "B").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 left-5 z-20 w-5 h-5 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white" aria-hidden="true">
                    <span className="text-[9px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <div className="flex-1 pl-4">
                  <p className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-text-secondary capitalize mt-0.5">{result.category}</p>
                </div>
                <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              </li>
            );
          })}
          </ul>
        </div>
      ) : query ? (
        <div className="space-y-6">
          {/* Entity page link — for single-entity searches */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">{query.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-semibold text-text">Looking for {query}?</p>
                <p className="text-sm text-text-secondary">View all comparisons featuring this entity</p>
              </div>
            </div>
            <Link
              href={`/entity/${slugify(query)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors text-sm"
            >
              View {query} comparisons
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick comparison builder */}
          <div className="text-center py-8 bg-surface-alt rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-text font-semibold mb-2">Compare &ldquo;{query}&rdquo; with something</p>
            <p className="text-text-secondary text-sm mb-4">
              Type what you&apos;d like to compare it against — we&apos;ll generate the comparison instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <span className="text-sm font-medium text-text">{query} vs</span>
              <label htmlFor="compare-with" className="sr-only">Compare {query} with</label>
              <input
                autoComplete="off"
                type="text"
                placeholder="Enter something to compare..."
                id="compare-with"
                aria-label={`Compare ${query} with`}
                value={compareWith}
                onChange={(e) => setCompareWith(e.target.value)}
                className="px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500 outline-none w-56"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && compareWith.trim()) {
                    router.push(`/compare/${slugify(query)}-vs-${slugify(compareWith.trim())}`);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (compareWith.trim()) {
                    router.push(`/compare/${slugify(query)}-vs-${slugify(compareWith.trim())}`);
                  }
                }}
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-150 hover:shadow-md hover:scale-105 active:scale-95"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 pt-2">
          {trending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Popular right now</p>
              </div>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
                {trending.map((item) => {
                  const parts = item.title.split(/\s+vs\.?\s+/i);
                  return (
                    <li key={item.slug}>
                    <Link
                      href={`/compare/${item.slug}`}
                      className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
                    >
                      <div className="relative flex flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-10">
                          {(parts[0] || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute left-5 top-0 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-0">
                          {(parts[1] || "B").charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 left-4 z-20 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white" aria-hidden="true">
                          <span className="text-[7px] font-black text-white leading-none">VS</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors truncate flex-1 pl-3">
                        {item.title}
                      </span>
                      <svg className="w-4 h-4 text-text-secondary group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <p className="text-center text-sm text-text-secondary py-4">
            Or type &ldquo;A vs B&rdquo; above to generate any comparison instantly.
          </p>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

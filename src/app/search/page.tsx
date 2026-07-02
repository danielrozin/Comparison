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
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
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
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try "Messi vs Ronaldo" or "Python vs JavaScript"...'
                aria-label="Search comparisons"
                className="w-full pl-12 pr-28 py-4 rounded-xl text-lg bg-white text-text placeholder:text-text-secondary/50 focus:ring-4 focus:ring-primary-400/30 outline-none border-2 border-transparent focus:border-primary-400/50 transition-all"
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
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : query && results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          {results.map((result) => {
            const parts = result.title.split(/\s+vs\.?\s+/i);
            return (
              <Link
                key={result.slug}
                href={`/compare/${result.slug}?from=${encodeURIComponent(query)}`}
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                    {(parts[0] || "A").charAt(0)}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                    {(parts[1] || "B").charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">{result.category}</p>
                </div>
                <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
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
              <input
                type="text"
                placeholder="Enter something to compare..."
                id="compare-with"
                className="px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none w-56"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = (e.target as HTMLInputElement).value.trim();
                    if (target) {
                      window.location.href = `/compare/${slugify(query)}-vs-${slugify(target)}`;
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("compare-with") as HTMLInputElement;
                  const target = input?.value.trim();
                  if (target) {
                    window.location.href = `/compare/${slugify(query)}-vs-${slugify(target)}`;
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
        <div className="text-center py-12 text-text-secondary">
          <p>Type a search term or comparison to get started.</p>
        </div>
      )}
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

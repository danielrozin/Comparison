"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { trackComparisonSearch } from "@/lib/utils/analytics";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<{ slug: string; title: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-bold text-text mb-6">Search Comparisons</h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search comparisons or type "A vs B" to create one...'
            className="w-full pl-12 pr-28 py-4 border border-border rounded-xl text-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </form>

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
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                    {(parts[0] || "A").charAt(0)}
                  </div>
                  <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
                    {(parts[1] || "B").charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">{result.category}</p>
                </div>
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold">{query.charAt(0).toUpperCase()}</span>
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick comparison builder */}
          <div className="text-center py-8 bg-surface-alt rounded-xl">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                onClick={() => {
                  const input = document.getElementById("compare-with") as HTMLInputElement;
                  const target = input?.value.trim();
                  if (target) {
                    window.location.href = `/compare/${slugify(query)}-vs-${slugify(target)}`;
                  }
                }}
                className="inline-block px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

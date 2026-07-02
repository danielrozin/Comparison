"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RecentSearch {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  searchedAt: string;
  generated: boolean;
}

export function RecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recent")
      .then((r) => r.json())
      .then((data) => {
        setSearches(data.searches || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || searches.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
            Just Compared
          </h2>
          <p className="text-text-secondary mt-0.5 text-sm">
            Fresh comparisons our community is exploring right now
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {searches.slice(0, 9).map((search) => {
          const parts = search.title.split(/\s+vs\.?\s+/i);
          const timeAgo = getTimeAgo(search.searchedAt);

          return (
            <Link
              key={search.slug}
              href={`/compare/${search.slug}`}
              className="group flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Entity avatars */}
              <div className="flex -space-x-2 flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                  {(parts[0] || "A").charAt(0).toUpperCase()}
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                  {(parts[1] || "B").charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                  {search.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded capitalize">
                    {search.subcategory}
                  </span>
                  <span className="text-[10px] text-text-secondary">{timeAgo}</span>
                  {search.generated && (
                    <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      AI
                    </span>
                  )}
                </div>
              </div>

              <svg className="w-4 h-4 text-text-secondary group-hover:text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Tags cloud */}
      {searches.length > 0 && (
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 mb-2.5">Trending topics</p>
          <div className="flex flex-wrap gap-2">
            {getUniqueTags(searches).slice(0, 15).map((tag, i) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all hover:-translate-y-0.5 capitalize ${
                  i < 3
                    ? "bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border border-primary-200/60 hover:from-primary-200 hover:to-accent-200"
                    : "bg-surface-alt text-text-secondary border border-border hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200"
                }`}
              >
                {i < 3 && <span className="mr-1 text-primary-400">#</span>}{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getUniqueTags(searches: RecentSearch[]): string[] {
  const tagCount = new Map<string, number>();
  for (const s of searches) {
    for (const tag of s.tags) {
      if (tag.length > 2) tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

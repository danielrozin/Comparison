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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
            Just Compared
          </h2>
          <p className="text-text-secondary mt-1 text-sm">
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
              className="group flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
            >
              {/* Entity avatars */}
              <div className="flex -space-x-2 flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                  {(parts[0] || "A").charAt(0).toUpperCase()}
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-accent-50 to-accent-400/30 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
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
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      AI
                    </span>
                  )}
                </div>
              </div>

              <svg className="w-4 h-4 text-text-secondary group-hover:text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Tags cloud */}
      {searches.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {getUniqueTags(searches).slice(0, 15).map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-surface-alt text-text-secondary text-xs font-medium rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors capitalize"
            >
              {tag}
            </Link>
          ))}
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

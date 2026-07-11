"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentlyViewed, type RecentlyViewedItem } from "@/lib/utils/recently-viewed";

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 id="recently-viewed-heading" className="text-xl sm:text-2xl font-display font-bold text-text">
            Your Recently Viewed
          </h2>
          <p className="text-text-secondary mt-0.5 text-sm">
            Pick up where you left off
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {items.slice(0, 8).map((item) => {
          const parts = item.title.split(/\s+vs\.?\s+/i);
          const timeAgo = formatTimeAgo(item.viewedAt);

          return (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="group flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[260px] sm:min-w-0 sm:flex-1 sm:basis-[calc(33.333%-0.75rem)] sm:max-w-[calc(33.333%-0.5rem)]"
            >
              <div className="relative flex-shrink-0 h-9" style={{ width: "50px" }}>
                <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-10">
                  {(parts[0] || "A").charAt(0).toUpperCase()}
                </div>
                <div className="absolute left-4 top-0 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-0">
                  {(parts[1] || "B").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 left-[14px] z-20 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white">
                  <span className="text-[6px] font-black text-white leading-none">VS</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded capitalize">
                    {item.category}
                  </span>
                  <span className="text-xs text-text-secondary">{timeAgo}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

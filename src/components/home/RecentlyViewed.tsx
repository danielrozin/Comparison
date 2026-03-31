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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-text">
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
              className="group flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all min-w-[260px] sm:min-w-0 sm:flex-1 sm:basis-[calc(33.333%-0.75rem)] sm:max-w-[calc(33.333%-0.5rem)]"
            >
              <div className="flex -space-x-2 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                  {(parts[0] || "A").charAt(0).toUpperCase()}
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-accent-50 to-accent-400/30 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
                  {(parts[1] || "B").charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded capitalize">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-text-secondary">{timeAgo}</span>
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

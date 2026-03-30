"use client";

import Link from "next/link";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

interface Comparison {
  slug: string;
  title: string;
  category: string | null;
}

/**
 * "You might also compare" section — shows contextually relevant comparisons
 * involving one or both entities from the current page. Displayed as a
 * horizontally scrollable strip on mobile, grid on desktop.
 */
export function YouMightAlsoCompare({
  comparisons,
  sourceSlug,
}: {
  comparisons: Comparison[];
  sourceSlug: string;
}) {
  if (comparisons.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-lg font-display font-bold text-text mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        You Might Also Compare
      </h2>

      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible sm:pb-0">
        {comparisons.slice(0, 6).map((comp) => {
          const parts = comp.title.split(/\s+vs\.?\s+/i);
          return (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              onClick={() => trackRelatedComparisonClick(sourceSlug, comp.slug)}
              className="flex-shrink-0 w-[280px] sm:w-auto snap-start flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className="flex -space-x-2 flex-shrink-0">
                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                  {(parts[0] || "A").charAt(0)}
                </div>
                <div className="w-9 h-9 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
                  {(parts[1] || "B").charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-primary-700 transition-colors">
                  {comp.title}
                </p>
                {comp.category && (
                  <p className="text-xs text-text-secondary capitalize">{comp.category}</p>
                )}
              </div>
              <svg className="w-4 h-4 text-text-secondary group-hover:text-primary-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

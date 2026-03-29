"use client";

import Link from "next/link";
import type { RelatedComparison } from "@/types";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

function ComparisonCard({
  comp,
  sourceSlug,
}: {
  comp: RelatedComparison;
  sourceSlug: string;
}) {
  const parts = comp.title.split(/\s+vs\.?\s+/i);
  return (
    <Link
      href={`/compare/${comp.slug}`}
      onClick={() => trackRelatedComparisonClick(sourceSlug, comp.slug)}
      className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group shrink-0 lg:shrink"
    >
      <div className="flex -space-x-2">
        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
          {(parts[0] || "A").charAt(0)}
        </div>
        <div className="w-7 h-7 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
          {(parts[1] || "B").charAt(0)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text truncate group-hover:text-primary-700 transition-colors">
          {comp.title}
        </p>
        {comp.category && (
          <p className="text-xs text-text-secondary capitalize">
            {comp.category}
          </p>
        )}
      </div>
      <svg
        className="w-4 h-4 text-text-secondary group-hover:text-primary-600 transition-colors flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}

export function RelatedComparisonsSidebar({
  comparisons,
  sourceSlug,
}: {
  comparisons: RelatedComparison[];
  sourceSlug: string;
}) {
  if (comparisons.length === 0) return null;

  const items = comparisons.slice(0, 6);

  return (
    <>
      {/* Mobile: horizontal scroll strip */}
      <div className="lg:hidden px-4 sm:px-6 py-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Related Comparisons
        </h3>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {items.map((comp) => (
            <div key={comp.slug} className="snap-start min-w-[260px] max-w-[300px]">
              <ComparisonCard comp={comp} sourceSlug={sourceSlug} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block w-[320px] shrink-0">
        <div className="sticky top-24 space-y-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Related Comparisons
          </h3>
          {items.map((comp) => (
            <ComparisonCard
              key={comp.slug}
              comp={comp}
              sourceSlug={sourceSlug}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

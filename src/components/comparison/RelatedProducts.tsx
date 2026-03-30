"use client";

import Link from "next/link";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

interface EntityLink {
  name: string;
  slug: string;
  comparisonCount?: number;
}

/**
 * "Related Products" component — shows entities that frequently appear
 * alongside the current entities in comparisons. Links to entity pages
 * so users can explore all comparisons for a given entity.
 */
export function RelatedProducts({
  entities,
  sourceSlug,
  category,
}: {
  entities: EntityLink[];
  sourceSlug: string;
  category?: string | null;
}) {
  if (entities.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-lg font-display font-bold text-text mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Related Products
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:overflow-x-visible sm:pb-0">
        {entities.slice(0, 8).map((entity) => (
          <Link
            key={entity.slug}
            href={`/entity/${entity.slug}`}
            onClick={() => trackRelatedComparisonClick(sourceSlug, entity.slug)}
            className="flex-shrink-0 w-[200px] sm:w-auto snap-start flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-accent-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-700">
                {entity.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate group-hover:text-primary-700 transition-colors">
                {entity.name}
              </p>
              {entity.comparisonCount != null && (
                <p className="text-xs text-text-secondary">
                  {entity.comparisonCount} comparison{entity.comparisonCount !== 1 ? "s" : ""}
                </p>
              )}
              {category && !entity.comparisonCount && (
                <p className="text-xs text-text-secondary capitalize">{category}</p>
              )}
            </div>
            <svg className="w-4 h-4 text-text-secondary group-hover:text-primary-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}

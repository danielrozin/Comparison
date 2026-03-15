import Link from "next/link";
import type { RelatedComparison } from "@/types";

export function RelatedComparisons({
  comparisons,
}: {
  comparisons: RelatedComparison[];
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Related Comparisons
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {comparisons.map((comp) => {
          const parts = comp.title.split(/\s+vs\.?\s+/i);
          return (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                  {(parts[0] || "A").charAt(0)}
                </div>
                <div className="w-8 h-8 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
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

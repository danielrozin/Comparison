"use client";

import Link from "next/link";

interface ComparisonWidgetProps {
  slug: string;
  title?: string;
}

export function ComparisonWidget({ slug, title }: ComparisonWidgetProps) {
  const displayTitle = title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const parts = displayTitle.split(/\s+vs\.?\s+/i);

  return (
    <div className="my-6 p-5 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
          Detailed Comparison
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex -space-x-2">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
            {(parts[0] || "A").charAt(0).toUpperCase()}
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-700 ring-2 ring-white">
            {(parts[1] || "B").charAt(0).toUpperCase()}
          </div>
        </div>
        <h4 className="text-lg font-bold text-text">{displayTitle}</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        See the full side-by-side comparison with specs, pros & cons, and our verdict.
      </p>
      <Link
        href={`/compare/${slug}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        View Full Comparison
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  );
}

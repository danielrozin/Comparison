import Link from "next/link";
import type { TrendingComparison } from "@/types";

const RANK_COLORS = [
  "from-amber-400 to-orange-500",   // #1
  "from-gray-300 to-gray-400",      // #2
  "from-amber-600 to-amber-700",    // #3
];

const RANK_BORDERS = [
  "border-amber-200 hover:border-amber-300",  // #1
  "border-border hover:border-primary-200",    // #2
  "border-orange-200 hover:border-orange-300", // #3
];

export function TrendingCard({
  comparison,
  rank,
}: {
  comparison: TrendingComparison;
  rank: number;
}) {
  const parts = comparison.title.split(/\s+vs\.?\s+/i);
  const entityA = parts[0] || comparison.title;
  const entityB = parts[1] || "";
  const isTopThree = rank <= 3;
  const rankGradient = isTopThree ? RANK_COLORS[rank - 1] : null;
  const borderClass = isTopThree ? RANK_BORDERS[rank - 1] : "border-border hover:border-primary-200";

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className={`group relative flex flex-col bg-white border ${borderClass} rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
    >
      <h3 className="sr-only">{comparison.title}</h3>
      {/* Top color strip */}
      <div className={`h-1 w-full ${
        isTopThree
          ? `bg-gradient-to-r ${rankGradient}`
          : "bg-gradient-to-r from-primary-400 to-accent-400"
      }`} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rank badge + category */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
              rankGradient
                ? `bg-gradient-to-br ${rankGradient} text-white shadow-sm`
                : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 shadow-sm"
            }`}
          >
            {rank}
          </div>
          {rank === 1 && (
            <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          )}
          {rank === 2 && (
            <svg className="w-3.5 h-3.5 text-text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {rank === 3 && (
            <svg className="w-3.5 h-3.5 text-amber-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider truncate ml-auto">
            {comparison.category}
          </span>
        </div>

        {/* Entity A vs Entity B row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-1 ring-white shadow-sm flex-shrink-0">
                {entityA.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors truncate">
                {entityA}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-1 ring-white shadow-sm flex-shrink-0">
                {entityB.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors truncate">
                {entityB}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
            <span className="text-xs font-black text-white leading-none">VS</span>
          </div>
        </div>

        {/* Category — NOT a view count. `viewCount` is seed data, not analytics,
            so it must never be rendered as traffic (DAN-2037). */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto pt-2 border-t border-border/50">
          <svg className="w-3 h-3 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="truncate capitalize">{comparison.category}</span>
          {isTopThree ? (
            <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Trending
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-semibold text-primary-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
              Compare
              <svg className="w-2.5 h-2.5 sm:group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>

        {/* CTA — always visible on mobile (no hover on touch), hover-expand on desktop */}
        <div className="mt-2 sm:overflow-hidden sm:max-h-0 sm:group-hover:max-h-8 sm:transition-all sm:duration-200 sm:mt-0 sm:group-hover:mt-2">
          <div className={`flex items-center justify-center gap-1 text-xs font-semibold text-white rounded-lg py-1.5 ${
            isTopThree
              ? `bg-gradient-to-r ${rankGradient}`
              : "bg-gradient-to-r from-primary-600 to-accent-600"
          }`}>
            View Comparison
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { TrendingComparison } from "@/types";

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

const RANK_COLORS = [
  "from-amber-400 to-orange-500",   // #1
  "from-gray-400 to-gray-500",      // #2
  "from-amber-700 to-amber-800",    // #3
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

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group relative flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all duration-200"
    >
      {/* Top color strip */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5 flex flex-col flex-1">
        {/* Rank badge + category */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
              rankGradient
                ? `bg-gradient-to-br ${rankGradient} text-white shadow-sm`
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            {rank}
          </div>
          <span className="text-[11px] font-medium text-primary-600 uppercase tracking-wider truncate">
            {comparison.category}
          </span>
        </div>

        {/* Entity A vs Entity B visual row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors truncate">
                {entityA}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-500 flex-shrink-0" />
              <span className="font-semibold text-sm text-text group-hover:text-primary-700 transition-colors truncate">
                {entityB}
              </span>
            </div>
          </div>
          {/* VS pill */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-sm">
            <span className="text-[9px] font-black text-white leading-none">VS</span>
          </div>
        </div>

        {/* View count */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto">
          <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {formatViews(comparison.viewCount)} views
        </div>
      </div>
    </Link>
  );
}

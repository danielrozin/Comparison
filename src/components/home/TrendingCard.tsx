import Link from "next/link";
import type { TrendingComparison } from "@/types";

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

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

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group relative flex flex-col bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
    >
      {/* Rank badge */}
      <div
        className={`absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
          isTopThree
            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm"
            : "bg-gray-100 text-gray-500 border border-gray-200"
        }`}
      >
        {rank}
      </div>

      {/* Category */}
      <span className="text-[11px] font-medium text-primary-600 uppercase tracking-wider mb-3">
        {comparison.category}
      </span>

      {/* Title — clean text only */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
          {entityA}
        </span>
        <span className="flex-shrink-0 text-[10px] font-bold text-text-secondary bg-gray-100 px-1.5 py-0.5 rounded">
          vs
        </span>
        <span className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
          {entityB}
        </span>
      </div>

      {/* View count */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-auto">
        <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {formatViews(comparison.viewCount)}
      </div>
    </Link>
  );
}

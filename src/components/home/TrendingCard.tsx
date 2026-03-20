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
  // Split title at "vs"
  const parts = comparison.title.split(/\s+vs\.?\s+/i);
  const entityA = parts[0] || comparison.title;
  const entityB = parts[1] || "";
  const isTopThree = rank <= 3;

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group relative flex flex-col bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/50 group-hover:to-accent-50/50 transition-all duration-300 pointer-events-none" />

      {/* Rank badge */}
      <div
        className={`absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
          isTopThree
            ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-300/50 shadow-md animate-flame"
            : "bg-primary-600 text-white"
        }`}
      >
        {isTopThree && (
          <span className="absolute -top-1 -right-1 text-[10px]">🔥</span>
        )}
        {rank}
      </div>

      {/* Category chip */}
      <span className="relative inline-flex self-start px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full mb-3">
        {comparison.category}
      </span>

      {/* VS Display */}
      <div className="relative flex items-center gap-3 mb-3">
        <div className="flex-1 text-right">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center ml-auto mb-1">
            <span className="text-primary-700 font-bold text-xs">
              {entityA.charAt(0)}
            </span>
          </div>
          <p className="text-sm font-semibold text-text truncate">{entityA}</p>
        </div>

        <div className="flex-shrink-0">
          <span className="relative text-xs font-bold text-white bg-gradient-to-br from-primary-500 to-accent-500 px-2.5 py-1 rounded-md shadow-sm group-hover:shadow-md group-hover:shadow-primary-300/50 transition-shadow duration-300">
            VS
          </span>
        </div>

        <div className="flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-50 to-accent-400/20 rounded-full flex items-center justify-center mr-auto mb-1">
            <span className="text-accent-600 font-bold text-xs">
              {entityB.charAt(0)}
            </span>
          </div>
          <p className="text-sm font-semibold text-text truncate">{entityB}</p>
        </div>
      </div>

      {/* View count */}
      <div className="relative flex items-center gap-1 text-xs text-text-secondary mt-auto pt-2 border-t border-border/50">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {formatViews(comparison.viewCount)} views
      </div>
    </Link>
  );
}

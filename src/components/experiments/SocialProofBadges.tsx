"use client";

import { useExperiment } from "@/lib/experiments";

function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

export function ViewCount({ count }: { count: number }) {
  const { variant, isLoading } = useExperiment("social-proof-elements");

  if (isLoading || variant !== "treatment") return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
      <svg
        className="w-4 h-4 opacity-60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span>{formatViews(count)} views</span>
    </div>
  );
}

export function TrendingBadge({ viewCount }: { viewCount: number }) {
  const { variant, isLoading } = useExperiment("social-proof-elements");

  if (isLoading || variant !== "treatment") return null;

  // Only show trending badge for comparisons with decent traffic
  if (viewCount < 100) return null;

  const isFire = viewCount >= 10_000;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isFire
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
          clipRule="evenodd"
        />
      </svg>
      {isFire ? "Hot" : "Trending"}
    </span>
  );
}

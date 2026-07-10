import type { CitationStats } from "@/types";

interface CitationStatsBarProps {
  stats: CitationStats;
}

export function CitationStatsBar({ stats }: CitationStatsBarProps) {
  const items: { label: string; value: string; icon: React.ReactNode }[] = [];

  if (stats.sourceCount > 0) {
    items.push({
      label: "Sources",
      value: String(stats.sourceCount),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    });
  }
  if (stats.dataPointCount > 0) {
    items.push({
      label: "Data Points",
      value: String(stats.dataPointCount),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    });
  }
  if (stats.reviewsAnalyzed != null && stats.reviewsAnalyzed > 0) {
    items.push({
      label: "Reviews",
      value: stats.reviewsAnalyzed >= 1000
        ? `${(stats.reviewsAnalyzed / 1000).toFixed(1)}k`
        : String(stats.reviewsAnalyzed),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    });
  }
  if (stats.preferencePercent != null && stats.preferenceEntity) {
    items.push({
      label: `Prefer ${stats.preferenceEntity}`,
      value: `${stats.preferencePercent}%`,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
    });
  }

  if (items.length === 0) return null;

  const researchDate = new Date(stats.lastResearched).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section aria-label="Data sources and review status" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="relative bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-indigo-50/80 border border-indigo-100 rounded-xl overflow-hidden">
        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-blue-500" />

        <div className="pl-4 pr-4 py-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {/* Shield badge */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider hidden sm:inline">Research-backed</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-indigo-200 hidden sm:block" />

            {/* Stat pills */}
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-white/90 border border-indigo-100 rounded-full px-3 py-1 text-xs shadow-sm hover:shadow-md hover:scale-105 transition-all duration-150 cursor-default">
                  <span className="text-indigo-500 flex-shrink-0">{item.icon}</span>
                  <span className="font-bold text-indigo-900">{item.value}</span>
                  <span className="text-indigo-400">{item.label}</span>
                </div>
                {i < items.length - 1 && (
                  <span className="text-indigo-200 text-xs hidden sm:inline" aria-hidden="true">·</span>
                )}
              </div>
            ))}

            {/* Research date */}
            <time dateTime={new Date(stats.lastResearched).toISOString()} className="text-[10px] text-indigo-400/80 ml-auto hidden sm:block whitespace-nowrap">
              Updated {researchDate}
            </time>
          </div>

          {/* Source attribution row */}
          {stats.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-2 text-[10px] text-indigo-400 border-t border-indigo-100/80 pt-2">
              <span className="font-semibold text-indigo-500 mr-0.5">Sources:</span>
              {stats.sources.slice(0, 5).map((source, i) => (
                <span key={i}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline decoration-indigo-200 hover:text-indigo-600 hover:decoration-indigo-400 transition-colors"
                    >
                      {source.name}<span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    source.name
                  )}
                  {i < Math.min(stats.sources.length, 5) - 1 && <span className="mx-0.5 text-indigo-200">·</span>}
                </span>
              ))}
              {stats.sources.length > 5 && (
                <span className="text-indigo-300">+{stats.sources.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import type React from "react";

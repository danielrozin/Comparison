import type { CitationStats } from "@/types";

interface CitationStatsBarProps {
  stats: CitationStats;
}

export function CitationStatsBar({ stats }: CitationStatsBarProps) {
  const items: { label: string; value: string }[] = [];

  if (stats.sourceCount > 0) {
    items.push({ label: "Sources", value: String(stats.sourceCount) });
  }
  if (stats.dataPointCount > 0) {
    items.push({ label: "Data Points", value: String(stats.dataPointCount) });
  }
  if (stats.reviewsAnalyzed != null && stats.reviewsAnalyzed > 0) {
    items.push({
      label: "Reviews Analyzed",
      value: stats.reviewsAnalyzed >= 1000
        ? `${(stats.reviewsAnalyzed / 1000).toFixed(1)}k`
        : String(stats.reviewsAnalyzed),
    });
  }
  if (stats.preferencePercent != null && stats.preferenceEntity) {
    items.push({
      label: `Prefer ${stats.preferenceEntity}`,
      value: `${stats.preferencePercent}%`,
    });
  }

  if (items.length === 0) return null;

  const researchDate = new Date(stats.lastResearched).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="font-bold text-gray-900">{item.value}</span>
              <span className="text-gray-500">{item.label}</span>
              {i < items.length - 1 && (
                <span className="text-gray-300 ml-2 hidden sm:inline" aria-hidden="true">|</span>
              )}
            </div>
          ))}
          <span className="text-[10px] text-gray-400 ml-1">
            Researched {researchDate}
          </span>
        </div>

        {/* Source attribution row */}
        {stats.sources.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1 mt-1.5 text-[10px] text-gray-400">
            <span>Sources:</span>
            {stats.sources.slice(0, 5).map((source, i) => (
              <span key={i}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline hover:text-gray-600 transition-colors"
                  >
                    {source.name}
                  </a>
                ) : (
                  source.name
                )}
                {i < Math.min(stats.sources.length, 5) - 1 && ", "}
              </span>
            ))}
            {stats.sources.length > 5 && (
              <span>+{stats.sources.length - 5} more</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface CitationStatsBarProps {
  stats: {
    totalSources?: number;
    totalCitations?: number;
    lastUpdated?: string;
    dataPoints?: number;
  };
}

export function CitationStatsBar({ stats }: CitationStatsBarProps) {
  const items = [
    stats.totalSources && { label: "Sources", value: stats.totalSources },
    stats.totalCitations && { label: "Citations", value: stats.totalCitations },
    stats.dataPoints && { label: "Data Points", value: stats.dataPoints },
    stats.lastUpdated && { label: "Updated", value: new Date(stats.lastUpdated).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
  ].filter(Boolean) as { label: string; value: string | number }[];

  if (items.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-text-secondary" aria-label="Comparison data statistics">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="font-semibold text-text">{item.value}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

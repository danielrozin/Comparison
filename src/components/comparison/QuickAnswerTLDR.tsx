import type { ComparisonPageData } from "@/types";

interface QuickAnswerTLDRProps {
  comparison: ComparisonPageData;
}

/**
 * Compute citation/data density stats from comparison data.
 * Counts: attributes with values, key differences, FAQs, pros/cons, numeric data points.
 */
function computeCitationStats(comparison: ComparisonPageData) {
  const numericDataPoints = comparison.attributes.reduce(
    (count, attr) => count + attr.values.filter((v) => v.valueNumber != null).length,
    0
  );
  const totalAttributes = comparison.attributes.length;
  const totalKeyDiffs = comparison.keyDifferences.length;
  const totalFaqs = comparison.faqs.length;
  const totalPros = comparison.entities.reduce((c, e) => c + (e.pros?.length || 0), 0);
  const totalCons = comparison.entities.reduce((c, e) => c + (e.cons?.length || 0), 0);

  const totalDataPoints = totalAttributes * 2 + totalKeyDiffs + totalFaqs + totalPros + totalCons;
  const totalFactsCompared = totalAttributes + totalKeyDiffs;

  return { numericDataPoints, totalDataPoints, totalFactsCompared, totalAttributes, totalKeyDiffs, totalFaqs };
}

export function QuickAnswerTLDR({ comparison }: QuickAnswerTLDRProps) {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  if (!entityA || !entityB) return null;

  const text = comparison.shortAnswer || comparison.verdict;
  if (!text) return null;

  const stats = computeCitationStats(comparison);

  // Build bullet-point key takeaways from top 3 key differences
  const topDiffs = comparison.keyDifferences.slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto">
        {/* Header with data density badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-semibold text-emerald-900 text-sm uppercase tracking-wide">
              Quick Answer
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700">
            <span className="inline-flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {stats.totalDataPoints} data points
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
              {stats.totalFactsCompared} facts compared
            </span>
          </div>
        </div>

        {/* TL;DR text */}
        <p className="text-emerald-900 leading-relaxed text-sm sm:text-base mb-3">
          {text}
        </p>

        {/* Key takeaways bullets */}
        {topDiffs.length > 0 && (
          <ul className="space-y-1.5">
            {topDiffs.map((diff, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="flex-shrink-0 mt-0.5">
                  {diff.winner === "a" ? (
                    <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center leading-5 text-center">{entityA.name.charAt(0)}</span>
                  ) : diff.winner === "b" ? (
                    <span className="inline-block w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center leading-5 text-center">{entityB.name.charAt(0)}</span>
                  ) : (
                    <span className="inline-block w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center leading-5 text-center">=</span>
                  )}
                </span>
                <span>
                  <strong>{diff.label}:</strong> {entityA.name} ({diff.entityAValue}) vs {entityB.name} ({diff.entityBValue})
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Stats footer */}
        <div className="mt-3 pt-3 border-t border-emerald-200 flex flex-wrap gap-3 text-xs text-emerald-600">
          <span>Based on {stats.totalAttributes} attributes</span>
          <span className="hidden sm:inline">|</span>
          <span>{stats.numericDataPoints} numeric comparisons</span>
          <span className="hidden sm:inline">|</span>
          <span>{stats.totalFaqs} FAQs answered</span>
        </div>
      </div>
    </section>
  );
}

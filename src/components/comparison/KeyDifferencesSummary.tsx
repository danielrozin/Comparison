import type { KeyDifference, ComparisonEntityData } from "@/types";

function CategoryIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();

  if (lower.includes("price") || lower.includes("cost") || lower.includes("gdp") || lower.includes("economy")) {
    return (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (lower.includes("performance") || lower.includes("speed") || lower.includes("processor") || lower.includes("battery")) {
    return (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    );
  }
  if (lower.includes("display") || lower.includes("screen") || lower.includes("camera") || lower.includes("design")) {
    return (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (lower.includes("storage") || lower.includes("memory") || lower.includes("weight") || lower.includes("size") || lower.includes("area") || lower.includes("population") || lower.includes("height")) {
    return (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }
  if (lower.includes("sound") || lower.includes("audio")) {
    return (
      <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3.536-3.536M12 18l3.536-3.536M6.464 8.464a5 5 0 000 7.072" />
      </svg>
    );
  }

  return (
    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}


export function KeyDifferencesSummary({
  differences,
  entityA,
  entityB,
}: {
  differences: KeyDifference[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const top3 = differences.slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <section aria-labelledby="key-diff-summary-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-xl p-4 sm:p-5 overflow-hidden">
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 id="key-diff-summary-heading" className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
            Key Differences at a Glance
          </h3>
        </div>

        <ul role="list" className="space-y-2 list-none">
          {top3.map((diff) => {
            const winnerName =
              diff.winner === "a"
                ? entityA.name
                : diff.winner === "b"
                ? entityB.name
                : null;
            const winnerVal = diff.winner === "a" ? diff.entityAValue : diff.entityBValue;
            const loserVal = diff.winner === "a" ? diff.entityBValue : diff.entityAValue;

            return (
              <li key={diff.label} className="flex items-center gap-2.5 text-sm">
                <span className="w-7 h-7 flex-shrink-0 bg-white border border-indigo-100 rounded-lg flex items-center justify-center shadow-sm">
                  <CategoryIcon label={diff.label} />
                </span>
                <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-text">{diff.label}:</span>
                  {winnerName ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200/60">
                        ✓ {winnerName} wins
                      </span>
                      <span className="text-text-secondary text-xs">({winnerVal} vs {loserVal})</span>
                    </>
                  ) : (
                    <span className="text-text-secondary">{diff.entityAValue} vs {diff.entityBValue}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {differences.length > 3 && (
          <a
            href="#key-differences"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded"
          >
            See all {differences.length} differences
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}

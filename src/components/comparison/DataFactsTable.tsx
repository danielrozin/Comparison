import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

interface DataFactsTableProps {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

export function DataFactsTable({ attributes, entityA, entityB }: DataFactsTableProps) {
  // Filter to only numeric attributes with real values — these are the "hard facts"
  const numericAttrs = attributes.filter(
    (attr) =>
      attr.dataType === "number" &&
      attr.values.some((v) => v.valueNumber != null)
  );

  if (numericAttrs.length === 0) return null;

  return (
    <section id="key-facts" aria-labelledby="key-facts-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-28">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 id="key-facts-heading" className="text-2xl font-display font-bold text-text">Key Facts &amp; Figures</h2>
            <p className="text-xs text-text-secondary mt-0.5">{numericAttrs.length} numeric metric{numericAttrs.length !== 1 ? "s" : ""} compared</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm" tabIndex={0} role="region" aria-label="Key facts table — scroll to see all columns">
          <table className="w-full text-sm" aria-label={`${entityA.name} vs ${entityB.name} — key numeric facts`}>
            <thead>
              <tr className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Metric
                </th>
                <th scope="col" className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  {entityA.name}
                </th>
                <th scope="col" className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  {entityB.name}
                </th>
                <th scope="col" className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider w-20">
                  Ratio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {numericAttrs.map((attr) => {
                const valA = attr.values.find((v) => v.entityId === entityA.id);
                const valB = attr.values.find((v) => v.entityId === entityB.id);
                // Fallback: use position-based matching
                const aVal = valA || attr.values[0];
                const bVal = valB || attr.values[1];
                const numA = aVal?.valueNumber;
                const numB = bVal?.valueNumber;

                let diff: string | null = null;
                let diffColor = "text-text-secondary";
                if (numA != null && numB != null && numB !== 0) {
                  const pct = ((numA - numB) / Math.abs(numB)) * 100;
                  if (Math.abs(pct) >= 1) {
                    const sign = pct > 0 ? "+" : "";
                    diff = `${sign}${pct.toFixed(0)}%`;
                    if (attr.higherIsBetter === true) {
                      diffColor = pct > 0 ? "text-green-600" : "text-red-500";
                    } else if (attr.higherIsBetter === false) {
                      diffColor = pct < 0 ? "text-green-600" : "text-red-500";
                    }
                  }
                }

                const aWins = aVal?.winner === true;
                const bWins = bVal?.winner === true;

                const rowIdx = numericAttrs.indexOf(attr);
                return (
                  <tr key={attr.id} className={`group/row hover:bg-primary-50/40 hover:shadow-[inset_2px_0_0_0_rgba(99,102,241,0.15)] transition-all duration-150 ${rowIdx % 2 === 1 ? "bg-surface-alt/50" : ""}`}>
                    <th scope="row" className="px-4 py-3 text-text font-medium text-left">
                      {attr.name}
                      {attr.unit && (
                        <span className="text-text-secondary text-xs ml-1">({attr.unit})</span>
                      )}
                    </th>
                    <td className={`px-4 py-3 text-center tabular-nums ${aWins ? "font-bold text-green-700 bg-green-50/60" : "text-text-secondary"}`}>
                      <span className="inline-flex items-center gap-1">
                        {aVal?.valueText || (numA != null ? formatNumber(numA) : "—")}
                        {aWins && <WinnerBadge />}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-center tabular-nums ${bWins ? "font-bold text-green-700 bg-green-50/60" : "text-text-secondary"}`}>
                      <span className="inline-flex items-center gap-1">
                        {bVal?.valueText || (numB != null ? formatNumber(numB) : "—")}
                        {bWins && <WinnerBadge />}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-24">
                      {numA != null && numB != null ? (
                        <div className="flex flex-col items-center gap-1" aria-hidden="true">
                          <div className="w-full h-2 rounded-full overflow-hidden bg-surface-alt flex">
                            {(() => {
                              const sum = numA + numB;
                              if (sum === 0) return <div className="w-full h-full bg-border" />;
                              const aW = Math.round((numA / sum) * 100);
                              return (
                                <>
                                  <div className={`h-full transition-all ${aWins ? "bg-green-400" : "bg-primary-400"}`} style={{ width: `${aW}%` }} />
                                  <div className={`h-full transition-all ${bWins ? "bg-green-400" : "bg-accent-400"}`} style={{ width: `${100 - aW}%` }} />
                                </>
                              );
                            })()}
                          </div>
                          {diff && (
                            <span className={`text-xs font-semibold tabular-nums ${diffColor}`}>{diff}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-text-secondary text-center block">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      <p className="text-xs text-text-secondary mt-2 text-right">
        Sourced from publicly available data · <time dateTime={new Date().toISOString().slice(0, 7)} suppressHydrationWarning>{new Date().toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}</time>
      </p>
    </section>
  );
}

function WinnerBadge() {
  return (
    <svg className="w-3 h-3 inline ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Key Facts &amp; Figures
        </h3>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {entityA.name}
                </th>
                <th className="text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {entityB.name}
                </th>
                <th className="text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Diff
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {numericAttrs.map((attr) => {
                const valA = attr.values.find((v) => v.entityId === entityA.id);
                const valB = attr.values.find((v) => v.entityId === entityB.id);
                // Fallback: use position-based matching
                const aVal = valA || attr.values[0];
                const bVal = valB || attr.values[1];
                const numA = aVal?.valueNumber;
                const numB = bVal?.valueNumber;

                let diff: string | null = null;
                let diffColor = "text-gray-400";
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

                return (
                  <tr key={attr.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2 text-gray-700 font-medium">
                      {attr.name}
                      {attr.unit && (
                        <span className="text-gray-400 text-xs ml-1">({attr.unit})</span>
                      )}
                    </td>
                    <td className={`px-3 py-2 text-center tabular-nums ${aWins ? "font-semibold text-green-700" : "text-gray-600"}`}>
                      {aVal?.valueText || (numA != null ? formatNumber(numA) : "—")}
                      {aWins && <WinnerBadge />}
                    </td>
                    <td className={`px-3 py-2 text-center tabular-nums ${bWins ? "font-semibold text-green-700" : "text-gray-600"}`}>
                      {bVal?.valueText || (numB != null ? formatNumber(numB) : "—")}
                      {bWins && <WinnerBadge />}
                    </td>
                    <td className={`px-3 py-2 text-center text-xs font-medium ${diffColor}`}>
                      {diff || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          All figures sourced from publicly available data. Last updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}.
        </p>
      </div>
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

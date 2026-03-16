import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

export function ComparisonTable({
  attributes,
  entityA,
  entityB,
}: {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const categories = new Map<string, ComparisonAttribute[]>();
  for (const attr of attributes) {
    const cat = attr.category || "General";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(attr);
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Full Comparison
      </h2>

      <div className="bg-white border border-border rounded-xl overflow-x-auto">
        <table className="w-full border-collapse min-w-[400px]">
          {/* Header */}
          <thead>
            <tr className="bg-surface-dark text-white">
              <th className="px-3 sm:px-5 py-3 text-left text-xs sm:text-sm font-semibold w-[40%]">
                Attribute
              </th>
              <th className="px-3 sm:px-5 py-3 text-center text-xs sm:text-sm font-semibold w-[30%]">
                {entityA.name}
              </th>
              <th className="px-3 sm:px-5 py-3 text-center text-xs sm:text-sm font-semibold w-[30%]">
                {entityB.name}
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from(categories.entries()).map(([categoryName, attrs]) => (
              <>
                {/* Category header row */}
                <tr key={`cat-${categoryName}`}>
                  <td
                    colSpan={3}
                    className="bg-surface-alt px-3 sm:px-5 py-2 border-b border-border"
                  >
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {categoryName}
                    </span>
                  </td>
                </tr>

                {/* Attribute rows */}
                {attrs.map((attr, i) => {
                  const valA = attr.values[0];
                  const valB = attr.values[1];

                  return (
                    <tr
                      key={attr.id}
                      className={`${
                        i !== attrs.length - 1
                          ? "border-b border-border/30"
                          : "border-b border-border"
                      } hover:bg-surface-alt/50 transition-colors`}
                    >
                      {/* Attribute name */}
                      <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-text">
                        {attr.name}
                        {attr.unit && (
                          <span className="ml-1 text-[10px] sm:text-xs text-text-secondary">
                            ({attr.unit})
                          </span>
                        )}
                      </td>

                      {/* Entity A value */}
                      <td
                        className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-center font-medium ${
                          valA?.winner === true
                            ? "text-win bg-green-50/50"
                            : valA?.winner === false
                            ? "text-text-secondary"
                            : "text-text"
                        }`}
                      >
                        {valA?.valueText || "—"}
                        {valA?.winner === true && (
                          <span className="ml-1 text-[10px] sm:text-xs text-win font-bold">
                            W
                          </span>
                        )}
                      </td>

                      {/* Entity B value */}
                      <td
                        className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-center font-medium ${
                          valB?.winner === true
                            ? "text-win bg-green-50/50"
                            : valB?.winner === false
                            ? "text-text-secondary"
                            : "text-text"
                        }`}
                      >
                        {valB?.valueText || "—"}
                        {valB?.winner === true && (
                          <span className="ml-1 text-[10px] sm:text-xs text-win font-bold">
                            W
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

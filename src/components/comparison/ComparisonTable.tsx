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

      {/* Desktop: Table layout */}
      <div className="hidden sm:block bg-white border border-border rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-dark text-white">
              <th className="px-5 py-3 text-left text-sm font-semibold w-[40%]">
                Attribute
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold w-[30%]">
                {entityA.name}
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold w-[30%]">
                {entityB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(categories.entries()).map(([categoryName, attrs]) => (
              <>
                <tr key={`cat-${categoryName}`}>
                  <td colSpan={3} className="bg-surface-alt px-5 py-2 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {categoryName}
                    </span>
                  </td>
                </tr>
                {attrs.map((attr, i) => {
                  const valA = attr.values[0];
                  const valB = attr.values[1];
                  return (
                    <tr
                      key={attr.id}
                      className={`${
                        i !== attrs.length - 1 ? "border-b border-border/30" : "border-b border-border"
                      } hover:bg-surface-alt/50 transition-colors`}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-text">
                        {attr.name}
                        {attr.unit && (
                          <span className="ml-1 text-xs text-text-secondary">({attr.unit})</span>
                        )}
                      </td>
                      <td className={`px-5 py-3 text-sm text-center font-medium ${
                        valA?.winner === true ? "text-win bg-green-50/50" : valA?.winner === false ? "text-text-secondary" : "text-text"
                      }`}>
                        {valA?.valueText || "—"}
                        {valA?.winner === true && <span className="ml-1 text-xs text-win font-bold">W</span>}
                      </td>
                      <td className={`px-5 py-3 text-sm text-center font-medium ${
                        valB?.winner === true ? "text-win bg-green-50/50" : valB?.winner === false ? "text-text-secondary" : "text-text"
                      }`}>
                        {valB?.valueText || "—"}
                        {valB?.winner === true && <span className="ml-1 text-xs text-win font-bold">W</span>}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Stacked card layout — fully readable, no overflow */}
      <div className="sm:hidden space-y-2">
        {Array.from(categories.entries()).map(([categoryName, attrs]) => (
          <div key={categoryName}>
            <div className="bg-surface-alt px-3 py-2 rounded-lg mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {categoryName}
              </span>
            </div>
            <div className="space-y-2">
              {attrs.map((attr) => {
                const valA = attr.values[0];
                const valB = attr.values[1];
                return (
                  <div key={attr.id} className="bg-white border border-border rounded-xl overflow-hidden">
                    {/* Attribute name */}
                    <div className="px-3 py-2 border-b border-border/50 bg-gray-50/50">
                      <span className="text-xs font-semibold text-text">
                        {attr.name}
                        {attr.unit && (
                          <span className="ml-1 text-text-secondary font-normal">({attr.unit})</span>
                        )}
                      </span>
                    </div>
                    {/* Values */}
                    <div className="grid grid-cols-2 divide-x divide-border/50">
                      <div className={`px-3 py-2.5 ${valA?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-medium text-text-secondary mb-0.5 truncate">{entityA.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valA?.winner === true ? "text-win" : valA?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valA?.valueText || "—"}
                          {valA?.winner === true && <span className="ml-1 text-[10px] text-win font-bold">W</span>}
                        </p>
                      </div>
                      <div className={`px-3 py-2.5 ${valB?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-medium text-text-secondary mb-0.5 truncate">{entityB.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valB?.winner === true ? "text-win" : valB?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valB?.valueText || "—"}
                          {valB?.winner === true && <span className="ml-1 text-[10px] text-win font-bold">W</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

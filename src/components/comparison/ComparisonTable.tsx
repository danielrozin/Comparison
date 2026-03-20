import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

function WinCheck() {
  return (
    <span className="ml-1.5 inline-flex items-center">
      <svg className="w-4 h-4 text-win" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

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
            <tr className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
              <th className="px-5 py-3.5 text-left text-sm font-semibold w-[40%]">
                Attribute
              </th>
              <th className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">
                {entityA.name}
              </th>
              <th className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">
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
                      } ${i % 2 === 0 ? "bg-gray-50/50" : ""} hover:bg-primary-50/30 transition-colors`}
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
                        {valA?.valueText || "\u2014"}
                        {valA?.winner === true && <WinCheck />}
                      </td>
                      <td className={`px-5 py-3 text-sm text-center font-medium ${
                        valB?.winner === true ? "text-win bg-green-50/50" : valB?.winner === false ? "text-text-secondary" : "text-text"
                      }`}>
                        {valB?.valueText || "\u2014"}
                        {valB?.winner === true && <WinCheck />}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Stacked card layout */}
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
                  <div key={attr.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                    {/* Attribute name */}
                    <div className="px-3 py-2 border-b border-border/50 bg-gradient-to-r from-gray-50 to-white">
                      <span className="text-xs font-bold text-text">
                        {attr.name}
                        {attr.unit && (
                          <span className="ml-1 text-text-secondary font-normal">({attr.unit})</span>
                        )}
                      </span>
                    </div>
                    {/* Values */}
                    <div className="grid grid-cols-2 divide-x divide-border/50">
                      <div className={`px-3 py-2.5 ${valA?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-semibold text-text-secondary mb-0.5 truncate">{entityA.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valA?.winner === true ? "text-win" : valA?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valA?.valueText || "\u2014"}
                          {valA?.winner === true && <WinCheck />}
                        </p>
                      </div>
                      <div className={`px-3 py-2.5 ${valB?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-semibold text-text-secondary mb-0.5 truncate">{entityB.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valB?.winner === true ? "text-win" : valB?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valB?.valueText || "\u2014"}
                          {valB?.winner === true && <WinCheck />}
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

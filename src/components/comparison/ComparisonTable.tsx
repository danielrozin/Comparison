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
  // Group attributes by category
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

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* Sticky header */}
        <div className="grid grid-cols-3 bg-surface-dark text-white sticky top-16 z-10">
          <div className="px-4 py-3 text-sm font-semibold">Attribute</div>
          <div className="px-4 py-3 text-sm font-semibold text-center">
            {entityA.name}
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-center">
            {entityB.name}
          </div>
        </div>

        {Array.from(categories.entries()).map(([categoryName, attrs]) => (
          <div key={categoryName}>
            {/* Category header */}
            <div className="bg-surface-alt px-4 py-2 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {categoryName}
              </span>
            </div>

            {/* Attribute rows */}
            {attrs.map((attr, i) => {
              const valA = attr.values.find((v) => v.entityId === entityA.id);
              const valB = attr.values.find((v) => v.entityId === entityB.id);

              return (
                <div
                  key={attr.id}
                  className={`grid grid-cols-3 ${
                    i !== attrs.length - 1 ? "border-b border-border/30" : "border-b border-border"
                  } hover:bg-surface-alt/50 transition-colors`}
                >
                  {/* Attribute name */}
                  <div className="px-4 py-3 text-sm font-medium text-text">
                    {attr.name}
                    {attr.unit && (
                      <span className="ml-1 text-xs text-text-secondary">({attr.unit})</span>
                    )}
                  </div>

                  {/* Entity A value */}
                  <div
                    className={`px-4 py-3 text-sm text-center font-medium ${
                      valA?.winner === true
                        ? "text-win bg-green-50/50"
                        : valA?.winner === false
                        ? "text-text-secondary"
                        : "text-text"
                    }`}
                  >
                    {valA?.valueText || "—"}
                    {valA?.winner === true && (
                      <span className="ml-1 text-xs text-win font-bold">W</span>
                    )}
                  </div>

                  {/* Entity B value */}
                  <div
                    className={`px-4 py-3 text-sm text-center font-medium ${
                      valB?.winner === true
                        ? "text-win bg-green-50/50"
                        : valB?.winner === false
                        ? "text-text-secondary"
                        : "text-text"
                    }`}
                  >
                    {valB?.valueText || "—"}
                    {valB?.winner === true && (
                      <span className="ml-1 text-xs text-win font-bold">W</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

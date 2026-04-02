import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

interface DataFactsTableProps {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

function displayValue(val: { valueText: string | null; valueNumber: number | null; valueBoolean: boolean | null } | undefined): string {
  if (!val) return "—";
  if (val.valueText) return val.valueText;
  if (val.valueNumber !== null) return val.valueNumber.toLocaleString();
  if (val.valueBoolean !== null) return val.valueBoolean ? "Yes" : "No";
  return "—";
}

export function DataFactsTable({ attributes, entityA, entityB }: DataFactsTableProps) {
  if (attributes.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl font-bold text-text mb-4">Key Facts & Figures</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="table">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 font-semibold text-text-secondary" scope="col">Attribute</th>
              <th className="text-left py-3 px-4 font-semibold text-primary-700" scope="col">{entityA.name}</th>
              <th className="text-left py-3 px-4 font-semibold text-accent-600" scope="col">{entityB.name}</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, i) => {
              const valA = attr.values.find((v) => v.entityId === entityA.id);
              const valB = attr.values.find((v) => v.entityId === entityB.id);

              return (
                <tr key={attr.id} className={i % 2 === 0 ? "bg-surface-alt" : ""}>
                  <td className="py-3 px-4 font-medium text-text">
                    {attr.name}
                    {attr.unit && <span className="text-text-secondary ml-1">({attr.unit})</span>}
                  </td>
                  <td className={`py-3 px-4 ${valA?.winner ? "text-win font-semibold" : "text-text-secondary"}`}>
                    {displayValue(valA)}
                  </td>
                  <td className={`py-3 px-4 ${valB?.winner ? "text-win font-semibold" : "text-text-secondary"}`}>
                    {displayValue(valB)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

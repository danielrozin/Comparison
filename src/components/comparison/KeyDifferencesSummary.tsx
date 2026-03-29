import type { KeyDifference, ComparisonEntityData } from "@/types";

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

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
        Top Differences
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {top3.map((diff, idx) => (
          <div
            key={idx}
            className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              {diff.label}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${diff.winner === "a" ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm text-text truncate">
                  <span className="font-medium">{entityA.name}:</span>{" "}
                  {diff.entityAValue}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${diff.winner === "b" ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm text-text truncate">
                  <span className="font-medium">{entityB.name}:</span>{" "}
                  {diff.entityBValue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {differences.length > 3 && (
        <a href="#key-differences" className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
          See all {differences.length} differences →
        </a>
      )}
    </section>
  );
}

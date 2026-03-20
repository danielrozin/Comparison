import type { KeyDifference, ComparisonEntityData } from "@/types";

export function KeyDifferencesBlock({
  differences,
  entityA,
  entityB,
}: {
  differences: KeyDifference[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Key Differences
      </h2>

      {/* Desktop: 3-column grid layout */}
      <div className="hidden sm:block bg-white border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] bg-surface-alt border-b border-border">
          <div className="px-4 py-3 text-sm font-semibold text-primary-700 text-center">
            {entityA.name}
          </div>
          <div className="px-4 py-3 text-xs font-medium text-text-secondary self-center">
            Attribute
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-accent-600 text-center">
            {entityB.name}
          </div>
        </div>

        {/* Rows */}
        {differences.map((diff, i) => (
          <div
            key={diff.label}
            className={`grid grid-cols-[1fr_auto_1fr] ${
              i !== differences.length - 1 ? "border-b border-border/50" : ""
            } ${
              diff.winner === "a"
                ? "border-l-[3px] border-l-green-500"
                : diff.winner === "b"
                ? "border-l-[3px] border-l-purple-500"
                : ""
            } hover:bg-gray-50/50 transition-colors duration-200`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Entity A Value */}
            <div
              className={`px-4 py-3 text-center text-sm font-medium ${
                diff.winner === "a"
                  ? "text-win bg-green-50"
                  : diff.winner === "b"
                  ? "text-lose/60"
                  : "text-text"
              }`}
            >
              {diff.entityAValue}
              {diff.winner === "a" && <WinBadge />}
            </div>

            {/* Label */}
            <div className="px-4 py-3 text-xs font-medium text-text-secondary text-center min-w-[120px] bg-surface-alt/50 self-center">
              {diff.label}
            </div>

            {/* Entity B Value */}
            <div
              className={`px-4 py-3 text-center text-sm font-medium ${
                diff.winner === "b"
                  ? "text-win bg-green-50"
                  : diff.winner === "a"
                  ? "text-lose/60"
                  : "text-text"
              }`}
            >
              {diff.entityBValue}
              {diff.winner === "b" && <WinBadge />}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Stacked card layout */}
      <div className="sm:hidden space-y-3">
        {differences.map((diff, i) => (
          <div
            key={diff.label}
            className={`bg-white border border-border rounded-xl overflow-hidden ${
              diff.winner === "a"
                ? "border-l-[3px] border-l-green-500"
                : diff.winner === "b"
                ? "border-l-[3px] border-l-purple-500"
                : ""
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Attribute label */}
            <div className="bg-surface-alt px-4 py-2">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {diff.label}
              </span>
            </div>

            {/* Values side by side */}
            <div className="grid grid-cols-2 divide-x divide-border/50">
              {/* Entity A */}
              <div className={`px-3 py-3 ${diff.winner === "a" ? "bg-green-50" : ""}`}>
                <p className="text-[11px] font-medium text-text-secondary mb-1 truncate">
                  {entityA.name}
                </p>
                <p className={`text-sm font-semibold break-words ${
                  diff.winner === "a"
                    ? "text-win"
                    : diff.winner === "b"
                    ? "text-text-secondary"
                    : "text-text"
                }`}>
                  {diff.entityAValue}
                  {diff.winner === "a" && <WinBadge />}
                </p>
              </div>

              {/* Entity B */}
              <div className={`px-3 py-3 ${diff.winner === "b" ? "bg-green-50" : ""}`}>
                <p className="text-[11px] font-medium text-text-secondary mb-1 truncate">
                  {entityB.name}
                </p>
                <p className={`text-sm font-semibold break-words ${
                  diff.winner === "b"
                    ? "text-win"
                    : diff.winner === "a"
                    ? "text-text-secondary"
                    : "text-text"
                }`}>
                  {diff.entityBValue}
                  {diff.winner === "b" && <WinBadge />}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WinBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center text-xs text-win">
      <span className="mr-0.5">&#x1F3C6;</span>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

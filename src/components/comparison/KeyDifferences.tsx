import type { KeyDifference, ComparisonEntityData } from "@/types";

function ScorecardHeader({
  differences,
  entityA,
  entityB,
}: {
  differences: KeyDifference[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  let aWins = 0;
  let bWins = 0;
  let ties = 0;
  for (const d of differences) {
    if (d.winner === "a") aWins++;
    else if (d.winner === "b") bWins++;
    else ties++;
  }

  const total = aWins + bWins + ties;
  if (total === 0) return null;

  const aPercent = total > 0 ? Math.round((aWins / total) * 100) : 50;
  const bPercent = total > 0 ? Math.round((bWins / total) * 100) : 50;
  const leader =
    aWins > bWins ? entityA.name : bWins > aWins ? entityB.name : null;

  return (
    <div className="mb-5 bg-gradient-to-r from-primary-50 via-white to-accent-50 border border-border rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-center min-w-0">
          <span className="block text-xl sm:text-2xl font-black text-primary-700">{aWins}</span>
          <span className="text-xs text-text-secondary truncate max-w-[80px] sm:max-w-none block">{entityA.name}</span>
        </div>
        <div className="flex-1 min-w-0 text-center">
          {leader ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-win/10 text-win border border-win/20">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {leader} leads
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-tie border border-border">
              Evenly matched
            </span>
          )}
          {ties > 0 && (
            <span className="block mt-1 text-[10px] text-text-secondary">{ties} tie{ties !== 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="text-center min-w-0">
          <span className="block text-xl sm:text-2xl font-black text-accent-600">{bWins}</span>
          <span className="text-xs text-text-secondary truncate max-w-[80px] sm:max-w-none block">{entityB.name}</span>
        </div>
      </div>

      {/* Win ratio bar */}
      <div className="h-2 rounded-full overflow-hidden bg-gray-100 flex">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
          style={{ width: `${aPercent}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-accent-400 to-accent-500 transition-all duration-500"
          style={{ width: `${bPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-primary-600 font-medium">{aPercent}%</span>
        <span className="text-[10px] text-accent-600 font-medium">{bPercent}%</span>
      </div>
    </div>
  );
}

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
      <h2 className="text-2xl font-display font-bold text-text mb-4">
        Key Differences
      </h2>

      <ScorecardHeader differences={differences} entityA={entityA} entityB={entityB} />

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

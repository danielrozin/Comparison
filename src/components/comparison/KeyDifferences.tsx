import Image from "next/image";
import type { KeyDifference, ComparisonEntityData } from "@/types";

function EntityMiniAvatar({ entity, variant }: { entity: ComparisonEntityData; variant: "a" | "b" }) {
  const hasImage = entity.imageUrl && !entity.imageUrl.includes("ui-avatars.com");
  const initials = entity.name.split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase();
  const gradientClass = variant === "a" ? "from-primary-400 to-primary-600" : "from-accent-400 to-accent-600";

  if (hasImage) {
    return (
      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
        <Image src={entity.imageUrl!} alt={entity.name} width={32} height={32} sizes="32px" decoding="async" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm flex-shrink-0`}>
      {initials || entity.name.charAt(0)}
    </div>
  );
}

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
        {/* Entity A */}
        <div className="flex flex-col items-center gap-1.5 min-w-0">
          <EntityMiniAvatar entity={entityA} variant="a" />
          <span className="block text-xl sm:text-2xl font-black text-primary-700">{aWins}</span>
          <span className="text-[10px] text-text-secondary truncate max-w-[72px] text-center">{entityA.name}</span>
        </div>

        {/* Center: leader badge */}
        <div className="flex-1 min-w-0 text-center">
          {leader ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-win/10 text-win border border-win/20">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {leader} leads
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Evenly matched
            </span>
          )}
          {ties > 0 && (
            <span className="block mt-1 text-[10px] text-text-secondary">{ties} tie{ties !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Entity B */}
        <div className="flex flex-col items-center gap-1.5 min-w-0">
          <EntityMiniAvatar entity={entityB} variant="b" />
          <span className="block text-xl sm:text-2xl font-black text-accent-600">{bWins}</span>
          <span className="text-[10px] text-text-secondary truncate max-w-[72px] text-center">{entityB.name}</span>
        </div>
      </div>

      {/* Win ratio bar */}
      <div className="h-2.5 rounded-full overflow-hidden bg-surface-alt flex">
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
    <section id="key-differences" aria-labelledby="key-differences-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="key-differences-heading" className="text-2xl font-display font-bold text-text">Key Differences</h2>
          <p className="text-xs text-text-secondary mt-0.5">{differences.length} attribute{differences.length !== 1 ? "s" : ""} compared head-to-head</p>
        </div>
      </div>

      <ScorecardHeader differences={differences} entityA={entityA} entityB={entityB} />

      {/* Desktop: 3-column grid layout */}
      <div className="hidden sm:block bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900">
          <div className="px-4 py-3 text-sm font-semibold text-blue-200 text-center">
            {entityA.name}
          </div>
          <div className="px-4 py-3 text-xs font-medium text-white/50 self-center text-center">
            Attribute
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-purple-200 text-center">
            {entityB.name}
          </div>
        </div>

        {/* Rows */}
        <ul aria-label={`${entityA.name} vs ${entityB.name} key differences`} className="list-none">
        {differences.map((diff, i) => (
          <li
            key={diff.label}
            className={`grid grid-cols-[1fr_auto_1fr] ${
              i !== differences.length - 1 ? "border-b border-border/50" : ""
            } ${
              diff.winner === "a"
                ? "border-l-[3px] border-l-green-500"
                : diff.winner === "b"
                ? "border-l-[3px] border-l-purple-500"
                : ""
            } hover:bg-primary-50/20 hover:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)] transition-all duration-150 group/row`}
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
            <div className="px-4 py-3 text-xs font-semibold text-text-secondary text-center min-w-[120px] bg-surface-alt/50 group-hover/row:bg-surface-alt self-center transition-colors duration-150">
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
          </li>
        ))}
        </ul>
      </div>

      {/* Mobile: Stacked card layout */}
      <ul aria-label={`${entityA.name} vs ${entityB.name} key differences`} className="sm:hidden space-y-3 list-none">
        {differences.map((diff, i) => (
          <li
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
          </li>
        ))}
      </ul>
    </section>
  );
}

function WinBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center text-xs text-win">
      <span className="mr-0.5" aria-hidden="true">&#x1F3C6;</span>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

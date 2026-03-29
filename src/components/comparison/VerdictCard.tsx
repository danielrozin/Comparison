import type { ComparisonEntityData } from "@/types";

interface VerdictCardProps {
  verdict: string;
  shortAnswer: string | null;
  entities: ComparisonEntityData[];
  attributes: { values: { entityId: string; winner?: boolean }[] }[];
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 3h14a1 1 0 011 1v2a5 5 0 01-3.53 4.78A5.01 5.01 0 0113 14.92V17h2a1 1 0 110 2H9a1 1 0 110-2h2v-2.08A5.01 5.01 0 017.53 10.78 5 5 0 014 6V4a1 1 0 011-1zm1 2v1a3 3 0 002.08 2.85A5 5 0 018 7V5H6zm12 0h-2v2a5 5 0 01-.08 1.85A3 3 0 0018 6V5zm-6 8a3 3 0 003-3V5H9v5a3 3 0 003 3z" />
    </svg>
  );
}

function computeScores(
  entities: ComparisonEntityData[],
  attributes: VerdictCardProps["attributes"]
): { scoreA: number; scoreB: number } | null {
  if (entities.length < 2 || attributes.length === 0) return null;

  const entityAId = entities[0].id;
  const entityBId = entities[1].id;
  let winsA = 0;
  let winsB = 0;
  let total = 0;

  for (const attr of attributes) {
    for (const val of attr.values) {
      if (val.winner) {
        if (val.entityId === entityAId) winsA++;
        else if (val.entityId === entityBId) winsB++;
        total++;
      }
    }
  }

  if (total === 0) return null;

  // Scale to 0-10 range based on win rate
  const scoreA = Math.round((5 + (winsA / total) * 5) * 10) / 10;
  const scoreB = Math.round((5 + (winsB / total) * 5) * 10) / 10;
  return { scoreA, scoreB };
}

export function VerdictCard({ verdict, shortAnswer, entities, attributes }: VerdictCardProps) {
  const entityA = entities[0];
  const entityB = entities[1];
  if (!entityA || !entityB) return null;

  const verdictText = verdict || shortAnswer;
  if (!verdictText) return null;

  const scores = computeScores(entities, attributes);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl p-5 sm:p-8 text-white overflow-hidden shadow-xl shadow-purple-900/30 border border-purple-700/30">
        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/5 rounded-full" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center ring-2 ring-yellow-400/30">
              <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold tracking-tight">Our Verdict</h2>
          </div>

          {/* Verdict text */}
          <p className="text-gray-200 leading-relaxed text-base sm:text-lg mb-6">
            {verdictText}
          </p>

          {/* Score bar */}
          {scores && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary-200">{entityA.name}</span>
                  <span className="text-lg font-bold text-white">{scores.scoreA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{scores.scoreB}</span>
                  <span className="text-sm font-semibold text-accent-200">{entityB.name}</span>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-l-full transition-all duration-700"
                  style={{ width: `${(scores.scoreA / (scores.scoreA + scores.scoreB)) * 100}%` }}
                />
                <div className="w-px bg-white/30" />
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-r-full transition-all duration-700 flex-1"
                />
              </div>
            </div>
          )}

          {/* Choose X if cards */}
          {entities.some((e) => e.bestFor) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {entities.map((entity, idx) =>
                entity.bestFor ? (
                  <div
                    key={entity.id}
                    className={`rounded-xl p-4 backdrop-blur-sm transition-transform hover:scale-[1.02] ${
                      idx === 0
                        ? "bg-blue-500/15 border border-blue-400/30"
                        : "bg-purple-500/15 border border-purple-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          idx === 0 ? "bg-blue-500/30" : "bg-purple-500/30"
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Choose {entity.name} if
                      </p>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{entity.bestFor}</p>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

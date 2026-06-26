import type { ComparisonEntityData, ComparisonAttribute } from "@/types";
import { AiAssistedBadge } from "./AiAssistedBadge";
import { VerdictFeedbackWidget } from "./VerdictFeedbackWidget";

interface VerdictCardProps {
  verdict: string;
  shortAnswer: string | null;
  entities: ComparisonEntityData[];
  attributes: ComparisonAttribute[];
  comparisonSlug: string;
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

export function VerdictCard({ verdict, shortAnswer, entities, attributes, comparisonSlug }: VerdictCardProps) {
  const entityA = entities[0];
  const entityB = entities[1];
  if (!entityA || !entityB) return null;

  const verdictText = verdict || shortAnswer;
  if (!verdictText) return null;

  const scores = computeScores(entities, attributes);

  return (
    <section data-verdict className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl p-5 sm:p-8 text-white overflow-hidden shadow-xl shadow-purple-900/30 border border-purple-700/30">
        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/5 rounded-full" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center ring-2 ring-yellow-400/30">
              <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <h2 className="text-lg sm:text-2xl font-display font-bold tracking-tight">Our Verdict</h2>
            <AiAssistedBadge />
          </div>

          {/* Verdict text — styled as a readable quote */}
          <div className="relative mb-5">
            <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400/60 via-yellow-400/30 to-transparent rounded-full" />
            <p className="pl-4 text-gray-200 leading-relaxed text-base sm:text-lg">
              {verdictText}
            </p>
          </div>

          {/* Feedback widget */}
          <div className="mb-6">
            <VerdictFeedbackWidget comparisonSlug={comparisonSlug} />
          </div>

          {/* Score bar */}
          {scores && (
            <div className="mb-6 bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3 gap-2">
                {/* Entity A score */}
                <div className="flex items-center gap-2 min-w-0">
                  {entityA.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entityA.imageUrl} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="block text-xs text-blue-300/80 truncate">{entityA.name}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-black text-white tabular-nums">{scores.scoreA}</span>
                      <span className="text-xs text-white/40 font-medium">/10</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">vs</div>

                {/* Entity B score */}
                <div className="flex items-center gap-2 min-w-0 text-right">
                  <div className="min-w-0">
                    <span className="block text-xs text-purple-300/80 truncate text-right">{entityB.name}</span>
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-2xl font-black text-white tabular-nums">{scores.scoreB}</span>
                      <span className="text-xs text-white/40 font-medium">/10</span>
                    </div>
                  </div>
                  {entityB.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entityB.imageUrl} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0" />
                  )}
                </div>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-700"
                  style={{ width: `${(scores.scoreA / (scores.scoreA + scores.scoreB)) * 100}%` }}
                />
                <div className="w-px bg-white/30" />
                <div className="bg-gradient-to-r from-purple-400 to-purple-300 transition-all duration-700 flex-1" />
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
                    className={`rounded-xl p-4 backdrop-blur-sm transition-all hover:scale-[1.02] hover:brightness-110 ${
                      idx === 0
                        ? "bg-blue-500/15 border border-blue-400/30"
                        : "bg-purple-500/15 border border-purple-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      {entity.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entity.imageUrl}
                          alt={entity.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${idx === 0 ? "bg-blue-500/30 text-blue-200" : "bg-purple-500/30 text-purple-200"}`}>
                          {entity.name.charAt(0).toUpperCase()}
                        </div>
                      )}
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

import type { ComparisonEntityData, ComparisonAttribute } from "@/types";
import { AiAssistedBadge } from "./AiAssistedBadge";
import { VerdictFeedbackWidget } from "./VerdictFeedbackWidget";
import { VerdictShareButton } from "./VerdictShareButton";
import { VerdictShareStrip } from "./VerdictShareStrip";
import { ScoreBarPanel } from "./ScoreBarPanel";

interface VerdictCardProps {
  verdict: string;
  shortAnswer: string | null;
  entities: ComparisonEntityData[];
  attributes: ComparisonAttribute[];
  comparisonSlug: string;
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
  const winnerIdx = scores ? (scores.scoreA > scores.scoreB ? 0 : scores.scoreB > scores.scoreA ? 1 : -1) : -1;

  return (
    <section id="verdict" aria-labelledby="verdict-heading" data-verdict className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 scroll-mt-28">
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl p-5 sm:p-8 text-white overflow-hidden shadow-xl shadow-purple-900/30 border border-purple-700/30">
        {/* Decorative background circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/5 rounded-full" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center ring-2 ring-yellow-400/30">
                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <h2 id="verdict-heading" className="text-lg sm:text-2xl font-display font-bold tracking-tight">Our Verdict</h2>
              <AiAssistedBadge />
            </div>
            <VerdictShareButton
              title={`${entityA.name} vs ${entityB.name}`}
              winnerName={winnerIdx === 0 ? entityA.name : winnerIdx === 1 ? entityB.name : null}
            />
          </div>

          {/* Verdict text — styled as a readable quote */}
          <div className="relative mb-5">
            <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400/60 via-yellow-400/30 to-transparent rounded-full" />
            <p className="pl-4 text-white/80 leading-relaxed text-base sm:text-lg">
              {verdictText}
            </p>
          </div>

          {/* Feedback widget */}
          <div className="mb-6">
            <VerdictFeedbackWidget comparisonSlug={comparisonSlug} />
          </div>

          {/* Score bar — animated on scroll-into-view */}
          {scores && (
            <ScoreBarPanel
              scoreA={scores.scoreA}
              scoreB={scores.scoreB}
              winnerIdx={winnerIdx}
              entityA={entityA}
              entityB={entityB}
            />
          )}

          {/* Choose X if cards */}
          {entities.some((e) => e.bestFor) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {entities.map((entity, idx) => {
                if (!entity.bestFor) return null;
                const isWinner = winnerIdx === idx;
                return (
                  <div
                    key={entity.id}
                    className={`relative rounded-xl overflow-hidden backdrop-blur-sm transition-all hover:scale-[1.02] hover:brightness-110 ${
                      idx === 0
                        ? "bg-blue-500/15 border border-blue-400/30"
                        : "bg-purple-500/15 border border-purple-400/30"
                    }`}
                  >
                    {/* Winner ribbon — decorative only; "Best pick" badge below conveys winner status */}
                    {isWinner && (
                      <div className="absolute top-0 right-0" aria-hidden="true">
                        <div className="relative">
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-yellow-400 border-r-transparent opacity-90" />
                          <div className="absolute top-1 right-0.5 rotate-45 text-xs font-black text-indigo-900 leading-none">
                            ★
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-center gap-2.5 mb-2.5">
                        {entity.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entity.imageUrl}
                            alt={entity.name}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${idx === 0 ? "bg-blue-500/30 text-blue-200" : "bg-purple-500/30 text-purple-200"}`}>
                            {entity.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/60 truncate">
                            Choose {entity.name} if
                          </p>
                          {isWinner && (
                            <span className="flex-shrink-0 inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-yellow-400 text-amber-900">
                              <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {" "}Best pick
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">{entity.bestFor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom share strip — high-intent moment after reading verdict */}
          <VerdictShareStrip
            title={`${entityA.name} vs ${entityB.name}`}
            winnerName={winnerIdx === 0 ? entityA.name : winnerIdx === 1 ? entityB.name : null}
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import type { ComparisonEntityData } from "@/types";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}

function extractWinner(verdict: string, entities: ComparisonEntityData[]): ComparisonEntityData | null {
  if (!verdict || entities.length < 2) return null;
  const lower = verdict.toLowerCase();
  // Check if exactly one entity name appears near a win signal in the first sentence
  const winSignals = ["wins", "is the winner", "is better", "outperforms", "is our pick", "recommend", "is the best"];
  for (const entity of entities) {
    const nameLower = entity.name.toLowerCase();
    if (winSignals.some((sig) => lower.includes(nameLower) && lower.indexOf(nameLower) < lower.indexOf(sig) + 40)) {
      return entity;
    }
  }
  return null;
}

export function VerdictBlock({
  verdict,
  entities,
}: {
  verdict: string;
  entities: ComparisonEntityData[];
}) {
  const winner = extractWinner(verdict, entities);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(verdict);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section id="verdict" data-verdict aria-labelledby="verdict-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden shadow-xl shadow-purple-900/30 border border-purple-700/30">
        {/* Decorative mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.12),transparent_60%)]" />

        {/* Sparkle accents */}
        <SparkleIcon className="absolute top-4 right-6 w-4 h-4 text-yellow-400/25" />
        <SparkleIcon className="absolute top-12 right-16 w-3 h-3 text-purple-300/20" />
        <SparkleIcon className="absolute bottom-6 left-8 w-3 h-3 text-indigo-300/20" />
        <SparkleIcon className="absolute bottom-16 right-10 w-2 h-2 text-yellow-400/20" />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-yellow-500/20 border border-yellow-400/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h2 id="verdict-heading" className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">Our Verdict</h2>
              {winner && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-yellow-300">{winner.name} wins overall</span>
                </div>
              )}
            </div>
          </div>

          {/* Verdict text */}
          <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 mb-6 group/verdict">
            <p className="text-white/90 leading-relaxed text-base sm:text-lg pr-8">{verdict}</p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Verdict copied!" : "Copy verdict to clipboard"}
              title={copied ? "Copied!" : "Copy verdict"}
              className={`absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 opacity-0 group-hover/verdict:opacity-100 focus:opacity-100 ${
                copied
                  ? "bg-emerald-500/30 text-emerald-300"
                  : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80"
              }`}
            >
              {copied ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Who should choose cards */}
          {entities.some((e) => e.bestFor) && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Who should choose each?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entities.map((entity, idx) =>
                  entity.bestFor ? (
                    <div
                      key={entity.id}
                      className={`relative rounded-xl p-4 backdrop-blur-sm border overflow-hidden ${
                        idx === 0
                          ? "bg-primary-600/15 border-primary-500/30"
                          : "bg-accent-500/15 border-accent-400/30"
                      }`}
                    >
                      {/* Subtle glow corner */}
                      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30 ${
                        idx === 0 ? "bg-primary-400" : "bg-accent-400"
                      }`} />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            idx === 0 ? "bg-primary-500/40" : "bg-accent-500/40"
                          }`}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <p className={`text-xs font-bold uppercase tracking-wider ${
                            idx === 0 ? "text-primary-200" : "text-accent-200"
                          }`}>
                            Choose {entity.name} if
                          </p>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{entity.bestFor}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

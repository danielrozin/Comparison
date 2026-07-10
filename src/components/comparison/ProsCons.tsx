"use client";

import { useState } from "react";
import Image from "next/image";
import type { ComparisonEntityData } from "@/types";

const INITIAL_SHOW = 5;

function EntityAvatar({ entity, variant }: { entity: ComparisonEntityData; variant: "a" | "b" }) {
  const hasImage = entity.imageUrl && !entity.imageUrl.includes("ui-avatars.com");
  const initials = entity.name.split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase();
  const gradientClass = variant === "a" ? "from-primary-400 to-primary-600" : "from-accent-400 to-accent-600";

  if (hasImage) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
        <Image src={entity.imageUrl!} alt={entity.name} width={40} height={40} sizes="40px" decoding="async" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm flex-shrink-0`}>
      {initials || entity.name.charAt(0)}
    </div>
  );
}

function ShowMoreButton({ hidden, onToggle, label }: { hidden: number; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text rounded-lg hover:bg-surface-alt border border-dashed border-border hover:border-border transition-all duration-150"
      aria-label={label}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      Show {hidden} more
    </button>
  );
}

function ShowLessButton({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text rounded-lg hover:bg-surface-alt border border-dashed border-border hover:border-border transition-all duration-150"
      aria-label="Show less"
    >
      <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      Show less
    </button>
  );
}

export function ProsConsBlock({ entities }: { entities: ComparisonEntityData[] }) {
  const [showAllPros, setShowAllPros] = useState<boolean[]>(entities.map(() => false));
  const [showAllCons, setShowAllCons] = useState<boolean[]>(entities.map(() => false));

  const totalPros = entities.reduce((s, e) => s + e.pros.length, 0);
  const totalCons = entities.reduce((s, e) => s + e.cons.length, 0);

  return (
    <section id="pros-cons" aria-labelledby="pros-cons-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="pros-cons-heading" className="text-2xl font-display font-bold text-text">Pros &amp; Cons</h2>
          {(totalPros + totalCons) > 0 && (
            <p className="text-xs text-text-secondary mt-0.5">
              <span className="text-green-600 font-semibold">{totalPros} pros</span>
              <span className="mx-1 text-text-secondary/50">·</span>
              <span className="text-red-500 font-semibold">{totalCons} cons</span>
              <span className="text-text-secondary/50"> across both</span>
            </p>
          )}
        </div>
        {entities.length >= 2 && (
          <div className="flex -space-x-2 flex-shrink-0">
            <EntityAvatar entity={entities[0]} variant="a" />
            <EntityAvatar entity={entities[1]} variant="b" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entities.map((entity, idx) => {
          const total = entity.pros.length + entity.cons.length;
          const prosPercent = total > 0 ? Math.round((entity.pros.length / total) * 100) : 50;
          const prosExpanded = showAllPros[idx] ?? false;
          const consExpanded = showAllCons[idx] ?? false;
          const visiblePros = prosExpanded ? entity.pros : entity.pros.slice(0, INITIAL_SHOW);
          const visibleCons = consExpanded ? entity.cons : entity.cons.slice(0, INITIAL_SHOW);
          const hiddenPros = entity.pros.length - INITIAL_SHOW;
          const hiddenCons = entity.cons.length - INITIAL_SHOW;

          const togglePros = () => setShowAllPros((prev) => { const next = [...prev]; next[idx] = !prev[idx]; return next; });
          const toggleCons = () => setShowAllCons((prev) => { const next = [...prev]; next[idx] = !prev[idx]; return next; });

          return (
            <div
              key={entity.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Entity header */}
              <div
                className={`px-5 pt-5 pb-4 ${
                  idx === 0
                    ? "bg-gradient-to-br from-primary-50 via-primary-50 to-white"
                    : "bg-gradient-to-br from-accent-50 via-accent-50 to-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <EntityAvatar entity={entity} variant={idx === 0 ? "a" : "b"} />
                    <h3
                      className={`font-bold text-lg leading-tight truncate ${
                        idx === 0 ? "text-primary-800" : "text-accent-700"
                      }`}
                    >
                      {entity.name}
                    </h3>
                  </div>
                  <div className="flex gap-1.5 ml-2 mt-0.5 flex-shrink-0">
                    {entity.pros.length > 0 && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        +{entity.pros.length}
                      </span>
                    )}
                    {entity.cons.length > 0 && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        -{entity.cons.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score bar */}
                {total > 0 && (
                  <div className="flex items-center gap-2">
                    <div
                      role="meter"
                      aria-label={`${entity.name} sentiment score`}
                      aria-valuenow={prosPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuetext={`${prosPercent}% positive`}
                      className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${prosPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-text-secondary tabular-nums" aria-hidden="true">{prosPercent}% positive</span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Pros */}
                {entity.pros.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest">Pros</h4>
                    </div>
                    <ul aria-label={`Pros for ${entity.name}`} className="space-y-1">
                      {visiblePros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text group/item -mx-2 px-2 py-1 rounded-lg hover:bg-green-50/70 transition-colors duration-150 cursor-default">
                          <span className="flex-shrink-0 w-4 h-4 rounded bg-green-50 border border-green-200 flex items-center justify-center mt-0.5 group-hover/item:bg-green-100 group-hover/item:border-green-300 group-hover/item:scale-110 transition-all duration-150">
                            <svg className="w-2.5 h-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="leading-relaxed group-hover/item:text-green-900 transition-colors duration-150">{pro}</span>
                        </li>
                      ))}
                    </ul>
                    {hiddenPros > 0 && !prosExpanded && (
                      <ShowMoreButton hidden={hiddenPros} onToggle={togglePros} label={`Show ${hiddenPros} more pros for ${entity.name}`} />
                    )}
                    {prosExpanded && entity.pros.length > INITIAL_SHOW && (
                      <ShowLessButton onToggle={togglePros} />
                    )}
                  </div>
                )}

                {entity.pros.length > 0 && entity.cons.length > 0 && (
                  <div className="border-t border-dashed border-border" />
                )}

                {/* Cons */}
                {entity.cons.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest">Cons</h4>
                    </div>
                    <ul aria-label={`Cons for ${entity.name}`} className="space-y-1">
                      {visibleCons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text group/item -mx-2 px-2 py-1 rounded-lg hover:bg-red-50/70 transition-colors duration-150 cursor-default">
                          <span className="flex-shrink-0 w-4 h-4 rounded bg-red-50 border border-red-200 flex items-center justify-center mt-0.5 group-hover/item:bg-red-100 group-hover/item:border-red-300 group-hover/item:scale-110 transition-all duration-150">
                            <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="leading-relaxed group-hover/item:text-red-900 transition-colors duration-150">{con}</span>
                        </li>
                      ))}
                    </ul>
                    {hiddenCons > 0 && !consExpanded && (
                      <ShowMoreButton hidden={hiddenCons} onToggle={toggleCons} label={`Show ${hiddenCons} more cons for ${entity.name}`} />
                    )}
                    {consExpanded && entity.cons.length > INITIAL_SHOW && (
                      <ShowLessButton onToggle={toggleCons} />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

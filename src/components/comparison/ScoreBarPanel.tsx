"use client";

import { useState, useRef, useEffect } from "react";
import type { ComparisonEntityData } from "@/types";

interface ScoreBarPanelProps {
  scoreA: number;
  scoreB: number;
  winnerIdx: number;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

export function ScoreBarPanel({ scoreA, scoreB, winnerIdx, entityA, entityB }: ScoreBarPanelProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const aWidth = animated ? `${(scoreA / (scoreA + scoreB)) * 100}%` : "0%";

  return (
    <div ref={ref} className="mb-6 bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3 gap-2">
        {/* Entity A score */}
        <div className={`flex items-center gap-2 min-w-0 transition-all duration-500 ${animated && winnerIdx === 0 ? "scale-105" : ""}`}>
          {entityA.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={entityA.imageUrl} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0" loading="lazy" decoding="async" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-blue-200">
              {entityA.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="block text-xs text-blue-300/80 truncate">{entityA.name}</span>
              {winnerIdx === 0 && <span className="text-[10px]" aria-hidden="true">👑</span>}
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className={`text-2xl font-black tabular-nums transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${winnerIdx === 0 ? "text-yellow-300" : "text-white"}`}>{scoreA}</span>
              <span className="text-xs text-white/70 font-medium">/10</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest" aria-hidden="true">vs</div>

        {/* Entity B score */}
        <div className={`flex items-center gap-2 min-w-0 text-right transition-all duration-500 ${animated && winnerIdx === 1 ? "scale-105" : ""}`}>
          <div className="min-w-0">
            <div className="flex items-center gap-1 justify-end">
              {winnerIdx === 1 && <span className="text-[10px]" aria-hidden="true">👑</span>}
              <span className="block text-xs text-purple-300/80 truncate text-right">{entityB.name}</span>
            </div>
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className={`text-2xl font-black tabular-nums transition-all duration-700 delay-100 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${winnerIdx === 1 ? "text-yellow-300" : "text-white"}`}>{scoreB}</span>
              <span className="text-xs text-white/70 font-medium">/10</span>
            </div>
          </div>
          {entityB.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={entityB.imageUrl} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0" loading="lazy" decoding="async" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-purple-200">
              {entityB.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div
        role="img"
        aria-label={`Score comparison: ${entityA.name} ${scoreA}/10 vs ${entityB.name} ${scoreB}/10${winnerIdx === 0 ? ` — ${entityA.name} wins` : winnerIdx === 1 ? ` — ${entityB.name} wins` : " — tied"}`}
        className="h-2.5 bg-white/10 rounded-full overflow-hidden flex"
      >
        <div
          className={`bg-gradient-to-r from-blue-400 to-blue-300 transition-all duration-700 ease-out ${winnerIdx === 0 ? "brightness-125" : ""}`}
          style={{ width: aWidth }}
        />
        <div className="w-px bg-white/30" />
        <div className={`bg-gradient-to-r from-purple-400 to-purple-300 transition-all duration-700 ease-out flex-1 ${winnerIdx === 1 ? "brightness-125" : ""}`} />
      </div>

      {winnerIdx === -1 && (
        <p className="text-center text-[10px] text-white/70 mt-2 font-medium tracking-wide">TIE — neck and neck</p>
      )}
    </div>
  );
}

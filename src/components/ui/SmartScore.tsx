"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface SmartScoreProps {
  score: number; // 0-100
  breakdown?: {
    rating: number;     // 0-100 contribution from avg rating
    consistency: number; // 0-100 how consistent reviews are
    volume: number;      // 0-100 review volume factor
    value: number;       // 0-100 value/price perception
  };
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
  if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function SmartScore({ score, breakdown }: SmartScoreProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = "smartscore-tooltip";

  // Close on outside click
  useEffect(() => {
    if (!showTooltip) return;
    const fn = (e: MouseEvent) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [showTooltip]);

  // Close on Escape
  useEffect(() => {
    if (!showTooltip) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTooltip(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [showTooltip]);

  const factors = breakdown
    ? [
        { label: "User Rating", value: breakdown.rating },
        { label: "Review Consistency", value: breakdown.consistency },
        { label: "Review Volume", value: breakdown.volume },
        { label: "Value Perception", value: breakdown.value },
      ]
    : null;

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm font-bold border rounded-lg ${getScoreColor(score)}`}>
        SmartScore {Math.round(score)}/100
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-describedby={showTooltip ? tooltipId : undefined}
        aria-label="SmartScore methodology info"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-text-secondary hover:text-text hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full mt-2 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
        >
          <h4 className="text-sm font-bold text-text mb-1">How SmartScore Works</h4>
          <p className="text-xs text-text-secondary mb-3">
            SmartScore aggregates multiple quality signals into a single 0-100 rating to help you make faster decisions.
          </p>

          {factors && (
            <div className="space-y-2 mb-3">
              {factors.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-text-secondary">{f.label}</span>
                    <span className="font-medium text-text">{Math.round(f.value)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getBarColor(f.value)}`}
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/how-it-works#smartscore"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            onClick={() => setShowTooltip(false)}
          >
            Learn more about SmartScore
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Tooltip arrow */}
          <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";

export function AiAssistedBadge() {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        const trigger = containerRef.current?.querySelector<HTMLButtonElement>(
          "button[data-ai-badge-trigger]"
        );
        trigger?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <span ref={containerRef} className="relative inline-flex items-center">
      {/* Pill with subtle gradient border via box-shadow */}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500/15 to-amber-500/10 border border-yellow-400/40 hover:border-yellow-400/70 px-3 py-1 text-xs font-medium text-yellow-100 backdrop-blur-sm transition-colors duration-200 cursor-default">
        {/* Animated sparkle */}
        <svg
          className="w-3.5 h-3.5 text-yellow-300 animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ animationDuration: "2s" }}
        >
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
        <span className="font-semibold tracking-wide">AI-assisted</span>
        <button
          type="button"
          data-ai-badge-trigger
          aria-label="About our AI-assisted verdicts"
          aria-expanded={open}
          aria-controls={tooltipId}
          onClick={() => setOpen((v) => !v)}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400/20 hover:bg-yellow-400/40 focus:bg-yellow-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 transition-colors"
        >
          <span className="text-[10px] leading-none font-bold text-yellow-200">i</span>
        </button>
      </span>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-xl bg-gray-900/95 backdrop-blur-sm border border-yellow-400/20 shadow-xl overflow-hidden"
        >
          {/* Tooltip header strip */}
          <span className="block px-3 pt-2.5 pb-1.5 border-b border-white/10 flex items-center gap-1.5">
            <svg className="w-3 h-3 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-wider">AI-Assisted Verdict</span>
          </span>
          <span className="block px-3 py-2.5 text-xs leading-relaxed text-gray-200">
            Our verdict is generated from product specs and verified reviews, then edited for accuracy.{" "}
            <a
              href="/how-we-write-verdicts"
              className="text-yellow-300 underline underline-offset-2 hover:text-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded"
            >
              Learn more →
            </a>
          </span>
        </span>
      )}
    </span>
  );
}

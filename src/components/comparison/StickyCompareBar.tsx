"use client";

import { useState, useEffect, useCallback } from "react";

interface StickyCompareBarProps {
  entityA: string;
  entityB: string;
  sections: { id: string; label: string }[];
}

export function StickyCompareBar({ entityA, entityB, sections }: StickyCompareBarProps) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [entered, setEntered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore — clipboard API may be unavailable */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 420;
      setVisible(shouldShow);
      if (shouldShow && !entered) setEntered(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (!entered) return null;

  return (
    <div
      role="navigation"
      aria-label="Comparison quick navigation"
      className={`fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-10 flex items-center gap-3 overflow-hidden">
        {/* Entity A vs B compact */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0 mr-2">
          <span
            className="font-bold text-[13px] text-primary-700 truncate max-w-[100px] sm:max-w-[160px]"
            title={entityA}
          >
            {entityA}
          </span>
          <div
            className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm"
            aria-hidden="true"
          >
            <span className="text-[8px] font-black text-white leading-none">VS</span>
          </div>
          <span
            className="font-bold text-[13px] text-accent-700 truncate max-w-[100px] sm:max-w-[160px]"
            title={entityB}
          >
            {entityB}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border flex-shrink-0" aria-hidden="true" />

        {/* Section jump links */}
        <nav
          className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1"
          aria-label="Jump to section"
        >
          {sections.map((s) => {
            const isActive = activeId === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? "bg-primary-100 text-primary-700 font-semibold"
                    : "text-text-secondary hover:text-text hover:bg-surface-alt"
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </nav>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied!" : "Copy link to this comparison"}
          title={copied ? "Copied!" : "Copy link"}
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ml-1 ${
            copied
              ? "bg-emerald-100 text-emerald-600"
              : "text-text-secondary hover:text-primary-600 hover:bg-primary-50"
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
    </div>
  );
}

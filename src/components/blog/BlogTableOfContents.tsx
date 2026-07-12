"use client";

import { useState, useEffect, useCallback } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function BlogTableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onScroll = useCallback(() => {
    const scrollY = window.scrollY + 120;
    let current = "";
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.offsetTop <= scrollY) current = h.id;
    }
    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  if (headings.length < 2) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" });
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-white p-4 text-sm shadow-sm"
    >
      <button
        type="button"
        onClick={() => setIsCollapsed((p) => !p)}
        className="flex w-full items-center justify-between gap-2 font-semibold text-text mb-3 hover:text-primary-600 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="blog-toc-list"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8M4 18h4" />
          </svg>
          Contents
        </span>
        <svg
          className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!isCollapsed && (
        <ol id="blog-toc-list" role="list" className="space-y-1 list-none">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => scrollTo(h.id)}
                aria-current={activeId === h.id ? "location" : undefined}
                className={`w-full text-left leading-snug transition-colors duration-100 rounded px-2 py-1 ${
                  h.level === 3 ? "ml-3 text-xs" : "text-sm"
                } ${
                  activeId === h.id
                    ? "text-primary-700 bg-primary-50 font-semibold"
                    : "text-text-secondary hover:text-text hover:bg-surface-alt"
                }`}
              >
                {activeId === h.id && (
                  <span className="inline-block w-1 h-1 rounded-full bg-primary-500 mr-1.5 mb-0.5 flex-shrink-0" aria-hidden="true" />
                )}
                {h.text}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

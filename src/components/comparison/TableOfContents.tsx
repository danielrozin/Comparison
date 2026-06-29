"use client";

import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  const activeIndex = items.findIndex((it) => it.id === activeId);
  const progressPct = activeIndex >= 0 ? Math.round(((activeIndex + 1) / items.length) * 100) : 0;

  return (
    <>
      {/* Collapsible bar — shown on all screens except very wide where the sidebar fits */}
      <div className="min-[1400px]:hidden max-w-5xl mx-auto px-4 sm:px-6 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-sm font-semibold transition-all duration-200 ${
            isOpen
              ? "bg-white border-primary-300 text-primary-700 shadow-sm"
              : "bg-surface-alt border-border text-text hover:border-gray-300"
          }`}
          aria-expanded={isOpen}
        >
          {/* Progress bar dot */}
          <div className="flex-shrink-0 w-5 h-5 relative">
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200" />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary-500 transition-all duration-300"
                strokeDasharray={`${2 * Math.PI * 8}`}
                strokeDashoffset={`${2 * Math.PI * 8 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="flex-1 text-left">On this page</span>

          {activeId && (
            <span className="hidden sm:inline text-xs font-normal text-text-secondary truncate max-w-[200px]">
              {items.find((it) => it.id === activeId)?.label}
            </span>
          )}

          <svg
            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown nav */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mt-1 bg-white border border-primary-200 rounded-xl p-2 space-y-0.5 shadow-lg shadow-primary-100/30">
            {items.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 overflow-hidden ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
                      : "text-text-secondary hover:text-text hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary-500 rounded-full" />
                  )}
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                      isActive ? "bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar — visible on wide screens (≥1400px) where content has room beside it */}
      <nav className="hidden min-[1400px]:block fixed left-4 top-1/3 z-30 w-52">
        <div className="bg-white/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary-50 to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
              On this page
            </p>
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Nav items */}
          <div className="p-2 space-y-0.5">
            {items.map((item, idx) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 overflow-hidden ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
                      : "text-text-secondary hover:text-text hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary-500 rounded-full" />
                  )}
                  <span
                    className={`flex-shrink-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                      isActive ? "bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

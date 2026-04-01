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

  return (
    <>
      {/* Mobile/tablet/desktop: collapsible bar (hidden only on very wide screens where fixed sidebar fits) */}
      <div className="min-[1700px]:hidden max-w-5xl mx-auto px-4 sm:px-6 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface-alt border border-border rounded-xl text-sm font-semibold text-text"
        >
          <span>Table of Contents</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <nav className="mt-1 bg-white border border-border rounded-xl p-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeId === item.id
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-text-secondary hover:text-text hover:bg-gray-50"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop: fixed left-edge pill (only visible on very wide screens where there's room beside content) */}
      <nav className="hidden min-[1700px]:block fixed left-4 top-1/2 -translate-y-1/2 z-30 w-48">
        <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl shadow-lg p-3 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary px-3 pb-1.5 mb-1 border-b border-border">
            On this page
          </p>
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                activeId === item.id
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-text-secondary hover:text-text hover:bg-gray-50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

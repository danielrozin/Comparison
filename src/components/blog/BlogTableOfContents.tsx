"use client";

import { useState, useEffect } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/** Extract headings from raw markdown content */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export function BlogTableOfContents({ headings }: { headings: TocHeading[] }) {
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

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="mb-8">
      {/* Mobile: collapsible */}
      <div className="lg:hidden">
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
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg text-sm transition-colors ${
                  h.level === 3 ? "pl-7 pr-3 py-1.5" : "px-3 py-2"
                } ${
                  activeId === h.id
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-text-secondary hover:text-text hover:bg-gray-50"
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop: inline TOC box */}
      <nav className="hidden lg:block bg-surface-alt border border-border rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
          Table of Contents
        </p>
        <div className="space-y-0.5">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block rounded-lg text-sm transition-colors ${
                h.level === 3 ? "pl-6 pr-3 py-1.5" : "px-3 py-2"
              } ${
                activeId === h.id
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-text-secondary hover:text-text hover:bg-white"
              }`}
            >
              {h.text}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

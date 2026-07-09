"use client";

import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

function KeyDiffIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18" />
    </svg>
  );
}

function ProsConsIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function VerdictIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function FAQIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const SECTION_CONFIGS: Array<{ id: string; label: string; icon: React.ReactNode; color: string }> = [
  { id: "key-differences", label: "Key Differences", icon: <KeyDiffIcon />, color: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
  { id: "comparison-table", label: "Attributes", icon: <TableIcon />, color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { id: "pros-cons", label: "Pros & Cons", icon: <ProsConsIcon />, color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
  { id: "verdict", label: "Verdict", icon: <VerdictIcon />, color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { id: "faq", label: "FAQ", icon: <FAQIcon />, color: "text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-100" },
];

export function QuickSectionNav() {
  const [visible, setVisible] = useState<Section[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const found: Section[] = [];
    for (const cfg of SECTION_CONFIGS) {
      if (document.getElementById(cfg.id)) {
        found.push(cfg);
      }
    }
    setVisible(found);
  }, []);

  useEffect(() => {
    if (visible.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );
    for (const s of visible) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [visible]);

  if (visible.length < 2) return null;

  return (
    <nav
      aria-label="Jump to section"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <span className="flex-shrink-0 text-[11px] font-bold text-text-secondary uppercase tracking-wider mr-1 whitespace-nowrap">
          Jump to:
        </span>
        {visible.map((section) => {
          const isActive = activeId === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-300"
                  : section.color
              }`}
            >
              {section.icon}
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

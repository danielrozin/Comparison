"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { trackComparisonSearch } from "@/lib/utils/analytics";

function parseComparison(input: string): [string, string] | null {
  const trimmed = input.trim();
  const patterns = [
    /^compare\s+(.+?)\s+(?:to|and|with|vs\.?)\s+(.+)$/i,
    /^differences?\s+between\s+(.+?)\s+and\s+(.+)$/i,
    /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
    /^(.+?)\s+(?:vs\.?|versus|compared\s+to|against)\s+(.+)$/i,
    /^(.+?)\s+[-–—]\s+(.+)$/,
    /^(.{2,40}?)\s+or\s+(.{2,40})$/i,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1].trim() && match[2].trim()) {
      return [match[1].trim(), match[2].trim()];
    }
  }
  return null;
}

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      const parsed = parseComparison(query);
      if (parsed) {
        const slug = `${slugify(parsed[0])}-vs-${slugify(parsed[1])}`;
        trackComparisonSearch(query.trim(), "comparison");
        router.push(`/compare/${slug}`);
      } else {
        trackComparisonSearch(query.trim(), "general");
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsOpen(false);
      setQuery("");
    },
    [query, router]
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-full text-sm text-gray-400 hover:shadow-sm transition-all"
        aria-label="Search comparisons"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-200 dark:bg-gray-700 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center" role="search" aria-label="Search comparisons">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-primary-400 dark:border-primary-500 rounded-full shadow-lg ring-2 ring-primary-400/20">
          <svg className="w-4 h-4 ml-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or compare..."
            className="w-48 sm:w-64 px-3 py-2 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => { setIsOpen(false); setQuery(""); }}
            className="mr-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            aria-label="Close search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

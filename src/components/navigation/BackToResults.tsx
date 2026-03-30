"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SEARCH_CONTEXT_KEY = "avb_search_context";

export interface SearchContext {
  query: string;
  url: string;
  timestamp: number;
}

/** Save search context to sessionStorage when navigating from search results. */
export function saveSearchContext(query: string, url: string) {
  if (typeof window === "undefined") return;
  const ctx: SearchContext = { query, url, timestamp: Date.now() };
  sessionStorage.setItem(SEARCH_CONTEXT_KEY, JSON.stringify(ctx));
}

/** Read saved search context. Returns null if expired (>30 min) or missing. */
export function getSearchContext(): SearchContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SEARCH_CONTEXT_KEY);
    if (!raw) return null;
    const ctx: SearchContext = JSON.parse(raw);
    // Expire after 30 minutes
    if (Date.now() - ctx.timestamp > 30 * 60 * 1000) {
      sessionStorage.removeItem(SEARCH_CONTEXT_KEY);
      return null;
    }
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Renders a "Back to results" link when the user navigated from a search page.
 * Preserves the original search query and URL.
 */
export function BackToResults() {
  const [ctx, setCtx] = useState<SearchContext | null>(null);

  useEffect(() => {
    setCtx(getSearchContext());
  }, []);

  if (!ctx) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
      <Link
        href={ctx.url}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-600 transition-colors group"
      >
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to results for &ldquo;{ctx.query}&rdquo;
      </Link>
    </div>
  );
}

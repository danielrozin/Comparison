"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSearchContext } from "@/lib/utils/recently-viewed";

export function BackToResults() {
  const searchParams = useSearchParams();
  const fromParam = searchParams?.get("from") ?? null;
  const [fallbackQuery, setFallbackQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!fromParam) {
      setFallbackQuery(getSearchContext());
    }
  }, [fromParam]);

  const query = fromParam || fallbackQuery;
  if (!query) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        className="group inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-all duration-150"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to results for &ldquo;{query}&rdquo;
      </Link>
    </div>
  );
}

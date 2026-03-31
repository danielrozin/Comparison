"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function BackToResults() {
  const searchParams = useSearchParams();
  const fromSearch = searchParams.get("from");

  if (!fromSearch) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
      <Link
        href={`/search?q=${encodeURIComponent(fromSearch)}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to results for &ldquo;{fromSearch}&rdquo;
      </Link>
    </div>
  );
}

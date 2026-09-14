"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import { BLOG_COMPARE_SOFT_HREF } from "@/lib/data/blog-compare-constants";

export interface BlogCompareCTAProps {
  blogSlug: string;
  /** First related live compare slug (primary CTA). */
  primarySlug?: string | null;
  primaryTitle?: string | null;
  /** Soft explore href when no live primary — never a dead /compare. */
  softHref?: string;
}

/**
 * Mid-article primary CTA + optional sticky mobile bar.
 * ROO-9: push blog landers into live /compare pages with tracking.
 */
export function BlogCompareCTA({
  blogSlug,
  primarySlug,
  primaryTitle,
  softHref = BLOG_COMPARE_SOFT_HREF,
}: BlogCompareCTAProps) {
  const [showSticky, setShowSticky] = useState(false);
  const hasPrimary = Boolean(primarySlug);
  const href = hasPrimary ? `/compare/${primarySlug}` : softHref;
  const label = hasPrimary
    ? primaryTitle || primarySlug!.replace(/-/g, " ")
    : "Explore side-by-side comparisons";
  const ctaVerb = hasPrimary ? "Compare now" : "Start comparing";

  useEffect(() => {
    function onScroll() {
      // Show sticky after ~35% scroll on mobile; hide near footer
      const scrolled = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? scrolled / docH : 0;
      setShowSticky(pct > 0.2 && pct < 0.88);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    trackRelatedComparisonClick(blogSlug, primarySlug || softHref);
  }

  return (
    <>
      <aside
        aria-label="Related comparison"
        className="my-6 rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 via-white to-accent-50 overflow-hidden shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 mb-0.5">
                {hasPrimary ? "Head-to-head comparison" : "Ready to decide?"}
              </p>
              <p className="text-sm sm:text-base font-bold text-text leading-snug truncate sm:whitespace-normal">
                {label}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {hasPrimary
                  ? "See attribute winners, verdict, and community votes."
                  : "Search any two options and get a structured side-by-side."}
              </p>
            </div>
          </div>
          <Link
            href={href}
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-sm hover:shadow-md transition-all duration-150 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {ctaVerb}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </aside>

      {/* Sticky mobile bar — md:hidden so desktop stays mid-article only */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-200 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        role="complementary"
        aria-label="Compare CTA"
      >
        <div className="mx-3 mb-3 rounded-xl border border-primary-200 bg-white/95 backdrop-blur-md shadow-lg p-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">Compare</p>
            <p className="text-sm font-semibold text-text truncate">{label}</p>
          </div>
          <Link
            href={href}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Go
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

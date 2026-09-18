"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import {
  COMPARE_NEXT_SOFT_HREF,
  COMPARE_NEXT_SOURCE,
} from "@/lib/data/compare-next-constants";

export type CompareNextStepChip = {
  slug: string;
  label: string;
};

export type CompareNextStepCTAProps = {
  /** Live chips already filtered server-side (DAN-2581). */
  chips: CompareNextStepChip[];
  /** PostHog source_page (default: compare-next). */
  source?: string;
  /** Soft explore when chips empty. */
  softHref?: string;
};

/**
 * Mid-page next-step compare chips for high-bounce /compare landers.
 * ROO-29: drive a second comparison_viewed via related_comparison_click
 * + ?source_page=compare-next (same pattern as HomeCompareCTA / ROO-30).
 */
export function CompareNextStepCTA({
  chips,
  source = COMPARE_NEXT_SOURCE,
  softHref = COMPARE_NEXT_SOFT_HREF,
}: CompareNextStepCTAProps) {
  const [showSticky, setShowSticky] = useState(false);
  const hasChips = chips.length > 0;
  const primary = hasChips ? chips[0] : null;
  const primaryHref = primary ? `/compare/${primary.slug}` : softHref;
  const primaryLabel = primary
    ? primary.label
    : "Browse trending comparisons";

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? scrolled / docH : 0;
      // After leaving hero/verdict; hide near footer / bottom related grid
      setShowSticky(pct > 0.18 && pct < 0.82);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function withSourcePage(href: string) {
    if (!source) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}source_page=${encodeURIComponent(source)}`;
  }

  function track(target: string) {
    trackRelatedComparisonClick(source, target);
  }

  return (
    <>
      <aside
        aria-label="Compare something next"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      >
        <div className="rounded-2xl border border-primary-200/70 bg-gradient-to-r from-primary-50 via-white to-accent-50 p-4 sm:p-5 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 mb-0.5">
                  Compare next
                </p>
                <p className="text-sm sm:text-base font-bold text-text leading-snug">
                  {hasChips
                    ? "Keep going — another live head-to-head"
                    : "Explore more side-by-sides"}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {hasChips
                    ? "Jump to a related comparison — winners, verdict, and votes."
                    : "Browse trending matchups or search any two options."}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <Link
                href={withSourcePage(primaryHref)}
                onClick={() => track(primary ? primary.slug : softHref)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-sm hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {hasChips ? "Compare now" : "Browse trending"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href={withSourcePage(softHref)}
                onClick={() => track(softHref)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-700 bg-white ring-1 ring-primary-200 hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Trending
              </Link>
            </div>
          </div>

          {hasChips && (
            <ul
              className="mt-3 flex flex-wrap gap-2 list-none p-0"
              aria-label="Related comparisons to try next"
            >
              {chips.map((chip) => (
                <li key={chip.slug}>
                  <Link
                    href={withSourcePage(`/compare/${chip.slug}`)}
                    onClick={() => track(chip.slug)}
                    className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 px-3 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 hover:border-primary-300 rounded-full text-xs font-medium text-text hover:text-primary-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <span
                      className="text-[10px] font-black text-primary-600"
                      aria-hidden="true"
                    >
                      VS
                    </span>
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Sticky mobile bar — md:hidden; bounce recovery after scroll */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-200 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        role="complementary"
        aria-label="Compare next CTA"
      >
        <div className="mx-3 mb-3 rounded-xl border border-primary-200 bg-white/95 backdrop-blur-md shadow-lg p-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">
              Compare next
            </p>
            <p className="text-sm font-semibold text-text truncate">
              {primaryLabel}
            </p>
          </div>
          <Link
            href={withSourcePage(primaryHref)}
            onClick={() => track(primary ? primary.slug : softHref)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Go
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

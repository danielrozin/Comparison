"use client";

import Link from "next/link";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import {
  HOME_COMPARE_SOURCE,
  HOME_COMPARE_TRENDING_HREF,
} from "@/lib/data/home-compare-constants";

export interface HomeFooterCompareCTAProps {
  primarySlug?: string | null;
  primaryTitle?: string | null;
}

/**
 * Bottom-of-home CTA — always lands on a live compare or /trending.
 * ROO-16: replaces soft `/#search` dead end.
 */
export function HomeFooterCompareCTA({
  primarySlug,
  primaryTitle,
}: HomeFooterCompareCTAProps) {
  const hasPrimary = Boolean(primarySlug);
  const href = hasPrimary ? `/compare/${primarySlug}` : HOME_COMPARE_TRENDING_HREF;
  const label = hasPrimary ? "Compare now" : "Browse trending";
  const trackTarget = hasPrimary ? primarySlug! : HOME_COMPARE_TRENDING_HREF;

  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 text-white py-16 relative overflow-hidden"
    >
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="home-cta-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4" />
            <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-cta-grid)" />
      </svg>
      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <h2 id="cta-heading" className="text-2xl sm:text-3xl font-display font-bold mb-4">
          Ready to Compare?
        </h2>
        <p className="text-primary-100 mb-2">
          {hasPrimary
            ? `Start with ${primaryTitle || primarySlug!.replace(/-/g, " ")} — or pick any other matchup.`
            : "Start with any comparison — sports, countries, products, or anything else."}
        </p>
        <p className="text-xs text-primary-200/80 mb-8">
          Side-by-side attributes, verdict, and community votes — free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={href}
            onClick={() => trackRelatedComparisonClick(HOME_COMPARE_SOURCE, trackTarget)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
          >
            {label}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={HOME_COMPARE_TRENDING_HREF}
            onClick={() =>
              trackRelatedComparisonClick(HOME_COMPARE_SOURCE, HOME_COMPARE_TRENDING_HREF)
            }
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Trending comparisons
          </Link>
        </div>
      </div>
    </section>
  );
}

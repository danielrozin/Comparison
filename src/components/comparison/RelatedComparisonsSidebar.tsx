"use client";

import Link from "next/link";
import type { RelatedComparison } from "@/types";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

const AVATAR_GRADIENTS = [
  "from-primary-400 to-primary-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
];

function avatarGradient(letter: string) {
  const code = (letter || "A").toUpperCase().charCodeAt(0) - 65;
  return AVATAR_GRADIENTS[Math.abs(code) % AVATAR_GRADIENTS.length];
}

function ComparisonCard({
  comp,
  sourceSlug,
  isTrending,
}: {
  comp: RelatedComparison;
  sourceSlug: string;
  isTrending?: boolean;
}) {
  const parts = comp.title.split(/\s+vs\.?\s+/i);
  const gradA = avatarGradient((parts[0] || "A").charAt(0));
  const gradB = avatarGradient((parts[1] || "B").charAt(0));
  return (
    <Link
      href={`/compare/${comp.slug}`}
      onClick={() => trackRelatedComparisonClick(sourceSlug, comp.slug)}
      className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group shrink-0 lg:shrink relative overflow-hidden"
    >
      {/* Hot accent stripe */}
      {isTrending && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-rose-500" />
      )}

      <div className="flex -space-x-2 flex-shrink-0">
        <div className={`w-8 h-8 bg-gradient-to-br ${gradA} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm`}>
          {(parts[0] || "A").charAt(0).toUpperCase()}
        </div>
        <div className={`w-8 h-8 bg-gradient-to-br ${gradB} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm`}>
          {(parts[1] || "B").charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate group-hover:text-primary-700 transition-colors leading-snug">
          {comp.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {comp.category && (
            <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-border/60 text-text-secondary capitalize">
              {comp.category}
            </span>
          )}
          {isTrending && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-100">
              <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              {" "}Hot
            </span>
          )}
        </div>
      </div>
      <svg
        className="w-3.5 h-3.5 text-text-secondary/50 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

type RelatedSidebarProps = {
  comparisons: RelatedComparison[];
  sourceSlug: string;
  /** "mobile" renders only the horizontal scroll strip; "desktop" renders only the sticky aside; default renders both (legacy). */
  variant?: "mobile" | "desktop";
};

export function RelatedComparisonsSidebar({
  comparisons,
  sourceSlug,
  variant,
}: RelatedSidebarProps) {
  if (comparisons.length === 0) return null;

  const items = comparisons.slice(0, 6);
  const showMobile = variant !== "desktop";
  const showDesktop = variant !== "mobile";

  return (
    <>
      {showMobile && (
        <div className="lg:hidden px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-text">Related Comparisons</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {items.map((comp, i) => (
              <div key={comp.slug} className="snap-start min-w-[260px] max-w-[300px]">
                <ComparisonCard comp={comp} sourceSlug={sourceSlug} isTrending={i < 2} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showDesktop && (
        <aside className="hidden lg:block w-[320px] shrink-0" aria-label="Related comparisons">
          <div className="sticky top-24">
            <div className="bg-surface/60 border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-text">Related Comparisons</h3>
              </div>
              <div className="space-y-2">
                {items.map((comp, i) => (
                  <ComparisonCard
                    key={comp.slug}
                    comp={comp}
                    sourceSlug={sourceSlug}
                    isTrending={i < 2}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

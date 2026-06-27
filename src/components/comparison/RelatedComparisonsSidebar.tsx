"use client";

import Link from "next/link";
import type { RelatedComparison } from "@/types";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

const AVATAR_COLORS = [
  { bg: "bg-primary-100", text: "text-primary-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

function avatarColor(letter: string) {
  const code = (letter || "A").toUpperCase().charCodeAt(0) - 65;
  return AVATAR_COLORS[Math.abs(code) % AVATAR_COLORS.length];
}

function ComparisonCard({
  comp,
  sourceSlug,
}: {
  comp: RelatedComparison;
  sourceSlug: string;
}) {
  const parts = comp.title.split(/\s+vs\.?\s+/i);
  const colorA = avatarColor((parts[0] || "A").charAt(0));
  const colorB = avatarColor((parts[1] || "B").charAt(0));
  return (
    <Link
      href={`/compare/${comp.slug}`}
      onClick={() => trackRelatedComparisonClick(sourceSlug, comp.slug)}
      className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 group shrink-0 lg:shrink"
    >
      <div className="flex -space-x-2 flex-shrink-0">
        <div className={`w-8 h-8 ${colorA.bg} rounded-full flex items-center justify-center text-xs font-bold ${colorA.text} ring-2 ring-white`}>
          {(parts[0] || "A").charAt(0).toUpperCase()}
        </div>
        <div className={`w-8 h-8 ${colorB.bg} rounded-full flex items-center justify-center text-xs font-bold ${colorB.text} ring-2 ring-white`}>
          {(parts[1] || "B").charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate group-hover:text-primary-700 transition-colors leading-snug">
          {comp.title}
        </p>
        {comp.category && (
          <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-border/60 text-text-secondary capitalize mt-0.5">
            {comp.category}
          </span>
        )}
      </div>
      <svg
        className="w-3.5 h-3.5 text-text-secondary/50 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
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
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-text">Related Comparisons</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {items.map((comp) => (
              <div key={comp.slug} className="snap-start min-w-[260px] max-w-[300px]">
                <ComparisonCard comp={comp} sourceSlug={sourceSlug} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showDesktop && (
        <aside className="hidden lg:block w-[320px] shrink-0">
          <div className="sticky top-24">
            <div className="bg-surface/60 border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-text">Related Comparisons</h3>
              </div>
              <div className="space-y-2">
                {items.map((comp) => (
                  <ComparisonCard
                    key={comp.slug}
                    comp={comp}
                    sourceSlug={sourceSlug}
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

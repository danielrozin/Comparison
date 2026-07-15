"use client";

import Link from "next/link";
import type { RelatedComparison } from "@/types";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

const CARD_GRADIENTS = [
  "from-primary-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-sky-500",
];

const CATEGORY_COLORS: Record<string, string> = {
  technology: "bg-blue-50 text-blue-700 border-blue-100",
  products: "bg-violet-50 text-violet-700 border-violet-100",
  sports: "bg-orange-50 text-orange-700 border-orange-100",
  health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  automotive: "bg-slate-50 text-slate-700 border-slate-100",
  gaming: "bg-purple-50 text-purple-700 border-purple-100",
  countries: "bg-cyan-50 text-cyan-700 border-cyan-100",
  entertainment: "bg-pink-50 text-pink-700 border-pink-100",
  history: "bg-amber-50 text-amber-700 border-amber-100",
};

function avatarGradient(idx: number, letter: string): string {
  const pairs = [
    "from-primary-400 to-primary-600",
    "from-accent-400 to-accent-600",
    "from-violet-400 to-violet-600",
    "from-emerald-400 to-emerald-600",
    "from-rose-400 to-rose-600",
    "from-amber-400 to-amber-600",
  ];
  const code = letter.charCodeAt(0) % pairs.length;
  return pairs[(idx === 0 ? code : (code + 2) % pairs.length)];
}

export function RelatedComparisons({
  comparisons,
  sourceSlug,
}: {
  comparisons: RelatedComparison[];
  sourceSlug?: string;
}) {
  return (
    <ScrollReveal delay={40}>
    <section id="related-comparisons" aria-labelledby="related-comparisons-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h2 id="related-comparisons-heading" className="text-2xl font-display font-bold text-text">Related Comparisons</h2>
            <p className="text-xs text-text-secondary mt-0.5">{comparisons.length} more to explore</p>
          </div>
        </div>
      </div>

      {/* Scroll-fade wrapper — right-edge fade signals more cards off-screen on mobile */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" aria-hidden="true" />
      <ul role="list" aria-label="Related comparisons" className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:snap-none sm:pb-0 lg:grid-cols-4 list-none">
        {comparisons.map((comp, cardIdx) => {
          const parts = comp.title.split(/\s+vs\.?\s+/i);
          const letterA = (parts[0] || "A").charAt(0).toUpperCase();
          const letterB = (parts[1] || "B").charAt(0).toUpperCase();
          const catColor = comp.category
            ? CATEGORY_COLORS[comp.category.toLowerCase()] ?? "bg-surface-alt text-text-secondary border-border"
            : null;

          return (
            <li key={comp.slug} className="flex flex-shrink-0 snap-start w-[220px] sm:w-auto sm:flex-shrink">
            <Link
              href={`/compare/${comp.slug}`}
              onClick={() => trackRelatedComparisonClick(sourceSlug || "", comp.slug)}
              style={{ animationDelay: `${Math.min(cardIdx, 5) * 40}ms` }}
              className="group relative flex flex-col gap-3 p-4 pt-5 bg-white border border-border rounded-2xl hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 overflow-hidden animate-fade-in w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {/* Gradient accent stripe */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${CARD_GRADIENTS[cardIdx % CARD_GRADIENTS.length]}`} />

              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/60 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

              {/* Avatars row — overlapping circles with VS badge, consistent with category + search cards */}
              <div className="relative flex items-center justify-between" aria-hidden="true">
                <div className="relative h-10 flex-shrink-0" style={{ width: "58px" }}>
                  <div className={`absolute left-0 top-0.5 w-9 h-9 bg-gradient-to-br ${avatarGradient(0, letterA)} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-10`}>
                    {letterA}
                  </div>
                  <div className={`absolute left-5 top-0.5 w-9 h-9 bg-gradient-to-br ${avatarGradient(1, letterB)} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-0`}>
                    {letterB}
                  </div>
                  <div className="absolute bottom-0 left-[18px] z-20 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white">
                    <span className="text-[7px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-text-secondary/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Title */}
              <div className="relative flex-1">
                <h3 className="text-sm font-semibold text-text leading-snug group-hover:text-primary-700 transition-colors line-clamp-2 m-0">
                  {comp.title}
                </h3>
              </div>

              {/* Category badge */}
              {catColor && comp.category && (
                <div className="relative">
                  <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${catColor}`}>
                    {comp.category}
                  </span>
                </div>
              )}
            </Link>
            </li>
          );
        })}
      </ul>
      </div>

      {/* Browse all CTA */}
      <div className="flex justify-center">
        <Link
          href="/trending"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-200 hover:bg-primary-100 hover:border-primary-300 hover:text-primary-700 transition-all duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Browse all comparisons
        </Link>
      </div>
    </section>
    </ScrollReveal>
  );
}

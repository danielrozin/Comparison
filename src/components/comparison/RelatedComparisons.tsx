"use client";

import Link from "next/link";
import type { RelatedComparison } from "@/types";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

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
    <section aria-labelledby="related-comparisons-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 list-none">
        {comparisons.map((comp, cardIdx) => {
          const parts = comp.title.split(/\s+vs\.?\s+/i);
          const letterA = (parts[0] || "A").charAt(0).toUpperCase();
          const letterB = (parts[1] || "B").charAt(0).toUpperCase();
          const catColor = comp.category
            ? CATEGORY_COLORS[comp.category.toLowerCase()] ?? "bg-surface-alt text-text-secondary border-border"
            : null;

          return (
            <li key={comp.slug} className="flex">
            <Link
              href={`/compare/${comp.slug}`}
              onClick={() => trackRelatedComparisonClick(sourceSlug || "", comp.slug)}
              style={{ animationDelay: `${cardIdx * 40}ms` }}
              className="group relative flex flex-col gap-3 p-4 pt-5 bg-white border border-border rounded-2xl hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 overflow-hidden animate-fade-in w-full"
            >
              {/* Gradient accent stripe */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${CARD_GRADIENTS[cardIdx % CARD_GRADIENTS.length]}`} />

              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/60 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

              {/* Avatars row — decorative; link text comes from the title below */}
              <div className="relative flex items-center justify-between" aria-hidden="true">
                <div className="flex items-center gap-1">
                  <div className={`w-9 h-9 bg-gradient-to-br ${avatarGradient(0, letterA)} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm`}>
                    {letterA}
                  </div>
                  <span className="text-[8px] font-black text-text-secondary/50 uppercase px-0.5">vs</span>
                  <div className={`w-9 h-9 bg-gradient-to-br ${avatarGradient(1, letterB)} rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm`}>
                    {letterB}
                  </div>
                </div>
                <svg className="w-4 h-4 text-text-secondary/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Title */}
              <div className="relative flex-1">
                <p className="text-sm font-semibold text-text leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
                  {comp.title}
                </p>
              </div>

              {/* Category badge */}
              {catColor && comp.category && (
                <div className="relative">
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${catColor}`}>
                    {comp.category}
                  </span>
                </div>
              )}
            </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import Link from "next/link";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import { BLOG_COMPARE_SOFT_HREF } from "@/lib/data/blog-related-compares";

export interface BlogRelatedComparisonsProps {
  blogSlug: string;
  slugs: string[];
  titles: Record<string, string>;
}

/**
 * Bottom related-comparisons rail with tracked clicks (ROO-9).
 * When slugs is empty, renders a soft Explore CTA — never dead /compare links.
 */
export function BlogRelatedComparisons({
  blogSlug,
  slugs,
  titles,
}: BlogRelatedComparisonsProps) {
  if (!slugs.length) {
    return (
      <section
        aria-labelledby="blog-related-comparisons-heading"
        className="mt-8 rounded-xl border border-border overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 id="blog-related-comparisons-heading" className="text-base font-bold text-text">
              Explore comparisons
            </h2>
            <p className="text-xs text-text-secondary">Find any A vs B side-by-side</p>
          </div>
        </div>
        <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-text-secondary flex-1">
            No related live comparisons for this article yet — search our database or browse trending head-to-heads.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={BLOG_COMPARE_SOFT_HREF}
              onClick={() => trackRelatedComparisonClick(blogSlug, BLOG_COMPARE_SOFT_HREF)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Search comparisons
            </Link>
            <Link
              href="/trending"
              onClick={() => trackRelatedComparisonClick(blogSlug, "/trending")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-primary-700 bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Trending
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="blog-related-comparisons-heading"
      className="mt-8 rounded-xl border border-border overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 id="blog-related-comparisons-heading" className="text-base font-bold text-text">
            Related Comparisons
          </h2>
          <p className="text-xs text-text-secondary">{slugs.length} head-to-head comparisons</p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none">
          {slugs.map((compSlug) => {
            const title = titles[compSlug] || compSlug.replace(/-/g, " ");
            const parts = title.split(/\s+vs\.?\s+/i);
            return (
              <li key={compSlug} className="flex">
                <Link
                  href={`/compare/${compSlug}`}
                  onClick={() => trackRelatedComparisonClick(blogSlug, compSlug)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-alt/30 hover:border-primary-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <div className="relative flex-shrink-0 h-9" style={{ width: "50px" }} aria-hidden="true">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-10">
                      {(parts[0] || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute left-4 top-0 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-0">
                      {(parts[1] || "B").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 left-[14px] z-20 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white">
                      <span className="text-[6px] font-black text-white leading-none">VS</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors flex-1 min-w-0 truncate">
                    {title}
                  </span>
                  <svg className="w-3.5 h-3.5 text-text-secondary/50 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

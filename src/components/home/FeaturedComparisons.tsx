import Link from "next/link";
import type { FeaturedComparison } from "@/lib/data/featured-comparisons";

interface FeaturedComparisonsProps {
  items: FeaturedComparison[];
  /** Section heading. */
  title?: string;
  /** Sub-heading under the title. */
  subtitle?: string;
  /** Tailwind classes for the wrapping <section>. */
  className?: string;
}

/**
 * Server-rendered "Featured comparisons" / Editor's picks grid.
 *
 * Renders plain `<a href>` links (via next/link) so the curated inbound links
 * are fully crawlable in the SSR HTML — not client-only. Used on the homepage
 * and pinned on category hubs (DAN-1020).
 */
export function FeaturedComparisons({
  items,
  title = "Featured Comparisons",
  subtitle = "Editor's picks — hand-selected, expert-written comparisons",
  className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
}: FeaturedComparisonsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={className} aria-label="Featured comparisons">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">{title}</h2>
            {subtitle && <p className="text-text-secondary text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <Link
          href="/trending"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const parts = item.anchor.split(/\s+vs\.?\s+/i);
          const gradients = [
            "from-primary-500 to-indigo-600",
            "from-violet-500 to-purple-600",
            "from-rose-500 to-pink-600",
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-orange-600",
            "from-cyan-500 to-sky-600",
          ];
          const grad = gradients[idx % gradients.length];
          const isTop = idx === 0;
          return (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className={`group relative flex flex-col bg-white border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${isTop ? "border-amber-200 hover:border-amber-300 ring-1 ring-amber-100" : "border-border hover:border-primary-200"}`}
            >
              {/* Gradient accent header */}
              <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
              {/* Editor's Pick crown badge on first card */}
              {isTop && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm shadow-amber-300/40 z-10">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Editor&apos;s Pick
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex -space-x-2 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                      {(parts[0] || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                      {(parts[1] || "B").charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text group-hover:text-primary-700 transition-colors block leading-snug text-base">
                      {item.anchor}
                    </h3>
                    {item.categories?.[0] && (
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 capitalize">
                        {item.categories[0]}
                      </span>
                    )}
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`} aria-hidden="true">
                    <span className="text-[8px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{item.blurb}</p>
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-end">
                  <span className="text-xs font-semibold text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Compare now
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

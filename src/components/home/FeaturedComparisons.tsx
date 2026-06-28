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
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-text flex items-center gap-2">
          <span aria-hidden="true">⭐</span> {title}
        </h2>
        {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
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
          return (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:border-primary-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Gradient accent header */}
              <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

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
                    <span className="font-bold text-text group-hover:text-primary-700 transition-colors block leading-snug">
                      {item.anchor}
                    </span>
                    {item.categories?.[0] && (
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 capitalize">
                        {item.categories[0]}
                      </span>
                    )}
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-[8px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{item.blurb}</p>
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-end">
                  <span className="text-xs font-semibold text-primary-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Compare now
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

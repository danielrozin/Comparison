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
        {items.map((item) => {
          const parts = item.anchor.split(/\s+vs\.?\s+/i);
          return (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="group flex flex-col p-5 bg-gradient-to-br from-accent-50 to-white border border-accent-200 rounded-xl hover:border-accent-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                    {(parts[0] || "A").charAt(0)}
                  </div>
                  <div className="w-9 h-9 bg-accent-100 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
                    {(parts[1] || "B").charAt(0)}
                  </div>
                </div>
                <span className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                  {item.anchor}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.blurb}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

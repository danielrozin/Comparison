// DAN-1013: curated "Featured Comparisons" module. Renders exact-match anchor
// links into the page-1 push targets from the homepage and category hubs.
import Link from "next/link";
import type { FeaturedComparison } from "@/lib/data/featured-comparisons";

export function FeaturedComparisons({
  items,
  heading = "Featured Comparisons",
  subheading = "Hand-picked head-to-head guides our editors recommend",
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
}: {
  items: FeaturedComparison[];
  heading?: string;
  subheading?: string;
  containerClassName?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={containerClassName}>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">{heading}</h2>
        <p className="text-text-secondary mt-1">{subheading}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const parts = item.anchor.split(/\s+vs\.?\s+/i);
          return (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="flex flex-col p-5 bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl hover:border-primary-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                    {(parts[0] || "A").charAt(0)}
                  </div>
                  <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
                    {(parts[1] || "B").charAt(0)}
                  </div>
                </div>
                {/* Exact-match anchor text — primary internal-link signal */}
                <span className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                  {item.anchor}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{item.blurb}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

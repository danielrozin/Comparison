import Link from "next/link";
import type { TrendingComparison } from "@/types";
import { CategoryIcon } from "@/lib/utils/category-icons";

export function ComparisonTicker({ items }: { items: TrendingComparison[] }) {
  if (!items.length) return null;

  // Duplicate the list so the seamless loop works
  const doubled = [...items, ...items];

  return (
    <div role="region" aria-label="Trending comparisons ticker" className="bg-white border-b border-border overflow-hidden">
      <div className="flex items-center">
        {/* Fixed "TRENDING" label */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white z-10 shadow-sm">
          <svg className="w-3.5 h-3.5 animate-flame" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Trending</span>
        </div>

        {/* Scrolling items */}
        <div className="relative flex-1 overflow-hidden">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-0 whitespace-nowrap motion-reduce:animate-none">
            {doubled.map((item, idx) => {
              const parts = item.title.split(/\s+vs\.?\s+/i);
              const a = parts[0] || item.title;
              const b = parts[1] || "";
              return (
                <Link
                  key={`${item.slug}-${idx}`}
                  href={`/compare/${item.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text hover:text-primary-700 group transition-colors duration-150 border-r border-border/40 last:border-r-0"
                  tabIndex={idx >= items.length ? -1 : 0}
                  aria-hidden={idx >= items.length ? "true" : undefined}
                >
                  <span className="text-text-secondary/60" aria-hidden="true">
                    <CategoryIcon category={item.category} />
                  </span>
                  <span className="group-hover:text-primary-600 transition-colors">{a}</span>
                  <span aria-hidden="true" className="inline-flex items-center justify-center text-[8px] font-black text-white bg-gradient-to-r from-primary-500 to-accent-500 px-1 py-0.5 rounded leading-none mx-0.5">VS</span>
                  <span className="group-hover:text-primary-600 transition-colors">{b}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

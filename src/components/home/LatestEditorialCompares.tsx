import type { EditorialCompareCard } from "@/lib/data/editorial-compares/listing";

/**
 * ROO-453 — server-rendered "Latest in-depth comparisons" strip.
 *
 * Plain <a href> links to the newest in-repo editorial compares, so the
 * homepage and /trending link every new answer page within a day of merge.
 */
export function LatestEditorialCompares({
  items,
  headingId = "latest-editorial-heading",
}: {
  items: EditorialCompareCard[];
  headingId?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <h2 id={headingId} className="text-2xl sm:text-3xl font-display font-bold text-text">
            Latest in-depth comparisons
          </h2>
          <p className="text-text-secondary mt-1">Newly published, researched A vs B pages</p>
        </div>
        <a href="/compare" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0">
          All comparisons <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 list-none">
        {items.map((c) => (
          <li key={c.slug}>
            <a
              href={`/compare/${c.slug}`}
              className="block h-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text hover:border-primary-300 hover:text-primary-700 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

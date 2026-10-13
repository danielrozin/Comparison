"use client";

import Link from "next/link";
import { trackCompareNextSearch, trackRelatedComparisonClick } from "@/lib/utils/analytics";
import type { CompareNextStepChip } from "@/components/comparison/CompareNextStepCTA";

export const COMPARE_NEXT_PLACEMENT = "compare_next";
export const COMPARE_NEXT_LIMIT = 3;

/**
 * ROO-155 — "Compare next" block right after the verdict.
 *
 * Up to three live related compares as cards, plus a small "Compare
 * something else" search box. `chips` are already live-filtered on the
 * server (buildCompareNextChips, DAN-2581), so nothing here can 404.
 * Real hrefs, so crawlers and no-JS readers can follow them.
 */
export function CompareNextCards({
  slug,
  chips,
}: {
  slug: string;
  chips: readonly CompareNextStepChip[];
}) {
  const cards = chips.filter((chip) => chip.slug !== slug).slice(0, COMPARE_NEXT_LIMIT);
  const sourcePage = `/compare/${slug}`;

  return (
    <section
      aria-labelledby="compare-next-heading"
      data-testid="compare-next"
      data-placement={COMPARE_NEXT_PLACEMENT}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-4">
        <h2 id="compare-next-heading" className="text-base font-bold text-text m-0">
          Compare next
        </h2>
        {cards.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-3 list-none m-0 p-0">
            {cards.map((chip, index) => (
              <li key={chip.slug} className="min-w-0">
                <Link
                  href={`/compare/${chip.slug}?source_page=${encodeURIComponent(sourcePage)}`}
                  onClick={() =>
                    trackRelatedComparisonClick(sourcePage, chip.slug, {
                      placement: COMPARE_NEXT_PLACEMENT,
                      position: String(index + 1),
                    })
                  }
                  className="flex h-full items-center gap-2 min-h-11 rounded-lg border border-primary-100 bg-white px-3 py-2.5 text-sm font-semibold text-primary-800 hover:border-primary-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <span className="min-w-0 flex-1 break-words">{chip.label}</span>
                  <span aria-hidden="true" className="text-primary-500">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <form
          action="/search"
          method="get"
          role="search"
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            const input = event.currentTarget.elements.namedItem("q");
            const query = input instanceof HTMLInputElement ? input.value.trim() : "";
            if (query) trackCompareNextSearch(query, slug);
          }}
        >
          <label htmlFor="compare-next-search" className="sr-only">
            Compare something else
          </label>
          <input
            id="compare-next-search"
            type="search"
            name="q"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Compare something else, e.g. iPhone vs Pixel"
            className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700"
          >
            Compare
          </button>
        </form>
      </div>
    </section>
  );
}

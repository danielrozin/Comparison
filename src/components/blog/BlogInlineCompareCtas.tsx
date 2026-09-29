"use client";

import { TrackedCompareLink } from "@/components/home/HomeCompareCTA";
import type { CashiersCheckCompareLink } from "@/lib/data/cashiers-check-blog-cta";

/**
 * ROO-119 — compact compare links under a blog intro.
 * Reuses TrackedCompareLink so the click fires `related_comparison_click`
 * (`source_page`, `target_page`) and the href carries `?source_page=`.
 */
export function BlogInlineCompareCtas({
  sourcePage,
  links,
}: {
  sourcePage: string;
  links: readonly CashiersCheckCompareLink[];
}) {
  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Related comparisons"
      data-testid="blog-inline-compare-ctas"
      className="my-6 rounded-xl border border-primary-200 bg-primary-50/60 p-4"
    >
      <p className="text-sm font-semibold text-text">
        Compare banks and money-transfer apps
      </p>
      <ul className="mt-2 flex flex-col gap-2 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.slug}>
            <TrackedCompareLink
              slug={link.slug}
              source={sourcePage}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {link.label}
            </TrackedCompareLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import type { InlineCardPosition } from "@/lib/blog/inline-comparison-card";

export interface InlineComparisonLink {
  slug: string;
  title: string;
}

/**
 * ROO-165 — "Compare the options in this article".
 *
 * Rendered on the server as normal links (real hrefs) so search engines
 * and readers without JavaScript can follow them. The click handler only
 * adds the PostHog event; it does not replace the link.
 */
export function BlogInlineComparisonCard({
  articleSlug,
  position,
  links,
}: {
  articleSlug: string;
  position: InlineCardPosition;
  links: readonly InlineComparisonLink[];
}) {
  if (links.length === 0) return null;

  const sourcePage = `/blog/${articleSlug}`;
  const headingId = `compare-options-in-article-${position}`;

  return (
    <section
      aria-labelledby={headingId}
      data-testid="blog-inline-comparison-card"
      data-inline-comparison-card=""
      data-position={position}
      className="my-6 rounded-xl border border-primary-200 bg-primary-50/70 p-4 sm:p-5"
    >
      {/* A paragraph, not an <h2>, so the article outline and the speakable
          heading selector stay on the writer's headings. */}
      <p id={headingId} role="heading" aria-level={2} className="text-base font-bold text-text m-0">
        Compare the options in this article
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        Head-to-head pages for the choices this article covers.
      </p>
      <ul className="mt-3 flex flex-col gap-2 list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.slug} className="min-w-0">
            <Link
              href={`/compare/${link.slug}?source_page=${encodeURIComponent(sourcePage)}`}
              onClick={() =>
                trackRelatedComparisonClick(sourcePage, link.slug, {
                  placement: "blog_inline_card",
                  position,
                  article_slug: articleSlug,
                })
              }
              className="flex items-center gap-3 min-h-11 w-full rounded-lg border border-primary-100 bg-white px-3 py-2.5 text-sm font-semibold text-primary-800 hover:border-primary-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <span className="min-w-0 flex-1 break-words">{link.title}</span>
              <svg
                className="w-4 h-4 flex-shrink-0 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

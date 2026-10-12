"use client";

import { useEffect } from "react";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";

const COMPARE_PATH = /^\/compare\/([^/?#]+)\/?$/;

/** Pull the comparison slug out of an href, ignoring query strings. */
export function compareSlugFromHref(href: string): string | null {
  try {
    const url = new URL(href, "https://aversusb.net");
    const match = url.pathname.match(COMPARE_PATH);
    if (!match?.[1]) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * ROO-165 — in-body /compare/ links are plain HTML, so they have no React
 * onClick. One listener on the article records those clicks with
 * placement `blog_body_link`.
 *
 * Links inside the new card, and the older intro CTAs, already record
 * their own event. This listener skips them so a click is counted once.
 */
export function BlogBodyCompareClickTracker({ articleSlug }: { articleSlug: string }) {
  useEffect(() => {
    const root = document.querySelector("[data-blog-prose]");
    if (!root) return;
    const prose: Element = root;

    function onClick(event: Event) {
      const raw = event.target;
      const element =
        raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
      const anchor = element?.closest("a");
      if (!anchor || !prose.contains(anchor)) return;
      if (anchor.closest("[data-inline-comparison-card], [data-testid='blog-inline-compare-ctas']")) {
        return;
      }
      const href = anchor.getAttribute("href");
      if (!href) return;
      const slug = compareSlugFromHref(href);
      if (!slug) return;
      trackRelatedComparisonClick(`/blog/${articleSlug}`, slug, {
        placement: "blog_body_link",
        article_slug: articleSlug,
      });
    }

    prose.addEventListener("click", onClick);
    return () => prose.removeEventListener("click", onClick);
  }, [articleSlug]);

  return null;
}

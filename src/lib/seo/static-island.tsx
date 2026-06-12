import "server-only";
import type { ReactElement } from "react";

/**
 * Pre-render interactivity-free server subtrees to inert HTML strings.
 *
 * WHY (DAN-432, Phase A — server-island/crawl-stable variant):
 * On `/compare/*` the dominant HTML cost is the inline React Server Components
 * flight payload (`self.__next_f.push(...)`), ~108 KB pre-gzip. Every SSR'd
 * server-component element tree is serialized into that payload as nested
 * `["$","tag",null,{…}]` arrays — verbose, and a near-duplicate of the SSR'd
 * DOM it produces. For large *static* SEO sections (Key Differences, Pros &
 * Cons, data tables, verdict) that flight encoding is pure overhead: the
 * sections never hydrate or re-render on the client.
 *
 * `getStaticRenderer()` returns a renderer that collapses such a subtree to a
 * single HTML string, injected via `dangerouslySetInnerHTML`. In the flight
 * payload the subtree then costs one string prop instead of a deep element
 * tree, while the rendered DOM stays byte-for-byte identical — so there is
 * **zero** change to crawlable content (the SEO-regression gate this ticket
 * requires).
 *
 * The `react-dom/server` import is dynamic on purpose: Next.js blocks a static
 * import of it from the app graph. We only ever call this on the server during
 * SSR/SSG of `/compare/*`, never on the client.
 *
 * SAFETY: only pass components with NO client interactivity (no `"use client"`,
 * no hooks, no context, no event handlers, and no client-component
 * descendants). The output is static markup; it will never hydrate. Passing a
 * client subtree here would silently drop its interactivity, so keep usage to
 * vetted pure-presentational server sections.
 */
export async function getStaticRenderer(): Promise<(el: ReactElement) => { __html: string }> {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return (el: ReactElement) => ({ __html: renderToStaticMarkup(el) });
}

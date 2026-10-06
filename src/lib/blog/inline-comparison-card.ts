/**
 * ROO-165 — choose the comparisons for the in-article card, and decide
 * where that card sits in the rendered article HTML.
 *
 * A "comparison" here is an existing /compare/ page (for example
 * bank-of-america-vs-chase). The card only links to slugs the page has
 * already checked are published. This file does not talk to the database.
 *
 * Which comparisons, in order:
 * 1. An explicit blog → comparison map, when this article has one.
 *    The page passes only the mapped slugs that are already published.
 *    If the map exists and none of those pages are live yet, the card
 *    stays hidden — we do not fill it with a looser match.
 * 2. Links already written in the article body. Dead links were removed
 *    before this runs, so a slug found here is a real page.
 * 3. The article's related-comparison list (the stored field plus any
 *    curated fallbacks the page already merged in).
 *
 * Duplicates are skipped. At most three are kept. An empty list means
 * "do not render the card" — we never invent a comparison URL.
 */

/** Decision pages for cashier's-check articles. Unpublished until PR #373. */
export const CASHIERS_CHECK_DECISION_COMPARES = [
  { slug: "cashiers-check-vs-money-order", title: "Cashier's Check vs Money Order" },
  { slug: "cashiers-check-vs-certified-check", title: "Cashier's Check vs Certified Check" },
] as const;

/**
 * These posts are about the check itself, not about picking a bank.
 * Body links and the older bank fallbacks are the wrong card. The two
 * decision pages above are the match, and only after they are published.
 */
const BLOGS_WITH_CASHIERS_CHECK_DECISIONS = new Set([
  "how-to-get-a-cashiers-check",
  "can-you-deposit-cash-at-an-atm",
  "does-walmart-cash-checks",
]);

export function decisionComparesForBlog(
  blogSlug: string,
): readonly { slug: string; title: string }[] {
  if (!BLOGS_WITH_CASHIERS_CHECK_DECISIONS.has(blogSlug)) return [];
  return CASHIERS_CHECK_DECISION_COMPARES;
}

import { splitHtmlAfterIntro } from "@/lib/data/cashiers-check-blog-cta";

/** How many comparisons the card shows. */
export const INLINE_COMPARISON_CARD_LIMIT = 3;

export type InlineCardPosition = "top" | "mid";

export type BlogArticlePart =
  | { kind: "html"; html: string }
  | { kind: "card"; position: InlineCardPosition }
  | { kind: "intro-cta" };

function compareHrefPattern(): RegExp {
  // Slug only. A query string or hash after the slug is ignored, and the
  // closing quote is required so a short match cannot stop early.
  return /href="\/compare\/([^"/?#]+)\/?(?:[?#][^"]*)?"/gi;
}

function cleanCompareSlug(raw: string): string {
  const trimmed = raw.replace(/\/+$/, "").trim();
  if (!trimmed) return "";
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

/** Slugs of /compare/ links in document order, with duplicates removed. */
export function extractBodyCompareSlugs(html: string): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const match of html.matchAll(compareHrefPattern())) {
    const slug = cleanCompareSlug(match[1] ?? "");
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

/**
 * Up to three comparison slugs for the card.
 *
 * `preferredSlugs` must already be limited to published pages. When
 * `preferMappedOnly` is set, those slugs are the whole card: an empty
 * list renders nothing, even if the article body links somewhere else.
 */
export function selectInlineComparisonSlugs(input: {
  bodyHtml: string;
  relatedSlugs: readonly string[];
  preferredSlugs?: readonly string[];
  preferMappedOnly?: boolean;
  limit?: number;
}): string[] {
  const limit = input.limit ?? INLINE_COMPARISON_CARD_LIMIT;
  const seen = new Set<string>();
  const picked: string[] = [];

  const push = (slug: string) => {
    const clean = cleanCompareSlug(slug);
    if (!clean || seen.has(clean) || picked.length >= limit) return;
    seen.add(clean);
    picked.push(clean);
  };

  for (const slug of input.preferredSlugs ?? []) push(slug);
  if (input.preferMappedOnly) return picked;

  for (const slug of extractBodyCompareSlugs(input.bodyHtml)) push(slug);
  for (const slug of input.relatedSlugs) push(slug);
  return picked;
}

/** Index just after the first </h2>, or the first </h3> when there is no h2. */
export function indexAfterFirstHeading(html: string): number | null {
  const h2 = /<\/h2>/i.exec(html);
  if (h2?.index != null) return h2.index + h2[0].length;
  const h3 = /<\/h3>/i.exec(html);
  if (h3?.index != null) return h3.index + h3[0].length;
  return null;
}

/**
 * A cut point near 60% of the article, snapped to the end of a paragraph
 * or other block so we never slice a tag in half.
 *
 * The cut stays after the top card (with a gap, so the two cards do not
 * stack) and out of the last fifth of the article.
 */
export function indexNearSixtyPercent(html: string, afterIndex: number): number | null {
  // A short post does not have room for a second card.
  if (html.length < 800) return null;

  const target = Math.floor(html.length * 0.6);
  const min =
    afterIndex > 0
      ? afterIndex + Math.max(160, Math.floor(html.length * 0.12))
      : Math.floor(html.length * 0.4);
  const max = Math.floor(html.length * 0.8);
  if (min >= max) return null;

  const blockClose = /<\/(?:p|h2|h3|ul|ol|pre|blockquote|div)>/gi;
  let best: number | null = null;
  for (const match of html.matchAll(blockClose)) {
    const end = (match.index ?? 0) + match[0].length;
    if (end < min || end > max) continue;
    if (best == null || Math.abs(end - target) < Math.abs(best - target)) {
      best = end;
    }
  }
  return best;
}

function sliceWithCards(
  html: string,
  inserts: Array<{ at: number; position: InlineCardPosition }>,
): BlogArticlePart[] {
  const ordered = [...inserts].sort((a, b) => a.at - b.at);
  const parts: BlogArticlePart[] = [];
  let cursor = 0;

  for (const insert of ordered) {
    if (insert.at < cursor || insert.at > html.length) continue;
    if (insert.at > cursor) {
      parts.push({ kind: "html", html: html.slice(cursor, insert.at) });
    }
    parts.push({ kind: "card", position: insert.position });
    cursor = insert.at;
  }

  if (cursor < html.length) {
    parts.push({ kind: "html", html: html.slice(cursor) });
  }
  return parts.length > 0 ? parts : [{ kind: "html", html }];
}

/**
 * Split rendered article HTML so a card can be inserted after the first
 * heading and again near 60% down. Joining the html parts gives the
 * original string back — the cards do not replace any words.
 */
export function splitHtmlForInlineComparisonCards(html: string): BlogArticlePart[] {
  const topAt = indexAfterFirstHeading(html);
  const midAt = indexNearSixtyPercent(html, topAt ?? 0);
  const inserts: Array<{ at: number; position: InlineCardPosition }> = [];
  if (topAt != null) inserts.push({ at: topAt, position: "top" });
  if (midAt != null && midAt !== topAt) inserts.push({ at: midAt, position: "mid" });
  if (inserts.length === 0) return [{ kind: "html", html }];
  return sliceWithCards(html, inserts);
}

/**
 * Card slots, plus the older "under the intro" CTA on the few landers
 * that already have one. The intro CTA stays before the first heading.
 * The new card stays after that heading.
 */
export function composeBlogArticleParts(
  html: string,
  options: { cards: boolean; introCta: boolean },
): BlogArticlePart[] {
  const parts: BlogArticlePart[] = options.cards
    ? splitHtmlForInlineComparisonCards(html)
    : [{ kind: "html", html }];

  if (!options.introCta) return parts;

  const index = parts.findIndex((part) => part.kind === "html" && /<p\b/i.test(part.html));
  if (index < 0) return parts;
  const target = parts[index];
  if (target.kind !== "html") return parts;

  const split = splitHtmlAfterIntro(target.html);
  if (!split) return parts;

  const replacement: BlogArticlePart[] = [
    { kind: "html", html: split.lead },
    { kind: "intro-cta" },
  ];
  if (split.rest.length > 0) {
    replacement.push({ kind: "html", html: split.rest });
  }
  return [...parts.slice(0, index), ...replacement, ...parts.slice(index + 1)];
}

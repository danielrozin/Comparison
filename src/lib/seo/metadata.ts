// CTR metadata builders (DAN-1145, Creative Director CTR audit 2026-06-14).
//
// Three template-level fixes for the title/description we emit on /compare/*:
//   Bug 1 — double brand suffix "X | A Versus B | A Versus B". Legacy stored
//           pageTitles already end in the brand, and the root layout
//           title.template ("%s | A Versus B") appends it again. We return an
//           ABSOLUTE title (caller uses `title: { absolute }`) so the template
//           is bypassed and the brand is appended here exactly once — for
//           <title>, og:title and twitter:title alike.
//   Bug 2 — redundant "| Comparison" segment when the title already conveys a
//           comparison ("Comparison"/"vs"), e.g. "PS5 vs Xbox: Complete
//           Comparison (2026) | Comparison".
//   Bug 3 — meta descriptions hard-truncated mid-word. Clamp at the last word
//           boundary ≤ the limit and append "…" when clamped.

import { SITE_NAME } from "@/lib/utils/constants";

const BRAND = SITE_NAME; // "A Versus B"
const BRAND_SUFFIX = ` | ${BRAND}`;

// Google typically renders ~155–160 chars of a meta description.
export const META_DESCRIPTION_LIMIT = 160;

const conveysComparison = (s: string) => /\bvs\b|\bcomparison\b/i.test(s);

// Bug 2: drop a bare "| Comparison" segment when another segment already says
// "Comparison" or "vs". Index-based so we never collapse legitimate duplicates.
function stripRedundantComparisonSegment(title: string): string {
  const segments = title
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length <= 1) return title;

  const kept = segments.filter((seg, i) => {
    if (/^comparison$/i.test(seg)) {
      const rest = segments.filter((_, j) => j !== i);
      return !rest.some(conveysComparison);
    }
    return true;
  });
  return kept.join(" | ");
}

/**
 * Build a page <title> with the brand appended exactly once. Strips any
 * pre-existing trailing brand suffix(es) (Bug 1) and a redundant "| Comparison"
 * segment (Bug 2). Return value is meant for `title: { absolute }` AND for
 * og:title / twitter:title so all three stay single-brand.
 */
export function buildPageTitle(rawTitle: string | null | undefined): string {
  let title = (rawTitle || "").replace(/\s+/g, " ").trim();

  // Bug 1: peel off one or more trailing brand suffixes before re-appending.
  const suffixLower = BRAND_SUFFIX.toLowerCase();
  while (title.toLowerCase().endsWith(suffixLower)) {
    title = title.slice(0, title.length - BRAND_SUFFIX.length).trim();
  }

  title = stripRedundantComparisonSegment(title);

  return title ? `${title}${BRAND_SUFFIX}` : BRAND;
}

/**
 * Bug 3: clamp a meta description at the last word boundary ≤ maxLength,
 * appending "…" when truncation occurred. Result (including the ellipsis) never
 * exceeds maxLength.
 */
export function clampDescription(
  desc: string | null | undefined,
  maxLength = META_DESCRIPTION_LIMIT,
): string {
  const text = (desc || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;

  // Reserve one char for the ellipsis so the final string stays ≤ maxLength.
  let clamped = text.slice(0, maxLength - 1);
  const lastSpace = clamped.lastIndexOf(" ");
  if (lastSpace > 0) clamped = clamped.slice(0, lastSpace);
  // Drop trailing punctuation/whitespace so we don't render ".…" or ",…".
  clamped = clamped.replace(/[\s.,;:!?–—-]+$/, "");

  return `${clamped}…`;
}

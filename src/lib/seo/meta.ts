// Template-level SEO title/description normalizers (DAN-1144).
//
// The root layout applies a Next.js title template `%s | A Versus B`, so any
// page-level `title` string gets the brand appended automatically. Stored
// `metaTitle` values, however, often ALREADY end in the brand (legacy stubs) or
// in a redundant `| Comparison` segment — producing live SERP/social titles
// like `Figma vs Canva | A Versus B | A Versus B` or
// `PS5 vs Xbox Series X: Complete Comparison (2026) | Comparison | A Versus B`.
//
// `buildMetaTitle` produces one canonical, single-branded title. Use it with
// `title: { absolute }` to bypass the layout template (which would otherwise
// re-append the brand) and set the same value on og:title / twitter:title so
// social shares match the document title.

import { SITE_NAME } from "@/lib/utils/constants";

const BRAND_SUFFIX = ` | ${SITE_NAME}`;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Trailing ` | A Versus B` (case-insensitive), possibly repeated.
const BRAND_TAIL = new RegExp(`\\s*\\|\\s*${escapeRegExp(SITE_NAME)}\\s*$`, "i");
// Trailing ` | Comparison` segment — the descriptive half already says it.
const COMPARISON_TAIL = /\s*\|\s*Comparison\s*$/i;

/**
 * Normalize any title to end in exactly one brand suffix and no redundant
 * `| Comparison` segment.
 *  - strips every trailing brand suffix (dedupes the double-brand bug)
 *  - strips a redundant trailing `| Comparison` segment
 *  - appends exactly one brand suffix
 */
export function buildMetaTitle(raw: string | null | undefined): string {
  let t = (raw || "").trim();
  while (BRAND_TAIL.test(t)) t = t.replace(BRAND_TAIL, "").trim();
  t = t.replace(COMPARISON_TAIL, "").trim();
  return `${t}${BRAND_SUFFIX}`;
}

/**
 * Clamp a meta description to <= maxLen chars without cutting a word in half.
 * Trims to the last whole word that fits, strips trailing punctuation, and
 * appends a single period. Descriptions already within the limit are returned
 * as-is (whitespace-collapsed).
 */
export function clampDescription(raw: string | null | undefined, maxLen = 160): string {
  const d = (raw || "").replace(/\s+/g, " ").trim();
  if (d.length <= maxLen) return d;
  // Reserve one char for the appended period.
  let cut = d.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 0) cut = cut.slice(0, lastSpace);
  cut = cut.replace(/[\s.,;:!?–—-]+$/, "").trim();
  return `${cut}.`;
}

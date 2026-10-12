/**
 * ROO-25 — HTML-suffix soft-404 strip for `/compare/*`.
 *
 * Crawlers request paths whose slug is a real compare slug plus an
 * HTML-injected tail, for example:
 *   /compare/neymar-vs-mbappe:A%3Cb%3ENeymar
 *   /compare/neymar-vs-cristiano-ronaldo-career-stats-comparison-2026:P%3Cb%3ENeymar%3C/b
 *
 * The tail is not a second page. It is a broken `<b>…` fragment glued on
 * with a colon. The base before that colon is the canonical slug.
 *
 * These cannot live in COMPARE_REDIRECTS / next.config redirects(). That
 * table is matched with path-to-regexp, where `:` starts a named parameter,
 * so a literal colon-plus-HTML key is not a normal source. The close-tag
 * form also contains a raw `/` (`%3C/b` → `</b`), which splits the path
 * into more than one segment and never reaches `pages/compare/[slug]`.
 * Middleware 301s the whole path. getStaticProps repeats the same helper
 * for the single-segment form (`:A%3Cb%3ENeymar`, no raw slash) in case a
 * request reaches the page.
 *
 * A live compare slug has no colon, so healthy pages are not redirected.
 * A colon suffix is stripped only when it carries an HTML marker (`<tag`,
 * `</tag`, `%3C`, `%3E`, `&lt;`, `&gt;`). Other colon tails are left alone.
 *
 * If the base is itself a retired alias, the existing consolidation map
 * folds it in the same hop so the Location is the survivor, not a second
 * redirect. The base is not added to REDIRECTED_COMPARE_SLUGS — that list
 * is for retired catalog slugs, and these tails were never pages.
 */

import { getConsolidatedCompareSlug } from "./compare-redirects";
import {
  isCleanSlug,
  isDegenerateComparisonSlug,
  parseComparisonSlug,
} from "@/lib/utils/slugify";

/** DAN-2518: compare moves are explicit 301s, not Next's permanent 308. */
export const HTML_SUFFIX_COMPARE_STATUS = 301 as const;

/**
 * Angle-bracket signal. A bare `>` is not enough — that would fold
 * unrelated colon tails. Encoded forms count because middleware may see
 * the path before or after percent-decoding.
 */
const HTML_MARKER = /(?:%3[ce]|&lt;|&gt;|<(?:\/|!|[a-z?]))/i;

function stripUrlDecorations(input: string): string {
  let s = input.trim();
  if (/^https?:\/\//i.test(s)) {
    try {
      s = new URL(s).pathname;
    } catch {
      // Keep the raw string when it is not a parseable absolute URL.
    }
  }
  const hash = s.indexOf("#");
  if (hash >= 0) s = s.slice(0, hash);
  const query = s.indexOf("?");
  if (query >= 0) s = s.slice(0, query);
  return s;
}

function decodeOnce(value: string): string | null {
  if (!value.includes("%")) return null;
  try {
    const decoded = decodeURIComponent(value);
    return decoded === value ? null : decoded;
  } catch {
    return null;
  }
}

function isPlausibleCompareSlug(slug: string): boolean {
  if (!isCleanSlug(slug)) return false;
  if (isDegenerateComparisonSlug(slug)) return false;
  const parsed = parseComparisonSlug(slug);
  return !!parsed && parsed.entities.length >= 2;
}

/**
 * `segment` is everything after `/compare/`, or a bare slug. The base is
 * the text before the first colon and must itself contain no slash. The
 * suffix may contain slashes because a truncated `</b` puts a raw `/` in
 * the path.
 */
function baseBeforeHtmlSuffix(segment: string): string | null {
  const colon = segment.indexOf(":");
  if (colon <= 0) return null;
  const base = segment.slice(0, colon);
  if (!base || base.includes("/")) return null;
  const suffix = segment.slice(colon + 1);
  if (!suffix || !HTML_MARKER.test(suffix)) return null;
  const normalized = base.toLowerCase();
  if (!isPlausibleCompareSlug(normalized)) return null;
  return normalized;
}

function segmentFromInput(input: string): string | null {
  const trimmed = input.replace(/\/+$/, "");
  if (trimmed.startsWith("/compare/")) {
    const rest = trimmed.slice("/compare/".length);
    return rest || null;
  }
  // Bare slug (getStaticProps). A leading slash is some other route.
  if (trimmed.startsWith("/")) return null;
  return trimmed || null;
}

/**
 * Returns the compare slug a malformed HTML-suffix path should 301 to,
 * or null when the path is not this cluster.
 */
export function resolveHtmlSuffixCompareRedirect(input: string): string | null {
  if (!input) return null;
  const normalized = stripUrlDecorations(input);
  const forms = [normalized];
  const decoded = decodeOnce(normalized);
  if (decoded) forms.push(decoded);

  for (const form of forms) {
    const segment = segmentFromInput(form);
    if (!segment) continue;
    const base = baseBeforeHtmlSuffix(segment);
    if (!base) continue;
    const folded = getConsolidatedCompareSlug(base);
    const dest = folded ?? base;
    if (!isPlausibleCompareSlug(dest)) return null;
    return dest;
  }
  return null;
}

/** Absolute path (`/compare/...`) for the middleware Location, or null. */
export function compareHtmlSuffixRedirectPath(input: string): string | null {
  const dest = resolveHtmlSuffixCompareRedirect(input);
  return dest ? `/compare/${dest}` : null;
}

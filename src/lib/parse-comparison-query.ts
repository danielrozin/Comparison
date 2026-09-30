/**
 * One comparison-query parser for the home search box, the header overlay,
 * and /search.
 *
 * It turns "Thailand vs Vietnam", "Vietnam compared to Thailand", and
 * "difference between Thailand and Vietnam" into the same canonical slug.
 * Trailing qualifiers ("for travel", "which is better", "?") become `intent`
 * and never part of the slug.
 */

import { canonicalSlug } from "@/lib/services/entity-aliases";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import {
  comparisonSlug,
  isDegenerateComparisonSlug,
  parseComparisonSlug,
  slugify,
  stripKeywordSuffixSlug,
} from "@/lib/utils/slugify";

export interface ParsedComparisonQuery {
  raw: string;
  parsed: boolean;
  entityA: string | null;
  entityB: string | null;
  /** Words we removed so they would not become part of the slug. */
  intent: string | null;
  /** Alphabetically sorted, alias-resolved slug, or null when `parsed` is false. */
  slug: string | null;
  /**
   * "x" when the only separator was x, ×, or ✕. That slug is a candidate:
   * search routing follows it only when the page is already in the results
   * for this exact query. "standard" is vs, versus, and the other patterns.
   */
  separator: "x" | "standard" | null;
}

/** Main's per-side limits. Longer sides are not a guess at a compare URL. */
export const LEGACY_MAX_SIDE_WORDS = 5;
export const LEGACY_MAX_SIDE_CHARS = 60;

export interface ParseComparisonOptions {
  maxSideWords?: number;
  maxSideChars?: number;
}

const TRAILING_QUALIFIERS: RegExp[] = [
  /[?？!！]+\s*$/,
  /\s+which\s+(?:is|one(?:'s)?|ones)\b[\s\S]*$/i,
  /\s+what(?:'s| is)\s+better\b[\s\S]*$/i,
  /\s+which\s+should\s+i\b[\s\S]*$/i,
  // "japan vs china in economic terms" → japan vs china. Anchored at the
  // end so a later "vs" (a third side) is left for the 3-way guard.
  /\s+in\s+(?:[\p{L}\p{N}'’-]+\s+){0,6}terms(?:\s*[?？!！]+)?\s*$/iu,
  /\s+in\s+20[2-3]\d\s*$/i,
];

/**
 * Main's "for …" list, plus "hosts" ("vrbo vs airbnb for hosts").
 * Anything else after "for" stays in the name: "Need for Speed", "Pay for Delete".
 */
const FOR_INTENT_WORD =
  /^(?:travel|tourists?|tourism|families|kids|children|beginners|students|work|business|gaming|school|hosts)$/i;

/**
 * Search-only entity aliases. These are not in ENTITY_ALIASES because that
 * map feeds rivalry studies; folding "hbo" into "hbo-max" there would change
 * published counts. `parseComparisonQuery` applies them. Compare-URL routing
 * (`canonicalComparisonSlug`, the 404, redirects, generate) does not.
 */
const SEARCH_ENTITY_ALIASES: Readonly<Record<string, string>> = {
  hbo: "hbo-max",
};

/** A whole side that is not an entity name. */
const STOP_SIDES = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "vs",
  "versus",
  "for",
  "with",
  "to",
  "of",
  "in",
  "on",
  "pros",
  "cons",
  "more",
  "less",
  "other",
  "others",
  "best",
  "worst",
  "better",
  "worse",
  "things",
  "stuff",
  "it",
  "this",
  "that",
  "these",
  "those",
  "not",
  "yes",
  "no",
]);

/** Phrases that use "and" but are one idea, not two entities. */
const AND_COLLOCATIONS = new Set([
  "pros and cons",
  "rock and roll",
  "trial and error",
  "bread and butter",
  "black and white",
  "give and take",
  "up and down",
  "back and forth",
  "fish and chips",
  "salt and pepper",
  "peanut butter and jelly",
  "more and more",
  "again and again",
]);

const PAIR_PATTERNS: RegExp[] = [
  /^compare\s+(.+?)\s+(?:to|and|with|vs\.?|versus)\s+(.+)$/i,
  /^diff(?:erence|erences)\s+between\s+(.+?)\s+and\s+(.+)$/i,
  /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
  /^(.+?)\s+(?:vs\.?|versus|against)\s+(.+)$/i,
  /^(.+?)\s+v\.?\s+(.+)$/i,
  /^(.+?)\s+[-–—]\s+(.+)$/,
  /^(.{2,40}?)\s+or\s+(.{2,40})$/i,
];

/**
 * "messi x ronaldo". Whitespace is required so "xbox" stays one word.
 * Tried only after the standard patterns, so "iPhone X vs Samsung" still
 * splits on "vs". Routing decides whether this slug is a real page.
 */
const X_PAIR_PATTERN = /^(.+?)\s+(?:x|×|✕)\s+(.+)$/i;

function hasComparisonSeparator(text: string): boolean {
  return /\b(?:vs\.?|versus|compared\s+(?:to|with)|against)\b/i.test(text) || /\s(?:x|×|✕)\s/i.test(text);
}

function stripIntent(input: string): { text: string; intent: string | null } {
  let text = input.trim().replace(/\s+/g, " ");
  const parts: string[] = [];

  // "vrbo vs airbnb: for hosts, which is more profitable?" The colon (or a
  // trailing comma clause) is intent, not part of either name.
  const colon = text.search(/[:：]/);
  if (colon > 0) {
    const before = text.slice(0, colon).trim();
    const after = text.slice(colon + 1).trim();
    if (after && hasComparisonSeparator(before)) {
      parts.push(after);
      text = before;
    }
  }
  const comma = text.lastIndexOf(",");
  if (comma > 0) {
    const before = text.slice(0, comma).trim();
    const after = text.slice(comma + 1).trim();
    if (
      after &&
      hasComparisonSeparator(before) &&
      /^(?:for|which|what|who|in)\b/i.test(after)
    ) {
      parts.push(after);
      text = before;
    }
  }

  for (let i = 0; i < 6; i++) {
    let removed = false;
    for (const pattern of TRAILING_QUALIFIERS) {
      const match = text.match(pattern);
      if (match && match.index !== undefined && match.index > 0) {
        parts.push(text.slice(match.index).trim());
        text = text.slice(0, match.index).trim();
        removed = true;
        break;
      }
    }
    if (!removed) {
      const forIntent = tryStripTrailingFor(text);
      if (forIntent) {
        parts.push(forIntent.removed);
        text = forIntent.text;
        removed = true;
      }
    }
    if (!removed) break;
  }
  return { text, intent: parts.length > 0 ? parts.reverse().join(" ") : null };
}

/** The entity after the last vs / and / or in `head` (the text before " for …"). */
function sideAfterLastSeparator(head: string): string {
  const match = head.match(
    /^(?:compare\s+)?(?:diff(?:erence|erences)\s+between\s+)?(.+?)\s+(?:compared\s+(?:to|with)|vs\.?|versus|against|v\.?|and|or)\s+(.+)$/i,
  );
  return (match?.[2] ?? head).trim();
}

/**
 * Strip a trailing "for <intent>" only.
 *
 * "for Speed" in "Need for Speed" is the name, so it stays. The same for
 * "Pay for Delete" and "War for the Planet of the Apes".
 *
 * A one-word name plus an intent word ("Vietnam for travel", "Airbnb for
 * hosts") still strips — that side was already one word. We refuse the
 * strip when the clause would also eat title words and leave that one word
 * behind ("Pay for School supplies" stays whole).
 */
function tryStripTrailingFor(text: string): { text: string; removed: string } | null {
  const match = text.match(
    /\s+for\s+(travel|tourists?|tourism|families|kids|children|beginners|students|work|business|gaming|school|hosts)\b([\s\S]*)$/i,
  );
  if (!match || match.index == null || match.index <= 0) return null;
  if (!FOR_INTENT_WORD.test(match[1])) return null;

  const head = text.slice(0, match.index).trim();
  const sideWords = sideAfterLastSeparator(head).split(/\s+/).filter(Boolean);
  if (sideWords.length === 0) return null;

  const extra = (match[2] ?? "").replace(/^[?？!！.,\s]+/, "").trim();
  // One remaining word is fine only when nothing but the intent (or another
  // qualifier such as "which is better") was removed. Extra title words
  // would shorten the side to a single word, so leave the name alone.
  if (sideWords.length === 1 && extra.length > 0 && !/^(?:which|what|who|in)\b/i.test(extra)) {
    return null;
  }

  return { text: head, removed: text.slice(match.index).trim() };
}

function hasInnerSeparator(side: string): boolean {
  return hasComparisonSeparator(side);
}

function looksLikeEntitySide(side: string, maxWords: number, maxChars: number): boolean {
  const trimmed = side.trim();
  if (trimmed.length < 2 || trimmed.length > maxChars) return false;
  if (hasInnerSeparator(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > maxWords) return false;
  const tokens = words.map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""));
  if (tokens.every((token) => STOP_SIDES.has(token))) return false;
  if (!/^[\p{L}\p{N}]/u.test(trimmed)) return false;
  return true;
}

function parseAnd(text: string, maxWords: number, maxChars: number): [string, string] | null {
  if ((text.match(/\band\b/gi) ?? []).length !== 1) return null;
  if (AND_COLLOCATIONS.has(text.toLowerCase())) return null;
  if (/^(what|why|how|when|where|who|is|are|can|should|do|does)\b/i.test(text)) return null;
  const match = text.match(/^(.+?)\s+and\s+(.+)$/i);
  if (!match) return null;
  const left = match[1].trim();
  const right = match[2].trim();
  if (!looksLikeEntitySide(left, maxWords, maxChars) || !looksLikeEntitySide(right, maxWords, maxChars)) {
    return null;
  }
  return [left, right];
}

function parseComma(text: string, maxWords: number, maxChars: number): [string, string] | null {
  if ((text.match(/,/g) ?? []).length !== 1) return null;
  const [left, right] = text.split(",").map((part) => part.trim());
  if (!looksLikeEntitySide(left, maxWords, maxChars) || !looksLikeEntitySide(right, maxWords, maxChars)) {
    return null;
  }
  return [left, right];
}

interface PairHit {
  pair: [string, string];
  separator: "x" | "standard";
}

function pairFromPattern(
  pattern: RegExp,
  text: string,
  maxWords: number,
  maxChars: number,
): [string, string] | null {
  const match = text.match(pattern);
  if (!match?.[1]?.trim() || !match[2]?.trim()) return null;
  const left = match[1].trim();
  const right = match[2].trim();
  if (hasInnerSeparator(left) || hasInnerSeparator(right)) return null;
  if (!looksLikeEntitySide(left, maxWords, maxChars) || !looksLikeEntitySide(right, maxWords, maxChars)) {
    return null;
  }
  return [left, right];
}

function pairFromText(text: string, maxWords: number, maxChars: number): PairHit | null {
  for (const pattern of PAIR_PATTERNS) {
    const pair = pairFromPattern(pattern, text, maxWords, maxChars);
    if (pair) return { pair, separator: "standard" };
  }
  const xPair = pairFromPattern(X_PAIR_PATTERN, text, maxWords, maxChars);
  if (xPair) return { pair: xPair, separator: "x" };
  const and = parseAnd(text, maxWords, maxChars);
  if (and) return { pair: and, separator: "standard" };
  const comma = parseComma(text, maxWords, maxChars);
  if (comma) return { pair: comma, separator: "standard" };
  return null;
}

/**
 * Canonical two-entity slug. Applies entity aliases, the alphabetical sort
 * (`comparisonSlug`), keyword-suffix stripping, and the compare redirect map.
 * Returns null for a self-comparison or anything that is not exactly two entities.
 */
export function canonicalComparisonSlug(entityA: string, entityB: string): string | null {
  const a = canonicalSlug(slugify(entityA));
  const b = canonicalSlug(slugify(entityB));
  if (!a || !b || a.length < 2 || b.length < 2 || a === b) return null;
  let slug = comparisonSlug(a, b);
  const consolidated = getConsolidatedCompareSlug(slug);
  if (consolidated) slug = consolidated;
  const stripped = stripKeywordSuffixSlug(slug);
  if (stripped && !isDegenerateComparisonSlug(stripped)) {
    slug = getConsolidatedCompareSlug(stripped) ?? stripped;
  }
  if (isDegenerateComparisonSlug(slug)) return null;
  const parsed = parseComparisonSlug(slug);
  if (!parsed || parsed.entities.length !== 2) return null;
  return slug;
}

export function entityLabelFromSlug(entitySlug: string): string {
  return entitySlug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * The one URL a two-entity comparison lives at, after aliases, the
 * alphabetical sort, keyword-suffix stripping, and the compare redirect map.
 * Null when the slug is not exactly two real entities (self-compare, 3-way, junk).
 */
export function canonicalRequestedComparisonSlug(slug: string): string | null {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  const parsed = parseComparisonSlug(slug);
  if (!parsed || parsed.entities.length !== 2) return null;
  if (parsed.entities.some((entity) => entity.length < 2)) return null;
  const [a, b] = parsed.entities;
  return canonicalComparisonSlug(a.replace(/-/g, " "), b.replace(/-/g, " "));
}

/** True when this URL is a two-entity comparison a visitor may ask us to build. */
export function canRequestComparisonSlug(slug: string): boolean {
  return canonicalRequestedComparisonSlug(slug) === slug;
}

/**
 * Search-box alias only. `canonicalComparisonSlug` stays free of this map so
 * compare redirects, the 404, and the generate endpoint keep today's URLs.
 * "hbo" becomes "hbo max" here, then the normal slug rules run.
 */
function withSearchAlias(name: string): string {
  const slug = canonicalSlug(slugify(name));
  const mapped = SEARCH_ENTITY_ALIASES[slug];
  if (!mapped || mapped === slug) return name;
  return mapped.replace(/-/g, " ");
}

function searchCanonicalSlug(entityA: string, entityB: string): string | null {
  return canonicalComparisonSlug(withSearchAlias(entityA), withSearchAlias(entityB));
}

export function parseComparisonQuery(
  input: string,
  options?: ParseComparisonOptions,
): ParsedComparisonQuery {
  const raw = input ?? "";
  const empty: ParsedComparisonQuery = {
    raw,
    parsed: false,
    entityA: null,
    entityB: null,
    intent: null,
    slug: null,
    separator: null,
  };
  if (!raw.trim()) return empty;

  const maxSideWords = options?.maxSideWords ?? LEGACY_MAX_SIDE_WORDS;
  const maxSideChars = options?.maxSideChars ?? LEGACY_MAX_SIDE_CHARS;
  const { text, intent } = stripIntent(raw);
  const hit = pairFromText(text, maxSideWords, maxSideChars);
  if (!hit) return { ...empty, intent };

  const slug = searchCanonicalSlug(hit.pair[0], hit.pair[1]);
  if (!slug) return { ...empty, intent };

  return {
    raw,
    parsed: true,
    entityA: hit.pair[0],
    entityB: hit.pair[1],
    intent,
    slug,
    separator: hit.separator,
  };
}

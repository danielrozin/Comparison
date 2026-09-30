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
}

const TRAILING_QUALIFIERS: RegExp[] = [
  /[?？!！]+\s*$/,
  /\s+which\s+(?:is|one(?:'s)?|ones)\b[\s\S]*$/i,
  /\s+what(?:'s| is)\s+better\b[\s\S]*$/i,
  /\s+which\s+should\s+i\b[\s\S]*$/i,
  /\s+for\s+(?:travel|tourists?|tourism|families|kids|children|beginners|students|work|business|gaming|school)\b[\s\S]*$/i,
  // "japan vs china in economic terms" → japan vs china. Anchored at the
  // end so a later "vs" (a third side) is left for the 3-way guard.
  /\s+in\s+(?:[\p{L}\p{N}'’-]+\s+){0,6}terms(?:\s*[?？!！]+)?\s*$/iu,
  /\s+in\s+20[2-3]\d\s*$/i,
  // "vrbo vs airbnb for hosts" — only when "for …" is a trailing clause.
  /\s+for\s+(?!.{0,80}\b(?:vs\.?|versus|against|compared)\b)[\s\S]+$/i,
];

/**
 * Search-only entity aliases. These are not in ENTITY_ALIASES because that
 * map feeds rivalry studies; folding "hbo" into "hbo-max" there would change
 * published counts. Here it only picks the live comparison URL.
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
  // "messi x ronaldo" / "messi × ronaldo". Whitespace is required so "xbox"
  // and "iphone x" (as one side of a vs query) stay intact.
  /^(.+?)\s+(?:x|×|✕)\s+(.+)$/i,
  /^(.+?)\s+[-–—]\s+(.+)$/,
  /^(.{2,40}?)\s+or\s+(.{2,40})$/i,
];

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
    if (!removed) break;
  }
  return { text, intent: parts.length > 0 ? parts.reverse().join(" ") : null };
}

function hasInnerSeparator(side: string): boolean {
  return hasComparisonSeparator(side);
}

function looksLikeEntitySide(side: string): boolean {
  const trimmed = side.trim();
  // Eight words covers "tesla model 3 grande autonomie 2026" without
  // treating a whole sentence as an entity name.
  if (trimmed.length < 2 || trimmed.length > 80) return false;
  if (hasInnerSeparator(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 8) return false;
  const tokens = words.map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""));
  if (tokens.every((token) => STOP_SIDES.has(token))) return false;
  if (!/^[\p{L}\p{N}]/u.test(trimmed)) return false;
  return true;
}

function parseAnd(text: string): [string, string] | null {
  if ((text.match(/\band\b/gi) ?? []).length !== 1) return null;
  if (AND_COLLOCATIONS.has(text.toLowerCase())) return null;
  if (/^(what|why|how|when|where|who|is|are|can|should|do|does)\b/i.test(text)) return null;
  const match = text.match(/^(.+?)\s+and\s+(.+)$/i);
  if (!match) return null;
  const left = match[1].trim();
  const right = match[2].trim();
  if (!looksLikeEntitySide(left) || !looksLikeEntitySide(right)) return null;
  return [left, right];
}

function parseComma(text: string): [string, string] | null {
  if ((text.match(/,/g) ?? []).length !== 1) return null;
  const [left, right] = text.split(",").map((part) => part.trim());
  if (!looksLikeEntitySide(left) || !looksLikeEntitySide(right)) return null;
  return [left, right];
}

function pairFromText(text: string): [string, string] | null {
  for (const pattern of PAIR_PATTERNS) {
    const match = text.match(pattern);
    if (!match?.[1]?.trim() || !match[2]?.trim()) continue;
    const left = match[1].trim();
    const right = match[2].trim();
    if (hasInnerSeparator(left) || hasInnerSeparator(right)) continue;
    if (!looksLikeEntitySide(left) || !looksLikeEntitySide(right)) continue;
    return [left, right];
  }
  return parseAnd(text) ?? parseComma(text);
}

/**
 * Canonical two-entity slug. Applies entity aliases, the alphabetical sort
 * (`comparisonSlug`), keyword-suffix stripping, and the compare redirect map.
 * Returns null for a self-comparison or anything that is not exactly two entities.
 */
function resolveEntitySlug(name: string): string {
  const slug = canonicalSlug(slugify(name));
  return SEARCH_ENTITY_ALIASES[slug] ?? slug;
}

export function canonicalComparisonSlug(entityA: string, entityB: string): string | null {
  const a = resolveEntitySlug(entityA);
  const b = resolveEntitySlug(entityB);
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

export function parseComparisonQuery(input: string): ParsedComparisonQuery {
  const raw = input ?? "";
  const empty: ParsedComparisonQuery = {
    raw,
    parsed: false,
    entityA: null,
    entityB: null,
    intent: null,
    slug: null,
  };
  if (!raw.trim()) return empty;

  const { text, intent } = stripIntent(raw);
  const pair = pairFromText(text);
  if (!pair) return { ...empty, intent };

  const slug = canonicalComparisonSlug(pair[0], pair[1]);
  if (!slug) return { ...empty, intent };

  return {
    raw,
    parsed: true,
    entityA: pair[0],
    entityB: pair[1],
    intent,
    slug,
  };
}

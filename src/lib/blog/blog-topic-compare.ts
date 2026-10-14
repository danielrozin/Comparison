/**
 * ROO-180: find the X vs Y a blog post is about, from its slug and title.
 *
 * `delta-vs-united-airlines-lounge-access-2026-sky-club-vs-united-club`
 * yields delta-vs-united, delta-vs-united-airlines, united-vs-delta, ...
 * The page keeps the first candidate that is live. When none is live and
 * the topic is clearly two named things, the card links to the canonical
 * slug, which the on-demand builder (ROO-193) makes on first visit.
 */

import { canonicalRequestedComparisonSlug, entityLabelFromSlug } from "@/lib/parse-comparison-query";
import { slugify } from "@/lib/utils/slugify";

/** Words that end an entity name in a blog slug or title. */
const STOP_TOKENS = new Set([
  "2023", "2024", "2025", "2026", "2027",
  "which", "what", "who", "is", "are", "the", "a", "an", "for", "in", "on", "of", "to",
  "and", "or", "with", "should", "do", "does", "better", "best", "worth", "vs",
  "review", "reviews", "comparison", "compared", "guide", "complete", "explained",
  "lounge", "lounges", "access", "price", "prices", "pricing", "cost", "costs",
  "pros", "cons", "difference", "differences", "key", "full", "ultimate", "honest",
  "it", "really", "more", "runs", "wins", "win", "winner", "premium", "ticket", "tickets",
  // ROO-224: words that end a side in buying-guide titles. Without them
  // "steam-vs-gog-where-to-buy" became gog-where-vs-steam.
  "where", "how", "why", "when", "buy", "buying", "choose", "pick", "world", "cup",
  "total", "ownership", "head", "stats", "history", "rivalry", "prediction",
  "season", "breakdown", "career", "admissions", "programs", "real", "evidence",
  "does", "matter", "after", "vs.",
]);

/** Generic trailing words: try the brand with and without them. */
const BRAND_SUFFIXES = new Set(["airlines", "airline", "airways", "cinema", "cinemas", "inc", "app", "card", "cards"]);

const MAX_SIDE_TOKENS = 3;

/** Product tiers that share the brand on the left ("mastercard-gold vs platinum"). */
const TIER_WORDS = new Set([
  "gold", "platinum", "silver", "infinite", "signature", "black", "basic", "standard",
  "plus", "ultra", "max", "mini", "lite",
]);

function sideOptions(tokens: string[]): string[] {
  const out: string[] = [];
  for (let n = 1; n <= Math.min(MAX_SIDE_TOKENS, tokens.length); n++) {
    const slice = tokens.slice(0, n);
    out.push(slice.join("-"));
    const last = slice[slice.length - 1];
    if (slice.length > 1 && BRAND_SUFFIXES.has(last)) out.push(slice.slice(0, -1).join("-"));
  }
  return [...new Set(out)].filter((value) => value.length >= 2 && !BRAND_SUFFIXES.has(value));
}

function leftTokens(tokens: string[]): string[] {
  // The left side runs back from "vs" until a stop word.
  const out: string[] = [];
  for (let i = tokens.length - 1; i >= 0 && out.length < MAX_SIDE_TOKENS; i--) {
    if (STOP_TOKENS.has(tokens[i])) break;
    out.unshift(tokens[i]);
  }
  return out;
}

function rightTokens(tokens: string[]): string[] {
  const out: string[] = [];
  for (const token of tokens) {
    if (STOP_TOKENS.has(token) || out.length >= MAX_SIDE_TOKENS) break;
    out.push(token);
  }
  return out;
}

/** Left side read back to front: shortest is the word right before "vs". */
function leftOptions(tokens: string[]): string[] {
  const out: string[] = [];
  for (let n = 1; n <= tokens.length; n++) {
    const slice = tokens.slice(tokens.length - n);
    out.push(slice.join("-"));
    const last = slice[slice.length - 1];
    if (slice.length > 1 && BRAND_SUFFIXES.has(last)) out.push(slice.slice(0, -1).join("-"));
  }
  return [...new Set(out)].filter((value) => value.length >= 2 && !BRAND_SUFFIXES.has(value));
}

export interface TopicPair {
  left: string[];
  right: string[];
}

/** The first "x vs y" in a slugified string, as candidate entity names. */
export function topicPairFromText(text: string): TopicPair | null {
  const tokens = slugify(text || "").split("-").filter(Boolean);
  const vs = tokens.indexOf("vs");
  if (vs <= 0 || vs >= tokens.length - 1) return null;
  const left = leftOptions(leftTokens(tokens.slice(0, vs)));
  const right = sideOptions(rightTokens(tokens.slice(vs + 1)));
  if (left.length === 0 || right.length === 0) return null;
  return { left, right };
}

/**
 * Candidate /compare slugs for a post, most specific first, both orders.
 * Nothing here is checked against the database.
 */
export function topicCompareCandidates(blogSlug: string, title?: string | null): string[] {
  const pairs = [topicPairFromText(blogSlug), title ? topicPairFromText(title) : null].filter(
    (pair): pair is TopicPair => pair !== null,
  );
  const out: string[] = [];
  const add = (slug: string) => {
    if (!out.includes(slug)) out.push(slug);
  };
  for (const pair of pairs) {
    for (const a of pair.left) {
      for (const b of pair.right) {
        if (a === b) continue;
        add(`${a}-vs-${b}`);
        add(`${b}-vs-${a}`);
        const canonical = canonicalRequestedComparisonSlug(`${a}-vs-${b}`);
        if (canonical) add(canonical);
      }
    }
  }
  return out;
}

/**
 * The slug the builder would make for this post's topic, or null when the
 * post is not clearly about two things. Uses the most specific names.
 */
export function topicBuildSlug(blogSlug: string, title?: string | null): string | null {
  const sides = topicSides(blogSlug, title);
  if (!sides) return null;
  return canonicalRequestedComparisonSlug(`${sides[0]}-vs-${sides[1]}`);
}

/**
 * ROO-224: the two full entity names a post compares, or null.
 *
 * Each side is the whole run of words up to a stop word. The old code took
 * the first two words of the right side, which cut titles short
 * ("free-vs-paid-password", "sp-500-vs-total-stock"). Two shapes are not two
 * entities and return null or get repaired:
 * - one modifier against a longer noun phrase ("free vs paid password
 *   managers") is a single topic, so null;
 * - a branded tier against a bare tier ("mastercard-gold vs platinum")
 *   carries the brand over ("mastercard-platinum").
 */
export function topicSides(blogSlug: string, title?: string | null): [string, string] | null {
  const pair = topicPairFromText(blogSlug) ?? (title ? topicPairFromText(title) : null);
  if (!pair) return null;
  const longest = (values: string[]) =>
    values.reduce((best, value) => (value.split("-").length > best.split("-").length ? value : best), values[0]);
  const a = longest(pair.left);
  let b = longest(pair.right);
  if (!a || !b || a === b) return null;
  const aWords = a.split("-");
  const bWords = b.split("-");
  if (aWords.length === 1 && bWords.length >= 3) return null;
  if (bWords.length === 1 && aWords.length >= 3) return null;
  if (aWords.length === 2 && bWords.length === 1 && TIER_WORDS.has(aWords[1]) && TIER_WORDS.has(b)) {
    b = `${aWords[0]}-${b}`;
  }
  if (a === b) return null;
  return [a, b];
}

/** "Dolby Cinema vs IMAX" style label for a builder link. */
export function generatedCompareTitle(slug: string): string {
  const [a, b] = slug.split("-vs-");
  if (!a || !b) return slug.replace(/-/g, " ");
  return `${entityLabelFromSlug(a)} vs ${entityLabelFromSlug(b)}`;
}

/**
 * ROO-234: topic-relevant links for a blog compare card when the post's own
 * pair has no live page.
 *
 * After #403, 219 of 490 posts fell back to the same three popular compares
 * (iPhone 17 vs S26, LeBron vs Jordan, USA vs China) and 0 of 94 search
 * visitors on them clicked. This finds pages about the post's topic instead:
 *   - topic pages: /password-manager-comparison, /browser-comparison-2026,
 *     /hub/*, /best/* (static configs, so they always exist);
 *   - live compares found by searching the post's specific keywords.
 * When nothing matches, the caller hides the card. It never shows
 * unrelated popular compares.
 *
 * Lookups are injected; this file never talks to the database.
 */

import { slugify } from "@/lib/utils/slugify";
import { CATEGORIES } from "@/lib/utils/constants";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { BEST_CONFIG } from "@/lib/data/best-entries";

export interface TopicLink {
  slug: string;
  title: string;
  /** Non-compare target (hub / best / topic page). */
  href?: string;
}

/** Words that say nothing about the topic. Category names are added below. */
const GENERIC = new Set([
  "2023", "2024", "2025", "2026", "2027", "vs", "versus", "the", "and", "for", "with", "your", "you",
  "which", "what", "who", "why", "how", "when", "where", "does", "should", "could", "would", "can",
  "are", "is", "its", "it", "of", "to", "in", "on", "or", "an", "a", "at", "by", "from", "about",
  "best", "top", "guide", "complete", "ultimate", "review", "reviews", "ranked", "list", "compared",
  "comparison", "compare", "explained", "difference", "differences", "better", "worth", "good",
  "great", "real", "really", "actually", "truth", "facts", "fact", "everything", "know", "need",
  "tips", "ways", "way", "improve", "performance", "people", "leaving", "cost", "costs", "fee",
  "price", "prices", "pricing", "cheap", "cheapest", "free", "paid", "new", "year", "years",
  "month", "day", "time", "money", "plan", "plans", "use", "using", "make", "get", "help",
  "choose", "pick", "right", "buy", "buying", "buyer", "beginner", "beginners", "first", "most",
  "more", "less", "high", "low", "big", "small", "long", "short", "home", "life", "family", "work",
  "this", "that", "than", "then", "there", "they", "them", "their", "after", "before", "into",
  "head", "stats", "history", "season", "prediction", "breakdown", "which", "option", "options",
  "alternative", "alternatives", "pros", "cons", "full", "key", "main", "side", "honest", "win",
  "wins", "winner", "matter", "should", "career", "path", "world", "today", "now", "tech",
  "menu", "recipe", "recipes", "calculator", "step", "steps", "easy", "simple", "quick",
  "premium", "ticket", "tickets", "changed", "change", "changes", "safe", "legit", "deal", "deals",
]);

/** ROO-234: a match must hit one of the post's first few topic words. */
const PRIMARY_KEYWORDS = 2;
for (const category of CATEGORIES) {
  for (const word of slugify(category.slug).split("-")) GENERIC.add(word);
  for (const word of slugify(category.name).split("-")) GENERIC.add(word);
}

export function singular(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
  return word;
}

/** Specific topic words from a post's slug, title and tags, most frequent first. */
export function topicKeywords(...texts: (string | null | undefined)[]): string[] {
  const counts = new Map<string, number>();
  for (const text of texts) {
    for (const raw of slugify(text || "").split("-")) {
      const word = singular(raw);
      if (word.length < 3 || /^\d+$/.test(word) || GENERIC.has(raw) || GENERIC.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

interface TopicPage {
  href: string;
  title: string;
  keywords: Set<string>;
}

function wordsOf(...texts: string[]): Set<string> {
  return new Set(topicKeywords(...texts));
}

const STATIC_TOPIC_PAGES: TopicPage[] = [
  {
    href: "/password-manager-comparison",
    title: "Best password managers compared",
    keywords: wordsOf("password manager passwords 1password bitwarden lastpass dashlane keeper"),
  },
  {
    href: "/browser-comparison-2026",
    title: "Best web browsers compared",
    keywords: wordsOf("browser browsers chrome firefox safari edge brave opera"),
  },
  {
    href: "/llm-comparisons",
    title: "LLM comparison: GPT vs Claude vs Gemini vs Llama",
    keywords: wordsOf("llm llms chatgpt gpt claude gemini llama chatbot chatbots"),
  },
  {
    href: "/probability-vs-statistics",
    title: "Probability vs statistics",
    keywords: wordsOf("probability statistics"),
  },
];

export const TOPIC_PAGES: TopicPage[] = [
  ...STATIC_TOPIC_PAGES,
  ...Object.entries(HUB_CONFIG).map(([slug, hub]) => ({
    href: `/hub/${slug}`,
    title: hub.title.split(":")[0].trim(),
    keywords: wordsOf(slug, hub.title),
  })),
  ...Object.entries(BEST_CONFIG).map(([slug, entry]) => ({
    href: `/best/${slug}`,
    title: entry.h1 || entry.title,
    keywords: wordsOf(slug, entry.title),
  })),
];

/** Topic pages sharing the most keywords with the post (at least one). */
export function matchTopicPages(keywords: string[], pages: TopicPage[] = TOPIC_PAGES, limit = 1): TopicLink[] {
  const set = new Set(keywords);
  const primary = keywords.slice(0, PRIMARY_KEYWORDS);
  return pages
    .map((page) => ({ page, score: Array.from(page.keywords).filter((word) => set.has(word)).length }))
    .filter((item) => item.score > 0 && primary.some((word) => item.page.keywords.has(word)))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ page }) => ({ slug: page.href.replace(/^\//, ""), title: page.title, href: page.href }));
}

export interface TopicRelevanceDeps {
  search: (query: string) => Promise<{ slug: string; title: string }[]>;
  filterLive: (slugs: string[]) => Promise<string[]>;
}

const MAX_QUERIES = 4;

/** Does the compare's slug or title contain the keyword as a word (or word prefix)? */
export function mentions(row: { slug: string; title: string }, keyword: string): boolean {
  const words = new Set([...slugify(row.slug).split("-"), ...slugify(row.title).split("-")].map(singular));
  if (words.has(keyword)) return true;
  // "1password" contains "password"; brand-glued words only, not "air" in "airpods".
  return keyword.length >= 6 && [...words].some((word) => word.includes(keyword));
}

/** Live compares that mention the post's keywords, most keywords first. */
export async function matchTopicCompares(
  keywords: string[],
  deps: TopicRelevanceDeps,
  limit = 3,
): Promise<TopicLink[]> {
  const primary = keywords.slice(0, PRIMARY_KEYWORDS);
  const queries = keywords.filter((word) => word.length >= 4).slice(0, MAX_QUERIES);
  if (queries.length === 0) return [];
  const results = await Promise.all(queries.map((q) => deps.search(q).catch(() => [])));
  const rows = new Map<string, { slug: string; title: string; score: number; order: number }>();
  let order = 0;
  for (const list of results) {
    for (const row of list) {
      if (rows.has(row.slug)) continue;
      const score = keywords.filter((word) => mentions(row, word)).length;
      if (score > 0 && primary.some((word) => mentions(row, word))) rows.set(row.slug, { ...row, score, order: order++ });
    }
  }
  const ranked = Array.from(rows.values()).sort((a, b) => b.score - a.score || a.order - b.order);
  const live = new Set(await deps.filterLive(ranked.map((row) => row.slug)).catch(() => [] as string[]));
  return ranked
    .filter((row) => live.has(row.slug))
    .slice(0, limit)
    .map((row) => ({ slug: row.slug, title: row.title }));
}

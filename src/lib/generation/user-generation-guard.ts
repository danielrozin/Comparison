/**
 * Cost and safety checks for visitor-requested comparison generation.
 * Cron routes do not import this. They stay behind GENERATION_FREEZE.
 */

import { slugify } from "@/lib/utils/slugify";

const BLOCKED_TOKENS = new Set([
  "porn",
  "porno",
  "xxx",
  "nsfw",
  "hentai",
  "onlyfans",
  "sex",
  "sexual",
  "nude",
  "nudes",
  "naked",
  "xxxvideo",
  "camgirl",
  "camwhore",
  // Abuse / slurs. Whole tokens only, so "Middlesex" or "Sussex" are not blocked.
  "nigger",
  "nigga",
  "faggot",
  "retard",
  "kys",
]);

const ABUSE_PHRASES = [/kill\s+yourself/i, /\bkys\b/i];

const KEYBOARD_WALKS = ["qwerty", "asdfgh", "zxcvbn", "qazwsx"];

export function isUserGenerationEnabled(): boolean {
  return (process.env.USER_GENERATION_ENABLED ?? "").toLowerCase() === "true";
}

export type EntityCheckMode = "fail-closed" | "fail-open" | "off";

/** Default fail-closed: a Wikipedia timeout or error refuses generation. */
export function entityCheckMode(): EntityCheckMode {
  const raw = (process.env.USER_GENERATION_ENTITY_CHECK ?? "fail-closed").toLowerCase();
  if (raw === "off" || raw === "fail-open" || raw === "fail-closed") return raw;
  return "fail-closed";
}

function tokensOf(label: string): string[] {
  const fromSlug = slugify(label).split("-").filter(Boolean);
  const fromRaw = label.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return [...fromSlug, ...fromRaw];
}

export function queryBlockReason(entityA: string, entityB: string): string | null {
  const combined = `${entityA} ${entityB}`;
  if (ABUSE_PHRASES.some((pattern) => pattern.test(combined))) return "abuse";
  for (const label of [entityA, entityB]) {
    if (tokensOf(label).some((token) => BLOCKED_TOKENS.has(token))) return "nsfw";
    if (isNonsense(label)) return "nonsense";
  }
  return null;
}

function isNonsense(label: string): boolean {
  const slug = slugify(label);
  if (slug.length < 2 || slug.length > 80) return true;
  if (/(.)\1{4,}/.test(slug.replace(/-/g, ""))) return true;
  if (KEYBOARD_WALKS.some((walk) => slug.includes(walk))) return true;
  const letters = slug.replace(/[^a-z]/g, "");
  if (letters.length >= 6 && !/[aeiouy]/.test(letters)) return true;
  return false;
}

export type EntityLookup = "yes" | "no" | "error";

const WIKI_TIMEOUT_MS = 4000;

function titlesMatch(query: string, title: string): boolean {
  const needle = slugify(query);
  const candidate = slugify(title);
  if (!needle || !candidate) return false;
  if (candidate === needle) return true;
  // "New York" matches "New York City"; "Los Angeles" matches "Los Angeles".
  if (candidate.startsWith(`${needle}-`) || needle.startsWith(`${candidate}-`)) return true;
  // "domino s" matches "Domino's" (apostrophes split slugs differently).
  if (needle.replace(/-/g, "") === candidate.replace(/-/g, "")) return true;
  // "messi" matches "Lionel Messi": every query word is in a short title.
  const n = needle.split("-");
  const c = candidate.split("-");
  if (c.length <= n.length + 2 && n.every((t) => t.length >= 2 && c.includes(t))) return true;
  return false;
}

/**
 * Is this a real thing someone could compare? Wikipedia first; on a miss,
 * fall back in parallel to Wikidata (covers software like Weaviate) and to the
 * brand prefix ("macbook air m4" → "macbook air", "zoho books" → "zoho"),
 * because most product models have no page of their own. Junk that slips
 * through still has to pass the promotion quality gate before going live.
 */
export async function lookupEntity(
  name: string,
  fetchImpl: typeof fetch = fetch,
): Promise<EntityLookup> {
  const first = await lookupWikipedia(name, fetchImpl);
  if (first !== "no") return first;

  const words = slugify(name).split("-").filter(Boolean);
  const prefixes: string[] = [];
  if (words.length >= 3) prefixes.push(words.slice(0, 2).join(" "));
  if (words.length >= 2 && words[0].length >= 3) prefixes.push(words[0]);

  const results = await Promise.all([
    lookupWikidata(name, fetchImpl),
    ...prefixes.map((p) => lookupWikipedia(p, fetchImpl)),
  ]);
  return results.includes("yes") ? "yes" : "no";
}

async function lookupWikidata(name: string, fetchImpl: typeof fetch): Promise<EntityLookup> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WIKI_TIMEOUT_MS);
  try {
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.searchParams.set("action", "wbsearchentities");
    url.searchParams.set("search", name);
    url.searchParams.set("language", "en");
    url.searchParams.set("limit", "5");
    url.searchParams.set("format", "json");
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AVersusB/1.0 (https://www.aversusb.net; entity-check)",
      },
    });
    if (!response.ok) return "error";
    const data = (await response.json()) as { search?: { label?: unknown }[] };
    const labels = Array.isArray(data?.search) ? data.search.map((s) => s?.label) : [];
    return labels.some((l) => typeof l === "string" && titlesMatch(name, l)) ? "yes" : "no";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}

async function lookupWikipedia(name: string, fetchImpl: typeof fetch): Promise<EntityLookup> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WIKI_TIMEOUT_MS);
  try {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "opensearch");
    url.searchParams.set("search", name);
    url.searchParams.set("limit", "5");
    url.searchParams.set("namespace", "0");
    url.searchParams.set("format", "json");
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AVersusB/1.0 (https://www.aversusb.net; entity-check)",
      },
    });
    if (!response.ok) return "error";
    const data = (await response.json()) as unknown;
    const titles = Array.isArray((data as unknown[])?.[1]) ? ((data as unknown[])[1] as unknown[]) : [];
    if (titles.length === 0) return "no";
    const hit = titles.some((title) => typeof title === "string" && titlesMatch(name, title));
    return hit ? "yes" : "no";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}

export async function validateRealEntities(
  entityA: string,
  entityB: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const mode = entityCheckMode();
  if (mode === "off") return { ok: true };

  const [left, right] = await Promise.all([
    lookupEntity(entityA, fetchImpl),
    lookupEntity(entityB, fetchImpl),
  ]);

  const failed = (result: EntityLookup, name: string): string | null => {
    if (result === "yes") return null;
    if (result === "no") return `unknown_entity:${name}`;
    return mode === "fail-closed" ? `entity_check_failed:${name}` : null;
  };

  const leftReason = failed(left, entityA);
  if (leftReason) return { ok: false, reason: leftReason };
  const rightReason = failed(right, entityB);
  if (rightReason) return { ok: false, reason: rightReason };
  return { ok: true };
}

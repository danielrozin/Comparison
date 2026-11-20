// Ranked, de-duplicated alternatives list for /alternatives/[slug] (Nov 2026 CTR audit).
//
// The page used to concatenate comparison-derived entities and curated entries,
// de-duplicating by entity slug only. Different slugs for the same product
// ("ps5" / "playstation-5", "pc-gaming" / "gaming-pc") produced duplicate rows,
// the subject itself showed up as its own alternative ("Xbox Series X" on
// /alternatives/xbox-series-x), and curated picks without a live comparison were
// dropped entirely (Toyota rendered a single alternative). This module builds
// the list once so the page body, ItemList schema, FAQ answers and <title> all
// agree.

export interface AlternativeRow {
  name: string;
  slug: string;
  /** One-line "best for / why switch" note. */
  reason: string | null;
  /** Canonical live /compare slug, when one exists. */
  comparisonSlug: string | null;
}

export interface ComparedAlternative {
  name: string;
  slug: string;
  comparisonSlug: string;
}

export interface CuratedAlternative {
  name: string;
  slug: string;
  reason: string;
}

export const MAX_ALTERNATIVES = 8;

// Announced/rumoured products nobody can buy yet — never recommend them.
const UNRELEASED_RE = /\b(?:playstation\s*6|ps\s*6)\b/i;

const ALIASES: [RegExp, string][] = [
  [/\bps\s*(\d)\b/g, "playstation $1"],
  [/\bplaystation(\d)\b/g, "playstation $1"],
  [/\bpc gaming\b/g, "gaming pc"],
];

/** Order-insensitive key: "PS5 Pro" ≡ "PlayStation 5 Pro", "PC Gaming" ≡ "Gaming PC". */
export function alternativeKey(nameOrSlug: string): string {
  let s = nameOrSlug
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, rep] of ALIASES) s = s.replace(re, rep);
  s = s.replace(/\b(range|mid to high|edition)\b/g, " ").replace(/\s+/g, " ").trim();
  return s.split(" ").filter(Boolean).sort().join(" ");
}

export function buildAlternativesList(
  subject: { slug: string; name: string },
  compared: ComparedAlternative[],
  curated: CuratedAlternative[] = [],
  max = MAX_ALTERNATIVES,
): AlternativeRow[] {
  const selfKeys = new Set([alternativeKey(subject.slug), alternativeKey(subject.name)]);
  const seen = new Set<string>(selfKeys);
  const comparedByKey = new Map<string, ComparedAlternative>();
  for (const c of compared) {
    for (const k of [alternativeKey(c.name), alternativeKey(c.slug)]) {
      if (!comparedByKey.has(k)) comparedByKey.set(k, c);
    }
  }

  const rows: AlternativeRow[] = [];
  const push = (name: string, slug: string, reason: string | null, comparisonSlug: string | null) => {
    if (rows.length >= max) return;
    if (slug === subject.slug || UNRELEASED_RE.test(name)) return;
    const keys = [alternativeKey(name), alternativeKey(slug)];
    if (keys.some((k) => seen.has(k))) return;
    keys.forEach((k) => seen.add(k));
    rows.push({ name, slug, reason, comparisonSlug });
  };

  // Editorially ranked picks first; attach a live comparison when one exists.
  for (const c of curated) {
    const match = comparedByKey.get(alternativeKey(c.name)) ?? comparedByKey.get(alternativeKey(c.slug));
    push(c.name, c.slug, c.reason, match?.comparisonSlug ?? null);
  }
  for (const c of compared) push(c.name, c.slug, null, c.comparisonSlug);

  return rows;
}

/** "Xbox Series X Alternatives 2026: PlayStation 5 & More" — ≤ 50 chars before the brand suffix. */
export function alternativesTitle(name: string, rows: AlternativeRow[], year: number): string {
  const maxLen = 50;
  const base = `${name} Alternatives ${year}`;
  const names = rows.map((r) => r.name);
  for (let n = Math.min(3, names.length); n >= 1; n--) {
    const list = n === 1 ? `${names[0]} & More` : `${names.slice(0, n - 1).join(", ")} & ${names[n - 1]}`;
    const t = `${base}: ${list}`;
    if (t.length <= maxLen) return t;
  }
  return base.length <= maxLen ? base : `${name} Alternatives`;
}

export function alternativesDescription(name: string, rows: AlternativeRow[]): string {
  if (rows.length === 0) {
    return `Looking past ${name}? Compare ${name} with its closest competitors side by side and see which option fits you best.`;
  }
  const top = rows.slice(0, 3).map((r) => r.name);
  const list = top.length > 1 ? `${top.slice(0, -1).join(", ")} and ${top[top.length - 1]}` : top[0];
  return `Looking past ${name}? We rank ${rows.length} alternatives, including ${list}, with who each one is best for. See the best pick for you.`;
}

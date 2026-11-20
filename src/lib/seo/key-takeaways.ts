// Key takeaways for /compare pages (Nov 2026 AI Mode research).
//
// Measured findings this implements:
// - AI Mode quotes short, complete sentences (median ~10 words, ≤ ~160 chars)
//   from the top third of the page; nothing mid-sentence (hackmd citation study,
//   dejan.ai snippet study).
// - Rerankers score a direct, self-contained statement far above descriptive
//   prose, and "it"/"they" references break when a chunk is lifted out of context
//   (metehan.ai rerankers) — so every sentence names BOTH products.
// - Pages with lists/tables are matched 91% vs 39% for unstructured pages.
//
// Sentences are built deterministically from keyDifferences (already on the page),
// so they never introduce a number the page does not show elsewhere.

import type { KeyDifference } from "@/types";

export const TAKEAWAY_MAX_CHARS = 160;
export const MAX_TAKEAWAYS = 5;
export const MIN_TAKEAWAYS = 3;

function cleanValue(v: string): string {
  return v.replace(/\s+/g, " ").trim().replace(/[.;,]+$/, "");
}

const UNINFORMATIVE = /^(n\/?a|none|unknown|varies|—|-|tbd|not available)$/i;

export function takeawaySentence(diff: KeyDifference, nameA: string, nameB: string): string | null {
  const a = cleanValue(diff.entityAValue || "");
  const b = cleanValue(diff.entityBValue || "");
  if (!a || !b || UNINFORMATIVE.test(a) || UNINFORMATIVE.test(b)) return null;
  const label = diff.label.replace(/\s+/g, " ").trim();
  // "Label — A: value; B: value." stays grammatical whatever the label/value
  // shape (plural labels, sentence-case values, parentheses), unlike
  // "A's label is value" which broke on e.g. "package deals is Limited packages".
  const s =
    a.toLowerCase() === b.toLowerCase()
      ? `${label} — ${nameA} and ${nameB}: ${a}.`
      : `${label} — ${nameA}: ${a}; ${nameB}: ${b}.`;
  return s.length <= TAKEAWAY_MAX_CHARS ? s : null;
}

/**
 * 3–5 standalone, quotable sentences. Numeric differences first (they are the
 * facts answer engines lift), decided ones (winner a/b) before ties. Returns []
 * when fewer than MIN_TAKEAWAYS qualify, so thin pages don't get a stub block.
 */
export function buildKeyTakeaways(
  differences: KeyDifference[] | null | undefined,
  nameA: string,
  nameB: string,
): string[] {
  if (!differences?.length || !nameA || !nameB) return [];
  const scored = differences
    .map((d, i) => {
      const sentence = takeawaySentence(d, nameA, nameB);
      if (!sentence) return null;
      const numeric = /\d/.test(`${d.entityAValue} ${d.entityBValue}`) ? 2 : 0;
      const decided = d.winner === "a" || d.winner === "b" ? 1 : 0;
      return { sentence, score: numeric + decided, i };
    })
    .filter((x): x is { sentence: string; score: number; i: number } => x !== null)
    .sort((x, y) => y.score - x.score || x.i - y.i);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of scored) {
    if (seen.has(s.sentence)) continue;
    seen.add(s.sentence);
    out.push(s.sentence);
    if (out.length >= MAX_TAKEAWAYS) break;
  }
  return out.length >= MIN_TAKEAWAYS ? out : [];
}

/**
 * Numeric-claim guard — DAN-2188 (systemic fix for DAN-2161).
 *
 * DAN-2161 found live /compare/ prose that contradicted itself inside a single
 * sentence: `china-economy-vs-united-states` said one side was "larger" while
 * quoting "(A vs B)" in the WRONG numeric order. The generator emits confident
 * precise figures independently in free prose (shortAnswer/verdict/quickAnswer)
 * and in the structured keyDifferences table, so the two can disagree.
 *
 * This module is the pre-publish detector: it reads as wrong with zero external
 * knowledge, so it can block a page before it goes live without a fact-check.
 * Detection logic is shared with the corpus sweep (scripts/dan2161-*.ts) so the
 * gate and the sweep can never drift apart.
 *
 * Pure functions, no external calls — safe to import anywhere server-side.
 */

const UP =
  /\b(larger|bigger|higher|greater|more|faster|stronger|leads?|dominates?|exceeds?|outnumbers?|ahead)\b/i;
const DOWN = /\b(smaller|lower|less|fewer|slower|weaker|trails?|behind|lags?)\b/i;
// Rank/ordinal context: "higher" means a SMALLER ordinal — inverts the numeric test.
const RANK = /\b(rank|ranked|ranking|ranks|no\.|#|position|place|nth|first|1st)\b/i;

const WORD_SCALE: Record<string, number> = {
  trillion: 1e12,
  billion: 1e9,
  million: 1e6,
  thousand: 1e3,
};
const LETTER_SCALE: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };

/**
 * Parse a magnitude out of a fragment. Handles a word suffix ("4.2 trillion"),
 * an attached single letter ("115m", "$20b"), a percentage, or a bare number.
 * Returns null when the fragment carries no number.
 */
export function parseNumericMagnitude(raw: string): number | null {
  const s = raw.trim().toLowerCase();

  let m = s.match(/(-?[\d,]+(?:\.\d+)?)\s+(trillion|billion|million|thousand)\b/);
  if (m) return parseFloat(m[1].replace(/,/g, "")) * WORD_SCALE[m[2]];

  m = s.match(/(-?[\d,]+(?:\.\d+)?)([kmbt])\b/);
  if (m) return parseFloat(m[1].replace(/,/g, "")) * LETTER_SCALE[m[2]];

  m = s.match(/(-?[\d,]+(?:\.\d+)?)\s*%/);
  if (m) return parseFloat(m[1].replace(/,/g, ""));

  m = s.match(/(-?[\d,]+(?:\.\d+)?)/);
  if (m) return parseFloat(m[1].replace(/,/g, ""));

  return null;
}

export interface SelfContradiction {
  /** Which prose field the contradiction was found in. */
  field: string;
  /** Whether the claim was read in rank/ordinal context (inverts the test). */
  isRank: boolean;
  /** The offending fragment, whitespace-collapsed, for logging. */
  snippet: string;
  /** The two parsed magnitudes, in the order the prose quotes them. */
  a: number;
  b: number;
}

/**
 * Scan one prose field for sentences that claim a direction ("larger"/"fewer")
 * and then immediately quote "(A vs B)" in the order that refutes the claim.
 *
 * Deliberately narrow: it only fires when the text quotes both numbers itself,
 * so a hit is always a real internal inconsistency, never a fact-check miss.
 */
export function scanTextForSelfContradictions(
  text: string | null | undefined,
  field: string
): SelfContradiction[] {
  const out: SelfContradiction[] = [];
  if (!text) return out;

  const re = /\(([^()]*?\bvs?\.?\b[^()]*?)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const inner = m[1];
    const parts = inner.split(/\bvs?\.?\b|\bversus\b/i);
    if (parts.length !== 2) continue;
    // Ranges ("25-30%", "$150-200M") are ambiguous for a min/max test — skip them.
    if (parts.some((p) => /\d\s*[-–]\s*\d/.test(p))) continue;

    const a = parseNumericMagnitude(parts[0]);
    const b = parseNumericMagnitude(parts[1]);
    if (a === null || b === null || a === b) continue;

    const lead = text.slice(Math.max(0, m.index - 90), m.index);
    const up = UP.test(lead);
    const down = DOWN.test(lead);
    if (up === down) continue; // need exactly one unambiguous direction

    const isRank = RANK.test(lead) || RANK.test(inner);
    // For ranks, "higher/better" means a smaller ordinal: invert the test.
    const aWins = isRank ? a < b : a > b;
    if (up === aWins) continue; // prose and numbers agree

    out.push({
      field,
      isRank,
      snippet: (lead.slice(-70) + "(" + inner + ")").replace(/\s+/g, " ").trim(),
      a,
      b,
    });
  }
  return out;
}

/** The prose-bearing subset of a comparison this guard inspects. */
export interface NumericClaimSubject {
  shortAnswer?: string | null;
  verdict?: string | null;
  quickAnswer?: { tldr?: string | null; keyFact?: string | null } | null;
  faqs?: { question?: string; answer?: string }[] | null;
}

/**
 * Find every self-contradicting numeric claim across a comparison's free prose.
 * Empty array = nothing detectable is wrong (not a guarantee the figures are
 * correct — only that the page does not refute itself).
 */
export function findSelfContradictions(
  comparison: NumericClaimSubject
): SelfContradiction[] {
  const out: SelfContradiction[] = [
    ...scanTextForSelfContradictions(comparison.shortAnswer, "shortAnswer"),
    ...scanTextForSelfContradictions(comparison.verdict, "verdict"),
    ...scanTextForSelfContradictions(comparison.quickAnswer?.tldr, "quickAnswer.tldr"),
    ...scanTextForSelfContradictions(comparison.quickAnswer?.keyFact, "quickAnswer.keyFact"),
  ];
  (comparison.faqs || []).forEach((faq, i) => {
    out.push(...scanTextForSelfContradictions(faq?.answer, `faqs[${i}].answer`));
  });
  return out;
}

/** Human-readable one-liner per contradiction, for gate rejection messages. */
export function describeContradictions(hits: SelfContradiction[]): string {
  return hits
    .map((h) => `${h.field}: claims a direction the quoted numbers refute (${h.a} vs ${h.b}) — "${h.snippet}"`)
    .join("; ");
}

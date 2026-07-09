/**
 * Comparison quality gate — DAN-1800 (spam-update recovery, lever #3).
 *
 * The Google June 2026 Spam Update downranked /compare/* for "scaled content
 * abuse": thousands of programmatic "X vs Y" pages whose bodies were
 * template-filler (vague values like "Good"/"Varies", empty specs, no real
 * numbers). To stop minting NET-NEW thin pages, every AI generation is scored
 * here before it is allowed to save/serve. Generations that fail the gate are
 * rejected with errorStage "quality" and fall back to the crawlable client
 * shell instead of persisting a thin record.
 *
 * The gate is intentionally lenient on the numeric SCORE and strict on the
 * HARD MINIMUMS (substantive key-differences + attributes). A genuine
 * comparison — the prompt asks for 5-7 key differences and 6-10 attributes with
 * real data — clears these easily; a data-less filler page cannot.
 */

// Server-side only — pure functions, no external calls.

/** Single-token values that carry no comparative information on their own. */
const FILLER_VALUES = new Set<string>([
  "",
  "-",
  "—",
  "n/a",
  "na",
  "n\\a",
  "none",
  "null",
  "undefined",
  "tbd",
  "unknown",
  "varies",
  "various",
  "depends",
  "similar",
  "same",
  "different",
  "comparable",
  "good",
  "great",
  "bad",
  "poor",
  "average",
  "moderate",
  "medium",
  "standard",
  "normal",
  "typical",
  "high",
  "low",
  "yes",
  "no",
  "maybe",
  "n/a.",
  "see above",
]);

/** Normalize a raw value for filler/substance checks. */
function normalizeValue(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/[.\s]+$/g, "");
}

/** A value is "filler" if it's empty or a single generic word with no data. */
export function isFillerValue(raw: unknown): boolean {
  const v = normalizeValue(raw);
  if (v.length < 2) return true;
  return FILLER_VALUES.has(v);
}

/**
 * A value is "substantive" when it conveys real, differentiated information:
 * it is not filler AND it either contains a number or is a specific multi-word
 * / long phrase (not just a bare adjective the model padded the grid with).
 */
export function isSubstantiveValue(raw: unknown): boolean {
  if (isFillerValue(raw)) return false;
  const v = normalizeValue(raw);
  const hasDigit = /\d/.test(v);
  const wordCount = v.split(/\s+/).filter(Boolean).length;
  return hasDigit || wordCount >= 2 || v.length >= 8;
}

export interface QualityAssessment {
  /** 0-100 content-depth score (informational — persisted as contentScore). */
  score: number;
  /** Whether the generation clears the gate. */
  pass: boolean;
  /** Human-readable reasons a generation failed (empty when pass). */
  reasons: string[];
  /** Diagnostic counts for logging/telemetry. */
  metrics: {
    substantiveKeyDifferences: number;
    substantiveAttributes: number;
    entitiesWithProsAndCons: number;
    sourceCount: number;
    verdictLength: number;
    shortAnswerLength: number;
  };
}

// Hard minimums — the real gate. Below any of these = thin page, reject.
const MIN_SUBSTANTIVE_KEY_DIFFERENCES = 3;
const MIN_SUBSTANTIVE_ATTRIBUTES = 4;
const MIN_SCORE = 45;

/**
 * Score a generated comparison and decide whether it is deep enough to index.
 * Works for both 2-way and N-way shapes (key differences may carry `values[]`
 * for N-way or `entityAValue`/`entityBValue` for 2-way; attributes carry a
 * `values[]` of `{ valueText, valueNumber }`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assessComparisonQuality(comparison: any): QualityAssessment {
  const reasons: string[] = [];

  // --- Key differences: count rows where the compared values are substantive.
  const keyDifferences: any[] = Array.isArray(comparison?.keyDifferences) // eslint-disable-line @typescript-eslint/no-explicit-any
    ? comparison.keyDifferences
    : [];
  let substantiveKeyDifferences = 0;
  for (const kd of keyDifferences) {
    const candidateValues: unknown[] = Array.isArray(kd?.values) && kd.values.length
      ? kd.values
      : [kd?.entityAValue, kd?.entityBValue];
    const nonFiller = candidateValues.filter((v) => !isFillerValue(v));
    const substantive = candidateValues.filter((v) => isSubstantiveValue(v));
    // A useful row needs a real label and at least two distinct, non-filler
    // sides (comparing "Good" vs "Good" is not a comparison).
    const label = normalizeValue(kd?.label);
    const distinct = new Set(nonFiller.map((v) => normalizeValue(v)));
    if (label.length >= 2 && nonFiller.length >= 2 && distinct.size >= 2 && substantive.length >= 1) {
      substantiveKeyDifferences++;
    }
  }

  // --- Attributes: count rows with at least one real numeric or specific value.
  const attributes: any[] = Array.isArray(comparison?.attributes) ? comparison.attributes : []; // eslint-disable-line @typescript-eslint/no-explicit-any
  let substantiveAttributes = 0;
  for (const attr of attributes) {
    const values: any[] = Array.isArray(attr?.values) ? attr.values : []; // eslint-disable-line @typescript-eslint/no-explicit-any
    const hasReal = values.some(
      (val) =>
        (typeof val?.valueNumber === "number" && Number.isFinite(val.valueNumber)) ||
        isSubstantiveValue(val?.valueText)
    );
    if (normalizeValue(attr?.name).length >= 2 && hasReal) {
      substantiveAttributes++;
    }
  }

  // --- Entities: pros/cons coverage.
  const entities: any[] = Array.isArray(comparison?.entities) ? comparison.entities : []; // eslint-disable-line @typescript-eslint/no-explicit-any
  const entitiesWithProsAndCons = entities.filter(
    (e) => Array.isArray(e?.pros) && e.pros.length >= 2 && Array.isArray(e?.cons) && e.cons.length >= 1
  ).length;

  const verdictLength = String(comparison?.verdict ?? "").trim().length;
  const shortAnswerLength = String(comparison?.shortAnswer ?? "").trim().length;
  const sourceCount =
    typeof comparison?.citationStats?.sourceCount === "number"
      ? comparison.citationStats.sourceCount
      : Array.isArray(comparison?.citationStats?.sources)
        ? comparison.citationStats.sources.length
        : 0;

  // --- Numeric depth score (informational; drives contentScore).
  let score = 0;
  score += (Math.min(substantiveKeyDifferences, 6) / 6) * 25;
  score += (Math.min(substantiveAttributes, 8) / 8) * 30;
  score += verdictLength >= 80 ? 12 : verdictLength >= 40 ? 6 : 0;
  score += shortAnswerLength >= 60 ? 10 : shortAnswerLength >= 30 ? 5 : 0;
  score += entities.length ? (entitiesWithProsAndCons / entities.length) * 13 : 0;
  score += (Math.min(sourceCount, 3) / 3) * 10;
  score = Math.round(score);

  // --- Hard gate.
  if (substantiveKeyDifferences < MIN_SUBSTANTIVE_KEY_DIFFERENCES) {
    reasons.push(
      `only ${substantiveKeyDifferences} substantive key differences (need ${MIN_SUBSTANTIVE_KEY_DIFFERENCES})`
    );
  }
  if (substantiveAttributes < MIN_SUBSTANTIVE_ATTRIBUTES) {
    reasons.push(
      `only ${substantiveAttributes} substantive attributes (need ${MIN_SUBSTANTIVE_ATTRIBUTES})`
    );
  }
  if (score < MIN_SCORE) {
    reasons.push(`content-depth score ${score} below minimum ${MIN_SCORE}`);
  }

  return {
    score,
    pass: reasons.length === 0,
    reasons,
    metrics: {
      substantiveKeyDifferences,
      substantiveAttributes,
      entitiesWithProsAndCons,
      sourceCount,
      verdictLength,
      shortAnswerLength,
    },
  };
}

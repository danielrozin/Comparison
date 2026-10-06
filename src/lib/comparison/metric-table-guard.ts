/**
 * Render-time cleanup for compare-page Key Facts and Full Comparison tables.
 *
 * Enrichment runs appended near-duplicate attribute rows (different names,
 * conflicting numbers, sometimes one entity's value pasted into both columns).
 * This module collapses those rows when a page is rendered. It never writes
 * to the database. Set COMPARE_METRIC_DEDUPE=false (or the constant below)
 * to show the stored rows again.
 */

import type { ComparisonAttribute, ComparisonPageData, KeyDifference } from "@/types";

/**
 * On by default. Set COMPARE_METRIC_DEDUPE=0 (or false/off) and redeploy
 * to render the stored rows again. The flag is read when the page is built.
 */
export const COMPARE_METRIC_DEDUPE_ENABLED = true;

/** Key Facts and Full Comparison share this cap. Scorecard metrics stay first. */
export const COMPARE_METRIC_ROW_CAP = 25;

type EnvLike = Record<string, string | undefined>;

export function isCompareMetricDedupeEnabled(env: EnvLike = process.env): boolean {
  const raw = (env.COMPARE_METRIC_DEDUPE ?? env.NEXT_PUBLIC_COMPARE_METRIC_DEDUPE ?? "")
    .trim()
    .toLowerCase();
  if (raw === "0" || raw === "false" || raw === "off") return false;
  if (raw === "1" || raw === "true" || raw === "on") return true;
  return COMPARE_METRIC_DEDUPE_ENABLED;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "of", "and", "or", "vs", "versus", "in", "for", "per",
  "inc", "co", "corp", "ltd", "llc",
]);

const FILLER_TOKENS = new Set([
  "rate", "ratio", "total", "size", "estimated", "approx", "approximately",
  "about", "figure", "figures", "value", "values", "number", "numbers",
]);

const UNIT_TOKENS = new Set([
  "usd", "eur", "gbp", "dollar", "dollars", "euro", "euros", "percent",
  "percentage", "pct", "trillion", "billion", "million", "thousand",
  "people", "km", "km2", "sq",
]);

const PROTECTED_TOKENS = new Set([
  "gdp", "ppp", "revenue", "debt", "growth", "population", "defense",
  "military", "price", "share", "commission", "driver", "market", "capita",
]);

interface Range {
  min: number;
  max: number;
}

interface ScorecardRef {
  label: string;
  cells: string[];
  winner?: "a" | "b" | "tie";
}

interface RankedRow {
  attr: ComparisonAttribute;
  index: number;
  cells: string[];
  scorecard: boolean;
  quick: boolean;
  hasSource: boolean;
  recency: number;
  identical: boolean;
  copied: boolean;
  side: "a" | "b" | "tie" | null;
}

export function canonicalizeMetricName(
  name: string,
  unit?: string | null,
  entityLabels: string[] = [],
): string {
  // A missing or non-text name is not a metric. Callers skip an empty key
  // instead of throwing, so one bad row cannot 500 the page.
  if (typeof name !== "string" || !name.trim()) return "";
  let text = name.toLowerCase();
  text = text.replace(/\(([^)]*)\)/g, " $1 ");
  text = text.replace(/&/g, " and ");
  text = text.replace(/\bdefence\b/g, "defense");
  text = text.replace(/\blabour\b/g, "labor");
  text = text.replace(/\bgross domestic product\b/g, "gdp");
  text = text.replace(/\bpurchasing power parity\b/g, "ppp");
  text = text.replace(/\bper person\b/g, "per capita");
  text = text.replace(/[^a-z0-9]+/g, " ");
  text = text.replace(/\b(?:19|20)\d{2}\b/g, " ");

  const unitTokens = new Set(UNIT_TOKENS);
  if (typeof unit === "string" && unit.trim()) {
    for (const part of unit.toLowerCase().split(/[^a-z0-9]+/)) {
      if (part) unitTokens.add(part);
    }
  }

  const entityTokens = new Set<string>();
  for (const label of entityLabels) {
    if (typeof label !== "string" || !label.trim()) continue;
    const parts = label.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    for (const part of parts) {
      if (part.length >= 2 && !PROTECTED_TOKENS.has(part)) entityTokens.add(part);
    }
    const joined = parts.join(" ");
    if (joined.includes("united states")) {
      entityTokens.add("us");
      entityTokens.add("usa");
    }
    if (joined.includes("united kingdom")) entityTokens.add("uk");
  }

  const tokens = text
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token) && !unitTokens.has(token) && !entityTokens.has(token));

  return canonicalFromTokens(tokens);
}

function canonicalFromTokens(tokens: string[]): string {
  const set = new Set(tokens);
  if (set.has("debt") && set.has("gdp")) return "debt to gdp";
  if (set.has("growth") && set.has("gdp")) return "gdp growth";
  if (set.has("capita") && set.has("gdp")) {
    return set.has("ppp") ? "gdp per capita ppp" : "gdp per capita";
  }
  if (set.has("ppp") && set.has("gdp")) return "gdp ppp";
  if (isNominalGdp(set)) return "nominal gdp";
  if (set.has("commission") || (set.has("platform") && set.has("fee"))) return "driver commission";
  if (isAnnualRevenue(set)) return "annual revenue";
  if (
    (set.has("defense") || set.has("military")) &&
    (set.has("spending") || set.has("budget") || set.has("expenditure"))
  ) {
    return "defense spending";
  }
  if (
    (set.has("geographic") && set.has("coverage")) ||
    (set.has("market") && set.has("presence")) ||
    (set.has("global") && set.has("presence"))
  ) {
    return "geographic coverage";
  }

  const generic = tokens.filter((token) => !FILLER_TOKENS.has(token));
  const used = generic.length > 0 ? generic : tokens;
  return [...used].sort().join(" ");
}

/**
 * "Nominal GDP" and "GDP (nominal)" are one metric. "Manufacturing as % of GDP"
 * and "R&D spending as % of GDP" are different metrics and stay separate.
 */
function isNominalGdp(tokens: Set<string>): boolean {
  if (!tokens.has("gdp")) return false;
  const allowed = new Set(["gdp", "nominal", "gross", "domestic", "product", "annual", "current"]);
  const extras = [...tokens].filter((token) => !allowed.has(token) && !FILLER_TOKENS.has(token));
  return extras.length === 0;
}

/** Dollar revenue, not "revenue diversification" or "revenue growth". */
function isAnnualRevenue(tokens: Set<string>): boolean {
  if (!tokens.has("revenue")) return false;
  const extras = [...tokens].filter(
    (token) => token !== "revenue" && token !== "annual" && !FILLER_TOKENS.has(token),
  );
  return extras.length === 0;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[$€£¥,~]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9.+-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function distinctiveWords(value: string): string[] {
  const ignored = new Set([
    ...UNIT_TOKENS,
    ...FILLER_TOKENS,
    "about", "approximately", "approx", "over", "around", "nearly", "plus",
  ]);
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !/^\d/.test(word) && !ignored.has(word));
}

const SCALE: Record<string, number> = {
  trillion: 1e12,
  tn: 1e12,
  t: 1e12,
  billion: 1e9,
  bn: 1e9,
  b: 1e9,
  million: 1e6,
  mn: 1e6,
  m: 1e6,
  thousand: 1e3,
  k: 1e3,
  percent: 1,
  "%": 1,
};

function stripNumberCommas(value: string): string {
  let next = value;
  for (let i = 0; i < 3; i += 1) {
    const stripped = next.replace(/(\d),(?=\d{3}(\D|$))/g, "$1");
    if (stripped === next) break;
    next = stripped;
  }
  return next;
}

/** Pull one numeric range out of a cell. Suffixes apply to the whole range. */
export function parsePrimaryRange(value: string): Range | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const text = stripNumberCommas(value.toLowerCase().replace(/[$€£¥~]/g, " "));
  const match = text.match(
    /(\d+(?:\.\d+)?)\s*(\+|[-–—]|to)?\s*(\d+(?:\.\d+)?)?\s*(trillion|billion|million|thousand|percent|tn|bn|mn|%|(?:(?<![a-z])[tmbk](?![a-z])))?/,
  );
  if (!match) return null;
  const first = Number(match[1]);
  const joiner = match[2];
  const second = match[3] != null ? Number(match[3]) : null;
  const suffix = match[4] ?? "";
  if (!Number.isFinite(first)) return null;
  const scale = SCALE[suffix] ?? 1;
  let min = first * scale;
  let max = first * scale;
  if (joiner === "+" || joiner === "plus") {
    max = Number.POSITIVE_INFINITY;
  } else if (second != null && Number.isFinite(second)) {
    const high = second * scale;
    min = Math.min(min, high);
    max = Math.max(first * scale, high);
  }
  return { min, max };
}

function rangesOverlap(a: Range, b: Range): boolean {
  return a.max >= b.min && b.max >= a.min;
}

/** A stored cell may sit this far from the scorecard figure and still match it. */
const SCORECARD_VALUE_TOLERANCE = 0.05;

/** A farther cell can still be shown, with its winner cleared, up to this gap. */
const SCORECARD_NEAR_TOLERANCE = 0.15;

function finiteMagnitude(range: Range): number {
  let magnitude = 0;
  if (Number.isFinite(range.min)) magnitude = Math.max(magnitude, Math.abs(range.min));
  if (Number.isFinite(range.max)) magnitude = Math.max(magnitude, Math.abs(range.max));
  return magnitude;
}

/**
 * Distance between two ranges as a fraction of the larger finite magnitude.
 * Overlap, including a point inside an open range such as "30+", is 0.
 * Suffixes are already scaled, so 38.7 and 38.7 billion are not the same unit.
 */
function rangeRelativeGap(a: Range, b: Range): number {
  if (rangesOverlap(a, b)) return 0;
  const gap = a.max < b.min ? b.min - a.max : a.min - b.max;
  const scale = Math.max(finiteMagnitude(a), finiteMagnitude(b));
  if (!Number.isFinite(gap) || scale === 0) return Number.POSITIVE_INFINITY;
  return gap / scale;
}

function figuresAgree(
  left: string | null | undefined,
  right: string | null | undefined,
  tolerance: number,
): boolean {
  if (typeof left !== "string" || typeof right !== "string") return false;
  if (!left || !right) return false;
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a || !b) return false;
  if (a === b) return true;

  const ra = parsePrimaryRange(left);
  const rb = parsePrimaryRange(right);
  if (ra && rb) {
    if (rangeRelativeGap(ra, rb) > tolerance) return false;
    const wordsA = distinctiveWords(left);
    const wordsB = distinctiveWords(right);
    if (wordsA.length > 0 && wordsB.length > 0) {
      const shared = wordsA.some((word) => wordsB.includes(word));
      if (!shared) return false;
    }
    return true;
  }

  const shorter = a.length <= b.length ? a : b;
  const longer = a.length <= b.length ? b : a;
  return shorter.length >= 4 && longer.includes(shorter);
}

/**
 * True when two cells are the same figure. A number also matches when it
 * falls inside the other range, or sits within ±5% of it, at the same scale.
 */
export function valuesMatch(left: string | null | undefined, right: string | null | undefined): boolean {
  return figuresAgree(left, right, SCORECARD_VALUE_TOLERANCE);
}

/** Exact text or overlapping ranges only. Used so close-but-different cells are not treated as copies. */
function sameFigure(left: string | null | undefined, right: string | null | undefined): boolean {
  return figuresAgree(left, right, 0);
}

function entityLabels(page: ComparisonPageData): string[] {
  return page.entities.flatMap((entity) => [entity.name, entity.slug]);
}

/** Text, a finite number, or a boolean. Anything else is a missing cell, not a crash. */
function cellString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return "";
}

function cellText(attr: ComparisonAttribute, entityId: string, index: number): string {
  if (!Array.isArray(attr.values)) return "";
  const value = attr.values.find((entry) => entry?.entityId === entityId) ?? attr.values[index];
  if (!value || typeof value !== "object") return "";
  const text = cellString(value.valueText);
  if (text) return text;
  if (typeof value.valueNumber === "number" && Number.isFinite(value.valueNumber)) return String(value.valueNumber);
  if (value.valueBoolean != null) return value.valueBoolean ? "yes" : "no";
  return "";
}

function rowCells(attr: ComparisonAttribute, page: ComparisonPageData): string[] {
  return page.entities.map((entity, index) => cellText(attr, entity.id, index));
}

function keyDifferencesOf(page: ComparisonPageData): KeyDifference[] {
  return Array.isArray(page.keyDifferences) ? page.keyDifferences : [];
}

function scorecardMap(page: ComparisonPageData, labels: string[]): Map<string, ScorecardRef> {
  const map = new Map<string, ScorecardRef>();
  for (const diff of keyDifferencesOf(page)) {
    const ref = safeScorecardRef(diff);
    if (!ref) continue;
    const key = canonicalizeMetricName(ref.label, null, labels);
    if (!key || map.has(key)) continue;
    map.set(key, ref);
  }
  return map;
}

/**
 * A scorecard row the guard can trust. Returns null for a row that would
 * blank or crash the table: no label, or the legacy 3-way shape
 * `{ attribute, values: { slug: text }, winner: slug }` used by
 * figma-vs-sketch-vs-adobe-xd and zoom-vs-google-meet-vs-teams.
 * Those rows are skipped. The attribute table still renders.
 */
function scorecardRef(diff: KeyDifference): ScorecardRef | null {
  if (!diff || typeof diff !== "object") return null;
  if (typeof diff.label !== "string" || !diff.label.trim()) return null;

  const rawValues = diff.values as unknown;
  // An object map is not a position-indexed values[]. Falling through to
  // entityAValue/entityBValue would store two blank cells and replace a
  // real metric with an empty scorecard row.
  if (rawValues && typeof rawValues === "object" && !Array.isArray(rawValues)) return null;

  let cells: string[];
  if (Array.isArray(rawValues)) {
    if (rawValues.length < 2) return null;
    cells = rawValues.map((value) => cellString(value));
  } else {
    cells = [cellString(diff.entityAValue), cellString(diff.entityBValue)];
  }
  if (!cells.some((cell) => cell.length > 0)) return null;

  const winner = diff.winner === "a" || diff.winner === "b" || diff.winner === "tie"
    ? diff.winner
    : undefined;
  return {
    label: diff.label.trim(),
    cells,
    ...(winner ? { winner } : {}),
  };
}

function safeScorecardRef(diff: KeyDifference): ScorecardRef | null {
  try {
    return scorecardRef(diff);
  } catch {
    return null;
  }
}

function cellsMatch(actual: string[], expected: string[]): boolean {
  if (expected.length === 0) return false;
  const width = Math.min(actual.length, expected.length);
  if (width < 2) return false;
  return expected.slice(0, width).every((cell, index) => valuesMatch(actual[index], cell));
}

function isIdentical(cells: string[]): boolean {
  if (cells.length < 2) return false;
  if (cells.some((cell) => !cell || cell === "—" || cell === "-")) return false;
  return cells.every((cell) => sameFigure(cell, cells[0]));
}

function quickProse(page: ComparisonPageData): string {
  return [page.quickAnswer?.tldr, page.quickAnswer?.keyFact, page.shortAnswer]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join("\n");
}

function matchesQuick(cells: string[], prose: string): boolean {
  if (!prose || cells.length < 2) return false;
  return cells.every((cell) => cell.length > 0 && proseMentions(cell, prose));
}

function proseMentions(cell: string, prose: string): boolean {
  const needle = normalizeText(cell);
  const haystack = normalizeText(prose);
  if (needle.length >= 4 && haystack.includes(needle)) return true;
  const cellRange = parsePrimaryRange(cell);
  if (!cellRange) return false;
  // Scan every number in the answer. The first match alone would miss the
  // second entity's figure.
  return numberRanges(prose).some((range) => rangesOverlap(cellRange, range));
}

function numberRanges(prose: string): Range[] {
  const text = stripNumberCommas(prose.toLowerCase().replace(/[$€£¥~]/g, " "));
  const pattern = /(\d+(?:\.\d+)?)\s*(\+|[-–—]|to)?\s*(\d+(?:\.\d+)?)?\s*(trillion|billion|million|thousand|percent|tn|bn|mn|%|(?:(?<![a-z])[tmbk](?![a-z])))?/g;
  const ranges: Range[] = [];
  for (const match of text.matchAll(pattern)) {
    const slice = match[0];
    const range = parsePrimaryRange(slice);
    if (range) ranges.push(range);
  }
  return ranges;
}

function rowMeta(attr: ComparisonAttribute): { hasSource: boolean; recency: number } {
  let hasSource = false;
  let recency = 0;
  if (!Array.isArray(attr.values)) return { hasSource, recency };
  for (const value of attr.values) {
    if (!value || typeof value !== "object") continue;
    if (value.source && value.source.trim()) hasSource = true;
    if (!value.updatedAt) continue;
    const stamp = Date.parse(value.updatedAt);
    if (Number.isFinite(stamp) && stamp > recency) recency = stamp;
  }
  return { hasSource, recency };
}

interface FigureCluster {
  sample: string;
  counts: number[];
  earliestEntity: number;
  earliestIndex: number;
}

/**
 * A row copied one entity's figure into the other entity's column when that
 * figure belongs to the other entity. Ownership is the entity that shows the
 * figure most often; a tie goes to the earliest row. The earliest row itself
 * stays, so a later paste cannot erase the original.
 */
function markCrossCopies(rows: RankedRow[]): void {
  const clusters: FigureCluster[] = [];

  const clusterFor = (cell: string): FigureCluster | null => {
    const text = cell.trim();
    if (!text || text === "—" || text === "-") return null;
    const found = clusters.find((cluster) => sameFigure(cluster.sample, text));
    if (found) return found;
    const created: FigureCluster = {
      sample: text,
      counts: [],
      earliestEntity: -1,
      earliestIndex: Number.POSITIVE_INFINITY,
    };
    clusters.push(created);
    return created;
  };

  for (const row of rows) {
    row.cells.forEach((cell, entity) => {
      const cluster = clusterFor(cell);
      if (!cluster) return;
      cluster.counts[entity] = (cluster.counts[entity] ?? 0) + 1;
      if (row.index < cluster.earliestIndex) {
        cluster.earliestIndex = row.index;
        cluster.earliestEntity = entity;
      }
    });
  }

  const ownerOf = (cluster: FigureCluster): number => {
    let bestCount = -1;
    for (const count of cluster.counts) {
      if (count > bestCount) bestCount = count;
    }
    const leaders: number[] = [];
    cluster.counts.forEach((count, entity) => {
      if (count === bestCount) leaders.push(entity);
    });
    if (leaders.length === 1) return leaders[0];
    return cluster.earliestEntity;
  };

  for (const row of rows) {
    row.copied = row.cells.some((cell, entity) => {
      const cluster = clusters.find((item) => sameFigure(item.sample, cell));
      if (!cluster) return false;
      const home = ownerOf(cluster);
      if (home < 0 || home === entity) return false;
      const homeCell = row.cells[home];
      return !homeCell || !sameFigure(homeCell, cell);
    });
  }
}

function winnerSide(attr: ComparisonAttribute, page: ComparisonPageData): "a" | "b" | "tie" | null {
  if (!Array.isArray(attr.values)) return null;
  const left = attr.values.find((value) => value?.entityId === page.entities[0]?.id) ?? attr.values[0];
  const right = attr.values.find((value) => value?.entityId === page.entities[1]?.id) ?? attr.values[1];
  if (!left && !right) return null;
  if (left?.winner === true && right?.winner === true) return "tie";
  if (left?.winner === true) return "a";
  if (right?.winner === true) return "b";
  if (left?.winner === false && right?.winner === false) return "tie";
  return null;
}

function withoutWinner(attr: ComparisonAttribute): ComparisonAttribute {
  return {
    ...attr,
    values: attr.values.map((value) => {
      if (value.winner == null) return value;
      const next = { ...value };
      delete next.winner;
      return next;
    }),
  };
}

function compareRank(a: RankedRow, b: RankedRow): number {
  const tier = (row: RankedRow) => (row.scorecard ? 2 : row.quick ? 1 : 0);
  const tierDelta = tier(b) - tier(a);
  if (tierDelta !== 0) return tierDelta;
  if (a.hasSource !== b.hasSource) return a.hasSource ? -1 : 1;
  if (a.hasSource && b.hasSource && a.recency !== b.recency) return b.recency - a.recency;
  return a.index - b.index;
}

interface Prepared {
  labels: string[];
  scorecards: Map<string, ScorecardRef>;
  groups: Map<string, RankedRow[]>;
  groupOrder: string[];
}

function prepare(page: ComparisonPageData): Prepared {
  const labels = entityLabels(page);
  const scorecards = scorecardMap(page, labels);
  const prose = quickProse(page);
  const groups = new Map<string, RankedRow[]>();
  const groupOrder: string[] = [];

  page.attributes.forEach((attr, index) => {
    // One broken attribute is dropped. The other rows still render.
    try {
      if (!attr || typeof attr.name !== "string" || !Array.isArray(attr.values)) return;
      const key = canonicalizeMetricName(attr.name, attr.unit, labels) || `row ${index}`;
      const cells = rowCells(attr, page);
      const scorecard = scorecards.get(key);
      const meta = rowMeta(attr);
      const ranked: RankedRow = {
        attr,
        index,
        cells,
        scorecard: scorecard ? cellsMatch(cells, scorecard.cells) : false,
        quick: matchesQuick(cells, prose),
        hasSource: meta.hasSource,
        recency: meta.recency,
        identical: isIdentical(cells),
        copied: false,
        side: winnerSide(attr, page),
      };
      if (!groups.has(key)) {
        groups.set(key, []);
        groupOrder.push(key);
      }
      groups.get(key)!.push(ranked);
    } catch {
      // Leave this row out of the table.
    }
  });

  for (const rows of groups.values()) {
    markCrossCopies(rows);
  }

  return { labels, scorecards, groups, groupOrder };
}

/**
 * One row per metric, consistent with the scorecard, with copied cells removed.
 * Returns the original array when nothing changes.
 */
export function guardComparisonAttributes(page: ComparisonPageData): ComparisonAttribute[] {
  if (!Array.isArray(page.entities) || page.entities.length < 2) return page.attributes ?? [];
  if (!Array.isArray(page.attributes) || page.attributes.length === 0) return page.attributes ?? [];

  const prepared = prepare(page);
  const kept: { key: string; index: number; attr: ComparisonAttribute }[] = [];

  for (const key of prepared.groupOrder) {
    try {
      const rows = prepared.groups.get(key) ?? [];
      const scorecard = prepared.scorecards.get(key);
      const choice = chooseRow(rows, scorecard);
      const attr = materialize(page, choice, scorecard, key);
      if (!choice || !attr) continue;
      kept.push({ key, index: choice.row?.index ?? Number.MAX_SAFE_INTEGER, attr });
    } catch {
      // Drop this metric. The rest of the table still renders.
    }
  }

  const scorecardOrder = new Map<string, number>();
  let cursor = 0;
  for (const diff of keyDifferencesOf(page)) {
    const ref = safeScorecardRef(diff);
    if (!ref) continue;
    const key = canonicalizeMetricName(ref.label, null, prepared.labels);
    if (!key || scorecardOrder.has(key)) continue;
    scorecardOrder.set(key, cursor);
    cursor += 1;
  }

  kept.sort((a, b) => {
    const aScore = scorecardOrder.get(a.key);
    const bScore = scorecardOrder.get(b.key);
    const aRank = aScore ?? Number.POSITIVE_INFINITY;
    const bRank = bScore ?? Number.POSITIVE_INFINITY;
    if (aRank !== bRank) return aRank - bRank;
    return a.index - b.index;
  });

  const capped = kept.slice(0, COMPARE_METRIC_ROW_CAP).map((row) => row.attr);
  if (
    capped.length === page.attributes.length &&
    capped.every((attr, index) => attr === page.attributes[index])
  ) {
    return page.attributes;
  }
  return capped;
}

interface RowChoice {
  row: RankedRow | null;
  clearWinner: boolean;
  fromScorecard: boolean;
}

function isOppositeWinner(row: RankedRow, scorecard: ScorecardRef | undefined): boolean {
  if (!scorecard?.winner || scorecard.winner === "tie") return false;
  if (row.side !== "a" && row.side !== "b") return false;
  return row.side !== scorecard.winner;
}

function cellGap(actual: string, expected: string): number {
  const left = parsePrimaryRange(actual);
  const right = parsePrimaryRange(expected);
  if (left && right) return rangeRelativeGap(left, right);
  return valuesMatch(actual, expected) ? 0 : Number.POSITIVE_INFINITY;
}

function rowGap(row: RankedRow, scorecard: ScorecardRef): number {
  const width = Math.min(row.cells.length, scorecard.cells.length);
  let worst = 0;
  for (let index = 0; index < width; index += 1) {
    const gap = cellGap(row.cells[index] ?? "", scorecard.cells[index] ?? "");
    if (gap > worst) worst = gap;
  }
  return worst;
}

function compareMatches(scorecard: ScorecardRef): (a: RankedRow, b: RankedRow) => number {
  return (a, b) => {
    if (a.hasSource !== b.hasSource) return a.hasSource ? -1 : 1;
    if (a.hasSource && b.hasSource && a.recency !== b.recency) return b.recency - a.recency;
    const gapDelta = rowGap(a, scorecard) - rowGap(b, scorecard);
    if (gapDelta !== 0) return gapDelta;
    return a.index - b.index;
  };
}

function closestWithin(rows: RankedRow[], scorecard: ScorecardRef): RankedRow | null {
  const eligible = rows.filter((row) => !row.copied && !row.identical && !isOppositeWinner(row, scorecard));
  const ranked = eligible
    .map((row) => ({ row, gap: rowGap(row, scorecard) }))
    .filter((item) => item.gap <= SCORECARD_NEAR_TOLERANCE)
    .sort((a, b) => {
      if (a.gap !== b.gap) return a.gap - b.gap;
      return compareRank(a.row, b.row);
    });
  return ranked[0]?.row ?? null;
}

/**
 * Prefer a scorecard match, and among matches the newest row that has a source.
 * A near miss (about 15%) is kept with its winner cleared. A wider gap, or a
 * winner that points the other way, is not kept. A scorecard metric is never
 * dropped: the scorecard cells are rendered instead.
 */
function chooseRow(rows: RankedRow[], scorecard: ScorecardRef | undefined): RowChoice | null {
  if (scorecard) {
    const matching = rows.filter((row) => row.scorecard && !isOppositeWinner(row, scorecard));
    if (matching.length > 0) {
      const best = [...matching].sort(compareMatches(scorecard))[0];
      if (best) return { row: best, clearWinner: false, fromScorecard: false };
    }
    const near = closestWithin(rows, scorecard);
    if (near) return { row: near, clearWinner: true, fromScorecard: false };
    return { row: null, clearWinner: false, fromScorecard: true };
  }

  const pool = rows.filter((row) => !row.identical && !row.copied);
  const best = [...pool].sort(compareRank)[0];
  if (!best) return null;
  return { row: best, clearWinner: false, fromScorecard: false };
}

function pointNumber(text: string): number | null {
  const range = parsePrimaryRange(text);
  if (!range || !Number.isFinite(range.min) || !Number.isFinite(range.max)) return null;
  if (range.min !== range.max) return null;
  return range.min;
}

function attributeFromScorecard(
  page: ComparisonPageData,
  scorecard: ScorecardRef,
  key: string,
): ComparisonAttribute {
  const values = page.entities.map((entity, index) => {
    const text = scorecard.cells[index] ?? "";
    return {
      entityId: entity.id,
      valueText: text,
      valueNumber: pointNumber(text),
      valueBoolean: null,
      ...(scorecard.winner === "a" && index === 0 ? { winner: true as const } : {}),
      ...(scorecard.winner === "b" && index === 1 ? { winner: true as const } : {}),
      ...(scorecard.winner === "tie" ? { winner: false as const } : {}),
    };
  });
  return {
    id: `scorecard:${key}`,
    slug: `scorecard-${key.replace(/\s+/g, "-")}`,
    name: scorecard.label,
    unit: null,
    category: null,
    dataType: values.some((value) => value.valueNumber != null) ? "number" : "text",
    higherIsBetter: null,
    values,
  };
}

function materialize(
  page: ComparisonPageData,
  choice: RowChoice | null,
  scorecard: ScorecardRef | undefined,
  key: string,
): ComparisonAttribute | null {
  if (!choice) return null;
  if (choice.fromScorecard) {
    return scorecard ? attributeFromScorecard(page, scorecard, key) : null;
  }
  if (!choice.row) return null;
  if (choice.clearWinner) return withoutWinner(choice.row.attr);
  return alignWinner(page, choice.row, scorecard);
}

function alignWinner(
  page: ComparisonPageData,
  row: RankedRow,
  scorecard: ScorecardRef | undefined,
): ComparisonAttribute {
  if (!scorecard?.winner) return row.attr;
  const side = winnerSide(row.attr, page);
  if (side && side !== scorecard.winner) return withoutWinner(row.attr);
  return row.attr;
}

/** Apply the guard when the flag is on. Does not mutate the input page. */
export function presentComparisonMetrics<T extends ComparisonPageData>(page: T): T {
  if (!isCompareMetricDedupeEnabled()) return page;
  try {
    const attributes = guardComparisonAttributes(page);
    if (attributes === page.attributes) return page;
    return { ...page, attributes };
  } catch (error) {
    // The table section falls back to the stored rows. The page still renders.
    console.warn("compare metric guard skipped", page?.slug, error);
    return page;
  }
}

export interface MetricQualityScore {
  slug: string;
  rawRowCount: number;
  guardedRowCount: number;
  duplicateGroupCount: number;
  conflictingRowCount: number;
  identicalRowCount: number;
  copiedRowCount: number;
}

/** One canonical metric that the guard would collapse or drop. */
export interface MetricConflict {
  /** Canonical name, such as "nominal gdp". */
  metric: string;
  /** Stored row the guard keeps. Null when every row for this metric is dropped. */
  kept: string | null;
  /** Every stored row, including the kept one. Each line is "Name — Entity: value | Entity: value". */
  values: string[];
}

export interface MetricInspection extends MetricQualityScore {
  conflicts: MetricConflict[];
}

function emptyInspection(slug: string, rawRowCount: number): MetricInspection {
  return {
    slug,
    rawRowCount,
    guardedRowCount: rawRowCount,
    duplicateGroupCount: 0,
    conflictingRowCount: 0,
    identicalRowCount: 0,
    copiedRowCount: 0,
    conflicts: [],
  };
}

function formatStoredRow(page: ComparisonPageData, row: RankedRow): string {
  const cells = page.entities.map((entity, index) => {
    const cell = row.cells[index]?.trim();
    return `${entity.name}: ${cell || "—"}`;
  });
  return `${row.attr.name} — ${cells.join(" | ")}`;
}

function formatScorecardRow(page: ComparisonPageData, scorecard: ScorecardRef): string {
  const cells = page.entities.map((entity, index) => {
    const cell = scorecard.cells[index]?.trim();
    return `${entity.name}: ${cell || "—"}`;
  });
  return `${scorecard.label} — ${cells.join(" | ")}`;
}

function isConflictGroup(
  rows: RankedRow[],
  choice: RowChoice | null,
  scorecard: ScorecardRef | undefined,
): boolean {
  if (rows.length === 0) return false;
  if (!choice || choice.fromScorecard || choice.clearWinner || rows.length > 1) return true;
  const row = choice.row ?? rows[0];
  if (!row) return true;
  if (row.copied && !row.scorecard) return true;
  if (row.identical && !row.scorecard) return true;
  if (scorecard && !row.scorecard) return true;
  return false;
}

/** Read-only inspection: counts plus the conflicting values and the kept row. */
export function inspectComparisonMetrics(page: ComparisonPageData): MetricInspection {
  const rawRowCount = page.attributes.length;
  if (page.entities.length < 2) return emptyInspection(page.slug, rawRowCount);

  const prepared = prepare(page);
  let duplicateGroupCount = 0;
  let conflictingRowCount = 0;
  let identicalRowCount = 0;
  let copiedRowCount = 0;
  const conflicts: MetricConflict[] = [];

  for (const key of prepared.groupOrder) {
    const rows = prepared.groups.get(key) ?? [];
    if (rows.length > 1) duplicateGroupCount += 1;
    const scorecard = prepared.scorecards.get(key);
    for (const row of rows) {
      if (row.identical) identicalRowCount += 1;
      if (row.copied) copiedRowCount += 1;
      if (scorecard && !row.scorecard) conflictingRowCount += 1;
    }
    const choice = chooseRow(rows, scorecard);
    if (!isConflictGroup(rows, choice, scorecard)) continue;
    const kept = choice?.fromScorecard && scorecard
      ? formatScorecardRow(page, scorecard)
      : choice?.row
        ? formatStoredRow(page, choice.row)
        : null;
    conflicts.push({
      metric: key,
      kept,
      values: rows.map((row) => formatStoredRow(page, row)),
    });
  }

  return {
    slug: page.slug,
    rawRowCount,
    guardedRowCount: guardComparisonAttributes(page).length,
    duplicateGroupCount,
    conflictingRowCount,
    identicalRowCount,
    copiedRowCount,
    conflicts,
  };
}

/** Read-only quality score. Counts the stored rows and the rows the guard would keep. */
export function scoreComparisonMetrics(page: ComparisonPageData): MetricQualityScore {
  const inspection = inspectComparisonMetrics(page);
  return {
    slug: inspection.slug,
    rawRowCount: inspection.rawRowCount,
    guardedRowCount: inspection.guardedRowCount,
    duplicateGroupCount: inspection.duplicateGroupCount,
    conflictingRowCount: inspection.conflictingRowCount,
    identicalRowCount: inspection.identicalRowCount,
    copiedRowCount: inspection.copiedRowCount,
  };
}

function measuredName(item: unknown): string | null {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const name = (item as { name?: unknown }).name;
  return typeof name === "string" ? name : null;
}

/**
 * Drop JSON-LD metric nodes that the cleaned table does not render, and keep
 * one node per canonical metric so Dataset and DefinedTermSet match the table.
 */
export function alignJsonLdToRenderedMetrics<T>(document: T, page: ComparisonPageData): T {
  if (!isCompareMetricDedupeEnabled()) return document;
  const labels = entityLabels(page);
  const allowed = new Set(
    page.attributes.map((attr) => canonicalizeMetricName(attr.name, attr.unit, labels)),
  );
  return walk(document, allowed, labels) as T;
}

function walk(value: unknown, allowed: Set<string>, labels: string[]): unknown {
  if (Array.isArray(value)) return value.map((item) => walk(item, allowed, labels));
  if (!value || typeof value !== "object") return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if ((key === "variableMeasured" || key === "hasDefinedTerm") && Array.isArray(child)) {
      next[key] = filterMetricNodes(child, allowed, labels);
      continue;
    }
    next[key] = walk(child, allowed, labels);
  }
  return next;
}

function filterMetricNodes(items: unknown[], allowed: Set<string>, labels: string[]): unknown[] {
  const seen = new Set<string>();
  const kept: unknown[] = [];
  for (const item of items) {
    const name = measuredName(item);
    if (!name) {
      kept.push(item);
      continue;
    }
    const key = canonicalizeMetricName(name, null, labels);
    if (!allowed.has(key) || seen.has(key)) continue;
    seen.add(key);
    kept.push(item);
  }
  return kept;
}

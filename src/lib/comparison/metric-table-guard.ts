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

/** Flip to false to render stored attribute rows with no cleanup. */
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
}

export function canonicalizeMetricName(
  name: string,
  unit?: string | null,
  entityLabels: string[] = [],
): string {
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
  if (unit) {
    for (const part of unit.toLowerCase().split(/[^a-z0-9]+/)) {
      if (part) unitTokens.add(part);
    }
  }

  const entityTokens = new Set<string>();
  for (const label of entityLabels) {
    for (const part of label.toLowerCase().split(/[^a-z0-9]+/)) {
      if (part.length >= 2 && !PROTECTED_TOKENS.has(part)) entityTokens.add(part);
    }
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
  if (set.has("gdp")) return "nominal gdp";
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

/** True when two cells are the same figure, allowing unit and wording variants. */
export function valuesMatch(left: string | null | undefined, right: string | null | undefined): boolean {
  if (!left || !right) return false;
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length <= b.length ? b : a;
  if (shorter.length >= 4 && longer.includes(shorter)) return true;

  const ra = parsePrimaryRange(left);
  const rb = parsePrimaryRange(right);
  if (!ra || !rb || !rangesOverlap(ra, rb)) return false;

  const wordsA = distinctiveWords(left);
  const wordsB = distinctiveWords(right);
  if (wordsA.length > 0 && wordsB.length > 0) {
    const shared = wordsA.some((word) => wordsB.includes(word));
    if (!shared) return false;
  }
  return true;
}

function entityLabels(page: ComparisonPageData): string[] {
  return page.entities.flatMap((entity) => [entity.name, entity.slug]);
}

function cellText(attr: ComparisonAttribute, entityId: string, index: number): string {
  const value = attr.values.find((entry) => entry.entityId === entityId) ?? attr.values[index];
  if (!value) return "";
  if (value.valueText && value.valueText.trim()) return value.valueText.trim();
  if (value.valueNumber != null && Number.isFinite(value.valueNumber)) return String(value.valueNumber);
  if (value.valueBoolean != null) return value.valueBoolean ? "yes" : "no";
  return "";
}

function rowCells(attr: ComparisonAttribute, page: ComparisonPageData): string[] {
  return page.entities.map((entity, index) => cellText(attr, entity.id, index));
}

function scorecardMap(page: ComparisonPageData, labels: string[]): Map<string, ScorecardRef> {
  const map = new Map<string, ScorecardRef>();
  for (const diff of page.keyDifferences ?? []) {
    const key = canonicalizeMetricName(diff.label, null, labels);
    if (!key || map.has(key)) continue;
    map.set(key, scorecardRef(diff));
  }
  return map;
}

function scorecardRef(diff: KeyDifference): ScorecardRef {
  const cells = diff.values && diff.values.length >= 2
    ? diff.values.map((value) => value ?? "")
    : [diff.entityAValue ?? "", diff.entityBValue ?? ""];
  return {
    cells,
    ...(diff.winner ? { winner: diff.winner } : {}),
  };
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
  return cells.every((cell) => valuesMatch(cell, cells[0]));
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
  for (const value of attr.values) {
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
    const found = clusters.find((cluster) => valuesMatch(cluster.sample, text));
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
      const cluster = clusters.find((item) => valuesMatch(item.sample, cell));
      if (!cluster) return false;
      const home = ownerOf(cluster);
      if (home < 0 || home === entity) return false;
      const homeCell = row.cells[home];
      return !homeCell || !valuesMatch(homeCell, cell);
    });
  }
}

function winnerSide(attr: ComparisonAttribute, page: ComparisonPageData): "a" | "b" | "tie" | null {
  const left = attr.values.find((value) => value.entityId === page.entities[0]?.id) ?? attr.values[0];
  const right = attr.values.find((value) => value.entityId === page.entities[1]?.id) ?? attr.values[1];
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
      const { winner: _winner, ...rest } = value;
      return rest;
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
    };
    if (!groups.has(key)) {
      groups.set(key, []);
      groupOrder.push(key);
    }
    groups.get(key)!.push(ranked);
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
  if (page.entities.length < 2 || page.attributes.length === 0) return page.attributes;

  const prepared = prepare(page);
  const kept: { key: string; index: number; attr: ComparisonAttribute }[] = [];

  for (const key of prepared.groupOrder) {
    const rows = prepared.groups.get(key) ?? [];
    const scorecard = prepared.scorecards.get(key);
    const selected = chooseRow(rows, scorecard);
    if (!selected) continue;
    kept.push({ key, index: selected.index, attr: alignWinner(page, selected, scorecard) });
  }

  const scorecardOrder = new Map<string, number>();
  let cursor = 0;
  for (const diff of page.keyDifferences ?? []) {
    const key = canonicalizeMetricName(diff.label, null, prepared.labels);
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

function chooseRow(rows: RankedRow[], scorecard: ScorecardRef | undefined): RankedRow | null {
  const matching = rows.filter((row) => row.scorecard);
  const pool = matching.length > 0
    ? matching
    : rows.filter((row) => !row.identical && !row.copied);
  if (pool.length === 0) return null;

  const best = [...pool].sort(compareRank)[0];
  if (!best) return null;
  if (scorecard && !best.scorecard) return null;
  if (best.identical && !best.scorecard) return null;
  if (best.copied && !best.scorecard) return null;
  return best;
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
  const attributes = guardComparisonAttributes(page);
  if (attributes === page.attributes) return page;
  return { ...page, attributes };
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

/** Read-only quality score. Counts the stored rows and the rows the guard would keep. */
export function scoreComparisonMetrics(page: ComparisonPageData): MetricQualityScore {
  const rawRowCount = page.attributes.length;
  if (page.entities.length < 2) {
    return {
      slug: page.slug,
      rawRowCount,
      guardedRowCount: rawRowCount,
      duplicateGroupCount: 0,
      conflictingRowCount: 0,
      identicalRowCount: 0,
      copiedRowCount: 0,
    };
  }

  const prepared = prepare(page);
  let duplicateGroupCount = 0;
  let conflictingRowCount = 0;
  let identicalRowCount = 0;
  let copiedRowCount = 0;
  for (const [key, rows] of prepared.groups) {
    if (rows.length > 1) duplicateGroupCount += 1;
    const scorecard = prepared.scorecards.get(key);
    for (const row of rows) {
      if (row.identical) identicalRowCount += 1;
      if (row.copied) copiedRowCount += 1;
      if (scorecard && !row.scorecard) conflictingRowCount += 1;
    }
  }

  return {
    slug: page.slug,
    rawRowCount,
    guardedRowCount: guardComparisonAttributes(page).length,
    duplicateGroupCount,
    conflictingRowCount,
    identicalRowCount,
    copiedRowCount,
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

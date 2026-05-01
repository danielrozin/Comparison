/**
 * Load a comparison row by slug from the Prisma DB and shape it into
 * `ComparisonVideoProps` (see remotion/ComparisonVideo.tsx for the type).
 *
 * Used by remotion/render-video.mjs so each slug renders its live DB row
 * instead of the demo fixture.
 *
 * Throws `ComparisonNotFoundError` when no row exists, and
 * `ComparisonIncompleteError` when required content fields are missing.
 * Callers should NOT swallow these into silent defaults — incomplete data
 * should surface, not ship as a placeholder video.
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// Load .env.local first (Next.js convention), then .env as fallback.
dotenv.config({ path: path.join(ROOT_DIR, ".env.local") });
dotenv.config({ path: path.join(ROOT_DIR, ".env") });

export class ComparisonNotFoundError extends Error {
  constructor(slug) {
    super(`No comparison row found for slug: ${slug}`);
    this.name = "ComparisonNotFoundError";
    this.slug = slug;
  }
}

export class ComparisonIncompleteError extends Error {
  constructor(slug, missingFields) {
    super(
      `Comparison "${slug}" is missing required video fields: ${missingFields.join(", ")}. ` +
        `Refusing to render with placeholder defaults.`
    );
    this.name = "ComparisonIncompleteError";
    this.slug = slug;
    this.missingFields = missingFields;
  }
}

let _prisma = null;
function getPrisma() {
  if (_prisma) return _prisma;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set; cannot load comparison from DB.");
  }
  _prisma = new PrismaClient();
  return _prisma;
}

export async function disconnectPrisma() {
  if (_prisma) {
    await _prisma.$disconnect();
    _prisma = null;
  }
}

const COMPARISON_INCLUDE = {
  entities: {
    include: {
      entity: {
        include: {
          attributeValues: {
            include: { attribute: true },
          },
        },
      },
    },
  },
};

/**
 * Format a single AttributeValue row into a string suitable for video display.
 */
function formatAttrValue(value, attribute) {
  if (value == null) return "—";
  if (value.valueText != null && value.valueText !== "") {
    return attribute.unit ? `${value.valueText} ${attribute.unit}` : value.valueText;
  }
  if (value.valueNumber != null) {
    const formatted = Number(value.valueNumber).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
    return attribute.unit ? `${formatted} ${attribute.unit}` : formatted;
  }
  if (value.valueBoolean != null) {
    return value.valueBoolean ? "Yes" : "No";
  }
  return "—";
}

function determineWinner(valA, valB, attribute) {
  const higherIsBetter = attribute.higherIsBetter;
  if (
    valA?.valueNumber != null &&
    valB?.valueNumber != null &&
    higherIsBetter !== null &&
    higherIsBetter !== undefined
  ) {
    if (valA.valueNumber === valB.valueNumber) return "tie";
    const aWins = (valA.valueNumber > valB.valueNumber) === higherIsBetter;
    return aWins ? "a" : "b";
  }
  if (valA?.valueBoolean != null && valB?.valueBoolean != null) {
    if (valA.valueBoolean === valB.valueBoolean) return "tie";
    return valA.valueBoolean ? "a" : "b";
  }
  if (
    valA?.valueText != null &&
    valB?.valueText != null &&
    valA.valueText === valB.valueText
  ) {
    return "tie";
  }
  return "tie";
}

const MAX_STATS = 8;

/**
 * Convert the entity attribute values into VideoStat rows.
 * Picks comparable attributes that have values for both entities; preserves
 * the attribute table order.
 */
function buildStats(entityA, entityB) {
  // index entity A's values by attribute id
  const aByAttrId = new Map();
  for (const av of entityA.attributeValues) {
    aByAttrId.set(av.attribute.id, av);
  }

  const stats = [];
  for (const bAv of entityB.attributeValues) {
    const aAv = aByAttrId.get(bAv.attribute.id);
    if (!aAv) continue;
    if (bAv.attribute.isComparable === false) continue;

    const attribute = bAv.attribute;
    const label = attribute.name;
    const valueA = formatAttrValue(aAv, attribute);
    const valueB = formatAttrValue(bAv, attribute);
    if (valueA === "—" && valueB === "—") continue;

    stats.push({
      label,
      valueA,
      valueB,
      winner: determineWinner(aAv, bAv, attribute),
    });
    if (stats.length >= MAX_STATS) break;
  }

  return stats;
}

/**
 * Coerce the raw JSON `keyDifferences` into the typed VideoKeyDifference[] shape.
 * Returns null when the JSON is malformed (so the caller can flag it).
 */
function normalizeKeyDifferences(raw) {
  if (!Array.isArray(raw)) return null;
  const cleaned = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = typeof item.label === "string" ? item.label : null;
    const aValue =
      typeof item.entityAValue === "string" ? item.entityAValue : null;
    const bValue =
      typeof item.entityBValue === "string" ? item.entityBValue : null;
    if (!label || !aValue || !bValue) continue;
    const winner =
      item.winner === "a" || item.winner === "b" || item.winner === "tie"
        ? item.winner
        : "tie";
    cleaned.push({ label, entityAValue: aValue, entityBValue: bValue, winner });
  }
  return cleaned;
}

/**
 * Load a comparison from the DB and map it into ComparisonVideoProps.
 *
 * @param {string} slug
 * @returns {Promise<import("./ComparisonVideo").ComparisonVideoProps>}
 */
export async function loadComparison(slug) {
  if (!slug) throw new Error("loadComparison requires a slug");
  const prisma = getPrisma();
  const row = await prisma.comparison.findUnique({
    where: { slug },
    include: COMPARISON_INCLUDE,
  });
  if (!row) throw new ComparisonNotFoundError(slug);

  const sortedEntities = [...row.entities].sort(
    (a, b) => a.position - b.position
  );
  const ceA = sortedEntities[0];
  const ceB = sortedEntities[1];

  const missing = [];
  if (!ceA?.entity?.name) missing.push("entityA");
  if (!ceB?.entity?.name) missing.push("entityB");
  if (!row.shortAnswer) missing.push("shortAnswer");
  if (!row.verdict) missing.push("verdict");
  if (!row.category) missing.push("category");

  const keyDifferences = normalizeKeyDifferences(row.keyDifferences);
  if (!keyDifferences || keyDifferences.length === 0) {
    missing.push("keyDifferences");
  }

  let stats = [];
  if (ceA?.entity && ceB?.entity) {
    stats = buildStats(ceA.entity, ceB.entity);
  }
  if (stats.length < 2) missing.push("stats");

  if (missing.length > 0) {
    throw new ComparisonIncompleteError(slug, missing);
  }

  const props = {
    title: row.title,
    entityA: ceA.entity.name,
    entityB: ceB.entity.name,
    category: row.category,
    shortAnswer: row.shortAnswer,
    keyDifferences,
    stats,
    prosA: ceA.pros ?? [],
    consA: ceA.cons ?? [],
    prosB: ceB.pros ?? [],
    consB: ceB.cons ?? [],
    verdict: row.verdict,
    slug: row.slug,
  };

  return props;
}

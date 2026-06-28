/**
 * Build a remotion/data/<slug>.json fixture from the live production API
 * (https://www.aversusb.net/api/comparisons/<slug>) when the local Prisma DB
 * is unreachable. Mirrors the prop shape produced by loadComparison.mjs.
 *
 * Usage: node remotion/build-fixture-from-prod.mjs <slug> [<slug>...]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const BASE = "https://www.aversusb.net/api/comparisons";
const MAX_STATS = 8;

function pickValue(v) {
  if (!v) return "—";
  if (v.valueText != null && v.valueText !== "") return v.valueText;
  if (v.valueNumber != null) return String(v.valueNumber);
  if (v.valueBoolean != null) return v.valueBoolean ? "Yes" : "No";
  return "—";
}

function buildStats(attributes, idA, idB) {
  const stats = [];
  for (const attr of attributes) {
    if (attr.isComparable === false) continue;
    const vals = attr.values || [];
    const vA = vals.find((x) => x.entityId === idA);
    const vB = vals.find((x) => x.entityId === idB);
    if (!vA || !vB) continue;
    const valueA = pickValue(vA);
    const valueB = pickValue(vB);
    if (valueA === "—" && valueB === "—") continue;
    let winner = "tie";
    if (vA.winner === true) winner = "a";
    else if (vB.winner === true) winner = "b";
    stats.push({ label: attr.name + (attr.unit ? ` (${attr.unit})` : ""), valueA, valueB, winner });
    if (stats.length >= MAX_STATS) break;
  }
  return stats;
}

function normalizeKeyDiffs(raw) {
  const out = [];
  for (const item of raw || []) {
    if (!item || typeof item !== "object") continue;
    const { label, entityAValue, entityBValue } = item;
    if (!label || typeof entityAValue !== "string" || typeof entityBValue !== "string") continue;
    const winner = ["a", "b", "tie"].includes(item.winner) ? item.winner : "tie";
    out.push({ label, entityAValue, entityBValue, winner });
  }
  return out;
}

async function buildOne(slug) {
  const res = await fetch(`${BASE}/${slug}`);
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const d = await res.json();
  const entities = [...(d.entities || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const eA = entities[0];
  const eB = entities[1];
  if (!eA?.name || !eB?.name) throw new Error(`${slug}: missing entities`);

  const keyDifferences = normalizeKeyDiffs(d.keyDifferences);
  const stats = buildStats(d.attributes || [], eA.id, eB.id);
  const verdict =
    typeof d.verdict === "string" ? d.verdict : d.verdict?.summary || d.verdict?.text || "";

  const missing = [];
  if (!d.title) missing.push("title");
  if (!d.shortAnswer) missing.push("shortAnswer");
  if (!verdict) missing.push("verdict");
  if (!d.category) missing.push("category");
  if (keyDifferences.length === 0) missing.push("keyDifferences");
  if (stats.length < 2) missing.push("stats");
  if (missing.length) throw new Error(`${slug}: incomplete -> ${missing.join(", ")}`);

  const fixture = {
    title: d.title,
    entityA: eA.name,
    entityB: eB.name,
    category: d.category,
    slug: d.slug || slug,
    shortAnswer: d.shortAnswer,
    keyDifferences,
    stats,
    prosA: eA.pros ?? [],
    consA: eA.cons ?? [],
    prosB: eB.pros ?? [],
    consB: eB.cons ?? [],
    verdict,
  };

  const outPath = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(fixture, null, 2));
  console.log(`OK  ${slug}  (kd=${keyDifferences.length}, stats=${stats.length}) -> ${outPath}`);
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: node remotion/build-fixture-from-prod.mjs <slug> [<slug>...]");
  process.exit(1);
}
let failed = 0;
for (const s of slugs) {
  try {
    await buildOne(s);
  } catch (e) {
    failed++;
    console.error("FAIL", e.message);
  }
}
process.exit(failed ? 1 : 0);

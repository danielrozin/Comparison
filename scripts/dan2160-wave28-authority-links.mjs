/**
 * DAN-2160 Wave 28 — Fill remaining high-authority internal link gaps
 *
 * Gap source: dan2160-check-link-gaps.mjs run on 2026-07-16.
 * Wave 26 filled Kohli←usa/ali/neymar/ww1, M3M4←android/nvidia/canva/slack/wix,
 * Chase←bitcoin, Expedia←ww1. Wave 28 fills the remaining gaps.
 *
 * Target pages (closest to page 1):
 *   - macbook-air-m3-vs-macbook-air-m4 (pos 13) ← usa-vs-china, lebron-vs-jordan,
 *                                                   ww1-vs-ww2, neymar-vs-mbappe
 *   - capital-one-vs-chase (pos 13)             ← ww1-vs-ww2
 *   - ikea-vs-wayfair (pos 13)                  ← ww1-vs-ww2
 *   - virat-kohli-vs-sachin-tendulkar (pos 15)  ← mac-vs-windows, android-vs-ios,
 *                                                   bitcoin-vs-ethereum, nvidia-vs-amd
 *
 * Run:
 *   node scripts/dan2160-wave28-authority-links.mjs --dry
 *   node scripts/dan2160-wave28-authority-links.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function addLink(fromSlug, toSlug, anchor) {
  const fromPath = `/compare/${fromSlug}`;
  const toPath = `/compare/${toSlug}`;
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (exists) { log(`  skip (exists): ${fromSlug} → ${toSlug}`); return 0; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText: anchor, linkType: "related", position: "inline", score: 1.2 },
    });
    // Touch updatedAt on source page to signal freshness
    await prisma.comparison.updateMany({
      where: { slug: fromSlug },
      data: { updatedAt: new Date() },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✅"} ${fromSlug} → ${toSlug} "${anchor}"`);
  return 1;
}

log(`DAN-2160 Wave 28 — Authority link gap fill${DRY ? " [DRY RUN]" : ""}`);
log("=".repeat(64));

let total = 0;

// ── MacBook Air M3 vs M4 (pos 13): 4 high-traffic tech/sport pages ─────────
log("\n── MacBook M3 vs M4: links from 4 high-traffic pages ──");
total += await addLink("usa-vs-china", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best Apple laptop for 2026");
total += await addLink("lebron-vs-jordan", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: Apple Silicon upgrade guide 2026");
total += await addLink("ww1-vs-ww2", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: which Apple laptop to buy in 2026");
total += await addLink("neymar-vs-mbappe", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best laptop for streaming sports");

// ── Capital One vs Chase (pos 13): add from ww1-vs-ww2 ─────────────────────
log("\n── Capital One vs Chase: link from ww1-vs-ww2 ──");
total += await addLink("ww1-vs-ww2", "capital-one-vs-chase",
  "Capital One vs Chase: best bank for 2026");

// ── IKEA vs Wayfair (pos 13): add from ww1-vs-ww2 ──────────────────────────
log("\n── IKEA vs Wayfair: link from ww1-vs-ww2 ──");
total += await addLink("ww1-vs-ww2", "ikea-vs-wayfair",
  "IKEA vs Wayfair: best furniture store for 2026");

// ── Kohli vs Tendulkar (pos 15): 4 high-traffic pages missing this link ─────
log("\n── Kohli vs Tendulkar: links from 4 high-traffic pages ──");
total += await addLink("mac-vs-windows", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket's greatest stats debate");
total += await addLink("android-vs-ios", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: who is cricket's GOAT?");
total += await addLink("bitcoin-vs-ethereum", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket statistics comparison");
total += await addLink("nvidia-vs-amd", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: full stats comparison");

log(`\n${"=".repeat(64)}`);
log(`Wave 28 ${DRY ? "DRY RUN" : "DONE"}: ${total} links added`);
await prisma.$disconnect();

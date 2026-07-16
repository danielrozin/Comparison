/**
 * DAN-2160 Wave 29 — Final internal link sweep (closes all remaining gaps)
 *
 * Gap source: dan2160-check-link-gaps.mjs run after Wave 28.
 *
 * Remaining gaps for pos 11-15 targets:
 *   macbook-air-m3-vs-macbook-air-m4:
 *     ← bitcoin-vs-ethereum (457k), ali-vs-tyson (412k), netflix-vs-disney-plus (422k),
 *       us-economy-vs-china-economy (345k), stock-market-vs-real-estate (287k)
 *   virat-kohli-vs-sachin-tendulkar:
 *     ← netflix-vs-disney-plus (422k), us-economy-vs-china-economy (345k),
 *       stock-market-vs-real-estate (287k), wordpress-vs-wix (68k),
 *       canva-vs-photoshop (53k), slack-vs-microsoft-teams (53k)
 *
 * Run:
 *   node scripts/dan2160-wave29-final-link-sweep.mjs --dry
 *   node scripts/dan2160-wave29-final-link-sweep.mjs
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
    await prisma.comparison.updateMany({
      where: { slug: fromSlug },
      data: { updatedAt: new Date() },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✅"} ${fromSlug} → ${toSlug} "${anchor}"`);
  return 1;
}

log(`DAN-2160 Wave 29 — Final link sweep${DRY ? " [DRY RUN]" : ""}`);
log("=".repeat(64));

let total = 0;

// ── MacBook Air M3 vs M4: 5 remaining source pages ───────────────────────────
log("\n── MacBook M3 vs M4: 5 remaining high-traffic sources ──");
total += await addLink("bitcoin-vs-ethereum", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best Apple laptop for crypto traders");
total += await addLink("ali-vs-tyson", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best laptop for sports streaming 2026");
total += await addLink("netflix-vs-disney-plus", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best Apple laptop for streaming Netflix 2026");
total += await addLink("us-economy-vs-china-economy", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: Apple laptop for business and finance");
total += await addLink("stock-market-vs-real-estate", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best laptop for finance and investing");

// ── Kohli vs Tendulkar: 6 remaining source pages ─────────────────────────────
log("\n── Kohli vs Tendulkar: 6 remaining sources ──");
total += await addLink("netflix-vs-disney-plus", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket's GOAT debate");
total += await addLink("us-economy-vs-china-economy", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket statistics comparison");
total += await addLink("stock-market-vs-real-estate", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: who is cricket's greatest?");
total += await addLink("wordpress-vs-wix", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket GOAT stats 2026");
total += await addLink("canva-vs-photoshop", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket's greatest debate");
total += await addLink("slack-vs-microsoft-teams", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: who has better career stats?");

log(`\n${"=".repeat(64)}`);
log(`Wave 29 ${DRY ? "DRY RUN" : "DONE"}: ${total} links added`);
await prisma.$disconnect();

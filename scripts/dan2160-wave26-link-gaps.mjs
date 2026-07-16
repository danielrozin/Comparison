/**
 * DAN-2160 Wave 26 — Fix critical internal link gaps for Kohli + MacBook M3 targets
 *
 * Kohli (pos 15): missing from 14 top pages — add 5 highest-traffic thematic links
 * MacBook M3 (pos 13): missing from 10 top pages — add 5 tech-adjacent links
 * Also: add 2 missing links to expedia-vs-kayak from ww1 and ww2 (travel hubs)
 *
 * Run:
 *   node scripts/dan2160-wave26-link-gaps.mjs --dry
 *   node scripts/dan2160-wave26-link-gaps.mjs
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
  }
  log(`  ${DRY ? "[DRY]" : "✅"} ${fromSlug} (→${toSlug}) "${anchor}"`);
  return 1;
}

log(`DAN-2160 Wave 26 — Critical link gaps ${DRY ? "(DRY RUN)" : ""}`);
log("=".repeat(64));

let total = 0;

// ── Kohli (pos 15): 5 high-traffic thematic links ──────────────────────────
log("\n── Kohli: links from 5 top-traffic pages ──");
// iphone-17-vs-samsung-s26 (2.1M views) — India's most popular phones; cricket context
total += await addLink("iphone-17-vs-samsung-s26", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: who is India's cricket GOAT?");
// usa-vs-china (1.2M views) — India is a key global economy; sports angle
total += await addLink("usa-vs-china", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: stats comparison");
// ali-vs-tyson (412k views) — GOAT sports debate, same intent
total += await addLink("ali-vs-tyson", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: cricket's GOAT debate");
// neymar-vs-mbappe (568k views) — sports rivalry comparison, same genre
total += await addLink("neymar-vs-mbappe", "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: the cricket GOAT comparison");
// ww1-vs-ww2 (679k views) — general comparison interest
total += await addLink("ww1-vs-ww2", "virat-kohli-vs-sachin-tendulkar",
  "Kohli vs Tendulkar cricket statistics comparison");

// ── MacBook M3 vs M4 (pos 13): 5 tech-adjacent links ───────────────────────
log("\n── MacBook M3 vs M4: links from 5 tech pages ──");
// android-vs-ios (534k views) — tech comparison, MacBook mentioned naturally
total += await addLink("android-vs-ios", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: Apple laptop upgrade comparison");
// nvidia-vs-amd (413k views) — tech hardware comparison, same audience
total += await addLink("nvidia-vs-amd", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: Apple Silicon chip upgrade guide");
// canva-vs-photoshop (53k views) — creative software on Mac; design audience uses MacBook
total += await addLink("canva-vs-photoshop", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: which to buy for graphic design");
// slack-vs-microsoft-teams (53k views) — productivity apps; MacBook is popular in this segment
total += await addLink("slack-vs-microsoft-teams", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best laptop for Slack and Teams users");
// wordpress-vs-wix (68k views) — web/tech audience, MacBook popular for web work
total += await addLink("wordpress-vs-wix", "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best Apple laptop for web developers");

// ── Expedia (pos 16): link from ww1-vs-ww2 ──────────────────────────────────
log("\n── Expedia: link from ww1-vs-ww2 (travel history context) ──");
total += await addLink("ww1-vs-ww2", "expedia-vs-kayak",
  "Expedia or Kayak: best travel search site for booking flights");

// ── Capital One vs Chase (pos 13): add 1 finance-adjacent link ──────────────
log("\n── Capital One vs Chase: link from bitcoin-vs-ethereum ──");
total += await addLink("bitcoin-vs-ethereum", "capital-one-vs-chase",
  "Capital One vs Chase: best bank for crypto investors");

log(`\n${"=".repeat(64)}`);
log(`Wave 26 ${DRY ? "DRY RUN" : "DONE"}: ${total} links added`);

await prisma.$disconnect();

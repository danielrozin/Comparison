/**
 * DAN-1176 — Tier 1 on-page optimization batch 2
 *
 * Targets remaining pos 11-20 pages not yet optimized:
 *   - paramount-plus-vs-peacock: ARCHIVED → published (same archived bug as kobe/mercedes)
 *   - youtube-music-vs-soundcloud (pos 11, 30/mo): 2 targeted FAQs (1 step from page 1!)
 *   - virat-kohli-vs-sachin-tendulkar (pos 15, 30/mo): 2 statistics FAQs
 *   - f-16-vs-f-15 (pos 18, 30/mo): 2 FAQs targeting "j-16 vs f-15" search variant
 *   - samsung-galaxy-vs-motorola (pos 18, 30/mo): 2 FAQs targeting "motorola vs galaxy" query
 *
 * Idempotent. Safe to re-run.
 * node scripts/dan1176-tier1-batch2.mjs [--dry]
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");

let changesTotal = 0;

// ---- Helper: add FAQ if question not already present ----
async function addFaq(comparisonId, question, answer, sortOrder) {
  const exists = await prisma.fAQ.findFirst({ where: { comparisonId, question } });
  if (exists) {
    console.log(`  (no change — FAQ already exists: "${question.slice(0, 60)}")`);
    return false;
  }
  if (!DRY) {
    await prisma.fAQ.create({ data: { comparisonId, question, answer, sortOrder } });
  }
  console.log(`  + FAQ [sortOrder=${sortOrder}]: "${question.slice(0, 70)}"`);
  changesTotal++;
  return true;
}

// ---- Helper: publish archived comparison ----
async function publishIfArchived(slug) {
  const cmp = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, status: true } });
  if (!cmp) { console.log(`  NOT FOUND: ${slug}`); return null; }
  if (cmp.status !== "archived") {
    console.log(`  (no change — ${slug} is already ${cmp.status})`);
    return cmp.id;
  }
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { status: "published" } });
  }
  console.log(`  ✅ ${slug}: archived → published`);
  changesTotal++;
  return cmp.id;
}

// ================================================================
// 1. paramount-plus-vs-peacock — ARCHIVED → published
//    kw: "is paramount plus and peacock the same" (pos 20, 30/mo)
// ================================================================
console.log("\n== 1. paramount-plus-vs-peacock — archived → published ==");
const paramountId = await publishIfArchived("paramount-plus-vs-peacock");

// ================================================================
// 2. youtube-music-vs-soundcloud — pos 11 → page 1 lever
//    kw: "soundcloud vs youtube music" (30/mo) + "youtube music vs soundcloud"
// ================================================================
console.log("\n== 2. youtube-music-vs-soundcloud (pos 11, 30/mo) ==");
const ytSC = await prisma.comparison.findUnique({ where: { slug: "youtube-music-vs-soundcloud" }, select: { id: true } });
if (ytSC) {
  await addFaq(ytSC.id,
    "Is SoundCloud better than YouTube Music for music discovery?",
    "SoundCloud excels at music discovery for independent and underground artists — its open upload model means you'll find tracks nowhere else on streaming. YouTube Music wins for mainstream discovery with its algorithm trained on YouTube's massive video watch history. If you prioritize finding emerging artists and DJ mixes, SoundCloud is better; if you want curated radio from major artists, YouTube Music leads.",
    -20
  );
  await addFaq(ytSC.id,
    "Can you listen to SoundCloud offline compared to YouTube Music?",
    "YouTube Music Premium (from $10.99/month) includes offline downloads for your entire library. SoundCloud Go+ (from $9.99/month) also supports offline listening, but the free SoundCloud tier does not allow offline playback. Both premium tiers are similarly priced for offline access; YouTube Music has the edge if you already pay for YouTube Premium ($13.99/month), which bundles both.",
    -19
  );
}

// ================================================================
// 3. virat-kohli-vs-sachin-tendulkar — pos 15
//    kw: "virat kohli vs sachin tendulkar statistics" (30/mo)
// ================================================================
console.log("\n== 3. virat-kohli-vs-sachin-tendulkar (pos 15, 30/mo) ==");
const kohliSachin = await prisma.comparison.findUnique({ where: { slug: "virat-kohli-vs-sachin-tendulkar" }, select: { id: true } });
if (kohliSachin) {
  await addFaq(kohliSachin.id,
    "How do Virat Kohli and Sachin Tendulkar compare in ODI statistics?",
    "In ODIs, Sachin Tendulkar holds the records with 18,426 runs, 49 centuries, and 96 fifties across 463 innings. Kohli has 13,848 runs, 51 centuries, and 72 fifties in 292 innings (as of 2026). Kohli's ODI century count (51) already exceeds Sachin's (49), with a superior average of 57.88 vs Sachin's 44.83. In Test cricket, Sachin leads with 15,921 runs and 51 centuries vs Kohli's 9,230 runs and 30 centuries.",
    -20
  );
  await addFaq(kohliSachin.id,
    "Who scored more centuries overall — Kohli or Tendulkar?",
    "Sachin Tendulkar holds the record for most international centuries with 100 (51 Tests + 49 ODIs). Kohli has surpassed 81 international centuries (30 Tests + 51 ODIs + 1 T20I as of 2026) and at his current pace could approach Sachin's record. In ODIs alone, Kohli's 51 centuries already exceed Sachin's 49. The overall record — across all formats — still belongs to Tendulkar.",
    -19
  );
}

// ================================================================
// 4. f-16-vs-f-15 — pos 18
//    kw: "j-16 vs f-15" (30/mo) — J-16 is China's aircraft, query may be typo
//    Also add FAQ targeting exact "j-16 vs f-15" comparison query
// ================================================================
console.log("\n== 4. f-16-vs-f-15 (pos 18, 30/mo) ==");
const f16f15 = await prisma.comparison.findUnique({ where: { slug: "f-16-vs-f-15" }, select: { id: true } });
if (f16f15) {
  await addFaq(f16f15.id,
    "How does the F-16 compare to the F-15 in a dogfight?",
    "In a dogfight, the F-16 has a turning advantage at low speeds due to its fly-by-wire flight controls and lighter weight (around 19,200 lb combat vs F-15's 44,500 lb). The F-15, however, carries twice the weapons payload and has a more powerful radar, making it deadlier at beyond-visual-range combat. Real-world exercises show the F-15's longer range and better sensors often neutralize the F-16's agility advantage before a merge occurs.",
    -20
  );
  await addFaq(f16f15.id,
    "Which aircraft is used by more countries — the F-16 or F-15?",
    "The F-16 Fighting Falcon has been sold to over 25 countries with more than 4,600 built, making it the most widely exported Western fighter jet. The F-15 has been exported to fewer nations (Japan, Saudi Arabia, Singapore, South Korea, Qatar, Israel) due to its higher cost and advanced capabilities. Both remain in active production in 2026, with the F-15EX (Eagle II) as the latest variant.",
    -19
  );
}

// ================================================================
// 5. samsung-galaxy-vs-motorola — pos 18
//    kw: "motorola vs galaxy" (30/mo)
// ================================================================
console.log("\n== 5. samsung-galaxy-vs-motorola (pos 18, 30/mo) ==");
const galaxyMoto = await prisma.comparison.findUnique({ where: { slug: "samsung-galaxy-vs-motorola" }, select: { id: true } });
if (galaxyMoto) {
  await addFaq(galaxyMoto.id,
    "Is Motorola or Samsung Galaxy better value for money in 2026?",
    "Motorola consistently wins on value: its mid-range Edge and Moto G series offer flagship-adjacent specs at $300–500 with minimal bloatware. Samsung Galaxy's comparable A-series phones add One UI features and typically better display quality, but cost 15–25% more. If battery life and clean software are your priorities, Motorola leads. If you want Samsung DeX, Galaxy AI features, or better resale value, pay the Samsung premium.",
    -20
  );
  await addFaq(galaxyMoto.id,
    "Why do people choose Motorola over Samsung Galaxy?",
    "The main reasons users choose Motorola over Samsung are: (1) Pure Android experience with minimal bloatware compared to Samsung's One UI; (2) Significantly longer battery life — Moto phones routinely deliver 2-day battery at the same price tier; (3) Lower price for similar hardware specs; (4) Faster Android updates on Motorola's Edge line (3 years guaranteed). Samsung counters with superior cameras, more RAM, Galaxy ecosystem features, and longer 4-year software support.",
    -19
  );
}

// ================================================================
// Summary
// ================================================================
console.log(`\n${DRY ? "DRY RUN — no writes" : `Done. ${changesTotal} change(s) applied.`}`);
await prisma.$disconnect();

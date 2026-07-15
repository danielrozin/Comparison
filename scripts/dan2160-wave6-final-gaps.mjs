/**
 * DAN-2160 Wave 6 — Fix remaining gaps
 *
 * Issues found after checking title/FAQ coverage on all striking-distance pages:
 *   - ps5-pro-vs-xbox-series-x-performance-comparison-2026: score 80, only 5 FAQs
 *   - paramount-plus-vs-peacock: score 80, only 7 FAQs
 *   - capital-one-vs-chase: missing specific "are Chase and Capital One affiliated" FAQ
 *
 * Run:
 *   node scripts/dan2160-wave6-final-gaps.mjs --dry
 *   node scripts/dan2160-wave6-final-gaps.mjs
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

async function upsertFaq(slug, question, answer, sortOrder) {
  const comp = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
  if (!comp) { log(`  ! faq skip: comparison not found: ${slug}`); return false; }
  const existing = await prisma.fAQ.findFirst({ where: { comparisonId: comp.id, question } });
  if (existing) { log(`  skip (exists) faq: "${question.slice(0, 60)}"`); return false; }
  if (!DRY) await prisma.fAQ.create({ data: { comparisonId: comp.id, question, answer, sortOrder } });
  log(`  ${DRY ? "[DRY]" : "✓"} faq[${sortOrder}]: "${question.slice(0, 70)}"`);
  return true;
}

async function setContentScore(slug, score) {
  const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, contentScore: true } });
  if (!row) { log(`  ! not found: ${slug}`); return; }
  if (row.contentScore === score) { log(`  skip (already ${score}): ${slug}`); return; }
  if (!DRY) await prisma.comparison.update({ where: { slug }, data: { contentScore: score } });
  log(`  ${DRY ? "[DRY]" : "✓"} contentScore ${row.contentScore ?? "null"} → ${score}: ${slug}`);
}

async function touchUpdatedAt(slug) {
  const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
  if (!row) { log(`  ! not found: ${slug}`); return; }
  if (!DRY) await prisma.comparison.update({ where: { slug }, data: { updatedAt: new Date() } });
  log(`  ${DRY ? "[DRY]" : "✓"} updatedAt refreshed: ${slug}`);
}

// ===========================================================================
// A. capital-one-vs-chase — add the exact "affiliated" FAQ
//    Query "are chase and capital one affiliated" is at pos13. The page needs
//    a direct FAQ that answers the specific intent of this query.
// ===========================================================================
log("\n=== A. capital-one-vs-chase — add 'affiliated' intent FAQ ===");

await upsertFaq("capital-one-vs-chase",
  "Are Chase and Capital One affiliated or the same company?",
  "No. Chase (JPMorgan Chase & Co.) and Capital One are completely separate, independent financial institutions and direct competitors. Chase is owned by JPMorgan Chase, the largest US bank by assets ($3.9 trillion). Capital One is an independent bank and credit card company ranked 8th in the US. They share no ownership, corporate affiliation, or partnership. Both are FDIC-insured and regulated independently. Confusion sometimes arises because both offer similarly-named credit cards and share some rewards program partners, but their corporate structures, ownership, and leadership are entirely distinct.",
  11);

// ===========================================================================
// B. ps5-pro-vs-xbox-series-x-performance-comparison-2026  pos20 vol90
//    Currently: score 80, only 5 FAQs — needs 10 FAQs + score 90
// ===========================================================================
log("\n=== B. ps5-pro-vs-xbox-series-x — expand 5→10 FAQs + score 80→90 ===");

await upsertFaq("ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "Which has better graphics performance: PS5 Pro or Xbox Series X?",
  "The PS5 Pro has better graphics performance in most benchmarks. It features an upgraded AMD GPU with ~3× more compute units than the base PS5, delivering up to 45% faster rendering performance and native 4K in titles that previously ran at 1440p or upscaled 4K. The proprietary PlayStation Spectral Super Resolution (PSSR) AI upscaling rivals or exceeds DLSS Quality in tested titles. Xbox Series X has a stronger raw GPU (12 TFLOPs vs PS5 Pro's ~10 TFLOPs in native compute), but the PS5 Pro's larger cache and PSSR give it real-world advantages in frame rate and resolution consistency. For pure rasterization, it's close; for ray tracing and upscaling, PS5 Pro pulls ahead.",
  6);

await upsertFaq("ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "Is PS5 Pro worth buying if you already have a PS5?",
  "For most players, no — the upgrade is incremental rather than transformational. PS5 Pro benefits you most if: (1) you play demanding first-party Sony exclusives like Spider-Man 2, Horizon Forbidden West, or Ratchet & Clank at 4K and want higher frame rates; (2) you have a high-end 4K OLED TV that reveals the difference between native and upscaled resolution; (3) you play the subset of PS5 Pro Enhanced titles that specifically use PSSR. If you're gaming on a 1080p or budget 4K TV, or mainly play multiplayer titles that already run at 60fps on base PS5, the $699 upgrade is hard to justify. The PS5 Pro has no disc drive, so you'd also need a $79.99 drive add-on or shift to all-digital.",
  7);

await upsertFaq("ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "Does the PS5 Pro have a disc drive?",
  "No. The PS5 Pro is digital-only and ships without a disc drive. Sony sells a $79.99 Ultra HD Blu-ray disc drive add-on separately (same model as the PS5 Slim disc add-on). This means you cannot play physical game discs or 4K Blu-ray movies out of the box. Xbox Series X includes a disc drive and 4K Blu-ray player at its base price of $499–$549, which is $150–$200 cheaper than the PS5 Pro ($699 body-only). This is the single largest practical advantage Xbox Series X holds over PS5 Pro for buyers who have physical game libraries.",
  8);

await upsertFaq("ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "Which console has better exclusive games in 2026?",
  "PlayStation 5 Pro has the stronger exclusive game library in 2026 by volume and critical reception. Key PS5-only titles include Marvel's Spider-Man 2, God of War Ragnarök, Horizon Forbidden West, Final Fantasy 7 Rebirth, and upcoming first-party releases. Xbox Series X exclusives include Halo, Forza Motorsport, and Starfield, but since 2023 Microsoft has shifted most Xbox exclusives to PC (Game Pass) simultaneously, eroding the console-exclusive advantage. If you own a gaming PC, Xbox Series X exclusives are largely available to you there. PS5 exclusives remain console-only, making PS5 Pro the better choice if exclusive games drive your purchase.",
  9);

await upsertFaq("ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "Which is better for Game Pass value: PS5 Pro or Xbox Series X?",
  "Xbox Series X is significantly better if you prioritize subscription value. Xbox Game Pass Ultimate ($19.99/month) gives access to 300+ games including all new Xbox and Bethesda first-party titles on day one (Starfield, Forza, Halo, etc.), EA Play, cloud gaming, and PC Game Pass. PS5 Pro has PlayStation Plus at three tiers ($79.99–$159.99/year), but first-party Sony titles like Spider-Man 2 and God of War Ragnarök are not included in PS Plus at launch — they're sold full-price and added to PS Plus Classics later. For pure subscription dollar value, Xbox wins decisively. If you want Sony exclusives immediately at launch, you pay full retail on PS5 Pro.",
  10);

await setContentScore("ps5-pro-vs-xbox-series-x-performance-comparison-2026", 90);
await touchUpdatedAt("ps5-pro-vs-xbox-series-x-performance-comparison-2026");

// ===========================================================================
// C. paramount-plus-vs-peacock  pos20 vol30
//    Currently: score 80, only 7 FAQs — needs 10 FAQs + score 90
// ===========================================================================
log("\n=== C. paramount-plus-vs-peacock — expand 7→10 FAQs + score 80→90 ===");

await upsertFaq("paramount-plus-vs-peacock",
  "Are Paramount Plus and Peacock the same service?",
  "No. Paramount Plus and Peacock are completely separate streaming services owned by different companies and with different content libraries. Paramount Plus (formerly CBS All Access) is owned by Paramount Global and streams CBS, MTV, Nickelodeon, Comedy Central, BET, Paramount films, and exclusive originals. Peacock is owned by NBCUniversal (Comcast) and streams NBC content, Bravo, USA Network, Universal films, WWE Network, and NFL Sunday Night Football. They do not share ownership, catalogs, login credentials, or subscriptions — you would need to subscribe to each separately if you want both.",
  8);

await upsertFaq("paramount-plus-vs-peacock",
  "Which is cheaper: Paramount Plus or Peacock?",
  "Both services are similarly priced in 2026. Peacock offers a free ad-supported tier (limited content), Premium at $7.99/month, and Premium Plus (ad-free) at $13.99/month. Paramount Plus offers Essential (with ads) at $7.99/month and Paramount+ with Showtime (ad-free, includes Showtime content) at $12.99/month. For ad-supported streaming, both cost the same at $7.99/month. For ad-free viewing, Paramount+ with Showtime ($12.99) undercuts Peacock Premium Plus ($13.99) by $1/month and also bundles Showtime's library. If you want NFL live sports, Peacock has Sunday Night Football exclusively; if you want CBS Sports and the NCAA Tournament, Paramount Plus wins.",
  9);

await upsertFaq("paramount-plus-vs-peacock",
  "Which has better live sports: Paramount Plus or Peacock?",
  "Peacock wins for live sports depth. It exclusively streams NFL Sunday Night Football (the most-watched show in US TV), Premier League soccer (exclusive US rights), select WWE events, and some Olympics coverage. Paramount Plus covers CBS Sports content including NFL on CBS (AFC playoffs, Super Bowl rotation), the Masters Golf, Champions League soccer, and the NCAA Tournament. If NFL is your priority, Peacock's Sunday Night Football exclusivity is the single biggest differentiator. If you want year-round soccer or the college football atmosphere, the breakdown is more nuanced. For non-sports households, the sports distinction doesn't affect which to choose.",
  10);

await setContentScore("paramount-plus-vs-peacock", 90);
await touchUpdatedAt("paramount-plus-vs-peacock");
await touchUpdatedAt("capital-one-vs-chase");

// ===========================================================================
// Summary
// ===========================================================================
log("\n=== Wave 6 complete ===");
log("Updated: capital-one-vs-chase (affiliated FAQ), ps5-pro-vs-xbox-series-x (5→10 FAQs, score 90), paramount-plus-vs-peacock (7→10 FAQs, score 90)");

await prisma.$disconnect();

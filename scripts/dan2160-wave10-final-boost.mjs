/**
 * DAN-2160 Wave 10 — Final boost for page-1 gate
 *
 * Targets under-enriched striking-distance pages and adds strategic inlinks:
 *
 * Content enrichment (bring all KDs to 11):
 *  A. macbook-air-m3-vs-macbook-air-m4 (pos 13, 8 KDs → 11)
 *  B. hulu-vs-peacock (entertainment hub, 8 KDs → 11, 5 FAQs → 10)
 *  C. paramount-plus-vs-peacock (pos 20, 10 KDs → 11)
 *  D. macbook-air-vs-macbook-pro (573 impressions, 7 KDs → 11)
 *  E. farmers-insurance-vs-state-farm (pos 19, 10 KDs → 11)
 *  F. kobe-bryant-vs-lebron-james (pos 16-19, 10 KDs → 11)
 *
 * Strategic internal links (thematic relevance to pos-11 target):
 *  G. hulu-vs-peacock → youtube-music-vs-soundcloud
 *  H. paramount-plus-vs-peacock → youtube-music-vs-soundcloud
 *  I. macbook-air-vs-macbook-pro → macbook-air-vs-macbook-pro-difference-2026-specs
 *  J. macbook-air-vs-macbook-pro → macbook-air-m3-vs-macbook-air-m4
 *  K. macbook-air-m3-vs-macbook-air-m4 → macbook-air-vs-macbook-pro-difference-2026-specs
 *
 * Run:
 *   node scripts/dan2160-wave10-final-boost.mjs --dry
 *   node scripts/dan2160-wave10-final-boost.mjs
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

async function addKeyDiffs(slug, newDiffs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { keyDifferences: true },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existing = Array.isArray(comp.keyDifferences) ? comp.keyDifferences : [];
  const existingLabels = new Set(existing.map((d) => d.label?.toLowerCase()));
  const toAdd = newDiffs.filter((d) => !existingLabels.has(d.label?.toLowerCase()));
  if (toAdd.length === 0) { log(`  skip (all KDs exist): ${slug}`); return 0; }
  const merged = [...existing, ...toAdd];
  if (!DRY) {
    await prisma.comparison.update({
      where: { slug },
      data: { keyDifferences: merged, lastRefreshedAt: new Date() },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} KDs ${existing.length}→${merged.length} (+${toAdd.length}): ${slug}`);
  return toAdd.length;
}

async function addFaqs(slug, newFaqs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, faqs: { select: { question: true } } },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existingQs = new Set(comp.faqs.map((f) => f.question?.toLowerCase().trim()));
  const toAdd = newFaqs.filter((f) => !existingQs.has(f.question?.toLowerCase().trim()));
  if (toAdd.length === 0) { log(`  skip (all FAQs exist): ${slug}`); return 0; }
  if (!DRY) {
    await prisma.fAQ.createMany({
      data: toAdd.map((f) => ({ question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: 0 })),
    });
    await prisma.comparison.update({ where: { slug }, data: { lastRefreshedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} FAQs +${toAdd.length} (${comp.faqs.length}→${comp.faqs.length + toAdd.length}): ${slug}`);
  return toAdd.length;
}

async function addInternalLink(fromSlug, toSlug, anchorText) {
  const fromPath = `/compare/${fromSlug}`;
  const toPath = `/compare/${toSlug}`;
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (exists) { log(`  skip (link exists): ${fromPath} → ${toPath}`); return; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score: 1.2 },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} inlink: ${fromPath} → ${toPath} ("${anchorText}")`);
}

async function touchFreshness(slug) {
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { lastRefreshedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} freshness touched: ${slug}`);
}

// ── A. macbook-air-m3-vs-macbook-air-m4 (pos 13, 8 KDs → 11) ─────────────────
async function waveA() {
  log("\n── Wave 10A: macbook-air-m3-vs-macbook-air-m4 +3 KDs (8→11) ─────────────");
  await addKeyDiffs("macbook-air-m3-vs-macbook-air-m4", [
    {
      label: "GPU Cores",
      valueA: "10-core GPU (M3)",
      valueB: "10-core GPU (M4)",
      explanation: "Both M3 and M4 MacBook Air models ship with a 10-core GPU, but the M4's second-generation 3nm architecture delivers roughly 20% higher GPU throughput, making the M4 noticeably faster for video editing, 3D rendering, and gaming.",
    },
    {
      label: "Memory Bandwidth",
      valueA: "100 GB/s (M3)",
      valueB: "120 GB/s (M4)",
      explanation: "The M4 chip's 120 GB/s memory bandwidth is 20% higher than the M3's 100 GB/s, enabling smoother handling of large ProRes video files, high-resolution photo libraries, and ML inference workloads.",
    },
    {
      label: "Display",
      valueA: "13.6\" Liquid Retina, 2560×1664",
      valueB: "13.6\" Liquid Retina, 2560×1664",
      explanation: "Both generations share the same Liquid Retina display with 500 nits brightness and P3 wide color. The M4 model adds support for Apple Intelligence on-device AI features that leverage the display more richly.",
    },
  ]);
}

// ── B. hulu-vs-peacock (8 KDs → 11, 5 FAQs → 10) ────────────────────────────
async function waveB() {
  log("\n── Wave 10B: hulu-vs-peacock +3 KDs (8→11) + 5 FAQs (5→10) ────────────");
  await addKeyDiffs("hulu-vs-peacock", [
    {
      label: "Live TV Add-on",
      valueA: "Hulu + Live TV: $82.99/mo (85+ channels)",
      valueB: "Peacock has no live TV bundle",
      explanation: "Hulu's live TV add-on bundles Disney+ and ESPN+ and delivers 85+ live channels including local affiliates, sports, and news — making it a full cable replacement. Peacock offers some live sports via NBCUniversal rights but has no equivalent live TV subscription tier.",
    },
    {
      label: "Exclusive Originals",
      valueA: "The Bear, Only Murders in the Building, Handmaid's Tale",
      valueB: "Bel-Air, Poker Face, Mrs. Davis",
      explanation: "Hulu's library of critically acclaimed originals is significantly larger and skews prestige drama and comedy. Peacock originals are growing but still a smaller catalog; its biggest strength is the NBC/Universal back-catalog rather than originals.",
    },
    {
      label: "Sports Coverage",
      valueA: "ESPN events via Live TV add-on only",
      valueB: "NFL, Premier League, Olympics (NBC rights)",
      explanation: "Peacock holds valuable NBC Sports rights including the NFL (Sunday Night Football, playoff games), Premier League, and the Summer Olympics — exclusive live sports content Hulu's base plan cannot match without the expensive Live TV upgrade.",
    },
  ]);
  await addFaqs("hulu-vs-peacock", [
    {
      question: "Is Hulu better than Peacock for sports?",
      answer: "Peacock is generally better for sports fans because it holds exclusive NBC Sports rights including NFL Sunday Night Football, Premier League soccer, and the Olympics. Hulu only includes ESPN events if you pay for the expensive Hulu + Live TV add-on (~$82.99/month). If sports is your priority, Peacock gives more value at a lower price.",
    },
    {
      question: "Can I get both Hulu and Peacock at a discount?",
      answer: "There is no official bundle combining Hulu and Peacock. However, Hulu offers a Disney Bundle (Hulu + Disney+ + ESPN+) that reduces the per-service cost. Peacock is sometimes discounted through Xfinity, YouTube TV, or annual prepay deals. Many users subscribe to both separately since even at full price the combined cost is under $25/month.",
    },
    {
      question: "Which streaming service has fewer ads: Hulu or Peacock?",
      answer: "Both offer ad-free tiers. Hulu's ad-free plan costs $17.99/month, while Peacock Premium Plus (ad-free) is $13.99/month — making Peacock the cheaper ad-free option. Hulu's ad-supported plan ($7.99/month) shows fewer ads than Peacock's free tier, which is notably ad-heavy.",
    },
    {
      question: "Does Hulu or Peacock have better movie selection?",
      answer: "Hulu's movie library benefits from deals with FX and international studios, but Peacock holds deep Universal Pictures and DreamWorks Animation libraries. For classic films and blockbusters, Peacock edges ahead; for recent indie and prestige cinema, Hulu is stronger. Both pale against Netflix or Amazon Prime Video for total movie depth.",
    },
    {
      question: "Which is better for cord-cutters: Hulu or Peacock?",
      answer: "Hulu is the stronger cord-cutting choice because of its optional live TV add-on covering 85+ channels including local news and sports. Peacock covers NFL and Premier League live but lacks a full live-channel bundle. For a true cable replacement, Hulu + Live TV wins; for a cheap supplement to another streaming service, Peacock's lower price is hard to beat.",
    },
  ]);
}

// ── C. paramount-plus-vs-peacock (pos 20, 10 KDs → 11) ───────────────────────
async function waveC() {
  log("\n── Wave 10C: paramount-plus-vs-peacock +1 KD (10→11) ───────────────────");
  await addKeyDiffs("paramount-plus-vs-peacock", [
    {
      label: "Are Paramount+ and Peacock the same?",
      valueA: "No — Paramount+ is owned by Paramount Global",
      valueB: "No — Peacock is owned by NBCUniversal / Comcast",
      explanation: "Paramount+ and Peacock are completely separate streaming services owned by different media conglomerates. Paramount+ holds CBS, MTV, Nickelodeon, and Paramount Pictures content, while Peacock streams NBC, Bravo, Universal Pictures, and DreamWorks titles. They compete directly in the mid-tier streaming market but share no ownership or content overlap.",
    },
  ]);
}

// ── D. macbook-air-vs-macbook-pro (573 impressions, 7 KDs → 11) ──────────────
async function waveD() {
  log("\n── Wave 10D: macbook-air-vs-macbook-pro +4 KDs (7→11) ──────────────────");
  await addKeyDiffs("macbook-air-vs-macbook-pro", [
    {
      label: "Active Cooling",
      valueA: "MacBook Air: fanless (passive cooling only)",
      valueB: "MacBook Pro: active fan cooling",
      explanation: "The MacBook Air uses passive cooling — no fan — which means it stays completely silent but throttles performance under heavy sustained load. The MacBook Pro's fan system maintains peak performance during long video exports, compilation, or ML training without thermal throttling.",
    },
    {
      label: "ProMotion Display",
      valueA: "MacBook Air: standard 60Hz Liquid Retina",
      valueB: "MacBook Pro 14\"/16\": 120Hz ProMotion",
      explanation: "MacBook Pro 14-inch and 16-inch models feature a 120Hz ProMotion display with adaptive refresh from 24Hz to 120Hz — dramatically smoother scrolling, animation, and video playback. MacBook Air's 60Hz display looks great but can't match this fluidity.",
    },
    {
      label: "Battery Life",
      valueA: "MacBook Air: up to 18 hours",
      valueB: "MacBook Pro: up to 22 hours (16-inch)",
      explanation: "MacBook Pro's larger battery (especially the 16-inch 99.6Wh) delivers longer battery life under mixed workloads. MacBook Air's 52.6Wh (13-inch) or 66.5Wh (15-inch) batteries still offer excellent all-day life, but the Pro wins for marathon sessions away from a charger.",
    },
    {
      label: "Starting Price",
      valueA: "MacBook Air M4: from $1,099",
      valueB: "MacBook Pro M4: from $1,599",
      explanation: "MacBook Air starts $500 cheaper than the entry MacBook Pro. For most users — students, writers, general knowledge work — the Air's performance is more than sufficient at a meaningfully lower price. The Pro's premium is justified only for sustained professional workloads that require active cooling or a ProMotion display.",
    },
    {
      label: "Ports (HDMI / SD Card)",
      valueA: "MacBook Air: MagSafe + 2× Thunderbolt + headphone jack (no HDMI, no SD)",
      valueB: "MacBook Pro 14\"/16\": adds HDMI 2.1 + SD card reader",
      explanation: "MacBook Pro 14-inch and 16-inch models include an HDMI 2.1 port and an SD card reader — essential for videographers and photographers who connect to external monitors or offload camera footage. MacBook Air users need a USB-C hub or dock to access these connections, adding cost and a potential single point of failure.",
    },
  ]);
}

// ── E. farmers-insurance-vs-state-farm (pos 19, 10 KDs → 11) ─────────────────
async function waveE() {
  log("\n── Wave 10E: farmers-insurance-vs-state-farm +1 KD (10→11) ─────────────");
  await addKeyDiffs("farmers-insurance-vs-state-farm", [
    {
      label: "Home Insurance Market Share",
      valueA: "Farmers: ~3% market share (#8 in US)",
      valueB: "State Farm: ~18% market share (#1 in US)",
      explanation: "State Farm is the largest home insurer in the United States by far, with roughly 18% market share — six times larger than Farmers. State Farm's scale gives it broad agent networks in all 50 states, while Farmers operates through an independent-agent model that may have fewer local offices in rural areas.",
    },
  ]);
  await touchFreshness("farmers-insurance-vs-state-farm");
}

// ── F. kobe-bryant-vs-lebron-james (pos 16-19, 10 KDs → 11) ─────────────────
async function waveF() {
  log("\n── Wave 10F: kobe-bryant-vs-lebron-james +1 KD (10→11) ─────────────────");
  await addKeyDiffs("kobe-bryant-vs-lebron-james", [
    {
      label: "Career Accolades at a Glance",
      valueA: "Kobe: 5× NBA Champion, 1× MVP, 18× All-Star, 2× Finals MVP",
      valueB: "LeBron: 4× NBA Champion, 4× MVP, 20× All-Star, 4× Finals MVP",
      explanation: "LeBron's accolade totals exceed Kobe's in most individual categories — more MVP awards, more Finals MVPs, and the all-time scoring record (40,017 points). Kobe's edge is his five championship rings with one franchise and his back-to-back Finals MVP performances in 2009–10. The debate often centers on whether rings with one team outweigh LeBron's greater individual honors across franchises.",
    },
  ]);
  await touchFreshness("kobe-bryant-vs-lebron-james");
}

// ── G. hulu-vs-peacock → youtube-music-vs-soundcloud (inlink) ─────────────────
async function waveG() {
  log("\n── Wave 10G: inlinks → youtube-music-vs-soundcloud ─────────────────────");
  await addInternalLink(
    "hulu-vs-peacock",
    "youtube-music-vs-soundcloud",
    "YouTube Music vs SoundCloud"
  );
  await addInternalLink(
    "paramount-plus-vs-peacock",
    "youtube-music-vs-soundcloud",
    "YouTube Music vs SoundCloud comparison"
  );
}

// ── H. macbook cross-links ─────────────────────────────────────────────────────
async function waveH() {
  log("\n── Wave 10H: macbook cross-links ────────────────────────────────────────");
  await addInternalLink(
    "macbook-air-vs-macbook-pro",
    "macbook-air-vs-macbook-pro-difference-2026-specs",
    "MacBook Air vs MacBook Pro 2026 detailed specs comparison"
  );
  await addInternalLink(
    "macbook-air-vs-macbook-pro",
    "macbook-air-m3-vs-macbook-air-m4",
    "MacBook Air M3 vs M4 comparison"
  );
  await addInternalLink(
    "macbook-air-m3-vs-macbook-air-m4",
    "macbook-air-vs-macbook-pro-difference-2026-specs",
    "MacBook Air vs MacBook Pro 2026 full comparison"
  );
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  log(`\nDAN-2160 Wave 10 — Final boost${DRY ? " (DRY RUN)" : ""}`);
  log("=".repeat(60));

  await waveA();
  await waveB();
  await waveC();
  await waveD();
  await waveE();
  await waveF();
  await waveG();
  await waveH();

  log("\n── Summary ─────────────────────────────────────────────────────────────────");
  if (DRY) log("DRY RUN complete — no DB changes made.");
  else log("Wave 10 complete — commit + push to trigger Vercel deploy.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

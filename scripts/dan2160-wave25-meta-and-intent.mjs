/**
 * DAN-2160 Wave 25 — Meta description CTR fixes + intent-specific content
 *
 * Targets: 6 pages closest to page 1 (pos 11–16)
 *
 * Actions:
 *  A. Fix meta descriptions over 160ch (SoundCloud 191ch→152ch, Chase 194ch→158ch, IKEA 191ch→155ch)
 *  B. Kohli page: add full-name "Virat Kohli vs Sachin Tendulkar" in desc + "statistics" keyword
 *  C. Expedia page: sharpen desc to put "or" intent answer first
 *  D. M3 vs M4: add 2026 price freshness to desc
 *  E. Freshness touch on all 6 pages to signal recent update
 *
 * Run:
 *   node scripts/dan2160-wave25-meta-and-intent.mjs --dry
 *   node scripts/dan2160-wave25-meta-and-intent.mjs
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

// ── meta description updates ──────────────────────────────────────────────────

const metaUpdates = [
  {
    slug: "youtube-music-vs-soundcloud",
    reason: "191ch→152ch — trim truncated desc, surface 'which is better' answer faster",
    metaDescription: "SoundCloud vs YouTube Music 2026: free tier, $9.99–$13.99/mo plans, 15M vs 100M tracks, indie artist support, and which wins for your listening style.",
  },
  {
    slug: "capital-one-vs-chase",
    reason: "194ch→143ch — keep 'NOT affiliated' hook, trim to ≤160ch",
    metaDescription: "Capital One and Chase are NOT affiliated — separate banks. Compare 2026 credit cards, travel rewards, savings rates & which is better for you.",
  },
  {
    slug: "ikea-vs-wayfair",
    reason: "191ch→155ch — tighten desc, keep 'Reddit' keyword prominent",
    metaDescription: "Wayfair vs IKEA 2026 — what Reddit says: price, quality, delivery, assembly, and return policy. Plus our full comparison and verdict.",
  },
  {
    slug: "virat-kohli-vs-sachin-tendulkar",
    reason: "Add 'statistics' keyword + full names — query is 'virat kohli vs sachin tendulkar statistics'",
    metaTitle: "Virat Kohli vs Sachin Tendulkar Stats & Records | A Versus B",
    metaDescription: "Virat Kohli vs Sachin Tendulkar statistics: Test runs, centuries, ODI records, career averages, and who is the GOAT. Comprehensive 2026 cricket data.",
  },
  {
    slug: "expedia-vs-kayak",
    reason: "Sharpen 'expedia or kayak' intent — put the key difference in first 100 chars",
    metaDescription: "Expedia or Kayak? Kayak is a search engine; Expedia is a booking site. Compare 2026 prices, rewards, fees, customer service, and which saves you more.",
  },
  {
    slug: "macbook-air-m3-vs-macbook-air-m4",
    reason: "Add 2026 price freshness signal to desc",
    metaDescription: "MacBook Air M3 vs M4 2026: M4 starts at $1,099 (M3 at $849 refurb). Compare CPU cores, RAM, battery, display, and whether the upgrade is worth it.",
  },
];

log(`DAN-2160 Wave 25 — Meta CTR fixes + intent-specific content ${DRY ? "(DRY RUN)" : ""}`);
log("=".repeat(64));

let updated = 0;

for (const u of metaUpdates) {
  log(`\n── ${u.slug} ──`);
  log(`  reason: ${u.reason}`);
  
  const existing = await prisma.comparison.findUnique({
    where: { slug: u.slug },
    select: { metaTitle: true, metaDescription: true, updatedAt: true },
  });
  if (!existing) { log(`  ! SKIP — not found`); continue; }
  
  const updateData = {
    updatedAt: new Date(),
  };
  
  if (u.metaDescription) {
    const len = u.metaDescription.length;
    log(`  desc: ${existing.metaDescription?.length || 0}ch → ${len}ch`);
    if (len > 160) log(`  ⚠️  WARNING: still over 160ch!`);
    updateData.metaDescription = u.metaDescription;
  }
  
  if (u.metaTitle) {
    const len = u.metaTitle.length;
    log(`  title: "${existing.metaTitle}" → "${u.metaTitle}" (${len}ch)`);
    updateData.metaTitle = u.metaTitle;
  }
  
  if (!DRY) {
    await prisma.comparison.update({
      where: { slug: u.slug },
      data: updateData,
    });
    log(`  ✅ updated`);
    updated++;
  } else {
    log(`  [DRY] would update`);
  }
}

// ── Kohli: add "statistics" FAQ and a stats intro section ───────────────────
log(`\n── Kohli: add statistics-specific FAQs ──`);

const kohli = await prisma.comparison.findUnique({
  where: { slug: "virat-kohli-vs-sachin-tendulkar" },
  select: { faqs: true, shortAnswer: true },
});

if (kohli) {
  const existingFaqs = Array.isArray(kohli.faqs) ? kohli.faqs : [];
  const existingQs = new Set(existingFaqs.map(f => f.question?.toLowerCase().trim()));
  
  const newFaqs = [
    {
      question: "What are the key statistics differences between Virat Kohli and Sachin Tendulkar?",
      answer: "The key statistical differences: Sachin has 100 international centuries vs Kohli's 81+; Sachin scored 34,357 international runs vs Kohli's 27,000+; Kohli averages 53+ in Tests vs Sachin's 53.78; Kohli has a higher ODI average (59.07) vs Sachin (44.83)."
    },
    {
      question: "Whose Test statistics are better — Kohli or Tendulkar?",
      answer: "Sachin Tendulkar leads in raw Test numbers: 15,921 runs vs Kohli's 9,230 (Kohli still active), 51 centuries vs 29. However, Kohli's Test batting average (53.7) is comparable to Sachin's (53.78). In terms of averages, they are nearly identical; Sachin leads in volume."
    },
    {
      question: "How do Kohli vs Tendulkar ODI statistics compare?",
      answer: "Virat Kohli averages 59.07 in ODIs vs Sachin Tendulkar's 44.83 — a significant difference. Sachin has 49 ODI centuries to Kohli's 50+, making Kohli the leader in ODI centuries. Sachin scored 18,426 ODI runs vs Kohli's 14,000+ (Kohli still active)."
    },
  ].filter(f => !existingQs.has(f.question.toLowerCase().trim()));
  
  if (newFaqs.length === 0) {
    log(`  skip — all stats FAQs already exist`);
  } else {
    log(`  adding ${newFaqs.length} statistics FAQs`);
    newFaqs.forEach(f => log(`    + "${f.question.substring(0,60)}..."`));
    if (!DRY) {
      await prisma.comparison.update({
        where: { slug: "virat-kohli-vs-sachin-tendulkar" },
        data: {
          faqs: [...existingFaqs, ...newFaqs],
          updatedAt: new Date(),
        },
      });
      log(`  ✅ Kohli FAQs updated (${existingFaqs.length} → ${existingFaqs.length + newFaqs.length})`);
      updated++;
    } else {
      log(`  [DRY] would add ${newFaqs.length} FAQs`);
    }
  }
}

// ── SoundCloud: add "vs Spotify" FAQ that captures search snippet for music queries ──
log(`\n── SoundCloud: add "free tier" FAQ for featured snippet capture ──`);

const sc = await prisma.comparison.findUnique({
  where: { slug: "youtube-music-vs-soundcloud" },
  select: { faqs: true },
});

if (sc) {
  const existingFaqs = Array.isArray(sc.faqs) ? sc.faqs : [];
  const existingQs = new Set(existingFaqs.map(f => f.question?.toLowerCase().trim()));
  
  const newFaqs = [
    {
      question: "Is SoundCloud or YouTube Music better for free listeners in 2026?",
      answer: "SoundCloud is better for free listeners in 2026. SoundCloud Go's free tier allows unlimited streaming with ads and some offline features. YouTube Music's free tier requires keeping the screen active (no background play on mobile). For free listening, SoundCloud wins; for paid, YouTube Music's $13.99/mo plan offers deeper integration with YouTube Premium."
    },
    {
      question: "Which music app is better for discovering underground music — SoundCloud or YouTube Music?",
      answer: "SoundCloud is far better for discovering underground and independent music. SoundCloud hosts over 300 million tracks — many from unsigned artists, DJs, and bedroom producers — versus YouTube Music's 100M+ licensed catalog. If you want to find new artists before they're mainstream, SoundCloud is unmatched in 2026."
    },
  ].filter(f => !existingQs.has(f.question.toLowerCase().trim()));
  
  if (newFaqs.length === 0) {
    log(`  skip — all SoundCloud FAQs already exist`);
  } else {
    log(`  adding ${newFaqs.length} new FAQs to SoundCloud page`);
    newFaqs.forEach(f => log(`    + "${f.question.substring(0,60)}..."`));
    if (!DRY) {
      await prisma.comparison.update({
        where: { slug: "youtube-music-vs-soundcloud" },
        data: {
          faqs: [...existingFaqs, ...newFaqs],
          updatedAt: new Date(),
        },
      });
      log(`  ✅ SoundCloud FAQs updated (${existingFaqs.length} → ${existingFaqs.length + newFaqs.length})`);
      updated++;
    } else {
      log(`  [DRY] would add ${newFaqs.length} FAQs`);
    }
  }
}

log(`\n${"=".repeat(64)}`);
log(`Wave 25 ${DRY ? "DRY RUN" : "DONE"}: ${updated} pages updated`);

await prisma.$disconnect();

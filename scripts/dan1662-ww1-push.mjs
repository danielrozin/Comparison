/**
 * DAN-1662 — On-page push: /compare/ww1-vs-ww2 pos 20 → page 1
 *
 * Target keyword: "ww1 vs ww2" / "World War 1 vs World War 2" (2,900/mo, pos 20)
 *
 * What this does (all idempotent):
 *   1. Title (H1) → "World War 1 vs World War 2: Causes, Deaths & Key Differences"
 *      — includes full keyword variant in H1
 *   2. metaTitle → keyword-first, <60 chars (60 incl. brand suffix)
 *   3. metaDescription → keyword-rich, benefit-led, 140-155 chars
 *   4. shortAnswer (intro lede) → keyword "World War 1 vs World War 2" in first 100 chars
 *   5. 4 new FAQs added (existing 4 retained) → 8 total, covering People Also Ask variants:
 *      - weapons/technology
 *      - number of countries involved
 *      - which was more destructive
 *      - main causes
 *   6. 3 additional internal links FROM history/military /compare/ pages
 *      (5 already exist: ancient-greece, roman-empire, french-revolution,
 *       cold-war, vietnam-war — criterion already met; adding for stronger signal)
 *
 * Run:
 *   node scripts/dan1662-ww1-push.mjs
 *   node scripts/dan1662-ww1-push.mjs --dry   (no DB writes)
 *
 * Idempotent: upserts/createMany with skipDuplicates; safe to re-run.
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

const SLUG = "ww1-vs-ww2";
const TO_PATH = "/compare/ww1-vs-ww2";

// ---------------------------------------------------------------------------
// 1) Load current record
// ---------------------------------------------------------------------------
const current = await prisma.comparison.findUnique({
  where: { slug: SLUG },
  select: { id: true, title: true, shortAnswer: true, metaTitle: true, metaDescription: true, status: true },
});

if (!current) {
  log("!! MISSING — comparison not found:", SLUG);
  await prisma.$disconnect();
  process.exit(1);
}

log("== Current state ==");
log("  title (H1):", current.title);
log("  metaTitle:", current.metaTitle);
log("  status:", current.status);

// ---------------------------------------------------------------------------
// 2) Copy edits: title, metaTitle, metaDescription, shortAnswer
// ---------------------------------------------------------------------------
// metaTitle: keyword-first, ≤60 chars total (per DAN-1169 pattern for comparisons;
// field stores FULL title tag value incl. brand suffix).
// "World War 1 vs World War 2: Causes & Deaths | A Versus B" = 56 chars ✓
const NEW_META_TITLE = "World War 1 vs World War 2: Causes & Deaths | A Versus B";

// H1: full keyword phrase + differentiator
const NEW_TITLE = "World War 1 vs World War 2: Causes, Deaths & Key Differences";

// metaDescription: keyword + key facts + CTA, 140-155 chars
const NEW_META_DESC =
  "Compare World War 1 vs World War 2: causes, casualties (20M vs 70-85M deaths), technology used, and which war was more destructive. Full WW1 vs WW2 breakdown.";

// shortAnswer: keyword in first 100 chars; retain key facts
const NEW_SHORT_ANSWER =
  "World War 1 vs World War 2: WW1 (1914–1918) killed 20 million while WW2 (1939–1945) killed 70–85 million. WW2 expanded to the Pacific and introduced nuclear weapons, fundamentally reshaping the world order.";

log("\n== Copy edits ==");
log("  NEW title (H1):", NEW_TITLE);
log("  NEW metaTitle:", NEW_META_TITLE, `(${NEW_META_TITLE.length} chars)`);
log("  NEW metaDesc:", NEW_META_DESC, `(${NEW_META_DESC.length} chars)`);
log("  NEW shortAnswer (first 100):", NEW_SHORT_ANSWER.slice(0, 100));

if (!DRY) {
  await prisma.comparison.update({
    where: { slug: SLUG },
    data: {
      title: NEW_TITLE,
      metaTitle: NEW_META_TITLE,
      metaDescription: NEW_META_DESC,
      shortAnswer: NEW_SHORT_ANSWER,
    },
  });
  log("  ✓ Updated comparison copy fields");
} else {
  log("  [DRY] would update comparison copy fields");
}

// ---------------------------------------------------------------------------
// 3) New FAQ entries (People Also Ask variants)
// ---------------------------------------------------------------------------
// Existing (retained): "Which war was more deadly?", "Did WW1 cause WW2?",
//   "What are the main differences between WW1 and WW2?", "Why is WW2 more famous than WW1?"
// Adding 4 more to reach 8 total, covering technology, scale, destruction, causes.
const NEW_FAQS = [
  {
    question: "What weapons and technology were introduced in WW1 vs WW2?",
    answer:
      "WW1 introduced industrial-scale warfare including poison gas (chlorine, mustard), tanks, and early aerial bombing. WW2 dramatically escalated technology: strategic bombing campaigns, radar, jet aircraft, V-2 rockets, and the atomic bomb (Hiroshima and Nagasaki, August 1945). WW2's technological advances were far more transformative, effectively ushering in the modern military era and the nuclear age.",
    sortOrder: 4,
  },
  {
    question: "How many countries were involved in WW1 vs WW2?",
    answer:
      "WW1 involved approximately 30 nations, primarily European powers: Allied Powers (UK, France, Russia, Italy, USA) vs Central Powers (Germany, Austria-Hungary, Ottoman Empire). WW2 involved over 50 nations across every inhabited continent, making it a truly global conflict. The Pacific Theater (Japan vs USA, UK, Australia, China) and WW2's reach into Africa and Southeast Asia illustrate its unprecedented geographic scope.",
    sortOrder: 5,
  },
  {
    question: "Which world war was more destructive overall?",
    answer:
      "WW2 was significantly more destructive by every measurable metric: 3–4× more total deaths (70–85 million vs 20 million), far higher civilian casualties (55–65% vs 35–40%), the Holocaust (6 million+ Jewish deaths), atomic bombings of Hiroshima and Nagasaki, and widespread destruction across Europe and Asia. WW1 devastated European economies; WW2 reshaped the entire world order and led to the Cold War.",
    sortOrder: 6,
  },
  {
    question: "What were the main causes of WW1 vs WW2?",
    answer:
      "WW1 was triggered by the assassination of Archduke Franz Ferdinand (June 1914) against a backdrop of imperial rivalries, an arms race, nationalism, and entangled alliances. WW2 stemmed directly from WW1's unresolved aftermath: the punitive Treaty of Versailles, the Great Depression, and the rise of fascism under Adolf Hitler in Germany, Mussolini in Italy, and militarism in Japan. WW2 is widely seen as a continuation of unfinished WW1 business.",
    sortOrder: 7,
  },
];

log("\n== New FAQs ==");
for (const faq of NEW_FAQS) {
  log(`  sortOrder ${faq.sortOrder}: "${faq.question}"`);
}

if (!DRY) {
  // Use createMany with skipDuplicates is NOT available for FAQs (no unique constraint
  // on question+comparisonId). Instead, check-before-insert to stay idempotent.
  const existingFaqs = await prisma.fAQ.findMany({
    where: { comparisonId: current.id },
    select: { question: true },
  });
  const existingQs = new Set(existingFaqs.map((f) => f.question));

  let added = 0;
  for (const faq of NEW_FAQS) {
    if (existingQs.has(faq.question)) {
      log(`  skip (exists): "${faq.question}"`);
      continue;
    }
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        comparisonId: current.id,
      },
    });
    log(`  ✓ Created FAQ: "${faq.question}"`);
    added++;
  }
  log(`  ${added} new FAQs added (${NEW_FAQS.length - added} already existed)`);
} else {
  log("  [DRY] would create 4 new FAQ entries");
}

// ---------------------------------------------------------------------------
// 4) Additional internal links (3 more from history/military pages)
// ---------------------------------------------------------------------------
// 5 already exist (ancient-greece, roman-empire, french-revolution, cold-war,
// vietnam-war) — criterion met. Adding 3 more for stronger topical signal.
const ADDITIONAL_LINKS = [
  {
    fromPath: "/compare/democracy-vs-communism",
    anchorText: "World War 1 vs World War 2",
    linkType: "related",
    position: "inline",
    score: 1.2,
  },
  {
    fromPath: "/compare/vietnam-war-vs-korean-war-comparison",
    anchorText: "WW1 vs WW2 comparison",
    linkType: "related",
    position: "inline",
    score: 1.1,
  },
  {
    fromPath: "/compare/us-military-vs-china-military",
    anchorText: "World War 1 vs World War 2",
    linkType: "related",
    position: "inline",
    score: 1.0,
  },
];

log("\n== Additional internal links ==");
for (const link of ADDITIONAL_LINKS) {
  log(`  ${link.fromPath} → ${TO_PATH} ("${link.anchorText}")`);
}

if (!DRY) {
  let linked = 0;
  for (const link of ADDITIONAL_LINKS) {
    const existing = await prisma.internalLink.findFirst({
      where: { fromPath: link.fromPath, toPath: TO_PATH },
    });
    if (existing) {
      log(`  skip (exists): ${link.fromPath}`);
      continue;
    }
    await prisma.internalLink.create({
      data: {
        fromPath: link.fromPath,
        toPath: TO_PATH,
        anchorText: link.anchorText,
        linkType: link.linkType,
        position: link.position,
        score: link.score,
      },
    });
    log(`  ✓ Created link: ${link.fromPath} → ${TO_PATH}`);
    linked++;
  }
  log(`  ${linked} new internal links added`);
} else {
  log("  [DRY] would add up to 3 internal links");
}

// ---------------------------------------------------------------------------
// 5) Final verification
// ---------------------------------------------------------------------------
if (!DRY) {
  const final = await prisma.comparison.findUnique({
    where: { slug: SLUG },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      shortAnswer: true,
      faqs: { select: { question: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  const inboundLinks = await prisma.internalLink.findMany({ where: { toPath: TO_PATH }, select: { fromPath: true } });

  log("\n== FINAL STATE ==");
  log("  title (H1):", final.title);
  log("  metaTitle:", final.metaTitle);
  log("  metaDesc:", final.metaDescription);
  log("  shortAnswer (first 100):", final.shortAnswer?.slice(0, 100));
  log("  FAQs:", final.faqs.length);
  for (const f of final.faqs) log(`    [${f.sortOrder}] ${f.question}`);
  log("  Internal links TO page:", inboundLinks.length);
  for (const l of inboundLinks) log(`    ${l.fromPath}`);
}

await prisma.$disconnect();
log("\nDone ✓");

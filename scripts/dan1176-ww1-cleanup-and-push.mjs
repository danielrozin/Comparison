/**
 * DAN-1176 T+21 — ww1-vs-ww2 FAQ cleanup + similarity/comparison FAQ expansion
 *
 * Actions:
 *   1. Delete 2 duplicate FAQs created by prior heartbeat overlap:
 *      - "How many countries were involved in WW1 vs WW2?" (sortOrder 9) — duplicate of sortOrder 5
 *      - "What new weapons and technology appeared in WW1 vs WW2?" (sortOrder 10) — near-duplicate of sortOrder 4
 *   2. Add 2 new FAQs targeting the ~1,040/mo comparison keyword cluster (pos 25-49):
 *      - "What were the main similarities between World War 1 and World War 2?" ← ~200/mo similarity cluster
 *      - "How do World War 1 and World War 2 compare overall?" ← ~1,040/mo comparison cluster
 *   3. Submit IndexNow for fast recrawl
 *
 * Run: node scripts/dan1176-ww1-cleanup-and-push.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();
const SLUG = "ww1-vs-ww2";
const PAGE_URL = "https://www.aversusb.net/compare/ww1-vs-ww2";

// Duplicate FAQ IDs to delete
const DUPLICATE_FAQ_IDS = [
  "cmr3ll5sb000bh7olaspo66nw", // "How many countries were involved in WW1 vs WW2?" (sortOrder 9) — dup of sortOrder 5
  "cmr3ll5wd000dh7olbwj878fw", // "What new weapons and technology appeared in WW1 vs WW2?" (sortOrder 10) — near-dup of sortOrder 4
];

// New FAQs targeting untapped keyword clusters
const NEW_FAQS = [
  {
    question: "What were the main similarities between World War 1 and World War 2?",
    answer:
      "Despite their differences, WW1 and WW2 shared key similarities: both were triggered by European power rivalries and nationalist tensions, both involved mass mobilization of industrial economies for warfare, both caused millions of civilian casualties, and both reshaped global borders and political maps. Both wars also accelerated social changes including women entering the workforce. The major difference is WW2's global scale — it spread to the Pacific, North Africa, and East Asia in ways WW1 never did.",
    sortOrder: 9,
  },
  {
    question: "How do World War 1 and World War 2 compare overall?",
    answer:
      "Comparing WW1 vs WW2: WW1 lasted 4 years (1914–1918) and killed ~20 million; WW2 lasted 6 years (1939–1945) and killed 70–85 million. WW1 was primarily a European conflict fought mostly in trenches; WW2 was a truly global war spanning 6 continents with rapid mechanized movement. WW2 introduced far more destructive technology — strategic bombing, the Holocaust, atomic weapons — and its aftermath created the United Nations, NATO, and the Cold War. WW2 is widely considered history's most devastating conflict.",
    sortOrder: 10,
  },
];

console.log("== DAN-1176 T+21: ww1-vs-ww2 FAQ cleanup + expansion ==\n");

// 1. Get current state
const current = await prisma.comparison.findUnique({
  where: { slug: SLUG },
  select: { id: true, faqs: { select: { id: true, question: true, sortOrder: true } } },
});
if (!current) { console.log("NOT FOUND"); process.exit(1); }

console.log(`Current FAQs (${current.faqs.length}):`);
for (const f of current.faqs.sort((a, b) => a.sortOrder - b.sortOrder)) {
  console.log(`  [${f.sortOrder}] ${f.question}`);
}

// 2. Delete duplicates
console.log("\n== Deleting duplicate FAQs ==");
for (const id of DUPLICATE_FAQ_IDS) {
  const faq = current.faqs.find(f => f.id === id);
  if (!faq) {
    console.log(`  skip (not found): ${id}`);
    continue;
  }
  await prisma.fAQ.delete({ where: { id } });
  console.log(`  ✓ Deleted: "${faq.question}" (${id})`);
}

// 3. Add new FAQs
console.log("\n== Adding new FAQs ==");
const existing = await prisma.fAQ.findMany({
  where: { comparisonId: current.id },
  select: { question: true },
});
const existingQs = new Set(existing.map(f => f.question));

for (const faq of NEW_FAQS) {
  if (existingQs.has(faq.question)) {
    console.log(`  skip (exists): "${faq.question}"`);
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
  console.log(`  ✓ Added: "${faq.question}"`);
}

// 4. Verify final state
const final = await prisma.comparison.findUnique({
  where: { slug: SLUG },
  select: { faqs: { select: { question: true, sortOrder: true }, orderBy: { sortOrder: "asc" } } },
});
console.log(`\n== Final FAQs (${final.faqs.length}) ==`);
for (const f of final.faqs) console.log(`  [${f.sortOrder}] ${f.question}`);

// 5. IndexNow
const INDEXNOW_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/indexnow`
  : "https://www.aversusb.net/api/indexnow";
const CRON_SECRET = process.env.CRON_SECRET;
if (CRON_SECRET) {
  console.log("\n== Submitting IndexNow ==");
  const inResp = await fetch(INDEXNOW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${CRON_SECRET}` },
    body: JSON.stringify({ urls: [PAGE_URL] }),
  });
  const inJson = await inResp.json().catch(() => ({ status: inResp.status }));
  console.log(`  IndexNow: ${JSON.stringify(inJson)}`);
} else {
  console.log("\n  [SKIP] No CRON_SECRET — IndexNow not submitted");
}

await prisma.$disconnect();
console.log("\nDone ✓");

import * as dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

const DRY = process.argv.includes("--dry");
const now = new Date();
const log = [];
const L = (m) => { console.log(m); log.push(m); };

// ── Striking-distance comparison targets (pos 11-30), compare/* only ──
const rankings = JSON.parse(readFileSync(new URL("./data/dan1026-rankings.json", import.meta.url)));
const norm = (u) => u.replace("https://www.aversusb.net", "").replace("https://aversusb.net", "").split("?")[0];
const targetSlugs = new Set();
for (const d of rankings) {
  if (d.position >= 11 && d.position <= 30) {
    const path = norm(d.url);
    const m = path.match(/^\/compare\/([a-z0-9-]+)$/);
    if (m) targetSlugs.add(m[1]);
  }
}
L(`Striking-distance /compare targets: ${targetSlugs.size}`);

// ── Hand-authored FAQs targeting exact striking keyword variants ──
const NEW_FAQS = {
  "us-military-vs-china-military": [
    { question: "Is China's military stronger than the US military?",
      answer: "No — as of 2026 the US military remains stronger overall. The US spends roughly $877 billion on defense (about 3x China's ~$230 billion), operates 11 nuclear-powered aircraft carriers to China's 3 conventional ones, and has a global network of bases plus combat-proven force projection. China leads in active personnel (~2 million) and total number of naval ships, and is closing the gap fast in shipbuilding, hypersonic missiles, and its nuclear arsenal — but it has not fought a major war since 1979 and lacks comparable global reach." },
    { question: "How does China's military compare to the US in 2026?",
      answer: "China fields the world's largest army by personnel and the largest navy by number of ships, and it is modernizing rapidly with advanced missiles, a growing carrier program, and a nuclear stockpile projected to reach about 1,000 warheads by 2030. The US still leads in budget, technology, aircraft carriers, stealth aircraft, nuclear warheads (~5,000), and worldwide basing. The gap is widest in global power projection and combat experience, and narrowest in regional firepower around the Indo-Pacific." },
  ],
  "ww1-vs-ww2": [
    { question: "What are the main differences between WW1 and WW2?",
      answer: "WW1 (1914–1918) was fought largely in static trench warfare across Europe and killed about 20 million people. WW2 (1939–1945) was a faster, more mobile and truly global war that killed 70–85 million, deployed tanks, aircraft, and nuclear weapons at scale, and involved far more nations and civilian casualties. WW1 redrew Europe's borders; WW2 reshaped the entire global order and set up the Cold War." },
    { question: "Why is WW2 more famous than WW1?",
      answer: "WW2 is more widely remembered because it was larger in every dimension — more deaths, more countries involved, the Holocaust, and the first use of nuclear weapons — and because it is more recent, far better documented in film and photography, and its outcomes (the UN, the Cold War, modern borders) still shape the world today." },
  ],
  "ally-bank-vs-marcus-by-goldman-sachs": [
    { question: "Is Marcus by Goldman Sachs a good HYSA?",
      answer: "Yes — Marcus by Goldman Sachs offers a competitive high-yield savings account (HYSA) with no monthly fees, no minimum deposit, and FDIC insurance up to $250,000. It consistently posts an APY near the top of the online-bank market and is a strong pick if you want a simple, fee-free place to grow savings. Its main trade-off versus Ally is that Marcus has no checking account, debit card, or ATM network, so it works best as a dedicated savings account rather than an all-in-one bank." },
    { question: "Marcus HYSA vs Ally savings — which has the higher APY?",
      answer: "Both Ally and Marcus offer near-identical high-yield savings APYs that move with the Fed, and the leader changes from month to month — so check current rates before opening. The bigger difference is features: Ally bundles savings with full checking, debit, and ATM access, while Marcus focuses purely on savings and short-term CDs. Choose Marcus for a no-frills HYSA, Ally for an all-in-one online bank." },
  ],
};

const backup = { faqs: [], relatedUpdates: [], internalLinks: [], refreshed: [] };

// ── 1. Add FAQs (skip if question already exists) ──
for (const [slug, faqs] of Object.entries(NEW_FAQS)) {
  const comp = await prisma.comparison.findUnique({ where: { slug }, include: { faqs: true } });
  if (!comp) { L(`  FAQ skip — missing ${slug}`); continue; }
  const existingQ = new Set(comp.faqs.map((f) => f.question.toLowerCase()));
  let order = comp.faqs.length;
  for (const f of faqs) {
    if (existingQ.has(f.question.toLowerCase())) { L(`  FAQ exists, skip: "${f.question}"`); continue; }
    if (!DRY) {
      const created = await prisma.fAQ.create({ data: { question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: order++ } });
      backup.faqs.push(created.id);
    }
    L(`  + FAQ [${slug}]: "${f.question}"`);
  }
}

// ── 2. Internal-linking sweep: route inbound authority into each target ──
const SOURCES_PER_TARGET = 5;
let linkRowsCreated = 0, relatedAdds = 0;
for (const slug of targetSlugs) {
  const target = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, slug: true, title: true, category: true } });
  if (!target || !target.category) { L(`  link skip — ${slug} (missing/no category)`); continue; }
  // authority sources: top-viewCount published pages in same category, excluding the target itself
  const sources = await prisma.comparison.findMany({
    where: { category: target.category, status: "published", slug: { not: slug }, viewCount: { gt: 0 } },
    select: { id: true, slug: true, title: true, relatedComparisonIds: true },
    orderBy: { viewCount: "desc" },
    take: SOURCES_PER_TARGET,
  });
  for (const src of sources) {
    // 2a. add target id to source.relatedComparisonIds (front, deduped, capped at 10)
    const cur = src.relatedComparisonIds || [];
    if (!cur.includes(target.id)) {
      const next = [target.id, ...cur].slice(0, 10);
      backup.relatedUpdates.push({ id: src.id, prev: cur });
      if (!DRY) await prisma.comparison.update({ where: { id: src.id }, data: { relatedComparisonIds: next } });
      relatedAdds++;
    }
    // 2b. tracking row in InternalLink (skip dup)
    const fromPath = `/compare/${src.slug}`, toPath = `/compare/${target.slug}`;
    const dup = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
    if (!dup) {
      if (!DRY) {
        const il = await prisma.internalLink.create({ data: { fromPath, toPath, anchorText: target.title, linkType: "related", position: "module", score: 1.5 } });
        backup.internalLinks.push(il.id);
      }
      linkRowsCreated++;
    }
  }
}
L(`Internal links: ${relatedAdds} relatedComparisonIds additions, ${linkRowsCreated} InternalLink rows`);

// ── 3. Freshness signal on all targets ──
let refreshed = 0;
for (const slug of targetSlugs) {
  const c = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, lastRefreshedAt: true } });
  if (!c) continue;
  backup.refreshed.push({ id: c.id, prev: c.lastRefreshedAt });
  if (!DRY) await prisma.comparison.update({ where: { id: c.id }, data: { lastRefreshedAt: now } });
  refreshed++;
}
L(`Freshness: lastRefreshedAt set on ${refreshed} target pages`);

if (!DRY) {
  writeFileSync(new URL("./data/dan1026-sweep-backup.json", import.meta.url).pathname, JSON.stringify(backup, null, 2));
  L("Backup written: scripts/data/dan1026-sweep-backup.json");
}
L(DRY ? "\n[DRY RUN — no writes]" : "\n[APPLIED]");
await prisma.$disconnect();

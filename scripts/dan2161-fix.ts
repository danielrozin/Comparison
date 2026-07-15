/**
 * DAN-2161 — fix the two live self-contradicting sentences found by
 * scripts/dan2161-contradiction-sweep.ts. Backs up originals to
 * scripts/dan2161-backup.json before writing. Idempotent (skips if the
 * bad substring is already gone).
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";
const prisma = new PrismaClient();

const FIXES: { slug: string; find: string; replace: string }[] = [
  {
    slug: "china-economy-vs-united-states",
    find: "while China's economy is larger by total GDP ($17.9 trillion vs $27.4 trillion adjusted for PPP)",
    // Align prose with its own keyDifferences: China leads on PPP ($28.3T vs $27.4T), NOT nominal.
    replace: "while China's economy is larger by GDP at purchasing power parity ($28.3 trillion vs $27.4 trillion PPP)",
  },
  {
    slug: "messi-vs-ronaldo",
    find: "has scored more international goals (128 vs 129 for Messi as of 2026)",
    // Drop the fabricated, self-contradicting count; keep the directionally-true, checkable claim.
    replace: "has scored more international goals (he is the all-time record international goalscorer)",
  },
];

async function main() {
  const backups: any[] = [];
  for (const f of FIXES) {
    const r = await prisma.comparison.findUnique({
      where: { slug: f.slug }, select: { id: true, slug: true, shortAnswer: true },
    });
    if (!r) { console.log(`SKIP ${f.slug}: not found`); continue; }
    backups.push({ slug: r.slug, shortAnswer: r.shortAnswer });
    if (!r.shortAnswer?.includes(f.find)) {
      console.log(`SKIP ${f.slug}: target substring not present (already fixed?)`);
      continue;
    }
    const next = r.shortAnswer.replace(f.find, f.replace);
    await prisma.comparison.update({ where: { id: r.id }, data: { shortAnswer: next } });
    console.log(`FIXED ${f.slug}`);
    console.log(`   new: ${next.slice(0, 240)}`);
  }
  writeFileSync("scripts/dan2161-backup.json", JSON.stringify(backups, null, 2));
  console.log(`\nBackups written to scripts/dan2161-backup.json (${backups.length} rows)`);
}
main().catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());

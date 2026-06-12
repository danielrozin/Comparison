import * as dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const DRY = process.argv.includes("--dry");

// related-category map (mirror of internal-linking-engine.ts so links actually render)
const RELATED = {
  sports:["celebrities"], countries:["military","economy"], technology:["products","companies"],
  products:["technology","brands"], celebrities:["sports"], history:["military","countries"],
  military:["countries","history"], economy:["countries","companies"], companies:["brands","technology","economy"],
  brands:["products","companies"], health:["products"], entertainment:["celebrities"],
  automotive:["products","technology"], software:["technology","companies"], finance:["economy","companies"],
  education:[], travel:["countries"],
};

const rankings = JSON.parse(readFileSync(new URL("./data/dan1026-rankings.json", import.meta.url)));
const norm = (u) => u.replace("https://www.aversusb.net","").replace("https://aversusb.net","").split("?")[0];
const targetSlugs = [...new Set(rankings.filter(d=>d.position>=11&&d.position<=30).map(d=>norm(d.url).match(/^\/compare\/([a-z0-9-]+)$/)?.[1]).filter(Boolean))];

const TARGET_INBOUND = 5;
const backup = { relatedUpdates: [], internalLinks: [] };
let adds=0, rows=0;
const report=[];

for (const slug of targetSlugs) {
  const t = await prisma.comparison.findUnique({ where:{slug}, select:{id:true,slug:true,title:true,category:true} });
  if (!t || !t.category) continue;
  // current inbound count
  const have = await prisma.comparison.count({ where:{ relatedComparisonIds:{ has:t.id } } });
  const need = TARGET_INBOUND - have;
  if (need <= 0) { report.push(`${slug}: ${have} inbound ✓`); continue; }
  // pull sources from related categories (high viewCount), excluding ones that already link
  const relCats = RELATED[t.category] || [];
  if (relCats.length === 0) { report.push(`${slug}: ${have} inbound, no related cats`); continue; }
  const candidates = await prisma.comparison.findMany({
    where:{ category:{ in:relCats }, status:"published", viewCount:{ gt:0 }, NOT:{ relatedComparisonIds:{ has:t.id } } },
    select:{ id:true, slug:true, relatedComparisonIds:true },
    orderBy:{ viewCount:"desc" }, take: need,
  });
  for (const src of candidates) {
    const cur = src.relatedComparisonIds || [];
    const next = [t.id, ...cur].slice(0,10);
    backup.relatedUpdates.push({ id:src.id, prev:cur });
    if (!DRY) await prisma.comparison.update({ where:{id:src.id}, data:{ relatedComparisonIds:next } });
    adds++;
    const fromPath=`/compare/${src.slug}`, toPath=`/compare/${t.slug}`;
    const dup = await prisma.internalLink.findFirst({ where:{ fromPath, toPath } });
    if (!dup) {
      if (!DRY){ const il=await prisma.internalLink.create({ data:{ fromPath, toPath, anchorText:t.title, linkType:"related", position:"module", score:1.3 } }); backup.internalLinks.push(il.id); }
      rows++;
    }
  }
  report.push(`${slug}: ${have}->${have+candidates.length} inbound (+${candidates.length} from ${relCats.join("/")})`);
}

report.forEach(r=>console.log("  "+r));
console.log(`\nPass2: +${adds} relatedComparisonIds, +${rows} InternalLink rows`);
if (!DRY) { writeFileSync(new URL("./data/dan1026-sweep-pass2-backup.json", import.meta.url).pathname, JSON.stringify(backup,null,2)); console.log("backup written"); }
console.log(DRY?"[DRY]":"[APPLIED]");
await prisma.$disconnect();

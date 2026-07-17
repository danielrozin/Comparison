/**
 * DAN-346 — CTR-recovery candidate finder. Live /compare/ pages that already
 * RANK (position <= 15) but under-convert impressions to clicks. Title rewrites
 * (META_OVERRIDES, DAN-1281 pattern) are the highest-leverage lever here — the
 * ranking is earned, only the click is missing.  Read-only.
 */
import * as fs from "fs";
import * as path from "path";
function loadEnv(): void {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return;
  const txt = fs.readFileSync(envPath, "utf8");
  for (const key of ["GOOGLE_SERVICE_ACCOUNT_KEY", "DATABASE_URL"]) {
    if (process.env[key]) continue;
    const m = new RegExp(`^${key}=(.*)$`, "m").exec(txt);
    if (!m) continue;
    let v = m[1];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    process.env[key] = v;
  }
}
// Rough expected CTR by position (industry curve, page 1).
function expectedCtr(pos: number): number {
  const table: [number, number][] = [[1,0.28],[2,0.15],[3,0.10],[4,0.07],[5,0.05],[6,0.04],[7,0.03],[8,0.025],[9,0.02],[10,0.018]];
  for (const [p, c] of table) if (pos <= p + 0.5) return c;
  return 0.012;
}
async function main() {
  loadEnv();
  const { fetchGSCPageData } = await import("../src/lib/services/gsc-service");
  const { prisma } = await import("../src/lib/db/prisma");
  const pages = await fetchGSCPageData(28);
  const rows = await prisma.comparison.findMany({ where: { status: "published" }, select: { slug: true, title: true, metaTitle: true } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const cand = pages
    .filter((p) => /\/compare\//.test(p.page))
    .map((p) => {
      const slug = decodeURIComponent(p.page.split("/compare/")[1] || "").replace(/\/$/, "");
      const db = bySlug.get(slug);
      return { slug, impressions: p.impressions, clicks: p.clicks, ctr: p.ctr, position: p.position, title: db?.metaTitle || db?.title || "", live: !!db };
    })
    .filter((p) => p.live && p.impressions >= 15 && p.position <= 15)
    .map((p) => ({ ...p, gap: expectedCtr(p.position) - p.ctr }))
    .filter((p) => p.gap > 0.01) // materially under-performing
    .sort((a, b) => (b.gap * b.impressions) - (a.gap * a.impressions)); // lost-clicks weighted
  console.log(`CTR-recovery candidates (live, impr>=15, pos<=15, under expected): ${cand.length}\n`);
  console.log("impr clk ctr% pos  expCTR%  lostClk  slug | title");
  for (const c of cand.slice(0, 30)) {
    const lost = (c.gap * c.impressions).toFixed(1);
    console.log(`${String(c.impressions).padStart(4)} ${String(c.clicks).padStart(3)} ${(c.ctr*100).toFixed(1).padStart(4)} ${c.position.toFixed(1).padStart(4)} ${(expectedCtr(c.position)*100).toFixed(1).padStart(6)}  ${lost.padStart(6)}   ${c.slug}  |  ${c.title}`);
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

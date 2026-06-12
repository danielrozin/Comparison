import { readFileSync, writeFileSync } from "fs";
const data = JSON.parse(readFileSync(new URL("./data/dan1026-rankings.json", import.meta.url)));

const norm = (u) => u.replace("https://www.aversusb.net", "").replace("https://aversusb.net", "").split("?")[0];
const pages = {};
for (const d of data) {
  const p = norm(d.url);
  if (!pages[p]) pages[p] = { path: p, kws: [], bestPos: 99, strikingVol: 0, totalVol: 0 };
  pages[p].kws.push(d);
  pages[p].totalVol += d.volume;
  pages[p].bestPos = Math.min(pages[p].bestPos, d.position);
  if (d.position >= 11 && d.position <= 30) pages[p].strikingVol += d.volume;
}

// Pages with striking-distance keywords (best position 11-30), ranked by striking volume
const striking = Object.values(pages)
  .filter((p) => p.strikingVol > 0 && p.bestPos >= 11 && p.bestPos <= 30)
  .sort((a, b) => b.strikingVol - a.strikingVol);

console.log("=== PAGE-LEVEL PRIORITY (best pos 11-30, by striking-distance volume) ===\n");
let i = 0;
for (const p of striking.slice(0, 25)) {
  i++;
  const kwCount = p.kws.filter((k) => k.position >= 11 && k.position <= 30).length;
  console.log(`${String(i).padStart(2)}. [${p.path}]`);
  console.log(`    bestPos=${p.bestPos}  strikingVol=${p.strikingVol}  totalVol=${p.totalVol}  #strikingKws=${kwCount}`);
  const top = p.kws.filter((k) => k.position >= 11 && k.position <= 30).sort((a, b) => b.volume - a.volume).slice(0, 4);
  for (const k of top) console.log(`       vol=${String(k.volume).padStart(5)} pos=${String(k.position).padStart(2)} kd=${k.difficulty ?? "-"}  "${k.keyword}"`);
}

// pos 11-20 — closest to page 1
console.log("\n\n=== CLOSEST TO PAGE 1 (any kw at pos 11-20) ===\n");
const close = data.filter((d) => d.position >= 11 && d.position <= 20).sort((a, b) => b.volume - a.volume);
for (const d of close) console.log(`  vol=${String(d.volume).padStart(5)} pos=${String(d.position).padStart(2)} kd=${d.difficulty ?? "-"}  "${d.keyword}"  -> ${norm(d.url)}`);

writeFileSync(new URL("./data/dan1026-page-priority.json", import.meta.url).pathname, JSON.stringify(striking, null, 2));
console.log(`\n\nTotal pages with striking-distance kws: ${striking.length}`);

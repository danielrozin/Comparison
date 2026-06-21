import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();

// New optimized intro first-sentences (prepended; existing copy retained as supporting detail)
const INTROS = {
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026":
    "PS5 Pro vs Xbox Series X — frame rate (FPS) and specs compared: the PS5 Pro's 2× GPU and AI upscaling vs the Xbox Series X's 12 TFLOPS, and which console actually hits higher FPS in real games.",
  "bloomberg-vs-the-wall-street-journal":
    "Bloomberg vs WSJ (The Wall Street Journal) in 2026: which is better for investors — terminal-grade data vs newspaper depth, and what each subscription costs.",
  "paramount-vs-peacock":
    "Peacock vs Paramount+ (Paramount Plus) in 2026: here's the head-to-head on live sports, movie libraries, and price to settle which streaming service wins.",
  "bose-vs-jbl":
    "JBL versus Bose in 2026: a head-to-head on sound quality, noise cancellation, build, and price to find which audio brand fits you best.",
};
const TITLE_EDITS = { // H1 (title field) changes
  "bloomberg-vs-the-wall-street-journal": "Bloomberg vs WSJ (The Wall Street Journal)",
};
const META_EDITS = { // metaTitle changes
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026": "PS5 Pro vs Xbox Series X: FPS, Specs & Price 2026",
};

const DRY = process.argv.includes("--dry");
for (const slug of Object.keys(INTROS)) {
  const c = await prisma.comparison.findUnique({ where:{slug}, select:{id:true,title:true,metaTitle:true,shortAnswer:true,status:true}});
  if (!c) { console.log("!! MISSING", slug); continue; }
  const data = {};
  // intro: prepend new sentence once (idempotent)
  const nf = INTROS[slug];
  const cur = c.shortAnswer || "";
  if (!cur.startsWith(nf)) data.shortAnswer = cur ? `${nf} ${cur}` : nf;
  if (TITLE_EDITS[slug] && c.title !== TITLE_EDITS[slug]) data.title = TITLE_EDITS[slug];
  if (META_EDITS[slug] && c.metaTitle !== META_EDITS[slug]) data.metaTitle = META_EDITS[slug];
  data.lastRefreshedAt = new Date();
  console.log("\n===", slug, `[${c.status}]`, "===");
  for (const k of ["title","metaTitle","shortAnswer"]) if (data[k]!==undefined) {
    console.log(`  ${k}:`);
    console.log(`    - was: ${JSON.stringify((c[k]||"").slice(0,90))}`);
    console.log(`    + new: ${JSON.stringify(String(data[k]).slice(0,90))}`);
  }
  if (Object.keys(data).length<=1) { console.log("  (no content change — already applied)"); }
  if (!DRY) { await prisma.comparison.update({ where:{id:c.id}, data }); console.log("  >> WRITTEN"); }
}
await prisma.$disconnect();
console.log(DRY ? "\nDRY RUN — no writes" : "\nDONE");

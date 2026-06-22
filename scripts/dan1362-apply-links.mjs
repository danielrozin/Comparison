import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const cp = s => `/compare/${s}`;
const TARGET = "/compare/bloomberg-vs-the-wall-street-journal";

// Exact-anchor inbound links from each new finance-media source page.
// Varied exact-match anchors per page (anchor-text policy), score 1.4 (>= 1.3).
const PLAN = [
  ["bloomberg-vs-cnbc", "Bloomberg vs The Wall Street Journal"],
  ["bloomberg-vs-financial-times", "Bloomberg vs WSJ"],
  ["wall-street-journal-vs-financial-times", "Wall Street Journal vs Bloomberg"],
  ["bloomberg-vs-marketwatch", "Bloomberg vs the Wall Street Journal"],
];

let created = 0, skipped = 0;
for (const [src, anchor] of PLAN) {
  const fromPath = cp(src);
  if (fromPath === TARGET) { console.log(`self-skip ${src}`); continue; }
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath: TARGET } });
  if (exists) { console.log(`exists  ${fromPath}`); skipped++; continue; }
  console.log(`+ ${fromPath}  "${anchor}"`);
  if (!DRY) await prisma.internalLink.create({ data: { fromPath, toPath: TARGET, anchorText: anchor, linkType: "related", position: "inline", score: 1.4 } });
  created++;
}
console.log(`\n${DRY ? "DRY " : ""}created=${created} skipped=${skipped}`);
const total = await prisma.internalLink.count({ where: { toPath: TARGET } });
console.log(`total inbound to target now: ${total}`);
await prisma.$disconnect();

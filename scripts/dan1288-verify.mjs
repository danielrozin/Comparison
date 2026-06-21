import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
for (const s of ["ps5-pro-vs-xbox-series-x-performance-comparison-2026","bloomberg-vs-the-wall-street-journal","paramount-vs-peacock","bose-vs-jbl"]) {
  const c = await prisma.comparison.findUnique({where:{slug:s},select:{title:true,metaTitle:true,shortAnswer:true}});
  console.log(`\n[${s}]`);
  console.log("  H1   :", c.title);
  console.log("  meta :", c.metaTitle);
  console.log("  intro:", c.shortAnswer.slice(0,110));
}
const b = await prisma.blogArticle.findUnique({where:{slug:"mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider"},select:{content:true}});
console.log("\n[blog] Audi section present:", /^## Audi Competitors: Best Luxury Car Alternatives in 2026/m.test(b.content));
for (const t of ["/compare/paramount-vs-peacock","/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026","/compare/bloomberg-vs-the-wall-street-journal","/compare/bose-vs-jbl"]) {
  const n = await prisma.internalLink.count({where:{toPath:t}});
  const ex = await prisma.internalLink.count({where:{toPath:t, anchorText:{contains:t.includes("bose")?"jbl versus bose":t.includes("peacock")?"peacock versus paramount":t.includes("ps5")?"ps5 pro vs xbox":"bloomberg vs wsj"}}});
  console.log(`  inbound ${t}: ${n} total, ${ex} exact-anchor`);
}
await prisma.$disconnect();

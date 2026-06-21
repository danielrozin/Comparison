import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const SLUG = "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider";
const SECTION = `## Audi Competitors: Best Luxury Car Alternatives in 2026

Audi's main competitors in the 2026 luxury car market are Mercedes-Benz, BMW, Genesis, Lexus, and Volvo. If you're cross-shopping Audi competitors among luxury cars in 2026, BMW is the closest performance rival, Genesis offers the best value, and Lexus leads on reliability. The segment-by-segment table above maps each Audi alternative to its direct match.`;
const DRY = process.argv.includes("--dry");
const b = await prisma.blogArticle.findUnique({ where:{slug:SLUG}, select:{id:true,content:true}});
if (/^## Audi Competitors:/m.test(b.content)) { console.log("Already present — skip."); }
else {
  const marker = "## Key Factors to Consider";
  const idx = b.content.indexOf(marker);
  if (idx < 0) throw new Error("insertion marker not found");
  const next = b.content.slice(0, idx) + SECTION + "\n\n" + b.content.slice(idx);
  console.log("Inserting", SECTION.length, "chars before:", marker);
  console.log("new len:", next.length, "(was", b.content.length + ")");
  if (!DRY) { await prisma.blogArticle.update({ where:{id:b.id}, data:{ content: next, updatedAt: new Date() }}); console.log(">> WRITTEN"); }
}
await prisma.$disconnect();

import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();
const top = await prisma.comparison.findMany({ where:{status:"published"}, orderBy:{viewCount:"desc"}, take:20, select:{slug:true,title:true,category:true,viewCount:true} });
console.log("Top 20 by viewCount:");
for (const c of top) console.log(`  ${c.viewCount}\t${c.category}\t${c.slug}`);
// category counts for our 3 targets' categories
for (const cat of [null,"finance","products","brands","technology","companies","home"]) {
  const n = await prisma.comparison.count({ where:{status:"published", category:cat} });
  console.log(`category ${cat}: ${n}`);
}
// targets' categories
const t = await prisma.comparison.findMany({ where:{slug:{in:["capital-one-vs-chase","ikea-vs-wayfair","amazon-vs-best-buy"]}}, select:{slug:true,category:true} });
console.log("targets:", t);
await prisma.$disconnect();

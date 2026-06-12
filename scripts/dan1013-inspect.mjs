import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();
const targets = ["amazon-vs-best-buy","capital-one-vs-chase","ikea-vs-wayfair"];
for (const slug of targets) {
  const c = await prisma.comparison.findFirst({ where: { slug }, select: { slug:true, title:true, category:true, status:true, viewCount:true } });
  console.log(JSON.stringify(c));
}
const home = await prisma.internalLink.findMany({ where: { OR:[{fromPath:"/"},{fromPath:{startsWith:"/category/"}}] }, select:{fromPath:true,toPath:true,anchorText:true} });
console.log("homepage/category internalLinks:", home.length, JSON.stringify(home));
await prisma.$disconnect();

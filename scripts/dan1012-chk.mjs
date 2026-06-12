import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();
for (const slug of ["capital-one-vs-chase","ikea-vs-wayfair","amazon-vs-best-buy"]) {
  const c = await prisma.comparison.findUnique({ where:{slug}, select:{schemaMarkup:true, faqs:{select:{id:true,sortOrder:true}}} });
  console.log(slug, "schemaMarkup:", c.schemaMarkup? "SET("+JSON.stringify(c.schemaMarkup).length+" bytes)":"null", "faqCount:", c.faqs.length);
}
await prisma.$disconnect();

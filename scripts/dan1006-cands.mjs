import * as dotenv from "dotenv";
import { createRequire } from "module";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });
const require = createRequire(import.meta.url);
const { PrismaClient } = require("/Users/danielrozin/Comparison/node_modules/@prisma/client");
const prisma = new PrismaClient();
const sets = {
  "amazon-vs-best-buy (retail/electronics)": ["amazon","walmart","target","costco","ebay","newegg","best-buy","aliexpress","temu","etsy","shein","prime","ps5","xbox","iphone","macbook","samsung","nvidia","amd","laptop","tv-"],
  "capital-one-vs-chase (finance)": ["chase","capital-one","amex","american-express","citi","wells-fargo","bank-of-america","discover","paypal","venmo","cash-app","credit-card","visa","mastercard","robinhood","sofi","bitcoin","ethereum"],
  "ikea-vs-wayfair (furniture/home)": ["ikea","wayfair","furniture","mattress","sofa","west-elm","home-depot","lowes","target","walmart","ashley","crate","pottery","casper","purple","tempur","article-vs","overstock"],
};
for (const [label, terms] of Object.entries(sets)) {
  const ors = terms.map(t=>({slug:{contains:t}}));
  const rows = await prisma.comparison.findMany({ where:{status:"published", OR:ors}, orderBy:{viewCount:"desc"}, take:14, select:{slug:true,viewCount:true,category:true} });
  console.log(`\n## ${label} — ${rows.length} candidates`);
  for (const r of rows) console.log(`  ${r.viewCount}\t${r.category}\t${r.slug}`);
}
await prisma.$disconnect();

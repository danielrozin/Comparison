import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv"; import path from "path"; import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const srcs = ["/compare/jbl-vs-marshall","/compare/bose-vs-sonos","/compare/bose-quietcomfort-vs-sony-wh-1000xm5"];
for (const fromPath of srcs) {
  const r = await prisma.internalLink.updateMany({ where:{ fromPath, toPath:"/compare/bose-vs-jbl" }, data:{ anchorText:"jbl versus bose", score:1.4 }});
  console.log(`  updated ${r.count}  ${fromPath} -> "jbl versus bose"`);
}
await prisma.$disconnect();

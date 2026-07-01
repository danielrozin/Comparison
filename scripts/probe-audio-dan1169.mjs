import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const audio = await p.comparison.findMany({ where: { status:"published", OR:[{slug:{contains:"bose"}},{slug:{contains:"jbl"}},{slug:{contains:"sony"}},{slug:{contains:"sonos"}},{slug:{contains:"airpods"}},{slug:{contains:"headphone"}},{slug:{contains:"speaker"}},{category:"electronics"}] }, select:{slug:true,viewCount:true,category:true}, orderBy:{viewCount:"desc"}, take:25 });
console.log("audio/electronics pages by views:");
audio.forEach(c=>console.log(`  v=${c.viewCount} [${c.category}] /${c.slug}`));
// existing inbound links to bose-vs-jbl
const inbound = await p.internalLink.findMany({ where: { toPath: "/compare/bose-vs-jbl" }, select:{fromPath:true,score:true} });
console.log("existing inbound InternalLink -> bose-vs-jbl:", inbound.length); inbound.forEach(l=>console.log("   from",l.fromPath,"score",l.score));
await p.$disconnect();

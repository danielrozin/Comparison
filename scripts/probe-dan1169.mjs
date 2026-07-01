import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

// Target comparison pages from the issue
const targetSlugs = [
  "bose-vs-jbl", "youtube-music-vs-amazon-music",
  "bloomberg-vs-the-wall-street-journal", "chick-fil-a-vs-popeyes",
];
console.log("=== TARGET COMPARISONS ===");
for (const s of targetSlugs) {
  const c = await p.comparison.findUnique({ where: { slug: s }, select: { slug:true, title:true, metaTitle:true, metaDescription:true, status:true } }).catch(e=>"ERR");
  console.log(c ? `[${c.status}] /${c.slug}\n   T: ${c.title}\n   MT: ${c.metaTitle}\n   MD: ${c.metaDescription}` : `MISSING: ${s}`);
}
// ps5 pro vs xbox
const ps5 = await p.comparison.findMany({ where: { slug: { contains: "ps5-pro" } }, select:{slug:true,status:true,metaTitle:true} });
console.log("=== ps5-pro comps ==="); ps5.forEach(c=>console.log(`[${c.status}] /${c.slug} :: ${c.metaTitle}`));

// Audi cluster — search blog by content/title broadly
const audiBlog = await p.blogArticle.findMany({
  where: { status: "published", OR: [
    { content: { contains: "Audi competitors", mode:"insensitive" } },
    { title: { contains: "luxury", mode:"insensitive" } },
    { slug: { contains: "luxury" } },
    { slug: { contains: "competitors" } },
  ] },
  select: { slug:true, title:true, viewCount:true },
}).catch(e=>"ERR:"+e);
console.log("=== AUDI/LUXURY BLOG CANDIDATES ===");
if(Array.isArray(audiBlog)) audiBlog.forEach(a=>console.log(`views=${a.viewCount} /${a.slug} :: ${a.title}`)); else console.log(audiBlog);

// Cleveland browns entity
const ent = await p.entity.findMany({ where: { OR:[{slug:{contains:"cleveland-browns"}},{slug:{contains:"browns"}}] }, select:{slug:true,name:true,metaTitle:true,metaDescription:true} });
console.log("=== BROWNS ENTITY ==="); ent.forEach(e=>console.log(`/${e.slug} :: name=${e.name}\n  MT:${e.metaTitle}\n  MD:${e.metaDescription}`));
await p.$disconnect();

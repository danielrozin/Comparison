import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
// All car-brand alternatives/competitors blog posts
const cluster = await p.blogArticle.findMany({
  where: { OR: [
    { slug: { contains: "alternatives" } },
    { slug: { contains: "competitors" } },
    { title: { contains: "alternatives", mode:"insensitive" } },
    { title: { contains: "competitors", mode:"insensitive" } },
  ] },
  select: { slug:true, title:true, status:true, viewCount:true },
  orderBy: [{ status:"asc" },{ slug:"asc" }],
});
console.log("=== ALTERNATIVES/COMPETITORS CLUSTER (n="+cluster.length+") ===");
cluster.forEach(a=>console.log(`[${a.status}] v=${a.viewCount} /${a.slug}`));
// ps5-pro both pages content length
const ps5 = await p.comparison.findMany({ where: { slug: { in: ["xbox-series-x-vs-ps5-pro","ps5-pro-vs-xbox-series-x-performance-comparison-2026"] } }, select:{slug:true,status:true,shortAnswer:true,viewCount:true,createdAt:true} });
console.log("\n=== PS5-PRO PAGES ===");
ps5.forEach(c=>console.log(`[${c.status}] v=${c.viewCount} created=${c.createdAt?.toISOString?.().slice(0,10)} /${c.slug}\n   shortAnswer len=${(c.shortAnswer||"").length}`));
await p.$disconnect();

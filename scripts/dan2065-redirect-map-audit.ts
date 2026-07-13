import * as dotenv from "dotenv"; dotenv.config({ path: ".env.prod.tmp", quiet: true });
import { PrismaClient } from "@prisma/client";
import { ORDERING_CONSOLIDATIONS } from "../src/lib/redirects/compare-ordering-redirects.generated";
const p = new PrismaClient();
(async () => {
  const entries = Object.entries(ORDERING_CONSOLIDATIONS as Record<string,string>);
  const slugs = [...new Set(entries.flat())];
  const rows = await p.comparison.findMany({ where: { slug: { in: slugs } }, select: { slug: true, status: true } });
  const st = new Map(rows.map(r => [r.slug, r.status]));
  const s = (x: string) => st.get(x) ?? "NOT-IN-DB";

  const brokenTarget = entries.filter(([, t]) => s(t) !== "published");
  const invertible  = brokenTarget.filter(([src]) => s(src) === "published");
  const bothDead    = brokenTarget.filter(([src]) => s(src) !== "published");

  console.log(`total entries:                 ${entries.length}`);
  console.log(`target published (healthy):    ${entries.length - brokenTarget.length}`);
  console.log(`target NOT published (broken): ${brokenTarget.length}`);
  console.log(`  -> source IS published (redirect is INVERTED, sends a live page to a 404): ${invertible.length}`);
  console.log(`  -> neither published (redirect points 404 -> 404):                          ${bothDead.length}`);
  console.log("\n--- inverted (live page redirected into a 404) ---");
  invertible.forEach(([src,t]) => console.log(`  ${src} [${s(src)}] -> ${t} [${s(t)}]`));
  console.log("\n--- both dead (sample 10) ---");
  bothDead.slice(0,10).forEach(([src,t]) => console.log(`  ${src} [${s(src)}] -> ${t} [${s(t)}]`));
  await p.$disconnect();
})();

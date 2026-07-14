import * as dotenv from "dotenv"; dotenv.config({ path: ".env.prod.tmp", quiet: true });
import { PrismaClient } from "@prisma/client";
import { COMPARE_REDIRECTS } from "../src/lib/redirects/compare-redirects";
const p = new PrismaClient();
(async () => {
  const entries = COMPARE_REDIRECTS.map(r => [r.source.replace("/compare/",""), r.destination.replace("/compare/","")] as const);
  const slugs = [...new Set(entries.flat())];
  const rows = await p.comparison.findMany({ where: { slug: { in: slugs } }, select: { slug: true, status: true } });
  const st = new Map(rows.map(r => [r.slug, r.status]));
  const s = (x: string) => st.get(x) ?? "NOT-IN-DB";

  // The only fatal class: a PUBLISHED page that is redirected away (its traffic dies).
  const livePageRedirected = entries.filter(([src]) => s(src) === "published");
  console.log(`total edge redirects (all layers): ${entries.length}`);
  console.log(`PUBLISHED pages being redirected away (BUG): ${livePageRedirected.length}`);
  livePageRedirected.forEach(([src,t]) => console.log(`  ${src} [published] -> ${t} [${s(t)}]`));
  await p.$disconnect();
})();

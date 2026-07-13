import * as dotenv from "dotenv"; dotenv.config({ path: ".env.prod.tmp", quiet: true });
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const CONC = 12;
(async () => {
  const rows = await p.comparison.findMany({ where: { status: "published" }, select: { slug: true } });
  const slugs = rows.map(r => r.slug);
  console.log(`sweeping all ${slugs.length} published comparisons...`);
  const bad: string[] = [];
  let done = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (slugs.length) {
      const s = slugs.pop()!;
      try {
        const res = await fetch(`https://www.aversusb.net/compare/${s}`, { redirect: "follow" });
        if (res.status !== 200) bad.push(`${res.status}  ${s}`);
      } catch { bad.push(`ERR  ${s}`); }
      done++;
    }
  }));
  console.log(`checked: ${done}`);
  console.log(`NOT 200: ${bad.length}`);
  bad.forEach(b => console.log("  " + b));
  await p.$disconnect();
})();

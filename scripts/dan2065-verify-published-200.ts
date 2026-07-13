import * as dotenv from "dotenv"; dotenv.config({ path: ".env.prod.tmp", quiet: true });
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  const rows = await p.comparison.findMany({ where: { status: "published" }, select: { slug: true } });
  console.log("published rows:", rows.length);
  const sample = rows.map(r => r.slug).sort(() => 0.5 - Math.random()).slice(0, 40);
  let bad = 0;
  for (const s of sample) {
    const res = await fetch(`https://www.aversusb.net/compare/${s}`, { redirect: "follow" });
    if (res.status !== 200) { console.log(`  NOT 200: ${res.status}  ${s}`); bad++; }
  }
  console.log(`sampled ${sample.length} published pages, non-200: ${bad}`);
  await p.$disconnect();
})();

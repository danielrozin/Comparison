/**
 * DAN-2078 — how many consolidations does the loop guard silently DROP?
 *
 * The guard in compare-redirects.ts drops any source that is also a survivor. That is
 * correct for a self-loop, but for a CHAIN (a -> b, b -> c) it drops `b -> c` and
 * leaves `a -> b` pointing at a page we decided to retire. Measure before changing it.
 */
import { ORDERING_CONSOLIDATIONS } from "../src/lib/redirects/compare-ordering-redirects.generated";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "../src/lib/redirects/compare-ordering-redirects.dan1800.generated";
import { RIVALRY_CONSOLIDATIONS_DAN2078 } from "../src/lib/redirects/compare-rivalry-redirects.dan2078.generated";

const merged: Record<string, string> = {
  ...ORDERING_CONSOLIDATIONS,
  ...ORDERING_CONSOLIDATIONS_DAN1800,
  ...RIVALRY_CONSOLIDATIONS_DAN2078,
};

const survivors = new Set(Object.values(merged));
const dropped = Object.entries(merged).filter(([from]) => survivors.has(from));

console.log(`total entries: ${Object.keys(merged).length}`);
console.log(`dropped by guard (source is also a survivor): ${dropped.length}\n`);
for (const [from, to] of dropped) {
  // Who points AT the dropped source? Those are the redirects left dangling.
  const inbound = Object.entries(merged).filter(([, dest]) => dest === from);
  console.log(`  DROPPED ${from} -> ${to}`);
  for (const [src] of inbound) console.log(`     ...but ${src} -> ${from} still 308s into it`);
}

/** DAN-2037 — regenerate the studies-service baked-in snapshots from live prod data. */
import { getMostComparedStudy, getB2BSaaSStudy, getFinanceStudy } from "@/lib/services/studies-service";

async function main() {
  const [brands, saas, fin] = await Promise.all([
    getMostComparedStudy(),
    getB2BSaaSStudy(),
    getFinanceStudy(),
  ]);
  for (const [n, s] of [["brands", brands], ["saas", saas], ["finance", fin]] as const) {
    if ((s as { fromSnapshot: boolean }).fromSnapshot) throw new Error(`${n} came from SNAPSHOT — live query failed`);
  }
  console.log(JSON.stringify({ brands, saas, finance: fin }, null, 2));
}
main();

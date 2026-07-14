/**
 * DAN-2068 — runs the real getB2BSaaSStudy() against prod and prints every claim
 * the page will render, plus assertions for each acceptance criterion.
 */
import { getB2BSaaSStudy } from "../src/lib/services/studies-service";

async function main() {
  const s = await getB2BSaaSStudy();
  console.log(`fromSnapshot=${s.fromSnapshot}  corpus=${s.totalSaaSComparisons} pages  distinctTools=${s.distinctTools}\n`);

  console.log("LEADERBOARD:");
  for (const t of s.topTools) console.log(`  #${t.rank}  ${t.name} — ${t.count} distinct rivals`);

  console.log("\nCLUSTERS:");
  for (const c of s.clusters) console.log(`  ${c.label}: ${c.count}  (top: ${c.topMatchup?.slug ?? "—"})`);
  console.log(`  coverage: shown=${s.clusterCoverage.shown} clustered=${s.clusterCoverage.clustered} total=${s.clusterCoverage.total}`);

  console.log("\nCHALLENGERS:");
  for (const c of s.challengers) {
    console.log(`  ${c.category}: ${c.challenger} ${c.challengerCount} vs ${c.incumbent} ${c.incumbentCount} -> ${c.outpacing ? "OUT-PACING" : "LEVEL"}`);
  }

  const fail: string[] = [];
  const zero = s.challengers.find((c) => c.challengerCount === 0 || c.incumbentCount === 0);
  if (zero) fail.push(`a challenger row publishes a 0: ${zero.challenger}/${zero.incumbent}`);
  for (const c of s.challengers) {
    if (c.outpacing && c.challengerCount <= c.incumbentCount) fail.push(`${c.challenger}: outpacing flag on a non-lead`);
    if (!c.outpacing && c.challengerCount > c.incumbentCount) fail.push(`${c.challenger}: lead not flagged`);
  }
  const hs = s.challengers.find((c) => c.challenger === "HubSpot");
  if (!hs || hs.challengerCount !== 4 || hs.incumbentCount !== 1)
    fail.push(`HubSpot/Salesforce must be 4 vs 1 (BD outreach copy), got ${hs?.challengerCount} vs ${hs?.incumbentCount}`);
  const zoho = s.challengers.find((c) => c.incumbent === "Zoho CRM");
  if (!zoho || zoho.incumbentCount < 1) fail.push("Zoho CRM must be >= 1");
  for (const bad of ["firefox", "mysql", "brave", "postgresql", "google-chrome"]) {
    if (s.topTools.some((t) => t.slug === bad)) fail.push(`${bad} still on the B2B SaaS leaderboard`);
  }
  if (s.clusterCoverage.shown === s.clusterCoverage.total)
    console.log("\n  (bars happen to sum to the headline — label still required)");

  console.log(fail.length ? `\n❌ FAIL:\n - ${fail.join("\n - ")}` : "\n✅ all DAN-2068 acceptance checks pass");
  process.exit(fail.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

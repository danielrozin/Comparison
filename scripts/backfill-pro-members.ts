/**
 * Backfill Pro members from completed AversusB Checkout sessions.
 *
 * Dry-run (no database writes) is the default:
 *   npx tsx scripts/backfill-pro-members.ts
 *
 * Write the rows after the dry-run looks right:
 *   npx tsx scripts/backfill-pro-members.ts --apply
 *
 * Requires DATABASE_URL, STRIPE_SECRET_KEY, and the Pro price env vars
 * STRIPE_PRICE_PRO_YEARLY / STRIPE_PRICE_PRO_MONTHLY. Stripe is read-only.
 */
import { backfillProMembers } from "../src/lib/monetization/backfill-pro-members";

async function main() {
  const apply = process.argv.includes("--apply");
  const result = await backfillProMembers({ dryRun: !apply });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

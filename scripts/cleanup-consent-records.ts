/**
 * GDPR retention cleanup: deletes ConsentRecord rows older than 3 years.
 * Intended cadence: monthly (e.g. Vercel Cron on the 1st of each month).
 *
 * Run manually: npm run cleanup:consent
 */
import { getPrisma } from "../src/lib/db/prisma";
import { purgeExpiredConsentRecords, retentionCutoff } from "../src/lib/consent-retention";

async function main() {
  const prisma = getPrisma();
  if (!prisma) {
    console.error("[consent-retention] DATABASE_URL is not configured; aborting cleanup.");
    process.exit(1);
  }

  const cutoff = retentionCutoff();
  console.log(`[consent-retention] Deleting ConsentRecord rows with grantedAt < ${cutoff.toISOString()}`);

  const { deletedCount } = await purgeExpiredConsentRecords(prisma);

  console.log(`[consent-retention] Deleted ${deletedCount} expired consent records`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("[consent-retention] Failed:", error);
  process.exit(1);
});

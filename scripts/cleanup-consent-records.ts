/**
 * GDPR retention cleanup for `consent_records`.
 * Deletes rows where granted_at < now() - 3 years (no active legal hold).
 *
 * Suggested cadence: monthly (e.g. `0 3 1 * *` UTC via Vercel Cron).
 *
 * Run manually:  npm run cleanup:consent
 */
import { getPrisma } from "../src/lib/db/prisma";
import {
  purgeExpiredConsentRecords,
  retentionCutoff,
} from "../src/lib/consent-retention";

async function main() {
  const prisma = getPrisma();
  if (!prisma) {
    console.error("[consent-retention] DATABASE_URL not configured — aborting");
    process.exit(1);
  }

  const cutoff = retentionCutoff();
  console.log(
    `[consent-retention] Deleting consent_records with granted_at < ${cutoff.toISOString()}`
  );

  const { deletedCount } = await purgeExpiredConsentRecords(prisma);
  console.log(`[consent-retention] Deleted ${deletedCount} expired consent records`);

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error("[consent-retention] Failed:", error);
  const prisma = getPrisma();
  if (prisma) await prisma.$disconnect();
  process.exit(1);
});

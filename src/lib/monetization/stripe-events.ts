import { getPrisma } from "@/lib/db/prisma";
import { isUniqueConstraintError, MembershipStoreError } from "@/lib/monetization/prisma-errors";

/**
 * Claim a Stripe event id in Postgres.
 *
 * Call this only after the membership write for the event has succeeded
 * (or there was nothing to write). A unique conflict means Stripe retried
 * an event we already finished, so the caller must skip emails.
 * If this insert fails for any other reason, the caller should return 500
 * without having sent mail — the membership upsert itself is idempotent.
 */
export async function claimStripeEvent(
  eventId: string,
  type: string
): Promise<"new" | "duplicate"> {
  const prisma = getPrisma();
  if (!prisma) throw new MembershipStoreError();

  try {
    await prisma.processedStripeEvent.create({
      data: { id: eventId, type },
    });
    return "new";
  } catch (err) {
    if (isUniqueConstraintError(err)) return "duplicate";
    throw err;
  }
}

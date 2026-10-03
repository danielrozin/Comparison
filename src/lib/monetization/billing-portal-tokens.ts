/**
 * One-time billing-portal tokens in Postgres.
 *
 * The email carries 32 random bytes (base64url). The table stores only
 * sha256(those bytes). Redeem is one UPDATE so two clicks cannot both win.
 * Issuing takes a transaction-scoped advisory lock on the address so a burst
 * cannot sneak past the 3-per-hour cap.
 */

import crypto from "node:crypto";
import { getPrisma } from "@/lib/db/prisma";

export const BILLING_PORTAL_LINK_TTL_MS = 15 * 60 * 1000;
export const BILLING_PORTAL_LINK_WINDOW_MS = 60 * 60 * 1000;
export const BILLING_PORTAL_LINK_LIMIT = 3;

export interface IssuedBillingToken {
  /** Raw token for the email. Never written to the database. */
  raw: string;
  email: string;
  stripeCustomerId: string;
}

export interface ConsumedBillingToken {
  email: string;
  stripeCustomerId: string;
}

export function hashBillingPortalTokenBytes(bytes: Buffer): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

/** 43-char base64url form of 32 bytes. Returns null when the link is garbage. */
export function decodeBillingPortalToken(raw: string): Buffer | null {
  if (!/^[A-Za-z0-9_-]{43}$/.test(raw)) return null;
  const bytes = Buffer.from(raw, "base64url");
  if (bytes.length !== 32) return null;
  return bytes;
}

export async function countRecentBillingLinks(email: string, now = new Date()): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("membership database unavailable");
  const since = new Date(now.getTime() - BILLING_PORTAL_LINK_WINDOW_MS);
  return prisma.billingPortalToken.count({
    where: { email, createdAt: { gte: since } },
  });
}

/**
 * Insert a link if this address has fewer than 3 in the last hour.
 * The count and the insert share one transaction, held behind an advisory
 * lock, so overlapping requests cannot all observe "2" and then all insert.
 * Returns null when the cap is already reached.
 */
export async function issueBillingPortalToken(
  email: string,
  stripeCustomerId: string,
  now = new Date()
): Promise<IssuedBillingToken | null> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("membership database unavailable");

  const bytes = crypto.randomBytes(32);
  const tokenHash = hashBillingPortalTokenBytes(bytes);
  const raw = bytes.toString("base64url");
  const since = new Date(now.getTime() - BILLING_PORTAL_LINK_WINDOW_MS);
  const expiresAt = new Date(now.getTime() + BILLING_PORTAL_LINK_TTL_MS);

  const inserted = await prisma.$transaction(async (tx) => {
    // Two-key lock so this does not collide with Prisma's migration lock.
    // Released automatically when the transaction commits or rolls back.
    // $executeRaw, not $queryRaw: pg_advisory_xact_lock returns void, and
    // Prisma 5.22 throws P2010 when $queryRaw tries to deserialize void
    // (prisma/prisma#3530).
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext('billing_portal_token'), hashtext(${email}))
    `;
    const recent = await tx.billingPortalToken.count({
      where: { email, createdAt: { gte: since } },
    });
    if (recent >= BILLING_PORTAL_LINK_LIMIT) return false;
    await tx.billingPortalToken.create({
      data: { tokenHash, email, stripeCustomerId, expiresAt },
    });
    return true;
  });

  if (!inserted) return null;
  return { raw, email, stripeCustomerId };
}

export async function deleteBillingPortalToken(raw: string): Promise<void> {
  const bytes = decodeBillingPortalToken(raw);
  if (!bytes) return;
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.billingPortalToken.delete({
    where: { tokenHash: hashBillingPortalTokenBytes(bytes) },
  }).catch(() => {
    // Already redeemed or missing. The send failure still returns the generic response.
  });
}

/**
 * Mark the token used only if it is unused and unexpired.
 * A second call returns null. This is the only redeem path.
 */
export async function consumeBillingPortalToken(raw: string): Promise<ConsumedBillingToken | null> {
  const bytes = decodeBillingPortalToken(raw);
  if (!bytes) return null;
  const prisma = getPrisma();
  if (!prisma) throw new Error("membership database unavailable");
  const tokenHash = hashBillingPortalTokenBytes(bytes);
  const rows = await prisma.$queryRaw<Array<{ email: string; stripe_customer_id: string }>>`
    UPDATE "billing_portal_tokens"
    SET "used_at" = NOW()
    WHERE "token_hash" = ${tokenHash}
      AND "used_at" IS NULL
      AND "expires_at" > NOW()
    RETURNING "email", "stripe_customer_id"
  `;
  const row = rows[0];
  if (!row?.email || !row.stripe_customer_id) return null;
  return { email: row.email, stripeCustomerId: row.stripe_customer_id };
}

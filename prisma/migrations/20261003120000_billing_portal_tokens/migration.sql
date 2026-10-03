-- Billing-portal magic links live in Postgres. Production does not configure
-- Redis (PR #300), so a token stored only in Redis can never be redeemed.
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Folder name stays 20261003120000_billing_portal_tokens. A database that
-- already applied an earlier copy of this migration will only warn about a
-- changed checksum; Prisma will not run this file a second time.

-- CreateTable
CREATE TABLE IF NOT EXISTS "billing_portal_tokens" (
    "token_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_portal_tokens_pkey" PRIMARY KEY ("token_hash")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "billing_portal_tokens_email_created_at_idx" ON "billing_portal_tokens"("email", "created_at");

-- One-off cleanup of the member row written with plan 'unknown'
-- (the old webhook fallback). Match Stripe ids only. Idempotent:
-- a second run deletes zero rows. Usage rows go first so the subquery
-- can still read the member address from pro_members.
DELETE FROM "pro_custom_compare_usage" WHERE "email" IN (SELECT "email" FROM "pro_members" WHERE "stripe_subscription_id"='sub_1ULovMRubzz9nfe2PEut6xMT' AND "stripe_customer_id"='cus_VMY115o51EqWxt' AND "plan"='unknown');
DELETE FROM "pro_members" WHERE "stripe_subscription_id"='sub_1ULovMRubzz9nfe2PEut6xMT' AND "stripe_customer_id"='cus_VMY115o51EqWxt' AND "plan"='unknown';

-- Keep processed_stripe_events.id = 'evt_1ULovPRubzz9nfe2IilWVH1q'.
-- That row is the webhook idempotency key. Deleting it would let a retry
-- of the foreign event write pro_members again.

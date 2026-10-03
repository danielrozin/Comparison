-- Billing-portal magic links live in Postgres. Production does not configure
-- Redis (PR #300), so a token stored only in Redis can never be redeemed.
-- Applied by `prisma migrate deploy` in scripts/vercel-build.mjs on Vercel
-- deploys and when RUN_MIGRATIONS=1.

-- CreateTable
CREATE TABLE "billing_portal_tokens" (
    "token_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_portal_tokens_pkey" PRIMARY KEY ("token_hash")
);

-- CreateIndex
CREATE INDEX "billing_portal_tokens_email_created_at_idx" ON "billing_portal_tokens"("email", "created_at");

-- One-off cleanup of the Scan2Remember customer inserted on 1 Oct 2026.
-- Idempotent: a second run deletes zero rows. Both predicates must match
-- before the member row goes away.
DELETE FROM "pro_custom_compare_usage"
WHERE "email" = 'fakiny@gmail.com';

DELETE FROM "pro_members"
WHERE "email" = 'fakiny@gmail.com'
  AND "stripe_subscription_id" = 'sub_1ULovMRubzz9nfe2PEut6xMT'
  AND "stripe_customer_id" = 'cus_VMY115o51EqWxt';

-- Keep processed_stripe_events.id = 'evt_1ULovPRubzz9nfe2IilWVH1q'.
-- That row is the webhook idempotency key. Deleting it would let a retry
-- of the foreign event write pro_members again.

-- Pro membership for consumer Stripe subscriptions.
-- Applied by `prisma migrate deploy` in scripts/vercel-build.mjs (Vercel
-- deploys and RUN_MIGRATIONS=1). This is separate from API-key billing.

-- CreateTable
CREATE TABLE "pro_members" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "plan" TEXT NOT NULL DEFAULT '',
    "interval" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "src" TEXT NOT NULL DEFAULT '',
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_stripe_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_stripe_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pro_custom_compare_usage" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "pair_keys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_custom_compare_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pro_members_email_key" ON "pro_members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pro_members_stripe_customer_id_key" ON "pro_members"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "pro_members_stripe_subscription_id_key" ON "pro_members"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "pro_members_status_idx" ON "pro_members"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pro_custom_compare_usage_email_month_key" ON "pro_custom_compare_usage"("email", "month");

-- CreateIndex
CREATE INDEX "pro_custom_compare_usage_email_month_idx" ON "pro_custom_compare_usage"("email", "month");

-- Add email capture & comparison alerts fields to newsletter_subscribers
-- Supports: category preferences, GDPR double opt-in, signed unsubscribe tokens

-- Add category preferences array
ALTER TABLE "newsletter_subscribers" ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add GDPR double opt-in fields
ALTER TABLE "newsletter_subscribers" ADD COLUMN "confirm_token" TEXT;
ALTER TABLE "newsletter_subscribers" ADD COLUMN "confirmed_at" TIMESTAMP(3);
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribe_token" TEXT;

-- Change default status from 'active' to 'pending' for new rows
-- Existing active subscribers remain active (they are grandfathered in)
ALTER TABLE "newsletter_subscribers" ALTER COLUMN "status" SET DEFAULT 'pending';

-- Unique indexes for token lookups
CREATE UNIQUE INDEX "newsletter_subscribers_confirm_token_key" ON "newsletter_subscribers"("confirm_token");
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribe_token_key" ON "newsletter_subscribers"("unsubscribe_token");

-- Performance indexes
CREATE INDEX "newsletter_subscribers_confirm_token_idx" ON "newsletter_subscribers"("confirm_token");
CREATE INDEX "newsletter_subscribers_unsubscribe_token_idx" ON "newsletter_subscribers"("unsubscribe_token");

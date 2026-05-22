-- CreateTable
CREATE TABLE "comparison_trackers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "comparison_slug" TEXT NOT NULL,
    "triggers" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confirmation_token" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "source" TEXT,
    "last_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparison_trackers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comparison_trackers_confirmation_token_key" ON "comparison_trackers"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_trackers_email_comparison_slug_key" ON "comparison_trackers"("email", "comparison_slug");

-- CreateIndex
CREATE INDEX "comparison_trackers_comparison_slug_idx" ON "comparison_trackers"("comparison_slug");

-- CreateIndex
CREATE INDEX "comparison_trackers_status_idx" ON "comparison_trackers"("status");

-- CreateIndex
CREATE INDEX "comparison_trackers_email_idx" ON "comparison_trackers"("email");

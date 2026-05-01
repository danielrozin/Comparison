-- CreateTable
CREATE TABLE "verdict_feedback" (
    "id" TEXT NOT NULL,
    "comparison_slug" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "reason" TEXT,
    "anon_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verdict_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verdict_feedback_comparison_slug_anon_id_key" ON "verdict_feedback"("comparison_slug", "anon_id");

-- CreateIndex
CREATE UNIQUE INDEX "verdict_feedback_comparison_slug_user_id_key" ON "verdict_feedback"("comparison_slug", "user_id");

-- CreateIndex
CREATE INDEX "verdict_feedback_comparison_slug_idx" ON "verdict_feedback"("comparison_slug");

-- CreateIndex
CREATE INDEX "verdict_feedback_vote_idx" ON "verdict_feedback"("vote");

-- CreateIndex
CREATE INDEX "verdict_feedback_created_at_idx" ON "verdict_feedback"("created_at");

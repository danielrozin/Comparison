-- DAN-596: Track every on-demand AI comparison generation attempt
-- so stuck slugs surface a real error UI instead of looping the
-- loading state, and so monitoring can detect attempts hung
-- in_progress past 2h.

CREATE TABLE "generation_attempts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "error_stage" TEXT,
    "error_message" TEXT,
    "duration_ms" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'user',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "generation_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "generation_attempts_slug_idx" ON "generation_attempts"("slug");
CREATE INDEX "generation_attempts_status_idx" ON "generation_attempts"("status");
CREATE INDEX "generation_attempts_started_at_idx" ON "generation_attempts"("started_at");

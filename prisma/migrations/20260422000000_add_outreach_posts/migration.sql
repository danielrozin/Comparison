-- CreateTable
CREATE TABLE "outreach_posts" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "question_url" TEXT NOT NULL,
    "question_title" TEXT NOT NULL,
    "subreddit" TEXT,
    "category" TEXT,
    "entity_a" TEXT,
    "entity_b" TEXT,
    "comparison_slug" TEXT NOT NULL,
    "comparison_url" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "posted_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "posted_at" TIMESTAMP(3),

    CONSTRAINT "outreach_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "outreach_posts_question_url_key" ON "outreach_posts"("question_url");

-- CreateIndex
CREATE INDEX "outreach_posts_status_idx" ON "outreach_posts"("status");

-- CreateIndex
CREATE INDEX "outreach_posts_platform_status_idx" ON "outreach_posts"("platform", "status");

-- CreateIndex
CREATE INDEX "outreach_posts_created_at_idx" ON "outreach_posts"("created_at");

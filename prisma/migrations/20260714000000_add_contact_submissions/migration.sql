-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "session_id" TEXT,
    "page_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions"("created_at");

-- CreateIndex
CREATE INDEX "contact_submissions_source_idx" ON "contact_submissions"("source");

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

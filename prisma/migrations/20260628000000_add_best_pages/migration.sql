-- CreateTable
CREATE TABLE "best_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "author_name" TEXT NOT NULL DEFAULT 'AversusB Editorial',
    "author_url" TEXT,
    "category" TEXT,
    "body_markdown" TEXT NOT NULL,
    "list_items" JSONB NOT NULL,
    "faqs" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "published_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "best_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "best_pages_slug_key" ON "best_pages"("slug");

-- CreateIndex
CREATE INDEX "best_pages_status_idx" ON "best_pages"("status");

-- CreateIndex
CREATE INDEX "best_pages_category_idx" ON "best_pages"("category");

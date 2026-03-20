-- CreateTable
CREATE TABLE "blog_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "meta_title" TEXT,
    "meta_description" TEXT,
    "source_query" TEXT,
    "source_impressions" INTEGER,
    "related_comparison_slugs" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_auto_generated" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_articles_slug_key" ON "blog_articles"("slug");

-- CreateIndex
CREATE INDEX "blog_articles_status_idx" ON "blog_articles"("status");

-- CreateIndex
CREATE INDEX "blog_articles_category_idx" ON "blog_articles"("category");

-- CreateIndex
CREATE INDEX "blog_articles_slug_idx" ON "blog_articles"("slug");

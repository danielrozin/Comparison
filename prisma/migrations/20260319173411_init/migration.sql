-- CreateTable
CREATE TABLE "entity_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_desc" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "entity_type_id" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "meta_title" TEXT,
    "meta_description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "data_type" TEXT NOT NULL DEFAULT 'text',
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "entity_type_id" TEXT NOT NULL,
    "is_comparable" BOOLEAN NOT NULL DEFAULT true,
    "higher_is_better" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_values" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "value_text" TEXT,
    "value_number" DOUBLE PRECISION,
    "value_boolean" BOOLEAN,
    "value_date" TIMESTAMP(3),
    "value_json" JSONB,
    "source" TEXT,
    "confidence" DOUBLE PRECISION DEFAULT 1.0,
    "as_of_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_answer" TEXT,
    "key_differences" JSONB,
    "verdict" TEXT,
    "content" JSONB,
    "category" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "schema_markup" JSONB,
    "related_comparison_ids" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'draft',
    "content_score" DOUBLE PRECISION,
    "is_auto_generated" BOOLEAN NOT NULL DEFAULT false,
    "is_human_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "search_impressions" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "last_refreshed_at" TIMESTAMP(3),
    "next_refresh_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_entities" (
    "id" TEXT NOT NULL,
    "comparison_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "pros" TEXT[],
    "cons" TEXT[],
    "best_for" TEXT,

    CONSTRAINT "comparison_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "entity_id" TEXT,
    "comparison_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_opportunities" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "search_volume" INTEGER,
    "cpc" DOUBLE PRECISION,
    "competition" DOUBLE PRECISION,
    "difficulty" DOUBLE PRECISION,
    "intent" TEXT,
    "category" TEXT,
    "entity_type_slug" TEXT,
    "entity_a" TEXT,
    "entity_b" TEXT,
    "query_pattern" TEXT,
    "opportunity_score" DOUBLE PRECISION,
    "has_existing_page" BOOLEAN NOT NULL DEFAULT false,
    "existing_page_id" TEXT,
    "source" TEXT,
    "source_data" JSONB,
    "cluster_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'discovered',
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keyword_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_clusters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "pillar_keyword" TEXT,
    "total_volume" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keyword_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_domains" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "categories" TEXT[],
    "authority" DOUBLE PRECISION,
    "last_scanned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitor_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_pages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "title" TEXT,
    "h1" TEXT,
    "category" TEXT,
    "entity_types" TEXT[],
    "url_pattern" TEXT,
    "title_pattern" TEXT,
    "has_table" BOOLEAN NOT NULL DEFAULT false,
    "has_schema" BOOLEAN NOT NULL DEFAULT false,
    "has_faq" BOOLEAN NOT NULL DEFAULT false,
    "content_blocks" JSONB,
    "analysis" JSONB,
    "last_scanned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitor_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_briefs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "category" TEXT,
    "entity_type_slug" TEXT,
    "entity_a" TEXT,
    "entity_b" TEXT,
    "keyword_ids" TEXT[],
    "brief" JSONB,
    "template_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "assigned_to" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_briefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_jobs" (
    "id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "config" JSONB,
    "result" JSONB,
    "error" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internal_links" (
    "id" TEXT NOT NULL,
    "from_entity_id" TEXT,
    "to_entity_id" TEXT,
    "from_path" TEXT NOT NULL,
    "to_path" TEXT NOT NULL,
    "anchor_text" TEXT NOT NULL,
    "link_type" TEXT NOT NULL,
    "position" TEXT,
    "score" DOUBLE PRECISION DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_logs" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "performed_by" TEXT,
    "comparison_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "parent_id" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entity_types_slug_key" ON "entity_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "entities_slug_key" ON "entities"("slug");

-- CreateIndex
CREATE INDEX "entities_entity_type_id_idx" ON "entities"("entity_type_id");

-- CreateIndex
CREATE INDEX "entities_status_idx" ON "entities"("status");

-- CreateIndex
CREATE INDEX "entities_slug_idx" ON "entities"("slug");

-- CreateIndex
CREATE INDEX "attributes_entity_type_id_idx" ON "attributes"("entity_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "attributes_slug_entity_type_id_key" ON "attributes"("slug", "entity_type_id");

-- CreateIndex
CREATE INDEX "attribute_values_entity_id_idx" ON "attribute_values"("entity_id");

-- CreateIndex
CREATE INDEX "attribute_values_attribute_id_idx" ON "attribute_values"("attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_values_entity_id_attribute_id_key" ON "attribute_values"("entity_id", "attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "comparisons_slug_key" ON "comparisons"("slug");

-- CreateIndex
CREATE INDEX "comparisons_status_idx" ON "comparisons"("status");

-- CreateIndex
CREATE INDEX "comparisons_category_idx" ON "comparisons"("category");

-- CreateIndex
CREATE INDEX "comparisons_slug_idx" ON "comparisons"("slug");

-- CreateIndex
CREATE INDEX "comparisons_view_count_idx" ON "comparisons"("view_count");

-- CreateIndex
CREATE INDEX "comparison_entities_comparison_id_idx" ON "comparison_entities"("comparison_id");

-- CreateIndex
CREATE INDEX "comparison_entities_entity_id_idx" ON "comparison_entities"("entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_entities_comparison_id_entity_id_key" ON "comparison_entities"("comparison_id", "entity_id");

-- CreateIndex
CREATE INDEX "faqs_entity_id_idx" ON "faqs"("entity_id");

-- CreateIndex
CREATE INDEX "faqs_comparison_id_idx" ON "faqs"("comparison_id");

-- CreateIndex
CREATE INDEX "keyword_opportunities_status_idx" ON "keyword_opportunities"("status");

-- CreateIndex
CREATE INDEX "keyword_opportunities_opportunity_score_idx" ON "keyword_opportunities"("opportunity_score");

-- CreateIndex
CREATE INDEX "keyword_opportunities_category_idx" ON "keyword_opportunities"("category");

-- CreateIndex
CREATE INDEX "keyword_opportunities_query_pattern_idx" ON "keyword_opportunities"("query_pattern");

-- CreateIndex
CREATE UNIQUE INDEX "keyword_opportunities_keyword_key" ON "keyword_opportunities"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_domains_domain_key" ON "competitor_domains"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_pages_url_key" ON "competitor_pages"("url");

-- CreateIndex
CREATE INDEX "competitor_pages_domain_id_idx" ON "competitor_pages"("domain_id");

-- CreateIndex
CREATE INDEX "content_briefs_status_idx" ON "content_briefs"("status");

-- CreateIndex
CREATE INDEX "content_briefs_priority_idx" ON "content_briefs"("priority");

-- CreateIndex
CREATE INDEX "refresh_jobs_status_idx" ON "refresh_jobs"("status");

-- CreateIndex
CREATE INDEX "refresh_jobs_job_type_idx" ON "refresh_jobs"("job_type");

-- CreateIndex
CREATE INDEX "internal_links_from_path_idx" ON "internal_links"("from_path");

-- CreateIndex
CREATE INDEX "internal_links_to_path_idx" ON "internal_links"("to_path");

-- CreateIndex
CREATE INDEX "internal_links_link_type_idx" ON "internal_links"("link_type");

-- CreateIndex
CREATE INDEX "change_logs_entity_type_entity_id_idx" ON "change_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "change_logs_created_at_idx" ON "change_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- AddForeignKey
ALTER TABLE "entity_types" ADD CONSTRAINT "entity_types_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "entity_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "entity_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "entity_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_entities" ADD CONSTRAINT "comparison_entities_comparison_id_fkey" FOREIGN KEY ("comparison_id") REFERENCES "comparisons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_entities" ADD CONSTRAINT "comparison_entities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_comparison_id_fkey" FOREIGN KEY ("comparison_id") REFERENCES "comparisons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyword_opportunities" ADD CONSTRAINT "keyword_opportunities_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "keyword_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_pages" ADD CONSTRAINT "competitor_pages_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "competitor_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_links" ADD CONSTRAINT "internal_links_from_entity_id_fkey" FOREIGN KEY ("from_entity_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_links" ADD CONSTRAINT "internal_links_to_entity_id_fkey" FOREIGN KEY ("to_entity_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_logs" ADD CONSTRAINT "change_logs_comparison_id_fkey" FOREIGN KEY ("comparison_id") REFERENCES "comparisons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

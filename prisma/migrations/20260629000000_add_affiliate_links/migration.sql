-- CreateTable
CREATE TABLE "affiliate_links" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "last_validated_at" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'manual',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_clicks" (
    "id" TEXT NOT NULL,
    "affiliate_link_id" TEXT,
    "entity_id" TEXT NOT NULL,
    "comparison_slug" TEXT NOT NULL,
    "affiliate_network" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "source" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_links_entity_id_idx" ON "affiliate_links"("entity_id");

-- CreateIndex
CREATE INDEX "affiliate_links_is_active_idx" ON "affiliate_links"("is_active");

-- CreateIndex
CREATE INDEX "affiliate_links_expires_at_idx" ON "affiliate_links"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_links_entity_id_partner_key" ON "affiliate_links"("entity_id", "partner");

-- CreateIndex
CREATE INDEX "affiliate_clicks_entity_id_idx" ON "affiliate_clicks"("entity_id");

-- CreateIndex
CREATE INDEX "affiliate_clicks_comparison_slug_idx" ON "affiliate_clicks"("comparison_slug");

-- CreateIndex
CREATE INDEX "affiliate_clicks_created_at_idx" ON "affiliate_clicks"("created_at");

-- CreateIndex
CREATE INDEX "affiliate_clicks_affiliate_link_id_idx" ON "affiliate_clicks"("affiliate_link_id");

-- AddForeignKey
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_affiliate_link_id_fkey" FOREIGN KEY ("affiliate_link_id") REFERENCES "affiliate_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "consent_categories" JSONB NOT NULL,
    "ip_hash" TEXT,
    "policy_version" TEXT NOT NULL,
    "user_agent" TEXT,
    "geo_country" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consent_records_visitor_id_idx" ON "consent_records"("visitor_id");

-- CreateIndex
CREATE INDEX "consent_records_granted_at_idx" ON "consent_records"("granted_at");

-- CreateIndex
CREATE INDEX "consent_records_geo_country_idx" ON "consent_records"("geo_country");

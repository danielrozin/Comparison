-- Visitor-requested comparison generation rate limit.
-- Postgres, not Redis: production does not have Redis configured.
CREATE TABLE "user_generation_requests" (
    "id" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_generation_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_generation_requests_ip_hash_created_at_idx" ON "user_generation_requests"("ip_hash", "created_at");

CREATE INDEX "user_generation_requests_created_at_idx" ON "user_generation_requests"("created_at");

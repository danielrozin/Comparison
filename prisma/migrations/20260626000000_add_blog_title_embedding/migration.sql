-- DAN-520 gate #2: store a small-embedding vector of each blog title for
-- semantic near-duplicate detection. Default empty array = not yet backfilled.
ALTER TABLE "blog_articles"
  ADD COLUMN "title_embedding" DOUBLE PRECISION[] NOT NULL DEFAULT ARRAY[]::DOUBLE PRECISION[];

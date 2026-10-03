-- The visitor page canoe-vs-kayak reused the Kayak.com entity (`kayak`)
-- and rendered that site's travel metrics on a boat comparison. Delete
-- only that provisional auto-generated comparison so the next visit
-- regenerates it against a disambiguated entity.
--
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Guard: slug AND status AND the auto-generated flag. A second run
-- deletes zero rows. comparison_entities and faqs cascade. change_logs
-- keep their rows and lose the comparison id (ON DELETE SET NULL).
-- The Kayak.com entity and its attribute_values are not touched.

DELETE FROM "comparisons" WHERE "slug" = 'canoe-vs-kayak' AND "status" = 'provisional' AND "is_auto_generated" = true;

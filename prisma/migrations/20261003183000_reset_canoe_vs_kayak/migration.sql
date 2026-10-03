-- The visitor page canoe-vs-kayak reused the Kayak.com entity (`kayak`)
-- and rendered that site's travel metrics on a boat comparison. Delete
-- only that provisional auto-generated comparison so the next visit
-- regenerates it against a disambiguated entity.
--
-- The statement runs at the start of the production build, while the
-- previous deployment is still serving. A visit in that window can insert
-- the row again with the old save path. The new code treats a provisional
-- auto-generated row with no visitor promotion table as missing, so the
-- following request builds it again.
--
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Guard: slug AND status AND the auto-generated flag. A second run
-- deletes zero rows. comparison_entities and faqs cascade. change_logs
-- keep their rows and lose the comparison id (ON DELETE SET NULL).
-- The Kayak.com entity and its attribute_values are not touched.

DELETE FROM "comparisons" WHERE "slug" = 'canoe-vs-kayak' AND "status" = 'provisional' AND "is_auto_generated" = true;

-- Correct one false medical sentence on the live perimenopause blog post.
-- The article body lives in blog_articles.content (markdown). The page renders
-- dateModified from updated_at. The publish date is not changed.
--
-- The live post has no sources or references section, so the FDA source URLs
-- are not inserted here.
--
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Guard: slug AND the exact false sentence. REPLACE changes only that
-- sentence. A second run matches zero rows and leaves updated_at alone.

UPDATE "blog_articles"
SET
  "content" = REPLACE(
    "content",
    'Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.',
    'The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.'
  ),
  "updated_at" = TIMESTAMP '2026-10-04 00:00:00.000'
WHERE "slug" = 'perimenopause-symptoms'
  AND "content" LIKE '%Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.%';

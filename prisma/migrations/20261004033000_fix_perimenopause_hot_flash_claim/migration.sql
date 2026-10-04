-- Correct the perimenopause-symptoms article in blog_articles.content.
-- The live body is markdown (the page renders it). If this row was stored as
-- HTML instead, the same statement rewrites the heading and uses <a> links.
-- Link text is the drug name. The sentence on SSRI and SNRI hot-flash reduction is not modified.
-- dateModified is rendered from updated_at. The publish date is not changed.
--
-- `prisma migrate deploy` runs only when VERCEL_ENV=production
-- (scripts/vercel-build.mjs). Preview builds skip it.
--
-- Guard: this slug, and only while the old heading or an old drug sentence
-- is still present. A second run matches zero rows.

UPDATE "blog_articles"
SET
  "content" = CASE
    WHEN "content" LIKE '%<h3%' OR "content" LIKE '%<p>%' OR "content" LIKE '%<p %' THEN
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  "content",
                  'Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.',
                  'The FDA approved paroxetine (<a href="https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf">Brisdelle</a>) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant (<a href="https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause">Veozah</a>) on May 12, 2023, and elinzanetant (<a href="https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet">Lynkuet</a>) on October 24, 2025, both for moderate to severe hot flashes due to menopause.'
                ),
                'The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.',
                'The FDA approved paroxetine (<a href="https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf">Brisdelle</a>) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant (<a href="https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause">Veozah</a>) on May 12, 2023, and elinzanetant (<a href="https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet">Lynkuet</a>) on October 24, 2025, both for moderate to severe hot flashes due to menopause.'
              ),
              '### SSRIs and SNRIs',
              '### Non-hormonal medications'
            ),
            '>SSRIs and SNRIs<',
            '>Non-hormonal medications<'
          ),
          '>SSRIs and SNRIs<span',
          '>Non-hormonal medications<span'
        ),
        'ssris-and-snris',
        'non-hormonal-medications'
      )
    ELSE
      REPLACE(
        REPLACE(
          REPLACE(
            "content",
            'Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.',
            'The FDA approved paroxetine ([Brisdelle](https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf)) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant ([Veozah](https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause)) on May 12, 2023, and elinzanetant ([Lynkuet](https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet)) on October 24, 2025, both for moderate to severe hot flashes due to menopause.'
          ),
          'The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.',
          'The FDA approved paroxetine ([Brisdelle](https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf)) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant ([Veozah](https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause)) on May 12, 2023, and elinzanetant ([Lynkuet](https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet)) on October 24, 2025, both for moderate to severe hot flashes due to menopause.'
        ),
        '### SSRIs and SNRIs',
        '### Non-hormonal medications'
      )
  END,
  "updated_at" = TIMESTAMP '2026-10-04 00:00:00.000'
WHERE "slug" = 'perimenopause-symptoms'
  AND (
    "content" LIKE '%Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.%'
    OR "content" LIKE '%The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.%'
    OR "content" LIKE '%### SSRIs and SNRIs%'
    OR "content" LIKE '%>SSRIs and SNRIs<%'
    OR "content" LIKE '%>SSRIs and SNRIs<span%'
    OR "content" LIKE '%ssris-and-snris%'
  );

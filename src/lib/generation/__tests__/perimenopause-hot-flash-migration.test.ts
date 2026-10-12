import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "prisma/migrations/20261004033000_fix_perimenopause_hot_flash_claim/migration.sql",
);

const falseSentence =
  "Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.";

const earlierFdaSentence =
  "The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.";

const markdownReplacement =
  "The FDA approved paroxetine ([Brisdelle](https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf)) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant ([Veozah](https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause)) on May 12, 2023, and elinzanetant ([Lynkuet](https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet)) on October 24, 2025, both for moderate to severe hot flashes due to menopause.";

const htmlReplacement =
  "The FDA approved paroxetine (<a href=\"https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2013/204516Orig1s000ltr.pdf\">Brisdelle</a>) in 2013 for moderate to severe hot flashes associated with menopause. Two newer non-hormonal drugs block neurokinin receptors in the brain instead of acting on serotonin: the FDA approved fezolinetant (<a href=\"https://www.fda.gov/news-events/press-announcements/fda-approves-novel-drug-treat-moderate-severe-hot-flashes-caused-menopause\">Veozah</a>) on May 12, 2023, and elinzanetant (<a href=\"https://www.fda.gov/drugs/drug-trials-snapshots/drug-trials-snapshots-lynkuet\">Lynkuet</a>) on October 24, 2025, both for moderate to severe hot flashes due to menopause.";

describe("perimenopause hot-flash claim migration", () => {
  const sql = readFileSync(migrationPath, "utf8");

  it("renames the heading and replaces the false sentence on one post", () => {
    expect(sql).toContain("VERCEL_ENV=production");
    expect(sql).toContain(`UPDATE "blog_articles"`);
    expect(sql).toContain(`WHERE "slug" = 'perimenopause-symptoms'`);
    expect(sql).toContain(`'### SSRIs and SNRIs'`);
    expect(sql).toContain(`'### Non-hormonal medications'`);
    expect(sql).toContain(`'${falseSentence}'`);
    expect(sql).toContain(`'${earlierFdaSentence}'`);
    expect(sql).toContain(`'${markdownReplacement}'`);
    expect(sql).toContain(`'${htmlReplacement}'`);
    expect(sql).toContain(`'>SSRIs and SNRIs<'`);
    expect(sql).toContain(`'>Non-hormonal medications<'`);
    expect(sql.match(/\bUPDATE\b/g)).toHaveLength(1);
  });

  it("keeps the drug name as the link text and does not rewrite the 40-60% sentence", () => {
    expect(sql).not.toContain("approval letter");
    expect(sql).not.toContain("press release");
    expect(sql).not.toContain("Drug Trials Snapshot");
    expect(sql).not.toMatch(/40[–-]60%/);
    expect(sql).toContain("[Brisdelle](https://www.accessdata.fda.gov/");
    expect(sql).toContain(">Brisdelle</a>");
    expect(sql).toContain(">Veozah</a>");
    expect(sql).toContain(">Lynkuet</a>");
  });

  it("sets updated_at to the 2026-10-04 deploy date and leaves every other field alone", () => {
    expect(sql).toContain(`"updated_at" = TIMESTAMP '2026-10-04 00:00:00.000'`);
    expect(sql).not.toMatch(/NOW\s*\(/i);
    expect(sql).not.toMatch(/CURRENT_TIMESTAMP/i);
    expect(sql.toLowerCase()).not.toContain("published_at");
    expect(sql.toLowerCase()).not.toContain("excerpt");
    expect(sql.toLowerCase()).not.toContain("meta_description");
    expect(sql.toLowerCase()).not.toContain("meta_title");
    expect(sql).toContain(`"content" LIKE '%${falseSentence}%'`);
    expect(sql).toContain(`OR "content" LIKE '%### SSRIs and SNRIs%'`);
  });
});

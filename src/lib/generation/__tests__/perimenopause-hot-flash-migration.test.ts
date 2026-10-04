import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "prisma/migrations/20261004033000_fix_perimenopause_hot_flash_claim/migration.sql",
);

const falseSentence =
  "Paroxetine (Brisdelle) is the only non-hormonal medication FDA-approved specifically for menopausal hot flashes.";

const replacement =
  "The FDA approved paroxetine (Brisdelle) for moderate to severe hot flashes associated with menopause. The FDA approved fezolinetant (Veozah) on May 12, 2023, for moderate to severe hot flashes caused by menopause, and elinzanetant (Lynkuet) on October 24, 2025, for moderate to severe hot flashes due to menopause.";

describe("perimenopause hot-flash claim migration", () => {
  const sql = readFileSync(migrationPath, "utf8");

  it("replaces only the exact false sentence on the perimenopause-symptoms post", () => {
    expect(sql).toContain("VERCEL_ENV=production");
    expect(sql).toContain(`UPDATE "blog_articles"`);
    expect(sql).toContain(`REPLACE(`);
    expect(sql).toContain(`'${falseSentence}'`);
    expect(sql).toContain(`'${replacement}'`);
    expect(sql).toContain(`WHERE "slug" = 'perimenopause-symptoms'`);
    expect(sql).toContain(
      `AND "content" LIKE '%${falseSentence}%'`,
    );
    expect(sql.match(/UPDATE\s+"/gi)).toHaveLength(1);
    expect(sql.match(/REPLACE\s*\(/gi)).toHaveLength(1);
  });

  it("sets updated_at to the 2026-10-04 deploy date and leaves every other field alone", () => {
    expect(sql).toContain(`"updated_at" = TIMESTAMP '2026-10-04 00:00:00.000'`);
    expect(sql).not.toMatch(/NOW\s*\(/i);
    expect(sql).not.toMatch(/CURRENT_TIMESTAMP/i);
    expect(sql.toLowerCase()).not.toContain("published_at");
    expect(sql.toLowerCase()).not.toContain("excerpt");
    expect(sql.toLowerCase()).not.toContain("meta_description");
    expect(sql.toLowerCase()).not.toContain("meta_title");
    expect(sql.match(/\bUPDATE\b/g)).toHaveLength(1);
  });
});

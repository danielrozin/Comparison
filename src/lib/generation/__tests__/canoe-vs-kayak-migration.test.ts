import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "prisma/migrations/20261003183000_reset_canoe_vs_kayak/migration.sql",
);

describe("canoe-vs-kayak reset migration", () => {
  const sql = readFileSync(migrationPath, "utf8");
  const comparisonDelete =
    `DELETE FROM "comparisons" WHERE "slug" = 'canoe-vs-kayak' AND "status" = 'provisional' AND "is_auto_generated" = true;`;

  it("deletes only the provisional auto-generated canoe-vs-kayak comparison", () => {
    expect(sql).toContain("VERCEL_ENV=production");
    expect(sql).toContain(comparisonDelete);
    expect(sql.match(/DELETE FROM/gi)).toHaveLength(1);
  });

  it("does not delete the Kayak.com entity or its metrics", () => {
    expect(sql.toLowerCase()).not.toContain('delete from "entities"');
    expect(sql.toLowerCase()).not.toContain('delete from "attribute_values"');
    expect(sql.toLowerCase()).not.toContain('delete from "attributes"');
    expect(sql).not.toContain("slug = 'kayak'");
  });
});

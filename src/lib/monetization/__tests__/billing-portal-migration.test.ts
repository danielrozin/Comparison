import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "prisma/migrations/20261003120000_billing_portal_tokens/migration.sql"
);

describe("billing portal token migration", () => {
  const sql = readFileSync(migrationPath, "utf8");

  it("creates the token table and deletes only the Scan2Remember member row", () => {
    expect(sql).toContain('CREATE TABLE "billing_portal_tokens"');
    expect(sql).toContain('"token_hash" TEXT NOT NULL');
    expect(sql).toContain("DELETE FROM \"pro_custom_compare_usage\"");
    expect(sql).toContain("WHERE \"email\" = 'fakiny@gmail.com'");
    expect(sql).toContain("DELETE FROM \"pro_members\"");
    expect(sql).toContain("AND \"stripe_subscription_id\" = 'sub_1ULovMRubzz9nfe2PEut6xMT'");
    expect(sql).toContain("AND \"stripe_customer_id\" = 'cus_VMY115o51EqWxt'");
  });

  it("does not delete the processed Stripe event that blocked a retry", () => {
    expect(sql).toContain("evt_1ULovPRubzz9nfe2IilWVH1q");
    expect(sql.toLowerCase()).not.toContain("delete from \"processed_stripe_events\"");
    expect(sql.toLowerCase()).not.toContain("delete from processed_stripe_events");
  });
});

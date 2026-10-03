import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "prisma/migrations/20261003120000_billing_portal_tokens/migration.sql"
);

describe("billing portal token migration", () => {
  const sql = readFileSync(migrationPath, "utf8");

  it("creates the token table and deletes the unknown-plan row by Stripe ids", () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "billing_portal_tokens"');
    expect(sql).toContain('"token_hash" TEXT NOT NULL');
    const usageDelete =
      `DELETE FROM "pro_custom_compare_usage" WHERE "email" IN (SELECT "email" FROM "pro_members" WHERE "stripe_subscription_id"='sub_1ULovMRubzz9nfe2PEut6xMT' AND "stripe_customer_id"='cus_VMY115o51EqWxt' AND "plan"='unknown');`;
    const memberDelete =
      `DELETE FROM "pro_members" WHERE "stripe_subscription_id"='sub_1ULovMRubzz9nfe2PEut6xMT' AND "stripe_customer_id"='cus_VMY115o51EqWxt' AND "plan"='unknown';`;
    expect(sql).toContain(usageDelete);
    expect(sql).toContain(memberDelete);
    expect(sql.indexOf(usageDelete)).toBeLessThan(sql.indexOf(memberDelete));
    expect(sql).not.toContain("@");
  });

  it("does not delete the processed Stripe event that blocked a retry", () => {
    expect(sql).toContain("evt_1ULovPRubzz9nfe2IilWVH1q");
    expect(sql.toLowerCase()).not.toContain('delete from "processed_stripe_events"');
    expect(sql.toLowerCase()).not.toContain("delete from processed_stripe_events");
  });
});

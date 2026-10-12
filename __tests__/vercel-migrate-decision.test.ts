import { describe, expect, it } from "vitest";
import { shouldRunPrismaMigrate } from "../scripts/vercel-migrate-decision.mjs";

const databaseUrl = "postgresql://example.invalid/app";

describe("shouldRunPrismaMigrate", () => {
  it("runs only when VERCEL_ENV is production and a database URL is set", () => {
    expect(
      shouldRunPrismaMigrate({ DATABASE_URL: databaseUrl, VERCEL_ENV: "production" }).run
    ).toBe(true);
  });

  it("skips preview builds even when VERCEL=1 would previously have migrated", () => {
    const decision = shouldRunPrismaMigrate({
      DATABASE_URL: databaseUrl,
      VERCEL: "1",
      VERCEL_ENV: "preview",
      RUN_MIGRATIONS: "1",
    });
    expect(decision.run).toBe(false);
    expect(decision.reason).toContain("VERCEL_ENV=preview");
    expect(decision.reason).toContain("migrations run only in production");
    expect(decision.reason).toContain("Build continues");
  });

  it("skips when VERCEL_ENV is missing", () => {
    const decision = shouldRunPrismaMigrate({ DATABASE_URL: databaseUrl, VERCEL: "1" });
    expect(decision.run).toBe(false);
    expect(decision.reason).toContain("VERCEL_ENV=unset");
  });

  it("skips and warns when DATABASE_URL is missing", () => {
    const decision = shouldRunPrismaMigrate({ VERCEL_ENV: "production" });
    expect(decision.run).toBe(false);
    expect(decision.level).toBe("warn");
    expect(decision.reason).toContain("DATABASE_URL not set");
  });
});

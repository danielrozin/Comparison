/**
 * Advisory-lock race against a real Postgres.
 *
 * Prisma 5.22 throws P2010 if the lock is taken with $queryRaw, because
 * pg_advisory_xact_lock returns void. This file calls the real issuer.
 * It skips unless DATABASE_URL is a non-placeholder Postgres URL, so CI
 * (no database on the test job) still passes. Point DATABASE_URL at a
 * local Postgres to run it.
 */

import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { issueBillingPortalToken } from "../billing-portal-tokens";

const FIXTURE = "lock-race@example.com";

function postgresUrlForIntegration(): string | null {
  const url = process.env.DATABASE_URL ?? "";
  if (!/^postgres(ql)?:\/\//.test(url)) return null;
  if (url.includes("placeholder") || url.includes("user:password@")) return null;
  return url;
}

const databaseUrl = postgresUrlForIntegration();

describe.skipIf(!databaseUrl)("billing portal token advisory lock on Postgres", () => {
  let prisma: PrismaClient;

  afterAll(async () => {
    if (!prisma) return;
    await prisma.billingPortalToken.deleteMany({ where: { email: FIXTURE } }).catch(() => undefined);
    await prisma.$disconnect();
  });

  it("inserts exactly 3 rows when 8 issuers race", async () => {
    const client = getPrisma();
    expect(client).toBeTruthy();
    prisma = client as PrismaClient;

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "billing_portal_tokens" (
        "token_hash" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "stripe_customer_id" TEXT NOT NULL,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "used_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "billing_portal_tokens_pkey" PRIMARY KEY ("token_hash")
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "billing_portal_tokens_email_created_at_idx"
      ON "billing_portal_tokens"("email", "created_at")
    `);
    await prisma.billingPortalToken.deleteMany({ where: { email: FIXTURE } });

    const results = await Promise.all(
      Array.from({ length: 8 }, () => issueBillingPortalToken(FIXTURE, "cus_lock_test"))
    );

    expect(results.filter(Boolean)).toHaveLength(3);
    const stored = await prisma.billingPortalToken.count({ where: { email: FIXTURE } });
    expect(stored).toBe(3);
  });
});

#!/usr/bin/env node
/**
 * Production/CI build wrapper — DAN-1512.
 *
 * `prisma migrate deploy` MUST run against the direct, non-pooled Neon endpoint.
 * Running migrations through the PgBouncer pooler (`-pooler` host) strands the
 * migration session on any failed/concurrent deploy, which keeps holding
 * Prisma's migration advisory lock (72707369). Every subsequent deploy then
 * fails with P1002 (advisory-lock timeout) until the stuck backend is killed
 * manually. This wrapper guarantees migrations never go through the pooler.
 *
 * Resolution order for the migration connection (DIRECT_URL):
 *   1. An explicit DIRECT_URL env var (preferred — set in Vercel prod).
 *   2. Otherwise derived from DATABASE_URL by removing `-pooler` from the host.
 *
 * The derived/explicit DIRECT_URL is exported onto process.env so that
 * `prisma migrate deploy` (and `prisma generate`, which reads the same
 * datasource block declaring `directUrl = env("DIRECT_URL")`) inherit it.
 */
import { execSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && !process.env.DIRECT_URL) {
  // Neon pooler host looks like:  ep-xxxx-pooler.<region>.aws.neon.tech
  // Direct (non-pooled) host:     ep-xxxx.<region>.aws.neon.tech
  const directUrl = databaseUrl.replace("-pooler.", ".");
  process.env.DIRECT_URL = directUrl;
  if (directUrl !== databaseUrl) {
    console.log(
      "[vercel-build] DIRECT_URL not set; derived non-pooled endpoint from DATABASE_URL for migrations.",
    );
  } else {
    // DATABASE_URL already points at a direct endpoint (no `-pooler`).
    console.log(
      "[vercel-build] DIRECT_URL not set; DATABASE_URL is already a direct endpoint.",
    );
  }
} else if (process.env.DIRECT_URL) {
  console.log("[vercel-build] Using explicit DIRECT_URL for migrations.");
}

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

if (databaseUrl) {
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "[vercel-build] DATABASE_URL not set — skipping `prisma migrate deploy`.",
  );
}

run("npx prisma generate");
run("npx next build");

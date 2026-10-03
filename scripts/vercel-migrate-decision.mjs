/**
 * Decide whether this build may run `prisma migrate deploy`.
 *
 * Preview deployments set VERCEL=1, the same flag production builds set.
 * If a preview shares the production database, migrating there applies a
 * pull request's SQL before anyone merges it. Migrations run only when
 * VERCEL_ENV is exactly "production". The build still continues either way.
 *
 * RUN_MIGRATIONS is intentionally ignored. An extra opt-in on a preview
 * would reopen the same hole.
 */

export function shouldRunPrismaMigrate(env) {
  if (!env.DATABASE_URL) {
    return {
      run: false,
      level: "warn",
      reason:
        "DATABASE_URL not set — skipping `prisma migrate deploy`. Build continues.",
    };
  }
  if (env.VERCEL_ENV === "production") {
    return {
      run: true,
      level: "log",
      reason: "VERCEL_ENV=production — running `prisma migrate deploy`.",
    };
  }
  const name = env.VERCEL_ENV ? env.VERCEL_ENV : "unset";
  return {
    run: false,
    level: "log",
    reason: `VERCEL_ENV=${name} — skipping \`prisma migrate deploy\` (migrations run only in production). Build continues.`,
  };
}

#!/usr/bin/env node
/**
 * PPC restart gate — criterion #2 check (DAN-2140 / DAN-79).
 *
 * PPC is paused until Q4 2026. One of the four re-activation conditions is
 * "30+ days of organic conversion baseline data". This script answers that
 * from our own Postgres instead of requiring a human to read the GA4 UI.
 *
 * Signup conversions (newsletter) are persisted to `newsletter_subscribers`.
 * Contact-form submits are GA4-only (no server-side row), so they are not
 * measurable here — see NOTE at the bottom of the output.
 *
 * Usage: DATABASE_URL=... node scripts/ppc-conversion-baseline.mjs
 */
import { PrismaClient } from "@prisma/client";

const REQUIRED_DAYS = 30;
const prisma = new PrismaClient();

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

async function main() {
  const now = new Date();
  const since = (days) => new Date(now.getTime() - days * 86_400_000);

  const rows = await prisma.newsletterSubscriber.findMany({
    select: { subscribedAt: true, source: true, referrerSlug: true },
    orderBy: { subscribedAt: "asc" },
  });

  const total = rows.length;
  const inWindow = (days) => rows.filter((r) => r.subscribedAt >= since(days)).length;

  const first = rows[0]?.subscribedAt ?? null;
  const last = rows[total - 1]?.subscribedAt ?? null;
  const spanDays = first && last ? daysBetween(first, last) : 0;

  // Distinct calendar days that produced at least one signup.
  const activeDays = new Set(rows.map((r) => r.subscribedAt.toISOString().slice(0, 10))).size;

  const bySource = {};
  for (const r of rows) {
    const key = r.source || "unknown";
    bySource[key] = (bySource[key] || 0) + 1;
  }

  console.log("=== PPC restart gate — criterion #2: organic conversion baseline ===\n");
  console.log(`Total newsletter signups (all time): ${total}`);
  console.log(`  last 30 days: ${inWindow(30)}`);
  console.log(`  last 60 days: ${inWindow(60)}`);
  console.log(`  last 90 days: ${inWindow(90)}`);
  console.log(`First signup: ${first ? first.toISOString().slice(0, 10) : "n/a"}`);
  console.log(`Last  signup: ${last ? last.toISOString().slice(0, 10) : "n/a"}`);
  console.log(`Collection span: ${spanDays} days across ${activeDays} day(s) with >=1 signup`);
  console.log(`By source: ${JSON.stringify(bySource)}`);

  // The gate needs a real behavioural baseline: >=REQUIRED_DAYS of collection
  // AND enough volume to be worth optimising bids against.
  const hasSpan = spanDays >= REQUIRED_DAYS;
  const hasVolume = inWindow(30) > 0;
  const pass = hasSpan && hasVolume;

  console.log(`\nCriterion #2 (${REQUIRED_DAYS}+ days of conversion data): ${pass ? "PASS" : "FAIL"}`);
  if (!hasSpan) console.log(`  - span is ${spanDays}d, need >=${REQUIRED_DAYS}d`);
  if (!hasVolume) console.log(`  - zero signups in the last 30 days: no live conversion signal to optimise against`);

  console.log(
    "\nNOTE: contact-form submits fire GA4 `generate_lead` but are not persisted to Postgres,",
  );
  console.log(
    "so they are invisible to this check. Newsletter signups are the only server-side conversion.",
  );

  await prisma.$disconnect();
  process.exit(pass ? 0 : 1);
}

main().catch(async (e) => {
  console.error("baseline check failed:", e.message);
  await prisma.$disconnect();
  process.exit(2);
});

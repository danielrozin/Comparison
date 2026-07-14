#!/usr/bin/env node
/**
 * PPC restart gate — criterion #2 check (DAN-2140 / DAN-79).
 *
 * PPC is paused until Q4 2026. One of the four re-activation conditions is
 * "30+ days of organic conversion baseline data". This script answers that
 * from our own Postgres instead of requiring a human to read the GA4 UI.
 *
 * Two server-side conversion signals are counted:
 *   - newsletter signups   -> `newsletter_subscribers`
 *   - contact-form submits -> `contact_submissions` (DAN-2146)
 *
 * Usage: DATABASE_URL=... node scripts/ppc-conversion-baseline.mjs
 */
import { PrismaClient } from "@prisma/client";

const REQUIRED_DAYS = 30;
const prisma = new PrismaClient();

// Seed/QA rows carry a marker in `source` (e.g. "dan-323-test"). They must never
// anchor the baseline: one test row dated 30+ days back is enough to satisfy the
// span check on its own, which would restart paid spend against a baseline that
// contains no real user behaviour at all.
const TEST_SOURCE = /test|seed|qa|dummy|sample/i;

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

async function main() {
  const now = new Date();
  const since = (days) => new Date(now.getTime() - days * 86_400_000);

  const [signupRows, contactRows] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      select: { subscribedAt: true, source: true },
      orderBy: { subscribedAt: "asc" },
    }),
    prisma.contactSubmission.findMany({
      select: { createdAt: true, source: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Normalise both tables onto one timeline — the gate cares about conversions,
  // not about which form produced them.
  const allRows = [
    ...signupRows.map((r) => ({ at: r.subscribedAt, kind: "newsletter", source: r.source || "unknown" })),
    ...contactRows.map((r) => ({ at: r.createdAt, kind: "contact_form", source: r.source || "unknown" })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime());

  const excluded = allRows.filter((r) => TEST_SOURCE.test(r.source));
  const conversions = allRows.filter((r) => !TEST_SOURCE.test(r.source));

  const total = conversions.length;
  const inWindow = (days, rows = conversions) => rows.filter((r) => r.at >= since(days)).length;

  const first = conversions[0]?.at ?? null;
  const last = conversions[total - 1]?.at ?? null;
  const spanDays = first && last ? daysBetween(first, last) : 0;

  // Distinct calendar days that produced at least one conversion.
  const activeDays = new Set(conversions.map((r) => r.at.toISOString().slice(0, 10))).size;

  const bySource = {};
  const byKind = {};
  for (const r of conversions) {
    bySource[r.source] = (bySource[r.source] || 0) + 1;
    byKind[r.kind] = (byKind[r.kind] || 0) + 1;
  }

  const newsletterRows = conversions.filter((r) => r.kind === "newsletter");
  const contactConversions = conversions.filter((r) => r.kind === "contact_form");

  console.log("=== PPC restart gate — criterion #2: organic conversion baseline ===\n");
  if (excluded.length > 0) {
    const sources = [...new Set(excluded.map((r) => r.source))].join(", ");
    console.log(`Excluded ${excluded.length} test/seed row(s) from the count (source: ${sources})\n`);
  }
  console.log(`Total server-side conversions (all time): ${total}`);
  console.log(`  newsletter signups:   ${newsletterRows.length} (last 30d: ${inWindow(30, newsletterRows)})`);
  console.log(`  contact-form submits: ${contactConversions.length} (last 30d: ${inWindow(30, contactConversions)})`);
  console.log("\nCombined:");
  console.log(`  last 30 days: ${inWindow(30)}`);
  console.log(`  last 60 days: ${inWindow(60)}`);
  console.log(`  last 90 days: ${inWindow(90)}`);
  console.log(`First conversion: ${first ? first.toISOString().slice(0, 10) : "n/a"}`);
  console.log(`Last  conversion: ${last ? last.toISOString().slice(0, 10) : "n/a"}`);
  console.log(`Collection span: ${spanDays} days across ${activeDays} day(s) with >=1 conversion`);
  console.log(`By kind:   ${JSON.stringify(byKind)}`);
  console.log(`By source: ${JSON.stringify(bySource)}`);

  // The gate needs a real behavioural baseline: >=REQUIRED_DAYS of collection
  // AND enough volume to be worth optimising bids against.
  const hasSpan = spanDays >= REQUIRED_DAYS;
  const hasVolume = inWindow(30) > 0;
  const pass = hasSpan && hasVolume;

  console.log(`\nCriterion #2 (${REQUIRED_DAYS}+ days of conversion data): ${pass ? "PASS" : "FAIL"}`);
  if (!hasSpan) console.log(`  - span is ${spanDays}d, need >=${REQUIRED_DAYS}d`);
  if (!hasVolume) {
    console.log("  - zero conversions in the last 30 days: no live signal to optimise bids against");
  }

  if (contactConversions.length === 0) {
    console.log(
      "\nNOTE: no contact_submissions rows yet. The table ships with DAN-2146, so rows only",
    );
    console.log(
      "accumulate from the first real submission after that deploy — expect the span to lag.",
    );
  }

  await prisma.$disconnect();
  process.exit(pass ? 0 : 1);
}

main().catch(async (e) => {
  console.error("baseline check failed:", e.message);
  await prisma.$disconnect();
  process.exit(2);
});

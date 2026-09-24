/**
 * Pro custom-compare gate (ROO-49).
 *
 * A custom comparison is the paid promise on /pricing: "2 custom comparisons
 * per month — request any matchup, built for you within 24 hours."
 * Community suggestions on /requests stay free. This path is the fast lane.
 *
 * Access is the Redis hash from ROO-42 (`monetization:member:{email}`).
 * `active` is true only for Stripe status active or trialing. Cancel sets
 * active to 0, so a canceled member is denied here with no extra revoke step.
 *
 * There is no login yet. The buyer proves membership by submitting the email
 * they paid with — the same key the webhook writes.
 */

import { getPrisma } from "@/lib/db/prisma";
import { sendNotificationEmail } from "@/lib/services/email";
import { getRedis } from "@/lib/services/redis";
import { lookupMember, normalizeMemberEmail, type MemberRecord } from "@/lib/monetization/members";
import { SITE_URL } from "@/lib/utils/constants";

/** Matches the Pro feature line in `plans.ts`. Business includes everything in Pro. */
export const CUSTOM_COMPARE_MONTHLY_LIMIT = 2;

export const CUSTOM_COMPARE_UPGRADE_PATH = "/pricing?src=custom-compare";
export const CUSTOM_COMPARE_LOG_KEY = "monetization:custom-compares";

const PAIR_TTL_SECONDS = 40 * 24 * 60 * 60;

export interface CustomCompareInput {
  entityA: string;
  entityB: string;
  email: string;
  note?: string;
}

export type CustomCompareResult =
  | {
      ok: true;
      status: 200;
      alreadyQueued: boolean;
      remaining: number;
      limit: number;
      message: string;
    }
  | {
      ok: false;
      status: 400 | 403 | 429 | 503;
      code: "invalid" | "upgrade_required" | "monthly_limit" | "unavailable";
      error: string;
      upgradeUrl?: string;
      billingUrl?: string;
      limit?: number;
      remaining?: number;
    };

function cleanEntity(raw: string): string | null {
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length < 1 || value.length > 200) return null;
  return value;
}

/** Stable pair id so "B vs A" and "A vs B" share one monthly credit. */
export function customComparePairKey(entityA: string, entityB: string): string {
  const [a, b] = [entityA, entityB].map((value) => value.trim().toLowerCase()).sort();
  return `${a}::${b}`;
}

export function customCompareMonthKey(email: string, now = new Date()): string {
  return `monetization:custom-compare:${email}:${now.toISOString().slice(0, 7)}`;
}

function upgradeDenied(member: MemberRecord | null): CustomCompareResult {
  const lapsed = member && !member.active;
  return {
    ok: false,
    status: 403,
    code: "upgrade_required",
    error: lapsed
      ? "Your membership is not active, so custom comparisons are paused. Renew on pricing, or open Manage billing if you only need to update a card."
      : "Custom comparisons are a Pro feature. Free accounts can still suggest a matchup on the requests page and vote. Pro publishes a requested matchup within 24 hours.",
    upgradeUrl: CUSTOM_COMPARE_UPGRADE_PATH,
    billingUrl: "/account/billing",
  };
}

export async function submitCustomCompare(
  input: CustomCompareInput,
  now = new Date()
): Promise<CustomCompareResult> {
  const entityA = cleanEntity(input.entityA ?? "");
  const entityB = cleanEntity(input.entityB ?? "");
  if (!entityA || !entityB) {
    return { ok: false, status: 400, code: "invalid", error: "Enter both sides of the comparison (1–200 characters each)." };
  }
  if (entityA.toLowerCase() === entityB.toLowerCase()) {
    return { ok: false, status: 400, code: "invalid", error: "Those are the same thing. Pick two different sides." };
  }
  const email = normalizeMemberEmail(input.email);
  if (!email) {
    return {
      ok: false,
      status: 400,
      code: "invalid",
      error: "Enter the email you used at checkout so we can check your membership.",
    };
  }

  const lookup = await lookupMember(email);
  if (!lookup.available) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not check membership just now. Nothing was submitted. Please try again in a minute.",
    };
  }
  if (!lookup.member?.active) {
    return upgradeDenied(lookup.member);
  }

  const redis = getRedis();
  if (!redis) {
    return {
      ok: false,
      status: 503,
      code: "unavailable",
      error: "We could not check membership just now. Nothing was submitted. Please try again in a minute.",
    };
  }

  const monthKey = customCompareMonthKey(email, now);
  const pair = customComparePairKey(entityA, entityB);
  const added = await redis.sadd(monthKey, pair);
  const used = await redis.scard(monthKey);
  await redis.expire(monthKey, PAIR_TTL_SECONDS);

  if (added === 1 && used > CUSTOM_COMPARE_MONTHLY_LIMIT) {
    await redis.srem(monthKey, pair);
    return {
      ok: false,
      status: 429,
      code: "monthly_limit",
      error: `Pro includes ${CUSTOM_COMPARE_MONTHLY_LIMIT} custom comparisons per month. You have used both for this month. The counter resets next month.`,
      limit: CUSTOM_COMPARE_MONTHLY_LIMIT,
      remaining: 0,
    };
  }

  const remaining = Math.max(0, CUSTOM_COMPARE_MONTHLY_LIMIT - used);
  if (added === 0) {
    return {
      ok: true,
      status: 200,
      alreadyQueued: true,
      remaining,
      limit: CUSTOM_COMPARE_MONTHLY_LIMIT,
      message: "That matchup is already in your queue for this month. We will still publish it within 24 hours.",
    };
  }

  const record = {
    email,
    plan: lookup.member.plan,
    entityA,
    entityB,
    note: (input.note ?? "").trim().slice(0, 500),
    at: now.toISOString(),
  };
  await redis.lpush(CUSTOM_COMPARE_LOG_KEY, JSON.stringify(record));

  try {
    await sendNotificationEmail({
      subject: `Custom compare: ${entityA} vs ${entityB} — ${email}`,
      type: "custom-compare",
      message: [
        `${email} (${lookup.member.plan || "member"}) requested a custom comparison.`,
        `${entityA} vs ${entityB}`,
        record.note ? `Note: ${record.note}` : null,
        `Remaining this month: ${remaining} of ${CUSTOM_COMPARE_MONTHLY_LIMIT}.`,
        "Publish the full side-by-side within 24 hours.",
      ]
        .filter((line): line is string => Boolean(line))
        .join("\n"),
      senderEmail: email,
      pageUrl: `${SITE_URL}/custom-compare`,
    });
  } catch (err) {
    console.error("[custom-compare] founder alert failed:", err);
  }

  try {
    const prisma = getPrisma();
    if (prisma) {
      const [normA, normB] = [entityA, entityB].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      await prisma.comparisonRequest.upsert({
        where: { entityA_entityB: { entityA: normA, entityB: normB } },
        create: {
          entityA: normA,
          entityB: normB,
          reason: `Pro custom compare (${lookup.member.plan || "member"}). ${record.note}`.trim(),
          sessionId: `pro:${email}`.slice(0, 200),
          email,
          voteCount: 1,
          status: "approved",
        },
        update: {
          email,
          status: "approved",
          reason: `Pro custom compare (${lookup.member.plan || "member"}). ${record.note}`.trim(),
        },
      });
    }
  } catch (err) {
    // Redis already has the request and founders were emailed. A database
    // miss should not look like a failed submit to the member.
    console.error("[custom-compare] request row failed:", err);
  }

  return {
    ok: true,
    status: 200,
    alreadyQueued: false,
    remaining,
    limit: CUSTOM_COMPARE_MONTHLY_LIMIT,
    message: `Request received. We will publish ${entityA} vs ${entityB} within 24 hours. ${remaining} custom comparison${remaining === 1 ? "" : "s"} left this month.`,
  };
}

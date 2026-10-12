import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";

/**
 * Paid membership index.
 *
 * Postgres table `pro_members` is the source of truth. Access is on only
 * when `status` is `active` or `trialing`. `customer.subscription.deleted`
 * sets status `canceled`.
 *
 * Stripe subscription events often omit the customer email. Checkout stores
 * the email on the row, and later events find that row by
 * `stripe_subscription_id` or `stripe_customer_id`.
 *
 * When Redis is configured, the same fields are mirrored to:
 *   monetization:member:{email}
 *   monetization:member-by-subscription:{subId}
 *   monetization:member-by-customer:{customerId}
 * and checkout still appends `monetization:members`. Those keys are a cache.
 * A missing Redis client must not change who has access.
 */

export const MEMBERS_LIST_KEY = "monetization:members";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENTITLED_STATUSES = new Set(["active", "trialing"]);

export function memberHashKey(email: string): string {
  return `monetization:member:${email}`;
}

export function memberBySubscriptionKey(subscriptionId: string): string {
  return `monetization:member-by-subscription:${subscriptionId}`;
}

export function memberByCustomerKey(customerId: string): string {
  return `monetization:member-by-customer:${customerId}`;
}

/** Lowercase + trim. Rejects blanks and the webhook's "unknown" placeholder. */
export function normalizeMemberEmail(raw: string | null | undefined): string | null {
  const email = (raw ?? "").trim().toLowerCase();
  if (!email || email === "unknown" || email.length > 320 || !EMAIL_RE.test(email)) {
    return null;
  }
  return email;
}

export interface MemberRecord {
  email: string;
  plan: string;
  interval: string;
  stripeCustomer: string;
  stripeSubscription: string;
  updatedAt: string;
  status: string;
  /** True only for Stripe status active or trialing. */
  active: boolean;
  src: string;
}

export interface MemberUpsert {
  email?: string | null;
  plan?: string | null;
  interval?: string | null;
  stripeCustomer?: string | null;
  stripeSubscription?: string | null;
  status?: string | null;
  src?: string | null;
  updatedAt?: string;
  /** Stripe `current_period_end` (unix seconds) converted by the caller. */
  currentPeriodEnd?: Date | null;
  /**
   * Checkout passes true so a new purchase replaces the stored subscription.
   * Subscription webhook events pass false so an older sub cannot overwrite
   * a newer one on the same email.
   */
  replaceSubscription?: boolean;
}

interface MembershipRow {
  id: string;
  email: string;
  plan: string;
  interval: string;
  status: string;
  src: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  updatedAt: Date;
}

/** Upstash JSON-parses hash values, so "1" can come back as the number 1. */
function isTruthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function memberIsActive(status: string, activeFlag: unknown): boolean {
  if (!ENTITLED_STATUSES.has(status.toLowerCase())) return false;
  if (activeFlag == null || activeFlag === "") return true;
  return isTruthyFlag(activeFlag);
}

function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() || "";
  return trimmed || null;
}

function rowToRecord(row: MembershipRow): MemberRecord {
  const status = row.status || "";
  return {
    email: row.email,
    plan: row.plan || "",
    interval: row.interval || "",
    stripeCustomer: row.stripeCustomerId || "",
    stripeSubscription: row.stripeSubscriptionId || "",
    updatedAt: row.updatedAt.toISOString(),
    status,
    active: memberIsActive(status, ENTITLED_STATUSES.has(status.toLowerCase()) ? "1" : "0"),
    src: row.src || "",
  };
}

async function findExisting(hints: {
  email?: string | null;
  stripeSubscription?: string | null;
  stripeCustomer?: string | null;
}): Promise<MembershipRow | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  if (hints.email) {
    const byEmail = await prisma.proMember.findUnique({ where: { email: hints.email } });
    if (byEmail) return byEmail;
  }
  const subscriptionId = blankToNull(hints.stripeSubscription);
  if (subscriptionId) {
    const bySub = await prisma.proMember.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
    });
    if (bySub) return bySub;
  }
  const customerId = blankToNull(hints.stripeCustomer);
  if (customerId) {
    return prisma.proMember.findUnique({ where: { stripeCustomerId: customerId } });
  }
  return null;
}

/** Best-effort cache. Failures are logged and do not change the Postgres result. */
async function mirrorMemberToRedis(row: MembershipRow): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const record = rowToRecord(row);
    const fields: Record<string, string> = {
      email: record.email,
      plan: record.plan,
      interval: record.interval,
      stripeCustomer: record.stripeCustomer,
      stripeSubscription: record.stripeSubscription,
      updatedAt: record.updatedAt,
      status: record.status,
      active: record.active ? "1" : "0",
      src: record.src,
    };
    await redis.hset(memberHashKey(record.email), fields);
    if (record.stripeSubscription) {
      await redis.set(memberBySubscriptionKey(record.stripeSubscription), record.email);
    }
    if (record.stripeCustomer) {
      await redis.set(memberByCustomerKey(record.stripeCustomer), record.email);
    }
  } catch (err) {
    console.error("[membership] redis cache write failed:", err);
  }
}

export async function resolveMemberEmail(hints: {
  email?: string | null;
  stripeSubscription?: string | null;
  stripeCustomer?: string | null;
}): Promise<string | null> {
  const direct = normalizeMemberEmail(hints.email);
  if (direct) return direct;
  const existing = await findExisting({
    stripeSubscription: hints.stripeSubscription,
    stripeCustomer: hints.stripeCustomer,
  });
  return existing?.email ?? null;
}

/**
 * Create or update the Postgres member row. Returns false when the email
 * cannot be resolved, or when an older subscription must not overwrite a
 * newer one. Throws if the database write fails.
 */
export async function upsertMember(input: MemberUpsert): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return false;

  const directEmail = normalizeMemberEmail(input.email);
  const existing = await findExisting({
    email: directEmail,
    stripeSubscription: input.stripeSubscription,
    stripeCustomer: input.stripeCustomer,
  });
  const email = directEmail || existing?.email || null;
  if (!email) return false;

  const currentSub = existing?.stripeSubscriptionId || "";
  const nextSub = input.stripeSubscription?.trim() || "";
  if (
    input.replaceSubscription !== true &&
    currentSub &&
    nextSub &&
    currentSub !== nextSub
  ) {
    return false;
  }

  const previousStatus = existing?.status || "";
  const status = (input.status || previousStatus || "active").toLowerCase();
  const updatedAt = input.updatedAt ? new Date(input.updatedAt) : new Date();
  const plan = input.plan?.trim();
  const interval = input.interval?.trim();
  const src = input.src?.trim();
  const stripeCustomerId = blankToNull(input.stripeCustomer);
  const stripeSubscriptionId = nextSub || null;

  const row = existing
    ? await prisma.proMember.update({
        where: { id: existing.id },
        data: {
          email,
          status,
          updatedAt,
          ...(plan ? { plan } : {}),
          ...(interval ? { interval } : {}),
          ...(src ? { src } : {}),
          ...(stripeCustomerId ? { stripeCustomerId } : {}),
          ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
          ...(input.currentPeriodEnd !== undefined
            ? { currentPeriodEnd: input.currentPeriodEnd }
            : {}),
        },
      })
    : await prisma.proMember.create({
        data: {
          email,
          status,
          plan: plan || "",
          interval: interval || "",
          src: src || "",
          stripeCustomerId,
          stripeSubscriptionId,
          currentPeriodEnd: input.currentPeriodEnd ?? null,
          updatedAt,
        },
      });

  await mirrorMemberToRedis(row);
  return true;
}

/**
 * Mark the member canceled. Does not delete the row, so ops can still see
 * who bought and then left. A delete for a subscription id that is not the
 * one currently stored (an older sub after a re-subscribe) is ignored.
 * Throws if the database write fails.
 */
export async function revokeMember(hints: {
  email?: string | null;
  stripeCustomer?: string | null;
  stripeSubscription?: string | null;
  updatedAt?: string;
}): Promise<{ revoked: boolean; email: string | null }> {
  const prisma = getPrisma();
  if (!prisma) return { revoked: false, email: normalizeMemberEmail(hints.email) };

  const directEmail = normalizeMemberEmail(hints.email);
  const existing = await findExisting({
    email: directEmail,
    stripeSubscription: hints.stripeSubscription,
    stripeCustomer: hints.stripeCustomer,
  });
  const email = directEmail || existing?.email || null;
  if (!existing || !email) return { revoked: false, email };

  const currentSub = existing.stripeSubscriptionId || "";
  const deletedSub = hints.stripeSubscription?.trim() || "";
  if (currentSub && deletedSub && currentSub !== deletedSub) {
    return { revoked: false, email };
  }

  const updatedAt = hints.updatedAt ? new Date(hints.updatedAt) : new Date();
  const stripeCustomerId = blankToNull(hints.stripeCustomer);
  const row = await prisma.proMember.update({
    where: { id: existing.id },
    data: {
      email,
      status: "canceled",
      updatedAt,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(deletedSub ? { stripeSubscriptionId: deletedSub } : {}),
    },
  });
  await mirrorMemberToRedis(row);
  return { revoked: true, email };
}

export type MemberLookup =
  | { available: false }
  | { available: true; member: MemberRecord | null };

export async function lookupMember(emailRaw: string): Promise<MemberLookup> {
  const email = normalizeMemberEmail(emailRaw);
  if (!email) return { available: true, member: null };
  const prisma = getPrisma();
  if (!prisma) return { available: false };
  try {
    const row = await prisma.proMember.findUnique({ where: { email } });
    if (!row) return { available: true, member: null };
    return { available: true, member: rowToRecord(row) };
  } catch (err) {
    console.error("[membership] lookup failed:", err);
    return { available: false };
  }
}

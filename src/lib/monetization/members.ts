import { getRedis } from "@/lib/services/redis";

/**
 * Paid membership index (ROO-42).
 *
 * Hash: `monetization:member:{lowercase-email}`
 * Fields: plan, interval, stripeCustomer, stripeSubscription, updatedAt,
 * status, active ("1" or "0"), src, email.
 *
 * Access is on only when status is `active` or `trialing`.
 * `customer.subscription.deleted` sets status `canceled` and active `0`.
 *
 * Stripe subscription events usually do not include the customer email, so
 * checkout also writes:
 *   monetization:member-by-subscription:{subId} -> email
 *   monetization:member-by-customer:{customerId} -> email
 * Cancel resolves the hash through those keys.
 *
 * `monetization:members` stays an append-only purchase list (LPUSH on
 * checkout). Nothing should scan that list to decide access — HGETALL this
 * hash (or GET /api/admin/membership) instead.
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
  /**
   * Checkout passes true so a new purchase replaces the stored subscription.
   * Subscription webhook events pass false so an older sub cannot overwrite
   * a newer one on the same email.
   */
  replaceSubscription?: boolean;
}

function asString(value: unknown): string {
  if (value == null) return "";
  return String(value);
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

function toRecord(email: string, raw: Record<string, unknown>): MemberRecord {
  const status = asString(raw.status);
  return {
    email: normalizeMemberEmail(asString(raw.email)) || email,
    plan: asString(raw.plan),
    interval: asString(raw.interval),
    stripeCustomer: asString(raw.stripeCustomer),
    stripeSubscription: asString(raw.stripeSubscription),
    updatedAt: asString(raw.updatedAt),
    status,
    active: memberIsActive(status, raw.active),
    src: asString(raw.src),
  };
}

async function readHash(email: string): Promise<Record<string, unknown> | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = await redis.hgetall<Record<string, unknown>>(memberHashKey(email));
  if (!raw || Object.keys(raw).length === 0) return null;
  return raw;
}

export async function resolveMemberEmail(hints: {
  email?: string | null;
  stripeSubscription?: string | null;
  stripeCustomer?: string | null;
}): Promise<string | null> {
  const direct = normalizeMemberEmail(hints.email);
  if (direct) return direct;

  const redis = getRedis();
  if (!redis) return null;

  if (hints.stripeSubscription) {
    const fromSub = await redis.get<string>(memberBySubscriptionKey(hints.stripeSubscription));
    const email = normalizeMemberEmail(typeof fromSub === "string" ? fromSub : null);
    if (email) return email;
  }
  if (hints.stripeCustomer) {
    const fromCus = await redis.get<string>(memberByCustomerKey(hints.stripeCustomer));
    const email = normalizeMemberEmail(typeof fromCus === "string" ? fromCus : null);
    if (email) return email;
  }
  return null;
}

/**
 * Create or update the member hash. Returns false when Redis is down or the
 * email cannot be resolved (subscription events often omit it until checkout
 * has written the index).
 */
export async function upsertMember(input: MemberUpsert): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const email = await resolveMemberEmail({
    email: input.email,
    stripeSubscription: input.stripeSubscription,
    stripeCustomer: input.stripeCustomer,
  });
  if (!email) return false;

  const existing = await readHash(email);
  const currentSub = existing ? asString(existing.stripeSubscription) : "";
  const nextSub = input.stripeSubscription?.trim() || "";
  if (
    input.replaceSubscription !== true &&
    currentSub &&
    nextSub &&
    currentSub !== nextSub
  ) {
    return false;
  }

  const previousStatus = existing ? asString(existing.status) : "";
  const status = (input.status || previousStatus || "active").toLowerCase();
  const fields: Record<string, string> = {
    email,
    status,
    active: ENTITLED_STATUSES.has(status) ? "1" : "0",
    updatedAt: input.updatedAt || new Date().toISOString(),
  };

  const plan = input.plan?.trim();
  const interval = input.interval?.trim();
  const src = input.src?.trim();
  if (plan) fields.plan = plan;
  if (interval) fields.interval = interval;
  if (src) fields.src = src;
  if (input.stripeCustomer) fields.stripeCustomer = input.stripeCustomer;
  if (nextSub) fields.stripeSubscription = nextSub;

  if (!existing) {
    fields.plan ??= "";
    fields.interval ??= "";
    fields.stripeCustomer ??= input.stripeCustomer || "";
    fields.stripeSubscription ??= nextSub;
  }

  await redis.hset(memberHashKey(email), fields);
  if (fields.stripeSubscription) {
    await redis.set(memberBySubscriptionKey(fields.stripeSubscription), email);
  }
  if (fields.stripeCustomer) {
    await redis.set(memberByCustomerKey(fields.stripeCustomer), email);
  }
  return true;
}

/**
 * Mark the member canceled. Does not delete the hash, so ops can still see
 * who bought and then left. A delete for a subscription id that is not the
 * one currently stored (an older sub after a re-subscribe) is ignored.
 */
export async function revokeMember(hints: {
  email?: string | null;
  stripeCustomer?: string | null;
  stripeSubscription?: string | null;
  updatedAt?: string;
}): Promise<{ revoked: boolean; email: string | null }> {
  const email = await resolveMemberEmail(hints);
  const redis = getRedis();
  if (!email || !redis) return { revoked: false, email: email ?? null };

  const existing = await readHash(email);
  if (!existing) return { revoked: false, email };

  const currentSub = asString(existing.stripeSubscription);
  const deletedSub = hints.stripeSubscription?.trim() || "";
  if (currentSub && deletedSub && currentSub !== deletedSub) {
    return { revoked: false, email };
  }

  const fields: Record<string, string> = {
    email,
    status: "canceled",
    active: "0",
    updatedAt: hints.updatedAt || new Date().toISOString(),
  };
  if (hints.stripeCustomer) fields.stripeCustomer = hints.stripeCustomer;
  if (deletedSub) fields.stripeSubscription = deletedSub;

  await redis.hset(memberHashKey(email), fields);
  return { revoked: true, email };
}

export type MemberLookup =
  | { available: false }
  | { available: true; member: MemberRecord | null };

export async function lookupMember(emailRaw: string): Promise<MemberLookup> {
  const email = normalizeMemberEmail(emailRaw);
  if (!email) return { available: true, member: null };
  if (!getRedis()) return { available: false };
  const raw = await readHash(email);
  if (!raw) return { available: true, member: null };
  return { available: true, member: toRecord(email, raw) };
}

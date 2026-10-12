/**
 * Backfill Pro members from completed Stripe Checkout sessions.
 *
 * Read-only against Stripe: this module only sends GET. It never creates,
 * updates, or archives Products or Prices. The Stripe account is shared
 * with Scan2Remember, so a session counts only when a line-item price id
 * is one of AversusB's Pro prices (STRIPE_PRICE_PRO_YEARLY /
 * STRIPE_PRICE_PRO_MONTHLY from plans.ts). The API-key price
 * STRIPE_PRICE_PRO is a different product and is ignored.
 */

import { PLANS } from "@/lib/monetization/plans";
import { normalizeMemberEmail, upsertMember } from "@/lib/monetization/members";

export const PRO_BACKFILL_SINCE = "2026-09-20T00:00:00.000Z";

const PAGE_LIMIT = 100;
const MAX_PAGES = 50;

export interface ProPriceRef {
  priceId: string;
  plan: "pro";
  interval: "month" | "year";
}

/** Consumer checkout price: Pro yearly/monthly or Business monthly. */
export interface OwnedPriceRef {
  priceId: string;
  plan: "pro" | "business";
  interval: "month" | "year";
}

export interface BackfillMemberPlan {
  sessionId: string;
  email: string;
  plan: string;
  interval: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  src: string;
  action: "upsert" | "skipped";
  reason?: string;
}

export interface BackfillResult {
  ok: boolean;
  dryRun: boolean;
  since: string;
  priceIds: string[];
  scanned: number;
  matched: number;
  upserted: number;
  skipped: number;
  truncated: boolean;
  error?: string;
  members: BackfillMemberPlan[];
}

interface StripePrice {
  id?: string;
}

interface StripeLineItem {
  price?: string | StripePrice | null;
}

interface StripeSession {
  id: string;
  created?: number;
  customer?: string | { id?: string } | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  subscription?: string | { id?: string } | null;
  metadata?: { src?: string } | null;
  line_items?: { data?: StripeLineItem[] } | null;
}

interface StripeList<T> {
  data?: T[];
  has_more?: boolean;
  error?: { message?: string };
}

interface StripeSubscription {
  id?: string;
  status?: string;
  created?: number;
  current_period_end?: number;
  error?: { message?: string };
}

const LIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export interface CheckoutCandidate {
  status: string;
  /** Unix seconds. Subscription created, then Checkout Session created. */
  created: number;
}

/**
 * Several completed checkouts can share an email. Keep the newest
 * active or trialing subscription. A newer canceled session must not
 * replace an older subscription that is still active. When nothing is
 * active, keep the newest session.
 */
export function pickLatestActiveSubscription<T extends CheckoutCandidate>(candidates: T[]): T {
  if (candidates.length === 0) {
    throw new Error("pickLatestActiveSubscription called with no checkouts");
  }
  const live = candidates.filter((candidate) => LIVE_SUBSCRIPTION_STATUSES.has(candidate.status));
  const pool = live.length > 0 ? live : candidates;
  return pool.reduce((best, candidate) => (candidate.created > best.created ? candidate : best));
}

/**
 * Every AversusB consumer price (Pro and Business). The API-key price
 * STRIPE_PRICE_PRO is not one of these and must stay out of the set.
 * One helper so the webhook and the billing portal cannot drift.
 */
export function aversusbOwnedPriceIds(
  env: Record<string, string | undefined> = process.env
): Map<string, OwnedPriceRef> {
  const map = new Map<string, OwnedPriceRef>();
  for (const plan of PLANS) {
    for (const interval of plan.intervals) {
      const priceId = (env[interval.stripePriceEnv] ?? "").replace(/[\r\n]+/g, "").trim();
      if (!priceId) continue;
      map.set(priceId, { priceId, plan: plan.id, interval: interval.interval });
    }
  }
  return map;
}

/** Pro price ids from the consumer plans. Empty when those env vars are unset. */
export function aversusbProPriceIds(
  env: Record<string, string | undefined> = process.env
): Map<string, ProPriceRef> {
  const map = new Map<string, ProPriceRef>();
  for (const ref of aversusbOwnedPriceIds(env).values()) {
    if (ref.plan !== "pro") continue;
    map.set(ref.priceId, { priceId: ref.priceId, plan: "pro", interval: ref.interval });
  }
  return map;
}

function stripeId(value: string | { id?: string } | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  return value.id?.trim() || null;
}

function priceIdOf(item: StripeLineItem): string | null {
  const price = item.price;
  if (!price) return null;
  if (typeof price === "string") return price;
  return price.id ?? null;
}

export function sessionProPrice(
  session: { line_items?: { data?: StripeLineItem[] } | null },
  prices: Map<string, ProPriceRef>
): ProPriceRef | null {
  const items = session.line_items?.data ?? [];
  for (const item of items) {
    const id = priceIdOf(item);
    if (id && prices.has(id)) return prices.get(id) ?? null;
  }
  return null;
}

/** GET only. Callers must not pass a path that would mutate Stripe. */
async function stripeGet<T>(path: string, secret: string): Promise<{ ok: boolean; status: number; body: T }> {
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = (await res.json()) as T;
  return { ok: res.ok, status: res.status, body };
}

function sessionsPath(startingAfter?: string): string {
  const since = Math.floor(Date.parse(PRO_BACKFILL_SINCE) / 1000);
  const params = new URLSearchParams();
  params.set("status", "complete");
  params.set("limit", String(PAGE_LIMIT));
  params.set("created[gte]", String(since));
  params.append("expand[]", "data.line_items");
  if (startingAfter) params.set("starting_after", startingAfter);
  return `/v1/checkout/sessions?${params.toString()}`;
}

async function lineItemsFor(
  session: StripeSession,
  secret: string
): Promise<StripeLineItem[]> {
  if (session.line_items?.data && session.line_items.data.length > 0) {
    return session.line_items.data;
  }
  const listed = await stripeGet<StripeList<StripeLineItem>>(
    `/v1/checkout/sessions/${encodeURIComponent(session.id)}/line_items?limit=20`,
    secret
  );
  if (!listed.ok) {
    throw new Error(listed.body.error?.message || `Stripe line items ${listed.status}`);
  }
  return listed.body.data ?? [];
}

async function subscriptionState(
  subscriptionId: string,
  secret: string
): Promise<{ status: string; created: number; currentPeriodEnd: Date | null; note?: string }> {
  const res = await stripeGet<StripeSubscription>(
    `/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
    secret
  );
  if (res.status === 404) {
    return { status: "canceled", created: 0, currentPeriodEnd: null, note: "subscription_missing" };
  }
  if (!res.ok) {
    throw new Error(res.body.error?.message || `Stripe subscription ${res.status}`);
  }
  const end = res.body.current_period_end;
  return {
    status: (res.body.status || "active").toLowerCase(),
    created: res.body.created ?? 0,
    currentPeriodEnd: end ? new Date(end * 1000) : null,
  };
}

/**
 * List completed Checkout sessions since 2026-09-20 and upsert Pro members.
 * `dryRun` (the default for callers) reports the rows and does not write.
 */
export async function backfillProMembers(options: {
  dryRun: boolean;
  env?: Record<string, string | undefined>;
}): Promise<BackfillResult> {
  const env = options.env ?? process.env;
  const prices = aversusbProPriceIds(env);
  const base: BackfillResult = {
    ok: false,
    dryRun: options.dryRun,
    since: PRO_BACKFILL_SINCE,
    priceIds: [...prices.keys()],
    scanned: 0,
    matched: 0,
    upserted: 0,
    skipped: 0,
    truncated: false,
    members: [],
  };

  if (prices.size === 0) {
    return {
      ...base,
      error:
        "AversusB Pro price ids are not configured. Set STRIPE_PRICE_PRO_YEARLY and/or STRIPE_PRICE_PRO_MONTHLY.",
    };
  }
  const secret = (env.STRIPE_SECRET_KEY ?? "").trim();
  if (!secret) {
    return { ...base, error: "STRIPE_SECRET_KEY is not configured." };
  }

  const candidates: Array<CheckoutCandidate & { row: BackfillMemberPlan; currentPeriodEnd: Date | null }> = [];
  let startingAfter: string | undefined;
  let pages = 0;
  let more = false;
  try {
    while (pages < MAX_PAGES) {
      pages += 1;
      const listed = await stripeGet<StripeList<StripeSession>>(sessionsPath(startingAfter), secret);
      if (!listed.ok) {
        return {
          ...base,
          error: listed.body.error?.message || `Stripe checkout sessions ${listed.status}`,
        };
      }
      const sessions = listed.body.data ?? [];
      base.scanned += sessions.length;

      for (const session of sessions) {
        const items = await lineItemsFor(session, secret);
        const price = sessionProPrice({ line_items: { data: items } }, prices);
        if (!price) continue;
        base.matched += 1;

        const email = normalizeMemberEmail(
          session.customer_details?.email || session.customer_email || ""
        );
        const subscriptionId = stripeId(session.subscription);
        const customerId = stripeId(session.customer);
        if (!email) {
          base.skipped += 1;
          base.members.push({
            sessionId: session.id,
            email: "",
            plan: price.plan,
            interval: price.interval,
            status: "active",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            currentPeriodEnd: null,
            src: session.metadata?.src || "backfill",
            action: "skipped",
            reason: "no_email",
          });
          continue;
        }

        let status = "active";
        let created = session.created ?? 0;
        let currentPeriodEnd: Date | null = null;
        let note: string | undefined;
        if (subscriptionId) {
          const state = await subscriptionState(subscriptionId, secret);
          status = state.status;
          currentPeriodEnd = state.currentPeriodEnd;
          if (state.created > 0) created = state.created;
          note = state.note;
        }

        candidates.push({
          status,
          created,
          currentPeriodEnd,
          row: {
            sessionId: session.id,
            email,
            plan: price.plan,
            interval: price.interval,
            status,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            currentPeriodEnd: currentPeriodEnd ? currentPeriodEnd.toISOString() : null,
            src: session.metadata?.src || "backfill",
            action: "upsert",
            reason: options.dryRun ? note || "dry_run" : note,
          },
        });
      }

      more = Boolean(listed.body.has_more && sessions.length > 0);
      if (!more) break;
      startingAfter = sessions[sessions.length - 1]?.id;
      if (!startingAfter) {
        more = false;
        break;
      }
    }

    const byEmail = new Map<string, typeof candidates>();
    for (const candidate of candidates) {
      const group = byEmail.get(candidate.row.email) ?? [];
      group.push(candidate);
      byEmail.set(candidate.row.email, group);
    }

    for (const group of byEmail.values()) {
      const winner = pickLatestActiveSubscription(group);
      for (const candidate of group) {
        if (candidate === winner) continue;
        base.skipped += 1;
        base.members.push({
          ...candidate.row,
          action: "skipped",
          reason: "kept_latest_active_subscription",
        });
      }

      if (!options.dryRun) {
        const wrote = await upsertMember({
          email: winner.row.email,
          plan: winner.row.plan,
          interval: winner.row.interval,
          stripeCustomer: winner.row.stripeCustomerId,
          stripeSubscription: winner.row.stripeSubscriptionId,
          status: winner.row.status,
          src: winner.row.src,
          currentPeriodEnd: winner.currentPeriodEnd,
          replaceSubscription: true,
          updatedAt: new Date().toISOString(),
        });
        if (!wrote) {
          winner.row.action = "skipped";
          winner.row.reason = "upsert_rejected";
          base.skipped += 1;
        } else {
          base.upserted += 1;
        }
      }
      base.members.push(winner.row);
    }

    base.truncated = more && pages >= MAX_PAGES;
    base.ok = true;
    return base;
  } catch (err) {
    return {
      ...base,
      error: err instanceof Error ? err.message : "Backfill failed",
    };
  }
}

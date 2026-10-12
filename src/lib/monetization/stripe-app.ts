/**
 * Which Stripe objects belong to AversusB on the shared Goldenroz account
 * (Scan2Remember, RookMentor, AversusB). Callers use this before any
 * membership write, email, alert, or analytics call.
 *
 * A checkout or subscription is ours when metadata.app is "aversusb", or
 * when a price id is one of the consumer prices from aversusbOwnedPriceIds.
 * The price check is the transition path for Checkout Sessions created
 * before metadata.app was stamped.
 */

import { getInterval, getPlan } from "@/lib/monetization/plans";

export const AVERSUS_APP = "aversusb";

export function metadataApp(metadata: { app?: unknown } | null | undefined): string {
  return typeof metadata?.app === "string" ? metadata.app.trim().toLowerCase() : "";
}

export function isAversusBApp(metadata: { app?: unknown } | null | undefined): boolean {
  return metadataApp(metadata) === AVERSUS_APP;
}

/** Stripe Price id from a string id or an expanded `{ id }` object. */
export function priceIdOf(price: unknown): string | null {
  if (typeof price === "string") {
    const id = price.trim();
    return id || null;
  }
  if (price && typeof price === "object" && "id" in price) {
    const id = (price as { id?: unknown }).id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return null;
}

export interface CheckoutOwnershipSession {
  id?: unknown;
  metadata?: { app?: unknown; price_id?: unknown; price?: unknown } | null;
  line_items?: { data?: Array<{ price?: unknown }> } | null;
}

/** Price ids already present on the event. Does not call Stripe. */
export function checkoutPriceIds(session: CheckoutOwnershipSession): string[] {
  const ids: string[] = [];
  const push = (price: unknown) => {
    const id = priceIdOf(price);
    if (id) ids.push(id);
  };
  for (const item of session.line_items?.data ?? []) push(item?.price);
  push(session.metadata?.price_id);
  push(session.metadata?.price);
  return ids;
}

export interface SubscriptionOwnership {
  metadata?: { app?: unknown } | null;
  items?: { data?: Array<{ price?: unknown }> } | null;
}

export function subscriptionPriceIds(subscription: SubscriptionOwnership): string[] {
  const ids: string[] = [];
  for (const item of subscription.items?.data ?? []) {
    const id = priceIdOf(item?.price);
    if (id) ids.push(id);
  }
  return ids;
}

export function priceInSet(ids: string[], prices: Set<string>): boolean {
  return ids.some((id) => prices.has(id));
}

/**
 * true: the session is AversusB.
 * false: it belongs to another app.
 * "retry": the payload had no app tag and no price, and the line-item read failed.
 */
export async function resolveCheckoutOwnership(
  session: CheckoutOwnershipSession,
  prices: Set<string>,
  fetchLineItemPriceIds: (sessionId: string) => Promise<string[] | null>
): Promise<true | false | "retry"> {
  if (isAversusBApp(session.metadata)) return true;
  const ids = checkoutPriceIds(session);
  if (priceInSet(ids, prices)) return true;
  // A labeled other app, or a payload that already names a non-AversusB price,
  // is not ours. Do not call Stripe to second-guess that.
  const app = metadataApp(session.metadata);
  if (app || ids.length > 0) return false;
  const sessionId = typeof session.id === "string" ? session.id.trim() : "";
  if (!sessionId) return false;
  const fetched = await fetchLineItemPriceIds(sessionId);
  if (fetched == null) return "retry";
  return priceInSet(fetched, prices);
}

export function subscriptionBelongsToAversusB(
  subscription: SubscriptionOwnership,
  prices: Set<string>
): boolean {
  if (isAversusBApp(subscription.metadata)) return true;
  return priceInSet(subscriptionPriceIds(subscription), prices);
}

export interface MembershipPlanFields {
  plan: string;
  interval: string;
  src: string;
}

/**
 * Plan and interval must be a real consumer plan. Missing or unknown values
 * are rejected so a foreign payload cannot be stored as plan "unknown".
 */
export function readMembershipPlan(
  metadata: { plan?: unknown; interval?: unknown; src?: unknown } | null | undefined
): MembershipPlanFields | null {
  const planId = typeof metadata?.plan === "string" ? metadata.plan.trim() : "";
  const intervalId = typeof metadata?.interval === "string" ? metadata.interval.trim() : "";
  const plan = getPlan(planId);
  const interval = plan ? getInterval(plan, intervalId) : undefined;
  if (!plan || !interval) return null;
  const src = typeof metadata?.src === "string" ? metadata.src.trim().slice(0, 40) : "";
  return { plan: plan.id, interval: interval.interval, src };
}

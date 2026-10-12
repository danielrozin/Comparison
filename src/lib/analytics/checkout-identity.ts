/**
 * One person for the pricing funnel (ROO-40).
 *
 * The browser records pricing_viewed and checkout_clicked on its PostHog
 * distinct id (often an anonymous id). Server events must reuse that same
 * id. Inventing a new one from the Stripe email — or the placeholder
 * "anonymous" — puts checkout_started and purchase on a different person,
 * so the funnel shows 0 people at checkout even when the raw events exist.
 *
 * Stripe stores the id in two places that come back on
 * checkout.session.completed:
 * - client_reference_id (max 200 characters)
 * - metadata.posthog_distinct_id (same value; also copied onto the Subscription)
 */

/** Stripe Checkout `client_reference_id` hard limit. */
export const CHECKOUT_DISTINCT_ID_MAX = 200;

/** Placeholders previously used when the real browser id was unknown. */
const SENTINEL_IDS = new Set(["anonymous", "unknown"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * A distinct id that is safe to store on a Checkout Session.
 * Returns undefined for empty values, control characters, the old
 * placeholders, and anything longer than Stripe allows.
 */
export function sanitizeCheckoutDistinctId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > CHECKOUT_DISTINCT_ID_MAX) return undefined;
  if (SENTINEL_IDS.has(trimmed)) return undefined;
  // Newlines in metadata are a request-splitting hazard and Stripe rejects some control chars.
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return undefined;
  return trimmed;
}

/** Lowercased email, or undefined when the value is not a usable address. */
export function normalizeCheckoutEmail(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) return undefined;
  return normalized;
}

/**
 * Distinct id for a server-side checkout event.
 *
 * The id the browser already used wins over the Stripe email. Email is only
 * a fallback for sessions created before this stitch existed.
 */
export function checkoutEventDistinctId(options: {
  posthogDistinctId?: unknown;
  clientReferenceId?: unknown;
  email?: unknown;
  fallback?: string;
}): string | undefined {
  const fromClient =
    sanitizeCheckoutDistinctId(options.posthogDistinctId) ||
    sanitizeCheckoutDistinctId(options.clientReferenceId);
  if (fromClient) return fromClient;

  if (typeof options.email === "string") {
    const email = options.email.trim();
    if (email) return email;
  }

  const fallback = options.fallback?.trim();
  return fallback || undefined;
}

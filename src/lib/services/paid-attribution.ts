/**
 * Paid-traffic attribution (DAN-2591)
 *
 * The Step 2 native measurement test ([DAN-2158]) has to attribute revenue to
 * paid sessions without Google Ads / Meta conversion tracking — both pixels are
 * deliberately off that critical path (DAN-79). Attribution instead runs through
 * Amazon Associates tracking-ID segregation: a paid session tags its outbound
 * Amazon links with a dedicated tracking ID, so the Associates earnings report
 * splits paid revenue from organic revenue with no ad-platform integration.
 *
 * Configuration:
 *   NEXT_PUBLIC_AMAZON_TAG_PAID - Amazon tracking ID used for ?src=paid sessions.
 *                                 Defaults to the live organic tag, which makes
 *                                 this module completely inert.
 *
 * Safety property: when NEXT_PUBLIC_AMAZON_TAG_PAID is unset (or set to the same
 * value as the organic tag) `isPaidAttributionActive()` is false and
 * `withPaidAmazonTag()` returns its input unchanged for EVERY session, including
 * ?src=paid ones. Nothing about production behaviour changes until the paid
 * tracking ID exists and is deployed.
 */

/** Live Amazon Associates tracking ID used for organic traffic (DAN-949). */
const DEFAULT_AMAZON_TAG = "goldenroz94-20";

/** Query param + value that flag a session as paid-sourced. */
export const PAID_SRC_PARAM = "src";
export const PAID_SRC_VALUE = "paid";

/** sessionStorage key that keeps a paid session attributed across page views. */
export const PAID_SESSION_KEY = "avb_traffic_src";

const ORGANIC_AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || DEFAULT_AMAZON_TAG;

const PAID_AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_TAG_PAID || DEFAULT_AMAZON_TAG;

/**
 * True only when a distinct paid tracking ID is configured. When false every
 * function below is a no-op — this is the kill switch that keeps the change
 * inert in production until the dedicated Amazon tracking ID is created.
 */
export function isPaidAttributionActive(): boolean {
  return Boolean(PAID_AMAZON_TAG) && PAID_AMAZON_TAG !== ORGANIC_AMAZON_TAG;
}

/** The tracking ID a paid session should use. Exported for tests/debugging. */
export function getPaidAmazonTag(): string {
  return PAID_AMAZON_TAG;
}

function readSessionFlag(): boolean {
  try {
    return window.sessionStorage.getItem(PAID_SESSION_KEY) === PAID_SRC_VALUE;
  } catch {
    // Private mode / storage blocked — degrade to per-page-view attribution.
    return false;
  }
}

function writeSessionFlag(): void {
  try {
    window.sessionStorage.setItem(PAID_SESSION_KEY, PAID_SRC_VALUE);
  } catch {
    // Non-fatal: the current page view is still attributed via the URL param.
  }
}

/**
 * Is the current browsing session paid-sourced?
 *
 * Landing pages carry `?src=paid`; the flag is persisted to sessionStorage so a
 * multi-page session (compare page → second compare page) stays attributed.
 * Safe to call on the server — always returns false there, which keeps the
 * server-rendered markup identical to today.
 */
export function isPaidSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get(PAID_SRC_PARAM)?.toLowerCase() === PAID_SRC_VALUE) {
      writeSessionFlag();
      return true;
    }
  } catch {
    // Fall through to the persisted flag.
  }

  return readSessionFlag();
}

function isAmazonUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return (
    host === "amzn.to" ||
    host === "amazon.com" ||
    host.endsWith(".amazon.com") ||
    /(^|\.)amazon\.[a-z.]+$/.test(host)
  );
}

/**
 * Rewrite an outbound Amazon affiliate URL with the paid tracking ID when the
 * current session is paid-sourced. Every other URL — and every non-paid session,
 * and every session at all while the paid tag is unconfigured — is returned
 * byte-identical.
 */
export function withPaidAmazonTag(url: string): string {
  if (!url) return url;
  if (!isPaidAttributionActive()) return url;
  if (!isPaidSession()) return url;

  try {
    const parsed = new URL(url);
    if (!isAmazonUrl(parsed)) return url;
    // amzn.to shortlinks carry their tag server-side; rewriting the query would
    // not change attribution, so leave them alone.
    if (parsed.hostname.toLowerCase() === "amzn.to") return url;
    if (parsed.searchParams.get("tag") === PAID_AMAZON_TAG) return url;

    // Swap the tag in place rather than re-serialising via URLSearchParams —
    // that would re-encode every other param (%20 -> +) and change links we
    // have no reason to touch.
    const swapped = url.replace(/([?&]tag=)[^&#]*/i, `$1${PAID_AMAZON_TAG}`);
    if (swapped !== url) return swapped;

    const [base, hash = ""] = url.split("#", 2);
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}tag=${PAID_AMAZON_TAG}${hash ? `#${hash}` : ""}`;
  } catch {
    // Relative or malformed URL — never break the link.
    return url;
  }
}

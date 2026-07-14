/**
 * Conversion-source attribution (DAN-2146).
 *
 * Google Ads bid optimisation needs to know whether a lead came from paid,
 * organic search, a referral or direct. We classify at submit time from the
 * live URL + referrer rather than storing a full click-attribution chain.
 */

export const CONVERSION_SOURCES = ["paid", "organic", "referral", "direct"] as const;
export type ConversionSource = (typeof CONVERSION_SOURCES)[number];

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paidsearch", "paid_search", "cpm"]);

const SEARCH_ENGINE_HOSTS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yahoo.",
  "ecosia.",
  "brave.",
  "baidu.",
  "yandex.",
  "startpage.",
];

export function isConversionSource(value: unknown): value is ConversionSource {
  return typeof value === "string" && (CONVERSION_SOURCES as readonly string[]).includes(value);
}

/**
 * Pure classifier so it can be unit-tested without a DOM.
 *
 * @param search   `window.location.search` at submit time
 * @param referrer `document.referrer` ("" when direct)
 * @param siteHost our own hostname — a referrer from ourselves is not a referral
 */
export function deriveConversionSource(
  search: string,
  referrer: string,
  siteHost = "aversusb.net"
): ConversionSource {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  // Ad-click IDs are the strongest paid signal — they survive missing utm tags.
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid") || params.has("msclkid")) {
    return "paid";
  }
  const medium = params.get("utm_medium")?.toLowerCase().trim();
  if (medium && PAID_MEDIUMS.has(medium)) return "paid";
  if (params.has("utm_source") || medium) return "referral";

  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }

  if (host === siteHost || host.endsWith(`.${siteHost}`)) return "direct";
  if (SEARCH_ENGINE_HOSTS.some((engine) => host.includes(engine))) return "organic";
  return "referral";
}

/** Browser-side helper: same `avsb_session` cookie the poll/request forms use. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = document.cookie
    .split("; ")
    .find((c) => c.startsWith("avsb_session="))
    ?.split("=")[1];
  if (!id) {
    id = crypto.randomUUID();
    document.cookie = `avsb_session=${id}; path=/; max-age=${365 * 86400}; SameSite=Lax`;
  }
  return id;
}

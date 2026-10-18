/**
 * ROO-230: only send client PostHog from canonical production hosts.
 * Preview/alias hosts (e.g. comparison-lyart.vercel.app) share the prod token
 * and pollute project 505329. Analytics-only filter — never blocks crawlers.
 */
export function isProductionAnalyticsHost(
  hostname: string | null | undefined = typeof window !== "undefined" ? window.location.hostname : null,
): boolean {
  if (!hostname) return false;
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "www.aversusb.net" || host === "aversusb.net") return true;
  // Local / CI only — never Vercel preview aliases
  if (host === "localhost" || host === "127.0.0.1") return true;
  return false;
}

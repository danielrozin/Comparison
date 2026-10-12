/**
 * Same consent rule as the PostHog bootstrap in instrumentation-client.ts.
 * Shared by that bootstrap, `trackEvent`, and the error boundary.
 *
 * Track when the visitor granted analytics, or made no choice and was not
 * geo-flagged as EU. An explicit reject, a broken cookie, or an EU visitor
 * who has not chosen stays dark.
 *
 * Callers must not import instrumentation-client.ts: that file initializes
 * PostHog as a side effect.
 */
export function analyticsAllowed(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const m = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);
    if (m) {
      const settings = JSON.parse(decodeURIComponent(m[1]));
      return Boolean(settings.analytics);
    }
    // no explicit choice: allowed unless the visitor was geo-flagged EU
    return document.cookie.indexOf("consent_region=eu") === -1;
  } catch {
    return false;
  }
}

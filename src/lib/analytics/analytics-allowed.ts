/**
 * Same consent rule as the PostHog bootstrap in instrumentation-client.ts.
 * Track when the visitor granted analytics, or made no choice outside the EU.
 * Otherwise stay dark. Callers must not import instrumentation-client.ts:
 * that file initializes PostHog as a side effect.
 */
export function analyticsAllowed(): boolean {
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

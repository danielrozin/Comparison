/**
 * ROO-97: automated browsers that PostHog's bot filter does not drop.
 *
 * Used only to skip the browser PostHog bootstrap. Server-side capture
 * (posthog-node) does not call this. A missing `navigator` (SSR, or a
 * check that throws) returns false so a real browser is never blocked
 * by an environment that has no user agent.
 */

const AUTOMATED_CLIENT_UA =
  /Lightpanda|HeadlessChrome|Lighthouse|PhantomJS|puppeteer|playwright/i;

export type AutomationSignals = {
  webdriver?: boolean;
  userAgent?: string;
};

function readNavigator(): AutomationSignals | null {
  try {
    if (typeof navigator === "undefined") return null;
    return {
      webdriver: navigator.webdriver,
      userAgent: typeof navigator.userAgent === "string" ? navigator.userAgent : "",
    };
  } catch {
    return null;
  }
}

/** True when this browser is webdriver-driven or matches a known headless UA. */
export function isAutomatedClient(signals?: AutomationSignals | null): boolean {
  const nav = signals === undefined ? readNavigator() : signals;
  if (!nav) return false;
  if (nav.webdriver === true) return true;
  return AUTOMATED_CLIENT_UA.test(nav.userAgent ?? "");
}

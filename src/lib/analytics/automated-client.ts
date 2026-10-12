/**
 * ROO-97: automated browsers that PostHog's bot filter does not drop.
 *
 * `isAutomatedClient` skips analytics capture in the browser.
 * `isHeadlessAutomationClient` is the older half of that check (webdriver
 * and known headless user agents). On-demand generation uses only that
 * half, so the ROO-159 window-size skip does not change the page.
 * Server-side capture (posthog-node) does not call either function.
 * A missing `navigator` (SSR, or a check that throws) returns false so a
 * real browser is never skipped by an environment that has no user agent.
 *
 * ROO-159: two Linux Chrome clusters (major 150, direct; major 154,
 * Google) share one window size. The user agent is the normal reduced
 * Chrome UA, so version + Linux alone would also skip real desktops.
 * See `isLinuxChromeCluster`.
 */

const AUTOMATED_CLIENT_UA =
  /Lightpanda|HeadlessChrome|Lighthouse|PhantomJS|puppeteer|playwright/i;

/**
 * Exact user agents observed on the ROO-159 clusters. Chrome's reduced UA
 * is `Chrome/<major>.0.0.0` for every desktop user on that major, so this
 * pattern is necessary but not sufficient.
 */
const LINUX_CHROME_CLUSTER_UA =
  /^Mozilla\/5\.0 \(X11; Linux x86_64\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/(150|154)\.0\.0\.0 Safari\/537\.36$/;

/**
 * Screen and viewport PostHog stored on every pageview in both clusters
 * (`$screen_*` is `screen.*`, `$viewport_*` is `window.inner*`).
 * In the 14 days through 2026-10-06 this pair appeared only on these two
 * user agents: 1919×992 inside a 1920×1080 screen. Other Linux Chrome
 * windows in that data were a different size (often 1905px wide, which is
 * the scrollbar). `navigator.webdriver` was not set — those hits were
 * recorded after the ROO-97 check — and `$browser_language` was en-US.
 */
const CLUSTER_SCREEN_WIDTH = 1920;
const CLUSTER_SCREEN_HEIGHT = 1080;
const CLUSTER_VIEWPORT_WIDTH = 1919;
const CLUSTER_VIEWPORT_HEIGHT = 992;

export type AutomationSignals = {
  webdriver?: boolean;
  userAgent?: string;
  /** `screen.width` / PostHog `$screen_width`. */
  screenWidth?: number;
  /** `screen.height` / PostHog `$screen_height`. */
  screenHeight?: number;
  /** `window.innerWidth` / PostHog `$viewport_width`. */
  viewportWidth?: number;
  /** `window.innerHeight` / PostHog `$viewport_height`. */
  viewportHeight?: number;
};

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readNavigator(): AutomationSignals | null {
  try {
    if (typeof navigator === "undefined") return null;
    const currentScreen = typeof screen === "undefined" ? undefined : screen;
    const currentWindow = typeof window === "undefined" ? undefined : window;
    return {
      webdriver: navigator.webdriver,
      userAgent: typeof navigator.userAgent === "string" ? navigator.userAgent : "",
      screenWidth: finiteNumber(currentScreen?.width),
      screenHeight: finiteNumber(currentScreen?.height),
      viewportWidth: finiteNumber(currentWindow?.innerWidth),
      viewportHeight: finiteNumber(currentWindow?.innerHeight),
    };
  } catch {
    return null;
  }
}

function isLinuxChromeCluster(nav: AutomationSignals): boolean {
  return (
    nav.screenWidth === CLUSTER_SCREEN_WIDTH &&
    nav.screenHeight === CLUSTER_SCREEN_HEIGHT &&
    nav.viewportWidth === CLUSTER_VIEWPORT_WIDTH &&
    nav.viewportHeight === CLUSTER_VIEWPORT_HEIGHT &&
    LINUX_CHROME_CLUSTER_UA.test(nav.userAgent ?? "")
  );
}

function resolve(signals?: AutomationSignals | null): AutomationSignals | null {
  return signals === undefined ? readNavigator() : signals;
}

/**
 * ROO-97 only: webdriver or a known headless user agent.
 * On-demand comparison generation uses this, not `isAutomatedClient`,
 * so the ROO-159 window-size skip does not change what a visitor is shown.
 */
export function isHeadlessAutomationClient(signals?: AutomationSignals | null): boolean {
  const nav = resolve(signals);
  if (!nav) return false;
  if (nav.webdriver === true) return true;
  return AUTOMATED_CLIENT_UA.test(nav.userAgent ?? "");
}

/**
 * True when this browser should not send analytics.
 * Webdriver and known headless user agents (ROO-97), or the ROO-159
 * Linux Chrome window. Does not change the page.
 */
export function isAutomatedClient(signals?: AutomationSignals | null): boolean {
  const nav = resolve(signals);
  if (!nav) return false;
  if (isHeadlessAutomationClient(nav)) return true;
  return isLinuxChromeCluster(nav);
}

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  isAutomatedClient,
  isHeadlessAutomationClient,
  type AutomationSignals,
} from "../automated-client";

const REAL_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Reduced UA shared by the clusters and by real Linux desktop Chrome. */
const LINUX_CHROME_150 =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";
const LINUX_CHROME_154 =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36";
const LINUX_CHROME_148 =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36";

const WINDOWS_CHROME_154 =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36";
const MAC_CHROME_154 =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36";
const ANDROID_CHROME_154 =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36";
const IOS_CHROME_154 =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/154.0.0.0 Mobile/15E148 Safari/604.1";

/** Screen 1920×1080, viewport 1919×992. Only these two clusters sent this. */
const CLUSTER_WINDOW = {
  screenWidth: 1920,
  screenHeight: 1080,
  viewportWidth: 1919,
  viewportHeight: 992,
};

describe("isAutomatedClient", () => {
  it("does not flag a normal browser", () => {
    expect(isAutomatedClient({ webdriver: false, userAgent: REAL_CHROME })).toBe(false);
    expect(isAutomatedClient({ userAgent: REAL_CHROME })).toBe(false);
    expect(isAutomatedClient({ webdriver: false, userAgent: "" })).toBe(false);
  });

  it("skips when navigator.webdriver is true, even with a normal user agent", () => {
    expect(isAutomatedClient({ webdriver: true, userAgent: REAL_CHROME })).toBe(true);
  });

  it("skips known headless and automation user agents", () => {
    for (const userAgent of [
      "Lightpanda/1.0",
      "Mozilla/5.0 Lightpanda/1.0",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 Chrome-Lighthouse",
      "Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1",
      "Mozilla/5.0 puppeteer",
      "Mozilla/5.0 Playwright/1.40",
    ]) {
      expect(isAutomatedClient({ webdriver: false, userAgent })).toBe(true);
    }
  });

  it("matches those user agents case-insensitively", () => {
    expect(isAutomatedClient({ userAgent: "lightpanda/1.0" })).toBe(true);
    expect(isAutomatedClient({ userAgent: "headlesschrome/120" })).toBe(true);
  });

  it("skips the ROO-159 Linux Chrome clusters (150 direct and 154 Google share one window)", () => {
    // webdriver is false: these hits were already recorded past the ROO-97 check.
    for (const userAgent of [LINUX_CHROME_150, LINUX_CHROME_154]) {
      expect(
        isAutomatedClient({ webdriver: false, userAgent, ...CLUSTER_WINDOW }),
      ).toBe(true);
    }
  });

  it("keeps real Chrome, including Linux desktops that share the cluster user agent", () => {
    const keep: Array<{ label: string; signals: AutomationSignals }> = [
      {
        label: "Linux Chrome 154, scrollbar width 1905",
        signals: {
          webdriver: false,
          userAgent: LINUX_CHROME_154,
          screenWidth: 1920,
          screenHeight: 1080,
          viewportWidth: 1905,
          viewportHeight: 1080,
        },
      },
      {
        label: "Linux Chrome 150, viewport fills the screen",
        signals: {
          webdriver: false,
          userAgent: LINUX_CHROME_150,
          screenWidth: 1920,
          screenHeight: 1080,
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      },
      {
        label: "Linux Chrome 150 user agent with no window size",
        signals: { webdriver: false, userAgent: LINUX_CHROME_150 },
      },
      {
        label: "Linux Chrome 148 even with the cluster window",
        signals: { webdriver: false, userAgent: LINUX_CHROME_148, ...CLUSTER_WINDOW },
      },
      {
        label: "Linux Chrome 150 portrait window (different slice, not this rule)",
        signals: {
          webdriver: false,
          userAgent: LINUX_CHROME_150,
          screenWidth: 1440,
          screenHeight: 900,
          viewportWidth: 1080,
          viewportHeight: 1920,
        },
      },
      {
        label: "Windows Chrome 154 with the cluster window",
        signals: { webdriver: false, userAgent: WINDOWS_CHROME_154, ...CLUSTER_WINDOW },
      },
      {
        label: "macOS Chrome 154 with the cluster window",
        signals: { webdriver: false, userAgent: MAC_CHROME_154, ...CLUSTER_WINDOW },
      },
      {
        label: "Android Chrome 154",
        signals: { webdriver: false, userAgent: ANDROID_CHROME_154, ...CLUSTER_WINDOW },
      },
      {
        label: "iOS Chrome 154",
        signals: { webdriver: false, userAgent: IOS_CHROME_154, ...CLUSTER_WINDOW },
      },
      {
        label: "Windows Chrome without a window size",
        signals: { webdriver: false, userAgent: REAL_CHROME },
      },
    ];

    for (const { label, signals } of keep) {
      expect({ label, skip: isAutomatedClient(signals) }).toEqual({ label, skip: false });
    }
  });

  it("is SSR-safe when navigator is missing", () => {
    expect(isAutomatedClient(null)).toBe(false);

    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: undefined,
    });
    try {
      expect(isAutomatedClient()).toBe(false);
    } finally {
      if (descriptor) Object.defineProperty(globalThis, "navigator", descriptor);
    }
  });

  it("gates posthog.init in the client bootstrap and does not run for this environment", () => {
    expect(isAutomatedClient()).toBe(false);

    const source = readFileSync(path.resolve(process.cwd(), "instrumentation-client.ts"), "utf8");
    const guardAt = source.indexOf("!isAutomatedClient()");
    const initAt = source.indexOf("posthog.init(");
    expect(guardAt).toBeGreaterThan(-1);
    expect(initAt).toBeGreaterThan(guardAt);
  });

  it("does not use the window-size skip to change on-demand generation", () => {
    expect(
      isHeadlessAutomationClient({ webdriver: false, userAgent: LINUX_CHROME_150, ...CLUSTER_WINDOW }),
    ).toBe(false);
    expect(isHeadlessAutomationClient({ webdriver: true, userAgent: REAL_CHROME })).toBe(true);

    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/comparison/OnDemandComparison.tsx"),
      "utf8",
    );
    expect(source).toContain("isHeadlessAutomationClient()");
    expect(source).not.toContain("isAutomatedClient(");
  });
});

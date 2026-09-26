import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isAutomatedClient } from "../automated-client";

const REAL_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

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
});

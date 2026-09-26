/**
 * ROO-81 — the phone cookie bar is one row and about 64px tall (h-16),
 * so it no longer covers the compare and pricing CTAs. Consent handlers
 * stay the same; only the layout and the short mobile sentence change.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/utils/analytics", () => ({
  trackEvent: vi.fn(),
}));

import { COMPACT_MOBILE_COOKIE_BAR, CookieConsentBanner } from "./CookieConsentBanner";

describe("CookieConsentBanner compact phone bar (ROO-81)", () => {
  beforeEach(() => {
    document.cookie = "cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps Accept All, Reject All, and Settings on one compact row", async () => {
    expect(COMPACT_MOBILE_COOKIE_BAR).toBe(true);

    render(<CookieConsentBanner />);

    await waitFor(() => {
      expect(document.querySelector('[data-cookie-bar="compact"]')).toBeTruthy();
    });

    const bar = document.querySelector('[data-cookie-bar="compact"]') as HTMLElement;
    expect(bar.className).toContain("md:hidden");
    // h-16 is 64px, under the ~80px phone target. Safe-area padding sits outside it.
    expect(bar.querySelector(".h-16")).toBeTruthy();

    const actions = bar.querySelector('[data-cookie-actions="compact"]') as HTMLElement;
    expect(actions.className).toContain("flex");
    expect(actions.className).not.toContain("grid-cols");

    const labels = [...actions.querySelectorAll("button")].map((b) => b.textContent);
    expect(labels).toEqual(["Accept All", "Reject All", "Settings"]);
    expect(bar.textContent).toContain("Cookie Policy");
  });

  it("still records Accept All through the existing consent helper", async () => {
    render(<CookieConsentBanner />);

    const bar = await waitFor(() => {
      const el = document.querySelector('[data-cookie-bar="compact"]');
      expect(el).toBeTruthy();
      return el as HTMLElement;
    });

    fireEvent.click(bar.querySelector("button") as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Cookie consent" })).not.toBeInTheDocument();
    });
    expect(document.cookie).toContain("cookie_consent=");
    expect(document.cookie).toContain("analytics");
  });

  it("opens the existing preferences sheet from Settings", async () => {
    render(<CookieConsentBanner />);

    const bar = await waitFor(() => {
      const el = document.querySelector('[data-cookie-bar="compact"]');
      expect(el).toBeTruthy();
      return el as HTMLElement;
    });

    const settings = [...bar.querySelectorAll("button")].find((b) => b.textContent === "Settings");
    fireEvent.click(settings as HTMLButtonElement);

    expect(await screen.findByText("Cookie Preferences")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Preferences" })).toBeInTheDocument();
    expect(document.querySelector('[data-cookie-bar="compact"]')).toBeNull();
  });
});

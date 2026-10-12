/**
 * ROO-132 — a refused or failed custom-compare submit stays honest.
 */
import { fireEvent, render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackMatchupRequested = vi.fn();
const trackCustomCompareGated = vi.fn();
const trackCustomCompareError = vi.fn();
const trackRelatedComparisonClick = vi.fn();
const trackPricingCtaClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackMatchupRequested: (...args: unknown[]) => trackMatchupRequested(...args),
  trackCustomCompareGated: (...args: unknown[]) => trackCustomCompareGated(...args),
  trackCustomCompareError: (...args: unknown[]) => trackCustomCompareError(...args),
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
  trackPricingCtaClick: (...args: unknown[]) => trackPricingCtaClick(...args),
}));

import { CustomCompareForm } from "../CustomCompareForm";

const escapes = [
  { slug: "iphone-17-vs-samsung-s26", label: "iPhone 17 vs Samsung Galaxy S26" },
  { slug: "usa-vs-china", label: "USA vs China" },
  { slug: "mac-vs-windows", label: "Mac vs Windows" },
];

function fillAndSubmit(container: HTMLElement) {
  const view = within(container);
  fireEvent.change(view.getByLabelText("First side"), { target: { value: "Notion" } });
  fireEvent.change(view.getByLabelText("Second side"), { target: { value: "Obsidian" } });
  fireEvent.change(view.getByLabelText("Email you paid with"), { target: { value: "free@example.com" } });
  fireEvent.click(view.getByRole("button", { name: "Request this comparison" }));
}

describe("CustomCompareForm failures", () => {
  beforeEach(() => {
    trackMatchupRequested.mockClear();
    trackCustomCompareGated.mockClear();
    trackCustomCompareError.mockClear();
    vi.unstubAllGlobals();
  });

  it("shows escape links and custom_compare_gated when the email is not Pro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({
          ok: false,
          code: "upgrade_required",
          error: "Custom comparisons are a Pro feature, so this request was not submitted. Nothing was queued.",
          upgradeUrl: "/pricing?src=custom-compare",
        }),
      }),
    );

    const { container } = render(<CustomCompareForm escapes={escapes} />);
    fillAndSubmit(container);

    const alert = await within(container).findByRole("alert");
    expect(alert.textContent).toMatch(/not submitted/i);
    expect(alert.textContent).not.toMatch(/24 hours/i);
    expect(within(alert).getByRole("link", { name: "iPhone 17 vs Samsung Galaxy S26" })).toHaveAttribute(
      "href",
      "/compare/iphone-17-vs-samsung-s26?source_page=%2Fcustom-compare",
    );
    expect(within(alert).getByRole("link", { name: "See Pro pricing" })).toBeTruthy();
    expect(trackCustomCompareGated).toHaveBeenCalledWith("upgrade_required");
    expect(trackCustomCompareError).not.toHaveBeenCalled();
  });

  it("shows the same links and custom_compare_error when membership cannot be checked", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({
          ok: false,
          code: "unavailable",
          error: "We could not check membership just now. Nothing was submitted. Please try again in a minute.",
        }),
      }),
    );

    const { container } = render(<CustomCompareForm escapes={escapes} />);
    fillAndSubmit(container);

    const alert = await within(container).findByRole("alert");
    expect(alert.textContent).toMatch(/Nothing was submitted/i);
    expect(alert.textContent).not.toMatch(/24 hours/i);
    expect(within(alert).getByRole("link", { name: "USA vs China" })).toHaveAttribute(
      "href",
      "/compare/usa-vs-china?source_page=%2Fcustom-compare",
    );
    expect(trackCustomCompareError).toHaveBeenCalledWith("unavailable");
    expect(trackCustomCompareGated).not.toHaveBeenCalled();
  });

  it("records a network failure without claiming the request was received", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const { container } = render(<CustomCompareForm escapes={escapes} />);
    fillAndSubmit(container);

    const alert = await within(container).findByRole("alert");
    expect(alert.textContent).toMatch(/Nothing was sent/i);
    expect(alert.textContent).not.toMatch(/24 hours/i);
    expect(within(alert).getByRole("link", { name: "See Pro pricing" })).toBeTruthy();
    expect(trackCustomCompareError).toHaveBeenCalledWith("network");
  });
});

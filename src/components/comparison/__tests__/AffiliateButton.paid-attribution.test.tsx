/**
 * DAN-2591 — end-to-end wiring check: the rendered <a href> of the shared
 * affiliate CTA picks up the paid tracking ID for a ?src=paid session, and is
 * left untouched when no paid tag is configured.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, within } from "@testing-library/react";
import type { AffiliateLink } from "@/types";

const ORGANIC_TAG = "goldenroz94-20";
const PAID_TAG = "goldenrozpaid-20";

const LINK: AffiliateLink = {
  url: `https://www.amazon.com/s?k=Sony%20WH-1000XM5&tag=${ORGANIC_TAG}`,
  partner: "amazon",
  label: "Shop Sony WH-1000XM5 on Amazon",
};

async function renderButton(paidTag: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_AMAZON_AFFILIATE_TAG", ORGANIC_TAG);
  vi.stubEnv("NEXT_PUBLIC_AMAZON_TAG_PAID", paidTag);
  const { AffiliateButton } = await import("../AffiliateButton");
  const { container } = render(<AffiliateButton link={LINK} />);
  return within(container).getByRole("link");
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/compare/sony-vs-bose");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("AffiliateButton paid attribution", () => {
  it("keeps the organic tag when no paid tag is configured", async () => {
    window.history.replaceState({}, "", "/compare/sony-vs-bose?src=paid");
    const anchor = await renderButton("");
    expect(anchor.getAttribute("href")).toBe(LINK.url);
  });

  it("keeps the organic tag for an organic session", async () => {
    const anchor = await renderButton(PAID_TAG);
    expect(anchor.getAttribute("href")).toBe(LINK.url);
  });

  it("renders the paid tag for a ?src=paid session", async () => {
    window.history.replaceState({}, "", "/compare/sony-vs-bose?src=paid");
    const anchor = await renderButton(PAID_TAG);
    expect(anchor.getAttribute("href")).toBe(
      `https://www.amazon.com/s?k=Sony%20WH-1000XM5&tag=${PAID_TAG}`,
    );
  });

  it("keeps the paid tag on a later page view in the same session", async () => {
    window.history.replaceState({}, "", "/compare/sony-vs-bose?src=paid");
    await renderButton(PAID_TAG);

    window.history.replaceState({}, "", "/compare/apple-vs-sony");
    const anchor = await renderButton(PAID_TAG);
    expect(anchor.getAttribute("href")).toContain(`tag=${PAID_TAG}`);
  });
});

/**
 * ROO-54 — /pricing hero buy button is a real checkout control, above the
 * headline, so the cookie banner cannot cover it on a short phone.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
    identify: vi.fn(),
    get_distinct_id: () => "ph_test",
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

import { PricingHeroCta } from "../PricingHeroCta";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("PricingHeroCta (ROO-54)", () => {
  it("places the checkout control above the pricing headline", () => {
    const page = source("src/app/pricing/page.tsx");
    const shell = source("src/components/layout/HubShell.tsx");
    const hero = source("src/components/monetization/PricingHeroCta.tsx");

    const heroSlot = page.indexOf("beforeTitle={");
    const cta = page.indexOf("<PricingHeroCta");
    const cards = page.indexOf("<CheckoutButton");
    expect(heroSlot).toBeGreaterThan(-1);
    expect(cta).toBeGreaterThan(heroSlot);
    // Plan cards stay on the page; they are the second way to buy.
    expect(cards).toBeGreaterThan(cta);

    // HubShell paints beforeTitle above the h1, under the breadcrumb.
    // Prop order in the page file is not the paint order.
    const breadcrumb = shell.indexOf('aria-label="Breadcrumb"');
    const slot = shell.indexOf("{beforeTitle");
    const heading = shell.indexOf("<h1");
    expect(breadcrumb).toBeGreaterThan(-1);
    expect(slot).toBeGreaterThan(breadcrumb);
    expect(heading).toBeGreaterThan(slot);

    expect(hero).toContain("<CheckoutButton");
    expect(hero).toContain('id="pricing-primary-cta"');
    expect(hero).not.toContain("checkout opens this week");
  });

  it("offers Stripe checkout when the price is live", () => {
    render(
      <PricingHeroCta
        plan="pro"
        planName="Pro"
        interval="year"
        price={49}
        src="blog"
        paymentsLive
      />,
    );

    const button = screen.getByRole("button", { name: "Get Pro — $49/year" });
    expect(button).toBeEnabled();
    expect(screen.getByText("Opens Stripe Checkout. Comparisons stay free.")).toBeInTheDocument();
    expect(screen.queryByText(/nothing is charged today/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/checkout opens this week/i)).not.toBeInTheDocument();
  });

  it("keeps the button tappable and says nothing is charged when Stripe is not configured", () => {
    render(
      <PricingHeroCta
        plan="pro"
        planName="Pro"
        interval="year"
        price={49}
        src="direct"
        paymentsLive={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Get Pro — $49/year" })).toBeEnabled();
    expect(screen.getByText(/Nothing is charged today/)).toBeInTheDocument();
  });
});

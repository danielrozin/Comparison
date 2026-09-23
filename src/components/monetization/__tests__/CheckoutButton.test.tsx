/**
 * ROO-40 — identify the known email before leaving for Stripe, and send the
 * browser distinct id that already owns pricing_viewed / checkout_clicked.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const identify = vi.fn();
const capture = vi.fn();
let distinctId = "ph_anon_019";

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    identify: (...args: unknown[]) => identify(...args),
    get_distinct_id: () => distinctId,
  },
}));

vi.mock("@/lib/services/clarity-service", () => ({
  tagComparisonView: vi.fn(),
  tagSearchQuery: vi.fn(),
  tagExperimentVariant: vi.fn(),
  tagUserAction: vi.fn(),
  tagEngagement: vi.fn(),
}));

const fetchMock = vi.fn();
const assign = vi.fn();

describe("CheckoutButton identify-before-redirect (ROO-40)", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    distinctId = "ph_anon_019";
    identify.mockClear();
    capture.mockClear();
    fetchMock.mockReset();
    assign.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, assign },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("sends the current distinct id and does not identify when no email is known", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        mode: "stripe",
        url: "https://checkout.stripe.com/c/pay/cs_test_direct",
      }),
    });

    const { CheckoutButton } = await import("../CheckoutButton");
    render(
      <CheckoutButton plan="pro" interval="year" src="header" label="Get Pro" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Pro" }));

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_direct");
    });

    expect(identify).not.toHaveBeenCalled();
    const body = JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body);
    expect(body).toEqual({
      plan: "pro",
      interval: "year",
      src: "header",
      posthogDistinctId: "ph_anon_019",
    });
    expect(capture).toHaveBeenCalledWith(
      "checkout_clicked",
      { plan: "pro", interval: "year", src: "header" },
      { send_instantly: true, transport: "sendBeacon" },
    );
    // The click is handed to PostHog before the checkout request starts,
    // so it is in flight while Stripe creates the session.
    expect(capture.mock.invocationCallOrder[0]).toBeLessThan(fetchMock.mock.invocationCallOrder[0]);
  });

  it("shows the Stripe note when this price is live", async () => {
    const { CheckoutButton } = await import("../CheckoutButton");
    render(
      <CheckoutButton plan="pro" interval="year" src="header" label="Get Pro" paymentsLive />,
    );
    expect(screen.getByText(/Continues on Stripe/)).toBeInTheDocument();
  });

  it("shows the Stripe error instead of the reservation form when session create fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ error: "Checkout failed: Invalid API Key provided: sk_test_x" }),
    });

    const { CheckoutButton } = await import("../CheckoutButton");
    render(<CheckoutButton plan="pro" interval="year" src="header" label="Get Pro" paymentsLive />);

    fireEvent.click(screen.getByRole("button", { name: "Get Pro" }));

    expect(await screen.findByText(/Checkout failed: Invalid API Key/)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("you@company.com")).not.toBeInTheDocument();
    expect(screen.queryByText(/Nothing is charged today/)).not.toBeInTheDocument();
  });

  it("shows an error instead of the reservation form when checkout rejects for a non-email reason", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Unknown plan" }),
    });

    const { CheckoutButton } = await import("../CheckoutButton");
    render(
      <CheckoutButton plan="nope" interval="year" src="header" label="Get Pro" paymentsLive />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Pro" }));

    expect(await screen.findByText("Unknown plan")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("you@company.com")).not.toBeInTheDocument();
    expect(screen.queryByText(/Nothing is charged today/)).not.toBeInTheDocument();
  });

  it("calls posthog.identify with the email before redirecting to Stripe", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "A valid email is required to reserve the founding price" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          mode: "stripe",
          url: "https://checkout.stripe.com/c/pay/cs_test_email",
        }),
      });

    const { CheckoutButton } = await import("../CheckoutButton");
    render(
      <CheckoutButton plan="pro" interval="year" src="header" label="Get Pro" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Pro" }));
    const input = await screen.findByPlaceholderText("you@company.com");
    fireEvent.change(input, { target: { value: "Buyer@Example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_email");
    });

    expect(identify).toHaveBeenCalledWith("buyer@example.com", { email: "buyer@example.com" });
    // The id sent to Stripe is the one that already owns the funnel events,
    // read before identify() aliases it to the email.
    const stripeCall = fetchMock.mock.calls[1];
    const body = JSON.parse((stripeCall[1] as { body: string }).body);
    expect(body.email).toBe("Buyer@Example.com");
    expect(body.posthogDistinctId).toBe("ph_anon_019");

    const identifyOrder = identify.mock.invocationCallOrder[0];
    const fetchOrder = fetchMock.mock.invocationCallOrder[1];
    const assignOrder = assign.mock.invocationCallOrder[0];
    expect(identifyOrder).toBeLessThan(fetchOrder);
    expect(identifyOrder).toBeLessThan(assignOrder);
    // A second identify is queued immediately before navigation.
    expect(identify.mock.invocationCallOrder.at(-1)).toBeLessThan(assignOrder);
  });

  it("identifies an email already on this browser before the Stripe redirect", async () => {
    distinctId = "buyer@example.com";
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        mode: "stripe",
        url: "https://checkout.stripe.com/c/pay/cs_test_known",
      }),
    });

    const { CheckoutButton } = await import("../CheckoutButton");
    render(
      <CheckoutButton plan="pro" interval="month" src="footer" label="Get Pro monthly" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Get Pro monthly" }));

    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_known");
    });

    expect(identify).toHaveBeenCalledWith("buyer@example.com", { email: "buyer@example.com" });
    expect(identify.mock.invocationCallOrder.at(-1)).toBeLessThan(assign.mock.invocationCallOrder[0]);
    const body = JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body);
    expect(body.posthogDistinctId).toBe("buyer@example.com");
  });
});

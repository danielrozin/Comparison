import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const analytics = vi.hoisted(() => ({
  identifySubscriber: vi.fn(),
  trackCompareChangeAlertSignup: vi.fn(),
  trackCompareChangeAlertViewed: vi.fn(),
}));
vi.mock("@/lib/utils/analytics", () => analytics);

import { CompareChangeAlert } from "@/components/comparison/CompareChangeAlert";

describe("ROO-242 compare change alert", () => {
  beforeEach(() => {
    Object.values(analytics).forEach((fn) => fn.mockClear());
  });

  it("names the two items in the copy", () => {
    render(<CompareChangeAlert compareSlug="rx-9060-xt-vs-rx-9070" matchup="RX 9060 XT vs RX 9070" />);
    expect(screen.getByRole("heading", { name: "Get notified when RX 9060 XT vs RX 9070 changes" })).toBeTruthy();
  });

  it("posts to /api/newsletter tagged with compare_slug and tracks the signup", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<CompareChangeAlert compareSlug="a-vs-b" matchup="A vs B" />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "x@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }));
    await waitFor(() => expect(analytics.trackCompareChangeAlertSignup).toHaveBeenCalledWith("a-vs-b"));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/newsletter");
    expect(JSON.parse(init.body)).toEqual({
      email: "x@example.com",
      source: "compare_change_alert",
      referrerSlug: "a-vs-b",
      compareSlug: "a-vs-b",
    });
    vi.unstubAllGlobals();
  });
});

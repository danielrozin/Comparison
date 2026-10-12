import { describe, it, expect } from "vitest";

describe("POST /api/v1/stripe/webhook", () => {
  it("returns 410 and does not read the body", async () => {
    const { POST } = await import("../route");
    const res = await POST();
    expect(res.status).toBe(410);
    expect(await res.json()).toEqual({
      error: "This webhook endpoint is no longer available.",
    });
  });
});

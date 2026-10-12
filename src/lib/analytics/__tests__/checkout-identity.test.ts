/**
 * ROO-40 — server checkout events must reuse the browser distinct id.
 */
import { describe, it, expect } from "vitest";
import {
  checkoutEventDistinctId,
  normalizeCheckoutEmail,
  sanitizeCheckoutDistinctId,
} from "../checkout-identity";

describe("checkout identity (ROO-40)", () => {
  it("keeps a real browser distinct id and drops placeholders", () => {
    expect(sanitizeCheckoutDistinctId("  ph_anon_019  ")).toBe("ph_anon_019");
    expect(sanitizeCheckoutDistinctId("anonymous")).toBeUndefined();
    expect(sanitizeCheckoutDistinctId("unknown")).toBeUndefined();
    expect(sanitizeCheckoutDistinctId("bad\nid")).toBeUndefined();
    expect(sanitizeCheckoutDistinctId("x".repeat(201))).toBeUndefined();
  });

  it("normalizes a checkout email", () => {
    expect(normalizeCheckoutEmail("  Buyer@Example.com ")).toBe("buyer@example.com");
    expect(normalizeCheckoutEmail("not-an-email")).toBeUndefined();
  });

  it("prefers the browser id over the Stripe email", () => {
    expect(
      checkoutEventDistinctId({
        posthogDistinctId: "ph_anon_019",
        clientReferenceId: "other",
        email: "buyer@example.com",
        fallback: "cus_abc",
      }),
    ).toBe("ph_anon_019");
  });

  it("uses client_reference_id when metadata has no distinct id", () => {
    expect(
      checkoutEventDistinctId({
        clientReferenceId: "ph_from_reference",
        email: "buyer@example.com",
      }),
    ).toBe("ph_from_reference");
  });

  it("falls back to email only when the session has no client id", () => {
    expect(
      checkoutEventDistinctId({
        posthogDistinctId: "anonymous",
        email: "buyer@example.com",
        fallback: "cus_abc",
      }),
    ).toBe("buyer@example.com");
  });
});

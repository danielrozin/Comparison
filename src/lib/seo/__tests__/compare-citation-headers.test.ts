import { describe, it, expect } from "vitest";

import {
  buildCompareCitationLinkHeader,
  shouldAdvertiseCompareCitationHeaders,
} from "../compare-citation-headers";

describe("compare citation Link headers (ROO-24 P0-2)", () => {
  it("does not advertise schema/FAQ/answer for a missing compare", () => {
    expect(
      shouldAdvertiseCompareCitationHeaders({
        slug: "signal-vs-whatsapp",
        pageExists: false,
      }),
    ).toBe(false);
    expect(
      shouldAdvertiseCompareCitationHeaders({
        slug: "china-vs-united-states-gdp-comparison-2026",
        pageExists: false,
      }),
    ).toBe(false);
  });

  it("does not advertise citation APIs for a redirect-source slug", () => {
    expect(
      shouldAdvertiseCompareCitationHeaders({
        slug: "china-vs-us-gdp-nominal-2026",
        pageExists: true,
        isRedirectSource: true,
      }),
    ).toBe(false);
  });

  it("advertises citation APIs only for a live compare", () => {
    expect(
      shouldAdvertiseCompareCitationHeaders({
        slug: "us-vs-china-gdp",
        pageExists: true,
      }),
    ).toBe(true);
  });

  it("refuses empty or path-like slugs", () => {
    expect(
      shouldAdvertiseCompareCitationHeaders({ slug: "", pageExists: true }),
    ).toBe(false);
    expect(
      shouldAdvertiseCompareCitationHeaders({
        slug: "us-vs-china-gdp/extra",
        pageExists: true,
      }),
    ).toBe(false);
  });

  it("builds Link values that name the live slug only", () => {
    const header = buildCompareCitationLinkHeader("us-vs-china-gdp");
    expect(header).toContain("/api/v1/schema/us-vs-china-gdp");
    expect(header).toContain("/api/faq/us-vs-china-gdp");
    expect(header).toContain("/api/answer/us-vs-china-gdp");
    expect(header).not.toContain("signal-vs-whatsapp");
  });
});

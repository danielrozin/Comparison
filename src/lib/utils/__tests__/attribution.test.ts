import { describe, it, expect } from "vitest";
import { deriveConversionSource, isConversionSource } from "../attribution";

describe("deriveConversionSource", () => {
  it("treats ad click IDs as paid even without utm tags", () => {
    expect(deriveConversionSource("?gclid=abc123", "")).toBe("paid");
    expect(deriveConversionSource("?msclkid=abc123", "https://google.com/")).toBe("paid");
    expect(deriveConversionSource("?gbraid=abc", "")).toBe("paid");
  });

  it("treats cpc-family utm mediums as paid", () => {
    expect(deriveConversionSource("?utm_medium=CPC", "")).toBe("paid");
    expect(deriveConversionSource("?utm_medium=paid_search", "")).toBe("paid");
  });

  it("classifies a search-engine referrer as organic", () => {
    expect(deriveConversionSource("", "https://www.google.com/")).toBe("organic");
    expect(deriveConversionSource("", "https://duckduckgo.com/?q=x")).toBe("organic");
  });

  it("classifies a non-search external referrer as referral", () => {
    expect(deriveConversionSource("", "https://reddit.com/r/x")).toBe("referral");
  });

  it("classifies non-paid utm campaigns as referral", () => {
    expect(deriveConversionSource("?utm_source=newsletter&utm_medium=email", "")).toBe("referral");
  });

  it("treats no referrer, our own pages, and junk referrers as direct", () => {
    expect(deriveConversionSource("", "")).toBe("direct");
    expect(deriveConversionSource("", "https://aversusb.net/compare/a-vs-b")).toBe("direct");
    expect(deriveConversionSource("", "https://www.aversusb.net/")).toBe("direct");
    expect(deriveConversionSource("", "not-a-url")).toBe("direct");
  });

  it("accepts a search string with or without the leading ?", () => {
    expect(deriveConversionSource("gclid=abc", "")).toBe("paid");
  });
});

describe("isConversionSource", () => {
  it("accepts only the four known sources", () => {
    expect(isConversionSource("paid")).toBe(true);
    expect(isConversionSource("direct")).toBe(true);
    expect(isConversionSource("email")).toBe(false);
    expect(isConversionSource(undefined)).toBe(false);
  });
});

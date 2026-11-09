import { describe, expect, it } from "vitest";
import { buildMemberWelcomeEmail } from "../welcome-email";

describe("buildMemberWelcomeEmail", () => {
  it("includes the plan, the charge, what Pro unlocks, and both links", () => {
    const message = buildMemberWelcomeEmail({
      planId: "pro",
      interval: "year",
      amountMajor: 49,
      currency: "usd",
      siteUrl: "https://www.aversusb.net",
    });

    expect(message.subject).toContain("Pro");
    expect(message.planName).toBe("Pro");
    expect(message.customCompareUrl).toBe("https://www.aversusb.net/custom-compare");
    expect(message.billingUrl).toBe("https://www.aversusb.net/account/billing");
    expect(message.text).toContain("49.00 USD");
    expect(message.text).toContain("custom comparison");
    expect(message.text).toContain("2 custom comparisons per month");
    expect(message.html).toContain("https://www.aversusb.net/custom-compare");
    expect(message.html).toContain("https://www.aversusb.net/account/billing");
    expect(message.html).not.toContain("<script");
  });

  it("uses Business features when that plan was purchased", () => {
    const message = buildMemberWelcomeEmail({
      planId: "business",
      interval: "month",
      siteUrl: "https://www.aversusb.net",
    });
    expect(message.planName).toBe("Business");
    expect(message.text).toContain("Production API access");
    expect(message.text).not.toContain("Charged:");
  });

  it("tells a trial member nothing is charged yet instead of printing a 0.00 receipt", () => {
    const message = buildMemberWelcomeEmail({
      planId: "pro",
      interval: "month",
      amountMajor: 0,
      currency: "usd",
      siteUrl: "https://www.aversusb.net",
    });
    expect(message.text).toContain("7-day free trial has started");
    expect(message.text).not.toContain("Payment received");
    expect(message.text).not.toContain("Charged:");
    expect(message.html).not.toContain("Charged:");
  });

  it("keeps the receipt wording for a paid monthly checkout", () => {
    const message = buildMemberWelcomeEmail({
      planId: "pro",
      interval: "month",
      amountMajor: 9,
      currency: "usd",
      siteUrl: "https://www.aversusb.net",
    });
    expect(message.text).toContain("Payment received");
    expect(message.text).toContain("9.00 USD");
  });
});

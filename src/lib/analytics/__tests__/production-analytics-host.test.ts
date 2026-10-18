import { describe, expect, it } from "vitest";
import { isProductionAnalyticsHost } from "../production-analytics-host";

describe("isProductionAnalyticsHost", () => {
  it("allows canonical production hosts", () => {
    expect(isProductionAnalyticsHost("www.aversusb.net")).toBe(true);
    expect(isProductionAnalyticsHost("aversusb.net")).toBe(true);
  });

  it("allows local development hosts", () => {
    expect(isProductionAnalyticsHost("localhost")).toBe(true);
    expect(isProductionAnalyticsHost("127.0.0.1")).toBe(true);
  });

  it("rejects Vercel preview and project aliases", () => {
    expect(isProductionAnalyticsHost("comparison-lyart.vercel.app")).toBe(false);
    expect(isProductionAnalyticsHost("comparison-git-main-daniarozin-gmailcoms-projects.vercel.app")).toBe(false);
    expect(isProductionAnalyticsHost("comparison-bjwgzuehb-daniarozin-gmailcoms-projects.vercel.app")).toBe(false);
  });

  it("rejects empty", () => {
    expect(isProductionAnalyticsHost("")).toBe(false);
    expect(isProductionAnalyticsHost(null)).toBe(false);
  });
});

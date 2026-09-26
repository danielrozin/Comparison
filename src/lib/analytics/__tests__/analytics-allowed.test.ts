import { describe, it, expect, beforeEach } from "vitest";
import { analyticsAllowed } from "../analytics-allowed";

function clearCookies() {
  document.cookie.split(";").forEach((part) => {
    const name = part.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

describe("analyticsAllowed", () => {
  beforeEach(() => {
    clearCookies();
  });

  it("allows analytics when the visitor has not chosen and is not in the EU", () => {
    expect(analyticsAllowed()).toBe(true);
  });

  it("blocks analytics for an EU visitor who has not chosen", () => {
    document.cookie = "consent_region=eu";
    expect(analyticsAllowed()).toBe(false);
  });

  it("follows an explicit analytics choice", () => {
    document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify({ analytics: false }))}`;
    expect(analyticsAllowed()).toBe(false);
    clearCookies();
    document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify({ analytics: true }))}`;
    expect(analyticsAllowed()).toBe(true);
  });
});

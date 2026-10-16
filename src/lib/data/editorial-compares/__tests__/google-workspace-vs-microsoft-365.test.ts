import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Google Workspace vs Microsoft 365 (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("google-workspace-vs-microsoft-365", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["google-drive-vs-onedrive", "slack-vs-microsoft-teams"],
      sourceHosts: /^https:\/\/(workspace\.google\.com|www\.microsoft\.com)\//,
      facts: ["30 GB", "5 TB", "300 users", "Business Premium", "Defender for Business"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});

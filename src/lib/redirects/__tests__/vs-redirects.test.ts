import { describe, it, expect } from "vitest";

import { VS_REDIRECTS } from "../vs-redirects";

describe("VS_REDIRECTS", () => {
  it("301-redirects every DAN-873 /vs/* link to its /compare/* canonical", () => {
    const expected = [
      "aws-vs-azure",
      "aws-vs-google-cloud",
      "azure-vs-google-cloud",
    ];

    for (const slug of expected) {
      const hit = VS_REDIRECTS.find((r) => r.source === `/vs/${slug}`);
      expect(hit, `missing redirect for /vs/${slug}`).toBeDefined();
      expect(hit?.destination).toBe(`/compare/${slug}`);
      expect(hit?.permanent).toBe(true);
    }
  });

  it("301-redirects the DAN-1079 single-entity /vs/* links to /entity/* profiles", () => {
    const expected = ["claude", "gemini"];

    for (const slug of expected) {
      const hit = VS_REDIRECTS.find((r) => r.source === `/vs/${slug}`);
      expect(hit, `missing redirect for /vs/${slug}`).toBeDefined();
      expect(hit?.destination).toBe(`/entity/${slug}`);
      expect(hit?.permanent).toBe(true);
    }
  });

  it("only aliases the /vs/* prefix to canonical /compare or /entity routes", () => {
    for (const r of VS_REDIRECTS) {
      expect(r.source.startsWith("/vs/")).toBe(true);
      expect(
        r.destination.startsWith("/compare/") ||
          r.destination.startsWith("/entity/"),
      ).toBe(true);
    }
  });
});

import { describe, expect, it } from "vitest";
import { IMPLEMENTATION_NOTES, getImplementationNote } from "../implementation-notes";

describe("implementation notes", () => {
  const entries = Object.entries(IMPLEMENTATION_NOTES);

  it("stays a short editorial list", () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBeLessThanOrEqual(15);
  });

  it("links only to goldenroz.com deep pages, each target once", () => {
    const hrefs = entries.map(([, n]) => n.href);
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\/goldenroz\.com\/[a-z0-9-]+(\/[a-z0-9-]+)*\/$/);
    }
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("has real copy and descriptive link text", () => {
    for (const [, n] of entries) {
      expect(n.body.length).toBeGreaterThan(120);
      expect(n.linkText.length).toBeGreaterThan(15);
      expect(n.linkText.toLowerCase()).not.toBe("goldenroz");
      expect(n.body).not.toMatch(/[—!]/);
    }
  });

  it("returns null for pages without a note", () => {
    expect(getImplementationNote("messi-vs-ronaldo")).toBeNull();
    expect(getImplementationNote(undefined)).toBeNull();
    expect(getImplementationNote("aws-vs-azure")?.href).toContain("cloud-migration-services");
  });
});

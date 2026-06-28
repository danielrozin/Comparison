import { describe, it, expect } from "vitest";
import { isDegenerateComparisonSlug } from "../slugify";

describe("isDegenerateComparisonSlug", () => {
  it("flags a self-comparison (X-vs-X)", () => {
    expect(isDegenerateComparisonSlug("grubhub-vs-grubhub")).toBe(true);
  });

  it("flags a self-comparison case-insensitively", () => {
    expect(isDegenerateComparisonSlug("GrubHub-vs-grubhub")).toBe(true);
  });

  it("flags an N-way slug with a repeated entity", () => {
    expect(isDegenerateComparisonSlug("a-vs-b-vs-a")).toBe(true);
  });

  it("passes a genuine two-entity comparison", () => {
    expect(isDegenerateComparisonSlug("roborock-vs-roomba")).toBe(false);
  });

  it("passes a genuine N-way comparison", () => {
    expect(isDegenerateComparisonSlug("a-vs-b-vs-c")).toBe(false);
  });

  it("returns false for a non-comparison slug (no -vs-)", () => {
    expect(isDegenerateComparisonSlug("just-an-entity")).toBe(false);
  });
});

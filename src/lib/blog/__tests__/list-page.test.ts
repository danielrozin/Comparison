import { describe, expect, it } from "vitest";
import { blogListPageIsOutOfRange, parseBlogListPage } from "../list-page";

describe("blog list page params", () => {
  it("treats a missing page as page 1 and rejects 0, negatives, and non-integers", () => {
    expect(parseBlogListPage(undefined)).toBe(1);
    expect(parseBlogListPage("")).toBe(1);
    expect(parseBlogListPage("1")).toBe(1);
    expect(parseBlogListPage("2")).toBe(2);
    expect(parseBlogListPage("0")).toBe("invalid");
    expect(parseBlogListPage("-1")).toBe("invalid");
    expect(parseBlogListPage("foo")).toBe("invalid");
    expect(parseBlogListPage("1.5")).toBe("invalid");
    expect(parseBlogListPage("01")).toBe("invalid");
  });

  it("marks pages past the last page as out of range, including an empty list", () => {
    expect(blogListPageIsOutOfRange(1, 0)).toBe(false);
    expect(blogListPageIsOutOfRange(2, 0)).toBe(true);
    expect(blogListPageIsOutOfRange(1, 12)).toBe(false);
    expect(blogListPageIsOutOfRange(2, 12)).toBe(true);
    expect(blogListPageIsOutOfRange(2, 13)).toBe(false);
    expect(blogListPageIsOutOfRange(3, 13)).toBe(true);
  });
});

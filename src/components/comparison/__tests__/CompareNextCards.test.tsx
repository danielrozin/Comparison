import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: vi.fn(),
  trackCompareNextSearch: vi.fn(),
}));

import { trackRelatedComparisonClick, trackCompareNextSearch } from "@/lib/utils/analytics";
import { CompareNextCards } from "@/components/comparison/CompareNextCards";

describe("CompareNextCards (ROO-155)", () => {
  const chips = [
    { slug: "a-vs-b", label: "A vs B" },
    { slug: "self-vs-page", label: "Self" },
    { slug: "c-vs-d", label: "C vs D" },
    { slug: "e-vs-f", label: "E vs F" },
    { slug: "g-vs-h", label: "G vs H" },
  ];

  it("renders up to 3 live cards (excluding the current page) and tags placement", () => {
    render(<CompareNextCards slug="self-vs-page" chips={chips} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]!.getAttribute("href")).toBe("/compare/a-vs-b?source_page=%2Fcompare%2Fself-vs-page");
    fireEvent.click(links[1]!);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith("/compare/self-vs-page", "c-vs-d", {
      placement: "compare_next",
      position: "2",
    });
  });

  it("tracks the compare-something-else search", () => {
    render(<CompareNextCards slug="x-vs-y" chips={[]} />);
    const input = screen.getByLabelText("Compare something else") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "iphone vs pixel" } });
    fireEvent.submit(input.closest("form")!);
    expect(trackCompareNextSearch).toHaveBeenCalledWith("iphone vs pixel", "x-vs-y");
  });
});

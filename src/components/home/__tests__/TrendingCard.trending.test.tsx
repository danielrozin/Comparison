/**
 * ROO-47 — trending cards are an obvious /compare path, and the click
 * is tracked only when the page asks for it.
 */
import { render, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrendingComparison } from "@/types";

const trackRelatedComparisonClick = vi.fn();

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: (...args: unknown[]) => trackRelatedComparisonClick(...args),
}));

import { TrendingCard } from "../TrendingCard";

const comparison: TrendingComparison = {
  slug: "chatgpt-vs-gemini",
  title: "ChatGPT vs Gemini",
  category: "technology",
  viewCount: 10,
  entityImages: [],
};

describe("TrendingCard compare path", () => {
  beforeEach(() => {
    trackRelatedComparisonClick.mockClear();
  });

  it("keeps View Comparison visible and tracks the click on /trending", () => {
    const view = render(
      <TrendingCard
        comparison={comparison}
        rank={4}
        trackSource="trending"
        emphasizeCta
      />,
    );

    const link = view.getByRole("link", { name: /ChatGPT vs Gemini/i });
    expect(link).toHaveAttribute(
      "href",
      "/compare/chatgpt-vs-gemini?source_page=trending",
    );
    expect(link.className).not.toContain("max-h-0");
    expect(view.getByText("View Comparison").parentElement?.className).not.toContain("max-h-0");

    fireEvent.click(link);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith(
      "trending",
      "chatgpt-vs-gemini",
    );
    view.unmount();
  });

  it("does not emit related_comparison_click from the home card", () => {
    const view = render(<TrendingCard comparison={comparison} rank={1} />);
    const link = view.getByRole("link", { name: /ChatGPT vs Gemini/i });

    expect(link).toHaveAttribute(
      "href",
      "/compare/chatgpt-vs-gemini?source_page=trending",
    );
    expect(view.getByText("View Comparison").parentElement?.className).toContain("max-h-0");

    fireEvent.click(link);
    expect(trackRelatedComparisonClick).not.toHaveBeenCalled();
    view.unmount();
  });
});

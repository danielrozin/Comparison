import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/lib/utils/analytics", () => ({
  trackRelatedComparisonClick: vi.fn(),
  trackCompareNextSearch: vi.fn(),
}));

import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import { CompareNextRow } from "@/components/comparison/CompareNextCards";

function source(rel: string): string {
  return readFileSync(path.resolve(process.cwd(), rel), "utf8");
}

describe("CompareNextRow (ROO-264)", () => {
  beforeEach(() => vi.clearAllMocks());

  const chips = [
    { slug: "a-vs-b", label: "A vs B" },
    { slug: "self-vs-page", label: "Self" },
    { slug: "c-vs-d", label: "C vs D" },
    { slug: "e-vs-f", label: "E vs F" },
    { slug: "g-vs-h", label: "G vs H" },
  ];

  it("renders up to 3 links (not the current page) and fires related_comparison_click with placement under-verdict-next", () => {
    render(<CompareNextRow slug="self-vs-page" chips={chips} />);
    const row = screen.getByTestId("compare-next-row");
    expect(row.getAttribute("data-placement")).toBe("under-verdict-next");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/compare/a-vs-b?source_page=%2Fcompare%2Fself-vs-page",
      "/compare/c-vs-d?source_page=%2Fcompare%2Fself-vs-page",
      "/compare/e-vs-f?source_page=%2Fcompare%2Fself-vs-page",
    ]);
    fireEvent.click(links[2]!);
    expect(trackRelatedComparisonClick).toHaveBeenCalledWith("/compare/self-vs-page", "e-vs-f", {
      placement: "under-verdict-next",
      position: "3",
    });
  });

  it("renders nothing with fewer than 2 links", () => {
    const { container } = render(
      <CompareNextRow slug="self-vs-page" chips={[{ slug: "a-vs-b", label: "A vs B" }, { slug: "self-vs-page", label: "Self" }]} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("sits directly under the verdict on both layouts; feedback widget moved lower, not deleted", () => {
    const page = source("src/pages/compare/[slug].tsx");
    const card = source("src/components/comparison/VerdictCard.tsx");
    expect(card).not.toContain("<VerdictFeedbackWidget");

    const verdictCard = page.indexOf("<VerdictCard");
    const firstRow = page.indexOf("<CompareNextRow", verdictCard);
    expect(firstRow).toBeGreaterThan(verdictCard);
    expect(page.slice(verdictCard, firstRow)).not.toContain("<CompareChangeAlert");

    const feedback = page.indexOf("<VerdictFeedbackWidget");
    expect(feedback).toBeGreaterThan(page.indexOf("<CompareNextCards", firstRow));
    expect(feedback).toBeLessThan(page.indexOf("function MultiEntityLayout"));

    const multiVerdict = page.indexOf('aria-label="Verdict"');
    const secondRow = page.indexOf("<CompareNextRow", multiVerdict);
    expect(secondRow).toBeGreaterThan(multiVerdict);
    expect(page.slice(multiVerdict, secondRow)).not.toContain("<CompareChangeAlert");
  });
});

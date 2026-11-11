import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { listEditorialComparisons } from "@/lib/data/editorial-compares";
import { ExpertAnalysis } from "../ExpertAnalysis";

beforeAll(() => {
  const view = window as Window & {
    matchMedia: typeof window.matchMedia;
    IntersectionObserver: typeof IntersectionObserver;
  };
  if (!view.matchMedia) {
    view.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  if (!view.IntersectionObserver) {
    class Observer {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    view.IntersectionObserver = Observer as unknown as typeof IntersectionObserver;
  }
});

afterEach(() => {
  cleanup();
});

function dashBlocks(analysis: string): string[] {
  return analysis.split(/\n\n+/).filter((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.length > 0 && lines.every((line) => line.startsWith("- "));
  });
}

function renderAnalysis(analysis: string, slug = "legacy-vs-legacy") {
  return render(
    <ExpertAnalysis
      analysis={analysis}
      slug={slug}
      entityAName="Alpha"
      entityBName="Beta"
      updatedAt="2026-11-08T00:00:00Z"
    />,
  );
}

describe("analysis blocks stay legacy unless a heading opts in", () => {
  it("renders existing dash paragraphs as paragraphs, hyphens included", () => {
    const legacy = listEditorialComparisons().filter((page) => {
      const analysis = page.expertAnalysis ?? "";
      return !/^##\s+\S/m.test(analysis) && dashBlocks(analysis).length > 0;
    });
    expect(legacy.length).toBeGreaterThanOrEqual(60);

    for (const page of legacy) {
      renderAnalysis(page.expertAnalysis!, page.slug);
      expect(screen.queryByRole("list")).toBeNull();
      expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
      expect(screen.queryByRole("table")).toBeNull();
      const dash = dashBlocks(page.expertAnalysis!)[0]!.split("\n")[0]!;
      expect(document.querySelector("#expert-analysis")?.textContent).toContain(dash);
      cleanup();
    }
  });

  it("uses h3, a list, and a captioned table only after a ## heading", () => {
    renderAnalysis(
      [
        "Direct answer for this pair.",
        "- First takeaway stays a list item\n- Second takeaway stays a list item",
        "## The specification row is 16 GB and 24 GB",
        "AMD specification figures opened 8 November 2026.\n| Specification | Alpha | Beta |\n| --- | --- | --- |\n| Memory | 16 GB | 24 GB |",
      ].join("\n\n"),
    );

    const headings = screen.getAllByRole("heading");
    expect(headings.map((heading) => heading.tagName)).toEqual([
      "H2",
      "H3",
    ]);
    expect(headings[0]).toHaveTextContent("Analysis: Alpha vs Beta");
    expect(headings[1]).toHaveTextContent("The specification row is 16 GB and 24 GB");
    expect(headings[1]?.compareDocumentPosition(headings[0]!) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "First takeaway stays a list item",
      "Second takeaway stays a list item",
    ]);

    const table = screen.getByRole("table");
    expect(table.querySelector("caption")?.textContent).toMatch(/opened 8 November 2026/);
    expect(table.querySelectorAll("th[scope='col']")).toHaveLength(3);
    expect(table.querySelectorAll("th[scope='row']")).toHaveLength(1);
    expect(screen.getByText("Drafted with AI from web research.")).toBeInTheDocument();
  });
});

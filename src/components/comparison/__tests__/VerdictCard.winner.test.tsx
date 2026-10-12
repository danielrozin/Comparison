/**
 * A null quickAnswer.winnerName means the scorecard has no single overall
 * winner. Unequal attribute scores must not grow a page-level "— winner" badge.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import type { ComparisonAttribute, ComparisonEntityData } from "@/types";
import { VerdictCard } from "../VerdictCard";

function entity(id: string, name: string): ComparisonEntityData {
  return {
    id,
    slug: id,
    name,
    shortDesc: null,
    imageUrl: null,
    entityType: "product",
    position: id === "a" ? 0 : 1,
    pros: [],
    cons: [],
    bestFor: `People who want ${name}`,
  };
}

function winningAttr(id: string, winnerId: "a" | "b"): ComparisonAttribute {
  return {
    id,
    slug: id,
    name: id,
    unit: null,
    category: null,
    dataType: "text",
    higherIsBetter: true,
    values: [
      {
        entityId: "a",
        valueText: "a",
        valueNumber: null,
        valueBoolean: null,
        winner: winnerId === "a",
      },
      {
        entityId: "b",
        valueText: "b",
        valueNumber: null,
        valueBoolean: null,
        winner: winnerId === "b",
      },
    ],
  };
}

const ENTITIES = [entity("a", "Cursor"), entity("b", "GitHub Copilot")];

function ariaLabels(container: HTMLElement): string[] {
  return [...container.querySelectorAll("[aria-label]")].map(
    (el) => el.getAttribute("aria-label") ?? "",
  );
}

beforeEach(() => {
  // Reduced motion skips IntersectionObserver in the score bar and scroll reveal.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: String(query).includes("reduce"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

function renderCard(winnerName: string | null | undefined, attributes: ComparisonAttribute[]) {
  return render(
    <VerdictCard
      verdict="Metric by metric only."
      shortAnswer={null}
      entities={ENTITIES}
      attributes={attributes}
      comparisonSlug="cursor-vs-copilot"
      {...(winnerName === undefined ? {} : { winnerName })}
    />,
  );
}

describe("VerdictCard winnerName contract", () => {
  // One win for Copilot → scoreB 10, scoreA 5. Live pages crown that gap.
  const unequal = [winningAttr("price", "b")];

  it("does not crown a winner when winnerName is null and scores differ", () => {
    const { container } = renderCard(null, unequal);
    const labels = ariaLabels(container).join("\n");

    expect(labels).toContain("GitHub Copilot: 10 out of 10");
    expect(labels).toContain("Cursor: 5 out of 10");
    expect(labels).not.toMatch(/winner/i);
    expect(labels).not.toMatch(/wins/);
    expect(labels).not.toMatch(/tied/i);
    expect(container.textContent).not.toMatch(/Best pick/);
    expect(container.textContent).not.toMatch(/TIE/);
  });

  it("does not crown a winner when winnerName is blank", () => {
    const { container } = renderCard("   ", unequal);
    const labels = ariaLabels(container).join("\n");

    expect(labels).not.toMatch(/winner/i);
    expect(container.textContent).not.toMatch(/Best pick/);
  });

  it("still crowns the higher score when winnerName is set", () => {
    const { container } = renderCard("GitHub Copilot", unequal);
    const labels = ariaLabels(container).join("\n");

    expect(labels).toContain("GitHub Copilot: 10 out of 10 — winner");
    expect(labels).toContain("GitHub Copilot wins");
    expect(labels).not.toContain("Cursor: 5 out of 10 — winner");
    expect(container.textContent).toMatch(/Best pick/);
  });

  it("keeps the score-based crown when winnerName is omitted", () => {
    const { container } = renderCard(undefined, unequal);
    const labels = ariaLabels(container).join("\n");

    expect(labels).toContain("GitHub Copilot: 10 out of 10 — winner");
  });

  it("still shows a tie when the scores are equal", () => {
    const tied = [winningAttr("models", "a"), winningAttr("autocomplete", "b")];
    const { container } = renderCard(null, tied);
    const labels = ariaLabels(container).join("\n");

    expect(labels).not.toMatch(/winner/i);
    expect(labels).toMatch(/tied/i);
    expect(container.textContent).toMatch(/TIE/);
    expect(container.textContent).not.toMatch(/Best pick/);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/lib/utils/analytics", () => ({ trackCustomCompareBuildStarted: vi.fn() }));

import { trackCustomCompareBuildStarted } from "@/lib/utils/analytics";
import { CustomCompareBuilder } from "@/components/monetization/CustomCompareBuilder";

describe("CustomCompareBuilder (ROO-132)", () => {
  const assign = vi.fn();
  beforeEach(() => {
    assign.mockReset();
    Object.defineProperty(window, "location", { value: { ...window.location, assign }, writable: true });
  });

  it("sends two names to the canonical compare URL and tracks it", () => {
    render(<CustomCompareBuilder />);
    fireEvent.change(screen.getByLabelText("First item"), { target: { value: "Nespresso" } });
    fireEvent.change(screen.getByLabelText("Second item"), { target: { value: "Keurig" } });
    fireEvent.submit(screen.getByTestId("custom-compare-builder"));
    expect(trackCustomCompareBuildStarted).toHaveBeenCalledTimes(1);
    const slug = (trackCustomCompareBuildStarted as ReturnType<typeof vi.fn>).mock.calls[0]![0] as string;
    expect(slug).toMatch(/-vs-/);
    expect(assign).toHaveBeenCalledWith(`/compare/${slug}`);
  });

  it("refuses a self-compare", () => {
    render(<CustomCompareBuilder />);
    fireEvent.change(screen.getByLabelText("First item"), { target: { value: "Tea" } });
    fireEvent.change(screen.getByLabelText("Second item"), { target: { value: "Tea" } });
    fireEvent.submit(screen.getByTestId("custom-compare-builder"));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(assign).not.toHaveBeenCalled();
  });
});

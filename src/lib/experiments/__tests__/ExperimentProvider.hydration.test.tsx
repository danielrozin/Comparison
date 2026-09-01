/**
 * Hydration guard for the A/B provider.
 *
 * The server render must depend only on the cookie, never on the browser-only
 * visitor id. When it depended on the visitor id, the server used the literal
 * "server" while the browser used a localStorage value, so any variant-driven
 * markup differed on hydration and React threw #418. These tests pin the render
 * output to the cookie and confirm the variant now resolves after mount.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import { render, waitFor } from "@testing-library/react";
import { ExperimentProvider, useExperiment } from "../ExperimentProvider";

const EXPERIMENT_ID = "follow-cta-copy"; // active, 100% traffic

function Consumer() {
  const { variant } = useExperiment(EXPERIMENT_ID);
  return <span data-testid="variant">{variant}</span>;
}

/** Replicates the provider's hash so we can pick an id that assigns "alerts". */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** A visitor id whose assignment is the non-control "alerts" variant. */
function findAlertsVisitorId(): string {
  const variants = ["control", "alerts"];
  for (let i = 0; i < 1000; i++) {
    const id = `visitor-${i}`;
    if (variants[hashString(id + EXPERIMENT_ID) % variants.length] === "alerts") {
      return id;
    }
  }
  throw new Error("no alerts-assigning visitor id found");
}

beforeEach(() => {
  window.localStorage.clear();
  document.cookie = "ab_experiments=; path=/; max-age=0";
});

describe("ExperimentProvider hydration", () => {
  it("renders control on the server regardless of the stored visitor id", () => {
    window.localStorage.setItem("ab_visitor_id", findAlertsVisitorId());

    const html = renderToString(
      <ExperimentProvider>
        <Consumer />
      </ExperimentProvider>
    );

    // Server markup ignores the browser visitor id, so it stays on control —
    // identical to the first client render, which is what avoids the mismatch.
    expect(html).toContain(">control<");
  });

  it("resolves the assigned variant on the client after mount", async () => {
    window.localStorage.setItem("ab_visitor_id", findAlertsVisitorId());

    const { getByTestId } = render(
      <ExperimentProvider>
        <Consumer />
      </ExperimentProvider>
    );

    await waitFor(() =>
      expect(getByTestId("variant").textContent).toBe("alerts")
    );
    expect(document.cookie).toContain("ab_experiments=");
  });
});

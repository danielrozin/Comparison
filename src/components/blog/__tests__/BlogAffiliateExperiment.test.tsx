/**
 * ROO-359 — the blog affiliate block is test-only, disclosed, and reuses
 * affiliate_link_clicked with page + variant.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

const { getFeatureFlag, register, onFeatureFlags, trackAffiliateClick } = vi.hoisted(() => ({
  getFeatureFlag: vi.fn(),
  register: vi.fn(),
  onFeatureFlags: vi.fn((cb: () => void) => {
    cb();
    return () => {};
  }),
  trackAffiliateClick: vi.fn(),
}));

vi.mock("posthog-js", () => ({
  default: {
    getFeatureFlag: (...args: unknown[]) => getFeatureFlag(...args),
    onFeatureFlags: (cb: () => void) => onFeatureFlags(cb),
    register: (...args: unknown[]) => register(...args),
  },
}));

vi.mock("@/lib/utils/analytics", () => ({
  trackAffiliateClick: (...args: unknown[]) => trackAffiliateClick(...args),
}));

vi.mock("@/lib/hooks/usePaidAffiliateHref", () => ({
  usePaidAffiliateHref: (url: string) => url,
}));

import { BlogAffiliateExperiment } from "../BlogAffiliateExperiment";

const KEURIG = "/blog/best-keurig-pods-2026-ranked-flavor-value-compatibility";

beforeEach(() => {
  getFeatureFlag.mockReset();
  register.mockReset();
  onFeatureFlags.mockClear();
  trackAffiliateClick.mockReset();
});

describe("BlogAffiliateExperiment", () => {
  it("renders nothing and does not evaluate the flag off the experiment paths", () => {
    getFeatureFlag.mockReturnValue("test");
    const { container } = render(
      <BlogAffiliateExperiment path="/blog/best-cloud-platform-2026" />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(getFeatureFlag).not.toHaveBeenCalled();
  });

  it("renders nothing for control and still records the arm", () => {
    getFeatureFlag.mockReturnValue("control");
    render(<BlogAffiliateExperiment path={KEURIG} />);
    expect(screen.queryByText(/Amazon Associate/)).not.toBeInTheDocument();
    expect(getFeatureFlag).toHaveBeenCalledWith("avb-aff-block-blog");
    expect(register).toHaveBeenCalledWith({ avb_aff_block_blog: "control" });
  });

  it("shows a disclosed Amazon block for the test arm and tracks the click", () => {
    getFeatureFlag.mockReturnValue("test");
    render(<BlogAffiliateExperiment path={KEURIG} />);

    expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Keurig K-Cup variety pack/ });
    expect(link).toHaveAttribute("rel", expect.stringContaining("sponsored"));
    expect(link.getAttribute("href")).toMatch(/amazon\.com\/s\?k=/);
    expect(link.getAttribute("href")).toContain("tag=");

    fireEvent.click(link);

    expect(trackAffiliateClick).toHaveBeenCalledWith(
      "Keurig K-Cup variety pack",
      "blog_aff_block",
      KEURIG,
      expect.objectContaining({
        partner: "amazon",
        variant: "test",
        experiment: "avb-aff-block-blog",
        page_path: KEURIG,
        cta_type: "affiliate",
      }),
    );
  });

  it("stays hidden when the flag is off or still loading", () => {
    getFeatureFlag.mockReturnValue(undefined);
    const { container } = render(<BlogAffiliateExperiment path="/blog" />);
    expect(container).toBeEmptyDOMElement();
    expect(register).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import path from "path";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/lib/utils/analytics", () => ({ trackCommunityLinkClicked: track }));

import { CompareRedditFooterLink } from "@/components/community/CompareRedditFooterLink";
import { COMPARE_FOOTER_REDDIT_THREAD_URL } from "@/lib/community/reddit-thread";

describe("compare footer Reddit link", () => {
  it("is disclosed, uses the config URL with no UTM, rel=noopener, and fires community_link_clicked", () => {
    render(<CompareRedditFooterLink compareSlug="deel-vs-remote" />);
    const link = screen.getByRole("link", { name: "Debate this on r/ThisOrThatDebate" });
    expect(link).toHaveAttribute("href", COMPARE_FOOTER_REDDIT_THREAD_URL);
    expect(COMPARE_FOOTER_REDDIT_THREAD_URL).toBe("https://www.reddit.com/r/ThisOrThatDebate/comments/1x5l7i0/");
    expect(link.getAttribute("href")).not.toMatch(/utm_/);
    expect(link).toHaveAttribute("rel", "noopener");
    expect(screen.getByTestId("compare-reddit-footer").textContent).toContain("(run by the AversusB team)");
    fireEvent.click(link);
    expect(track).toHaveBeenCalledWith({ placement: "compare_footer", compare_slug: "deel-vs-remote" });
  });

  it("is rendered on both /compare layouts", () => {
    const src = readFileSync(path.resolve(process.cwd(), "src/pages/compare/[slug].tsx"), "utf8");
    expect(src.match(/<CompareRedditFooterLink /g)?.length).toBe(2);
  });
});

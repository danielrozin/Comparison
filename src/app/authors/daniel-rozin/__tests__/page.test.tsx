import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children?: ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/comparison/ComparisonClientWidgets", () => ({ NewsletterSignup: () => null }));
vi.mock("@/components/engagement/NewsletterSignup", () => ({ NewsletterSignup: () => null }));

import DanielRozinPage from "@/app/authors/daniel-rozin/page";
import { HUMAN_REVIEWED_SLUGS } from "@/lib/editorial/human-reviewed";

describe("Daniel's author page credits only human-reviewed pages", () => {
  it("lists no AI-drafted hub, compare or blog page while the list is empty", () => {
    expect(HUMAN_REVIEWED_SLUGS).toEqual([]);
    const { container } = render(<DanielRozinPage />);
    const html = container.innerHTML;
    for (const hub of ["/password-manager-comparison\"", "/browser-comparison-2026\"", "/llm-comparisons\""]) {
      expect(html).not.toContain(`href="${hub}`);
    }
    expect(html).not.toMatch(/href="\/(compare|blog)\//);
    expect(html).not.toContain('"publishedWork"');
    expect(html).toContain("No pages are marked as personally reviewed by Daniel yet.");
  });
});

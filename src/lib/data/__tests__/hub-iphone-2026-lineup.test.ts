import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { hubSchemas } from "@/lib/seo/hub-schemas";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";

const BANNED = /this page|the page|according to|checked|fetch|Source note|human review|reviewed by|\bbest\b|\bwinner\b/i;

describe("phone-laptop hub: iPhone 2026 lineup block (ROO-275)", () => {
  const hub = HUB_CONFIG["phone-laptop"];
  const block = hub.lineupBlocks?.find((b) => b.id === "iphone-2026-lineup");

  it("adds one dated block with the live 17/18 compares and the Duo article", () => {
    expect(block).toBeDefined();
    expect(block!.heading).toBe("iPhone 2026 lineup: 17 Pro Max, 18 Pro Max and iPhone Duo");
    expect(block!.updated).toBe("2026-10-19");
    expect(block!.links.map((l) => l.slug).sort()).toEqual(
      ["iphone-17-pro-max-vs-iphone-18-pro-max", "iphone-17-pro-vs-iphone-18-pro", "iphone-17-pro-vs-pro-max", "iphone-18-pro-vs-iphone-18-pro-max"].sort(),
    );
    for (const link of block!.links) expect(isRedirectedCompareSlug(link.slug)).toBe(false);
  });

  it("links the iPhone Duo article", () => {
    expect(block!.articles?.map((a) => a.href)).toEqual(["/blog/iphone-duo-features"]);
  });

  it("keeps reader copy plain and cites Apple only", () => {
    const copy = [block!.heading, block!.intro, ...block!.links.flatMap((l) => [l.label, l.note]), ...(block!.articles ?? []).flatMap((a) => [a.label, a.note])].join("\n");
    expect(copy).not.toMatch(BANNED);
    for (const source of block!.sources) expect(source.url).toMatch(/^https:\/\/www\.apple\.com\/newsroom\//);
  });

  it("adds no FAQs and no schema", () => {
    expect(hub.faqs).toHaveLength(5);
    const withBlock = JSON.stringify(hubSchemas(hub, []));
    const withoutBlock = JSON.stringify(hubSchemas({ ...hub, lineupBlocks: undefined }, []));
    expect(withBlock).toBe(withoutBlock);
  });

  it("renders the block under an H2 through the live-slug gate", () => {
    const page = readFileSync("src/app/hub/[slug]/page.tsx", "utf8");
    expect(page).toMatch(/hub\.lineupBlocks/);
    expect(page).toMatch(/filterLiveCompareSlugs\(block\.links/);
    expect(page).toMatch(/<h2 id=\{`\$\{block\.id\}-heading`\}/);
  });
});

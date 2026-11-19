import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/alternatives/onenote/page.tsx", "utf8");
const sitemap = readFileSync("src/app/sitemap.ts", "utf8");

function stringConst(name: string): string {
  const match = page.match(new RegExp(`const ${name} =\\s*\\n?\\s*"([^"]*)"`));
  if (!match) throw new Error(`missing const ${name}`);
  return match[1];
}

describe("OneNote alternatives page", () => {
  it("keeps the title and description inside the AEO length limits", () => {
    const title = stringConst("PAGE_TITLE");
    const description = stringConst("PAGE_DESCRIPTION");
    expect(title.length + " | A Versus B".length).toBeLessThanOrEqual(60);
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("ships a self-hosted section without prices, a winner, or the banned word", () => {
    expect(page).toContain('id="onenote-self-hosted"');
    expect(page).toContain("Drafted with AI from web research.");
    expect(page).toContain("Joplin Server");
    expect(page).toContain("Self-hosted LiveSync");
    expect(page).not.toMatch(/\bchecked\b/i);
    expect(page).not.toMatch(/\bwinner\b/i);
    expect(page).not.toMatch(/\$\d/);
    expect(page).not.toMatch(/£|€/);
    expect(page).not.toMatch(/better pick|better value|better buy/i);
    expect(page).not.toMatch(/isHumanReviewed/);
    expect(page).not.toMatch(/winnerName/);
    expect(page).not.toMatch(/human-reviewed|human reviewed/i);
    expect(page).not.toMatch(/joplin-vs-onenote|obsidian-vs-onenote/);
    expect(page).not.toMatch(/not documented/i);
  });

  it("does not claim that Trilium imports OneNote", () => {
    const hits = page
      .split("\n")
      .filter((line) => /trilium/i.test(line) && /onenote/i.test(line) && /import/i.test(line));
    expect(hits).toEqual([]);
    expect(page).not.toMatch(/Trilium (can |does )?import OneNote/i);
    expect(page).not.toMatch(/import OneNote into Trilium/i);
  });

  it("points internal links only at the live slugs named for this page", () => {
    expect(page).toContain('href="/alternatives/notion"');
    expect(page).toContain('href="/alternatives/obsidian"');
    expect(page).toContain('href="/compare/notion-vs-obsidian"');
  });

  it("appends the sitemap URL without rewriting earlier alternative rows", () => {
    expect(sitemap).toContain('`${SITE_URL}/alternatives/salesforce`');
    const salesforce = sitemap.indexOf("/alternatives/salesforce");
    const onenote = sitemap.indexOf("/alternatives/onenote");
    expect(onenote).toBeGreaterThan(salesforce);
    expect(sitemap).toContain(
      '{ url: `${SITE_URL}/alternatives/onenote`, lastModified: "2026-11-19", changeFrequency: "weekly", priority: 0.8 },',
    );
  });

  it("builds FAQ schema from the same strings the section renders", () => {
    expect(page).toContain("FAQS.map((item) => ({");
    expect(page).toContain("{item.answer}");
    expect(page).toContain("What is the closest alternative to OneNote?");
    expect(page).toContain("Is there a self-hosted OneNote alternative?");
    expect(page).toContain("What is a good OneNote alternative for handwriting and PDF annotation?");
    expect(page).toContain("Can I import my OneNote notebooks into another app?");
    expect(page).toContain("Which OneNote alternative fits handwritten lecture notes?");
    expect(page).toContain("Does Obsidian sync without a Microsoft account?");
  });
});

import { describe, it, expect } from "vitest";

import robots from "../robots";

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function starRule() {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
  const star = rules.find((rule) => rule.userAgent === "*");
  if (!star) {
    throw new Error("robots() is missing the User-agent: * group");
  }
  return star;
}

/**
 * Prefix match used by robots.txt for rules without * or $.
 * Query-parameter rules (/*?*utm_ and friends) are not path prefixes.
 */
function prefixDisallows(path: string, disallow: string[]): string[] {
  return disallow.filter((rule) => {
    if (rule.includes("*") || rule.includes("$")) return false;
    return path === rule || path.startsWith(rule);
  });
}

describe("robots.txt Next.js assets", () => {
  it("does not disallow /_next/, /_next/static, or /_next/image", () => {
    const disallow = asList(starRule().disallow);

    expect(disallow).not.toContain("/_next/");
    expect(disallow).not.toContain("/_next/static");
    expect(disallow).not.toContain("/_next/static/");
    expect(disallow).not.toContain("/_next/image");

    const assetPaths = [
      "/_next/static/chunks/app.js",
      "/_next/static/css/app.css",
      "/_next/image",
      "/_next/image?url=%2Fhero.png&w=640&q=75",
      "/_next/data/compare/slack-vs-teams.json",
    ];
    for (const path of assetPaths) {
      expect(prefixDisallows(path, disallow)).toEqual([]);
    }
  });

  it("keeps the other User-agent: * disallow rules", () => {
    expect(asList(starRule().disallow)).toEqual([
      "/api/",
      "/admin/",
      "/embed/",
      "/developers/dashboard",
      "/survey",
      "/*?*sort=",
      "/*?*page=",
      "/*?*ref=",
      "/*?*utm_",
      "/*?*fbclid=",
      "/*?*gclid=",
    ]);
  });

  it("still explicitly allows the static bundles and the image optimizer", () => {
    const allow = asList(starRule().allow);
    expect(allow).toContain("/_next/static/");
    expect(allow).toContain("/_next/image");
  });
});

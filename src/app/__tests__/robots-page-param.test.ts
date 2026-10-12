import { describe, it, expect } from "vitest";

import robots from "../robots";

function rules() {
  const result = robots();
  return Array.isArray(result.rules) ? result.rules : [result.rules];
}

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Google-style robots wildcard match (`*` = any run, `$` = end). */
function matches(rule: string, url: string): boolean {
  const pattern = rule
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${pattern}`).test(url);
}

describe("robots.txt page parameter rule", () => {
  const star = rules().find((rule) => rule.userAgent === "*")!;
  const disallow = asList(star.disallow);

  it("no longer uses the broad /*?*page= rule", () => {
    expect(disallow).not.toContain("/*?*page=");
  });

  it("still blocks pagination parameters", () => {
    for (const url of ["/blog?page=2", "/category/tech?sort=new&page=3"]) {
      expect(disallow.some((rule) => matches(rule, url))).toBe(true);
    }
  });

  it("does not block ?source_page= or ?target_page= links", () => {
    for (const url of [
      "/compare/knicks-vs-76ers?source_page=compare-related",
      "/compare/a-vs-b?target_page=x",
    ]) {
      expect(disallow.filter((rule) => matches(rule, url))).toEqual([]);
    }
  });

  it("keeps every AI crawler group at Allow: / with no disallow", () => {
    const ai = rules().filter((rule) => rule.userAgent !== "*");
    expect(ai.length).toBeGreaterThan(100);
    for (const name of ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended"]) {
      expect(ai.find((rule) => rule.userAgent === name)?.allow).toBe("/");
    }
    for (const rule of ai) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toBeUndefined();
    }
  });
});

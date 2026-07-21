/**
 * DAN-2603 regression guard.
 *
 * Every legal template used to hardcode `contact@comparison.com`, a domain a
 * third party owns and parks, and nine `/best` guides pointed at
 * `corrections@aversusb.net`, which has no MX record. Both were stale
 * find-and-replace artifacts, and both meant the site advertised contact routes
 * that could never reach us.
 *
 * These addresses are not the kind of thing a typecheck or a render test
 * catches, so the source tree is asserted directly: any reintroduction fails CI
 * rather than shipping another undeliverable mailbox.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL } from "../constants";

const SRC = join(process.cwd(), "src");

/** Domains that must never appear in an address the site publishes. */
const FORBIDDEN = [
  // Owned and parked by a third party — never ours.
  "comparison.com",
  // Ours, but MX-less: the apex resolves to Vercel and accepts no mail.
  "@aversusb.net",
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return name === "__tests__" || name === "node_modules" ? [] : sourceFiles(full);
    }
    return /\.tsx?$/.test(name) ? [full] : [];
  });
}

describe("published contact address", () => {
  it("resolves to a single lowercase address with no whitespace", () => {
    expect(CONTACT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(CONTACT_EMAIL).toBe(CONTACT_EMAIL.toLowerCase());
  });

  it.each(FORBIDDEN)("is never %s anywhere in src/", (needle) => {
    const offenders = sourceFiles(SRC)
      .filter((file) => {
        const body = readFileSync(file, "utf8");
        // Comments explaining the ban are fine; only live strings matter, so
        // strip the lines that are purely commentary before searching.
        return body
          .split("\n")
          .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
          .some((line) => line.includes(needle));
      })
      .map((file) => file.replace(`${process.cwd()}/`, ""));

    expect(offenders).toEqual([]);
  });
});

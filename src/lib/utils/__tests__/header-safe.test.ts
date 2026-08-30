import { describe, it, expect } from "vitest";
import { headerSafe } from "../header-safe";

// A header value is valid when every char is ISO-8859-1 and there's no CR/LF —
// the same rule undici enforces before it throws "Invalid character in header content".
const isValidHeader = (s: string) => /^[\x20-\x7e\xa0-\xff]*$/.test(s);

describe("headerSafe", () => {
  it("maps typographic punctuation to ASCII instead of dropping it", () => {
    expect(headerSafe("Slack wins — it’s “simpler”… ok")).toBe('Slack wins - it\'s "simpler"... ok');
  });

  it("drops characters outside Latin-1 that have no ASCII stand-in", () => {
    const out = headerSafe("Kohli ✅ 59.07 avg ✓ vs 東京");
    expect(out).toBe("Kohli 59.07 avg vs");
    expect(isValidHeader(out)).toBe(true);
  });

  it("keeps Latin-1 letters (accents) intact", () => {
    expect(headerSafe("Café vs Crème brûlée")).toBe("Café vs Crème brûlée");
  });

  it("collapses newlines so a value can never split the response", () => {
    expect(headerSafe("line one\r\nline two\n")).toBe("line one line two");
  });

  it("truncates to the requested length after sanitising", () => {
    expect(headerSafe("a".repeat(600)).length).toBe(500);
    expect(headerSafe("abcdef", 3)).toBe("abc");
  });

  it("returns an empty string for null/undefined", () => {
    expect(headerSafe(null)).toBe("");
    expect(headerSafe(undefined)).toBe("");
  });

  it("the live failure: an em-dash FAQ answer becomes a valid header", () => {
    const answer = "Teams is better for Microsoft 365 shops — Slack for everyone else.";
    expect(isValidHeader(answer)).toBe(false);
    expect(isValidHeader(headerSafe(answer))).toBe(true);
  });
});

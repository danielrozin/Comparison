/**
 * Make free text safe to put in an HTTP response header.
 *
 * Header values must be ISO-8859-1. Node's fetch/undici throws
 * "Invalid character in header content" on anything outside that range, and
 * Next turns the throw into a 500 — so a single em-dash in a FAQ answer took
 * down /api/faq/<slug> for every page whose first answer contained one, and
 * /api/answer/<slug> for every page whose verdict did (found 2026-08-30 while
 * folding the AEO question bank in: 11 of 29 targets 500'd on one route or
 * the other). The DB content is fine; only the X-Summary header copy of it was
 * not.
 *
 * Common typographic characters are mapped to their ASCII look-alikes so the
 * summary still reads naturally; anything else outside Latin-1 is dropped.
 * Newlines are collapsed (a CR/LF in a header is a response-splitting vector).
 */

const TYPOGRAPHIC: Record<string, string> = {
  "—": "-", // em dash
  "–": "-", // en dash
  "‒": "-",
  "―": "-",
  "‘": "'",
  "’": "'",
  "‚": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "…": "...",
  " ": " ",
  " ": " ",
  " ": " ",
  "•": "*",
  "→": "->",
  "←": "<-",
  "≤": "<=",
  "≥": ">=",
  "≠": "!=",
  "€": "EUR",
  "™": "(TM)",
};

export function headerSafe(value: string | null | undefined, max = 500): string {
  if (!value) return "";
  let out = "";
  for (const ch of String(value).replace(/[\r\n\t]+/g, " ")) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x20 && code <= 0x7e) out += ch;
    else if (code >= 0xa0 && code <= 0xff) out += ch;
    else if (TYPOGRAPHIC[ch] !== undefined) out += TYPOGRAPHIC[ch];
    // else: drop it
  }
  return out.replace(/\s{2,}/g, " ").trim().slice(0, max);
}

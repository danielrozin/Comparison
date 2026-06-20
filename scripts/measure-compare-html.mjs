#!/usr/bin/env node
// DAN-432 — measure /compare/* HTML weight (total, gzip, inline RSC flight).
//
// Usage:
//   1. npm run build && npx next start -p 3999
//   2. node scripts/measure-compare-html.mjs [url]
//
// Default URL: http://localhost:3999/compare/iphone-17-vs-samsung-s26
// Prints pre-gzip + gzip total bytes and the inline RSC flight payload size,
// which is the dominant, structural cost on this route. Reproduces the
// before/after numbers posted on DAN-432.
import { gzipSync } from "node:zlib";

const url = process.argv[2] || "http://localhost:3999/compare/iphone-17-vs-samsung-s26";

const res = await fetch(url);
if (!res.ok) {
  console.error(`Fetch failed: ${res.status} ${res.statusText} for ${url}`);
  process.exit(1);
}
const html = await res.text();
const bytes = Buffer.byteLength(html, "utf8");
const gz = gzipSync(Buffer.from(html, "utf8"), { level: 9 }).length;

// Inline RSC flight payload: bytes inside self.__next_f.push(...) script tags.
const flightChunks = [...html.matchAll(/self\.__next_f\.push\((.*?)\)<\/script>/gs)].map((m) => m[1]);
const flightBytes = flightChunks.reduce((n, c) => n + Buffer.byteLength(c, "utf8"), 0);

// JSON-LD (structured data) blocks.
const ldBlocks = [...html.matchAll(/application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
const ldBytes = ldBlocks.reduce((n, c) => n + Buffer.byteLength(c, "utf8"), 0);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(`URL: ${url}`);
console.log(`  Total HTML (pre-gzip):  ${bytes} bytes  (${kb(bytes)})`);
console.log(`  Total HTML (gzip -9):   ${gz} bytes  (${kb(gz)})`);
console.log(`  Inline RSC flight:      ${flightBytes} bytes  (${kb(flightBytes)})  across ${flightChunks.length} chunks`);
console.log(`  JSON-LD:                ${ldBytes} bytes  (${kb(ldBytes)})  across ${ldBlocks.length} blocks`);

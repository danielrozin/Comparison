#!/usr/bin/env node
/** Verify every profile field in SETUP.md fits its platform limit. */

const FIELDS = [
  { platform: "Facebook", field: "Page name", limit: 75,
    text: "A Versus B" },
  { platform: "Facebook", field: "Bio", limit: 101,
    text: "Side-by-side comparisons of anything — tech, products, sports, countries. Answers in seconds." },
  { platform: "Facebook", field: "About / description", limit: 255,
    text: "A Versus B is the comparison platform for people who want an answer, not a sales pitch. Clear, data-driven, side-by-side breakdowns across technology, products, sports, countries, software and health — so you can decide in seconds." },
  { platform: "Instagram", field: "Name", limit: 30,
    text: "A Versus B · Compare Anything" },
  { platform: "Instagram", field: "Username", limit: 30,
    text: "aversusb" },
  { platform: "Instagram", field: "Bio", limit: 150,
    text: "Compare anything, side by side.\nTech · Products · Sports · Countries · Software\nNew head-to-head every day ↓" },
  { platform: "YouTube", field: "Channel name", limit: 100,
    text: "A Versus B" },
  { platform: "YouTube", field: "Handle", limit: 30,
    text: "@aversusb-net" },
  { platform: "YouTube", field: "Description", limit: 1000,
    text: `A Versus B settles comparisons.

Every day we publish a new head-to-head breakdown — two things, side by side, scored on the things that actually decide it. No sponsored verdicts, no filler, no ten-minute intro.

Technology · Products · Sports · Countries · Software · Health

Full written comparisons, with the data behind every verdict:
https://www.aversusb.net

Business enquiries: Info@aversusb.net` },
  { platform: "YouTube", field: "Keywords", limit: 500,
    text: "comparison, vs, versus, head to head, side by side, product comparison, tech comparison, compare" },
];

let fail = 0;
for (const f of FIELDS) {
  // Platforms count UTF-16 code units, and emoji/en-dashes are where limits
  // silently bite — so measure the string, not the ASCII approximation.
  const n = [...f.text].length;
  const ok = n <= f.limit;
  if (!ok) fail++;
  console.log(
    `${ok ? "ok  " : "OVER"} ${f.platform.padEnd(10)} ${f.field.padEnd(22)} ${String(n).padStart(4)} / ${f.limit}`
  );
}
process.exit(fail ? 1 : 0);

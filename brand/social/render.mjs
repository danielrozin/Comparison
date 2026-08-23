#!/usr/bin/env node
/**
 * Render the social assets to exact-pixel PNGs.
 *
 * Uses the headless Chrome that Remotion already vendors into node_modules,
 * so the brand font (Inter, inlined as a data URI) renders identically to the
 * site instead of silently falling back the way an SVG rasteriser would.
 *
 *   node brand/social/render.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "src");
const OUT = path.join(HERE, "out");
const CHROME = path.join(
  HERE, "..", "..",
  "node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell"
);

const TARGETS = [
  { file: "profile.html", out: "aversusb-profile-1024.png", w: 1024, h: 1024 },
  { file: "facebook-cover.html", out: "aversusb-facebook-cover-1640x624.png", w: 1640, h: 624 },
  { file: "youtube-banner.html", out: "aversusb-youtube-banner-2560x1440.png", w: 2560, h: 1440 },
];

fs.mkdirSync(OUT, { recursive: true });

for (const t of TARGETS) {
  const dest = path.join(OUT, t.out);
  execFileSync(CHROME, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${t.w},${t.h}`,
    `--screenshot=${dest}`,
    // fonts are inlined, but give the face a beat to bind before capture
    "--virtual-time-budget=2000",
    `file://${path.join(SRC, t.file)}`,
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(`${t.out.padEnd(44)} ${t.w}×${t.h}  ${kb} KB`);
}

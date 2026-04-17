/**
 * Preview render for the V2 composition — does NOT touch the production cron.
 * Usage: node remotion/render-v2-preview.mjs <slug> [--landscape]
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "public/videos");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const args = process.argv.slice(2);
const landscape = args.includes("--landscape");
const slug = args.find((a) => !a.startsWith("--"));
if (!slug) {
  console.error("Usage: node remotion/render-v2-preview.mjs <slug> [--landscape]");
  process.exit(1);
}

const dataPath = path.join(__dirname, "data", `${slug}.json`);
if (!fs.existsSync(dataPath)) {
  console.error(`No data file at ${dataPath}`);
  process.exit(1);
}
const inputProps = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
console.log(`Loaded: ${dataPath}`);

const suffix = landscape ? "-preview-v2-landscape" : "-preview-v2";
const outputPath = path.join(OUTPUT_DIR, `${slug}${suffix}.mp4`);

console.log("Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: path.join(__dirname, "index.tsx"),
  webpackOverride: (config) => config,
});

const compositionId = landscape ? "ComparisonVideoV2Landscape" : "ComparisonVideoV2";
const composition = await selectComposition({
  serveUrl: bundled,
  id: compositionId,
  inputProps,
});

console.log(`Mode: ${compositionId} — ${(composition.durationInFrames / composition.fps).toFixed(1)}s`);
console.log(`Rendering ${composition.durationInFrames} frames...`);
const startTime = Date.now();

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: outputPath,
  inputProps,
  crf: 20,
  x264Preset: "medium",
  chromiumOptions: { enableMultiProcessOnLinux: true },
});

const duration = ((Date.now() - startTime) / 1000).toFixed(1);
const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
console.log(`Done in ${duration}s — ${fileSize} MB`);
console.log(`Output: ${outputPath}`);

/**
 * Render a comparison video to MP4.
 * Usage: node src/remotion/render-video.mjs <slug>
 *
 * Reads comparison data from mock-data, renders via Remotion, outputs to public/videos/<slug>.mp4
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "public/videos");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const args = process.argv.slice(2);
const xlMode = args.includes("--xl");
const landscape = args.includes("--landscape");
const slug = args.find((a) => !a.startsWith("--"));
if (!slug) {
  console.error("Usage: node remotion/render-video.mjs <slug> [--xl | --landscape]");
  console.error("Example: node remotion/render-video.mjs bmw-vs-mercedes-benz --landscape");
  process.exit(1);
}

// Load comparison data from JSON file if it exists, otherwise use defaults
const dataPath = path.join(__dirname, "data", `${slug}.json`);
let inputProps = null;
if (fs.existsSync(dataPath)) {
  const raw = fs.readFileSync(dataPath, "utf-8");
  inputProps = JSON.parse(raw);
  console.log(`Loaded comparison data from: ${dataPath}`);
} else {
  console.log(`No data file at ${dataPath}, using default props from composition.`);
}

const suffix = xlMode ? "-xl" : landscape ? "-landscape" : "";
const outputPath = path.join(OUTPUT_DIR, `${slug}${suffix}.mp4`);

console.log(`Rendering video for: ${slug}`);
console.log(`Output: ${outputPath}`);

// Bundle the Remotion project
console.log("Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: path.join(__dirname, "index.tsx"),
  webpackOverride: (config) => config,
});

// Section durations (must match component files)
const FPS = 30;
const compositionId = xlMode
  ? "ComparisonVideoXL"
  : landscape
    ? "ComparisonVideoLandscape"
    : "ComparisonVideo";

const STANDARD_DURATIONS = {
  intro: FPS * 4, shortAnswer: FPS * 5, keyDifferences: FPS * 7,
  comparisonTable: FPS * 8, prosCons: FPS * 7, verdict: FPS * 5,
};
const XL_DURATIONS = {
  intro: FPS * 5, shortAnswer: FPS * 6, keyDiff1: FPS * 6, keyDiff2: FPS * 5,
  table1: FPS * 6, table2: FPS * 6, prosCons: FPS * 8, verdict: FPS * 6,
};

const durations = xlMode ? XL_DURATIONS : STANDARD_DURATIONS;
const totalFrames = Object.values(durations).reduce((a, b) => a + b, 0);

console.log(`Mode: ${xlMode ? "XL vertical" : landscape ? "Landscape 1920x1080" : "Vertical 1080x1920"} — ${(totalFrames / FPS).toFixed(1)}s`);

// Get the composition with overridden duration and props
const composition = await selectComposition({
  serveUrl: bundled,
  id: compositionId,
  inputProps: inputProps || undefined,
});

composition.durationInFrames = totalFrames;

// Render
console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
const startTime = Date.now();

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: outputPath,
  inputProps: inputProps || undefined,
  crf: 16, // near-visually-lossless quality
  x264Preset: "slow", // better compression efficiency
  chromiumOptions: {
    enableMultiProcessOnLinux: true,
  },
});

const duration = ((Date.now() - startTime) / 1000).toFixed(1);
const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`Done in ${duration}s — ${fileSize} MB`);
console.log(`Video saved to: ${outputPath}`);
console.log(`Accessible at: /videos/${slug}.mp4`);

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

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node src/remotion/render-video.mjs <slug>");
  console.error("Example: node src/remotion/render-video.mjs dyson-vs-shark-vacuum");
  process.exit(1);
}

const outputPath = path.join(OUTPUT_DIR, `${slug}.mp4`);

console.log(`Rendering video for: ${slug}`);
console.log(`Output: ${outputPath}`);

// Bundle the Remotion project
console.log("Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: path.join(__dirname, "index.tsx"),
  webpackOverride: (config) => config,
});

// Get the composition
const composition = await selectComposition({
  serveUrl: bundled,
  id: "ComparisonVideo",
});

// Render
console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
const startTime = Date.now();

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: outputPath,
  chromiumOptions: {
    enableMultiProcessOnLinux: true,
  },
});

const duration = ((Date.now() - startTime) / 1000).toFixed(1);
const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`Done in ${duration}s — ${fileSize} MB`);
console.log(`Video saved to: ${outputPath}`);
console.log(`Accessible at: /videos/${slug}.mp4`);

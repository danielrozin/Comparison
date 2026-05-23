/**
 * Render a comparison video to MP4.
 * Usage: node remotion/render-video.mjs <slug> [--xl | --landscape]
 *
 * Source-of-truth order:
 *   1. Prisma DB row keyed by slug (preferred — see loadComparison.mjs)
 *   2. JSON fixture at remotion/data/<slug>.json (offline / pipeline-cache fallback)
 *
 * If neither is available the script exits non-zero. We do NOT silently fall
 * through to the demo composition's defaultProps — every rendered slug must
 * own its data.
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  loadComparison,
  disconnectPrisma,
  ComparisonNotFoundError,
  ComparisonIncompleteError,
} from "./loadComparison.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "public/videos");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const args = process.argv.slice(2);
const xlMode = args.includes("--xl");
const landscape = args.includes("--landscape");
const skipDb = args.includes("--no-db");
const slug = args.find((a) => !a.startsWith("--"));
if (!slug) {
  console.error(
    "Usage: node remotion/render-video.mjs <slug> [--xl | --landscape] [--no-db]"
  );
  console.error(
    "Example: node remotion/render-video.mjs bmw-vs-mercedes-benz --landscape"
  );
  process.exit(1);
}

async function resolveInputProps() {
  const fixturePath = path.join(__dirname, "data", `${slug}.json`);

  if (!skipDb && process.env.DATABASE_URL) {
    try {
      const props = await loadComparison(slug);
      console.log(`Loaded comparison "${slug}" from Prisma DB.`);
      return props;
    } catch (err) {
      if (err instanceof ComparisonIncompleteError) {
        // Hard fail — surface bad data instead of producing a placeholder render.
        throw err;
      }
      if (err instanceof ComparisonNotFoundError) {
        console.warn(
          `DB has no row for "${slug}"; falling back to JSON fixture if present.`
        );
      } else {
        console.warn(
          `DB load failed for "${slug}" (${err.message}); falling back to JSON fixture if present.`
        );
      }
    }
  }

  if (fs.existsSync(fixturePath)) {
    const raw = fs.readFileSync(fixturePath, "utf-8");
    console.log(`Loaded comparison data from JSON fixture: ${fixturePath}`);
    return JSON.parse(raw);
  }

  throw new Error(
    `No comparison data found for slug "${slug}". ` +
      `Tried Prisma DB${skipDb || !process.env.DATABASE_URL ? " (skipped)" : ""} and ${fixturePath}.`
  );
}

let exitCode = 0;
try {
  const inputProps = await resolveInputProps();

  const suffix = xlMode ? "-xl" : landscape ? "-landscape" : "";
  const outputPath = path.join(OUTPUT_DIR, `${slug}${suffix}.mp4`);

  console.log(`Rendering video for: ${slug}`);
  console.log(`Output: ${outputPath}`);

  console.log("Bundling Remotion project...");
  const bundled = await bundle({
    entryPoint: path.join(__dirname, "index.tsx"),
    webpackOverride: (config) => config,
  });

  const compositionId = xlMode
    ? "ComparisonVideoXL"
    : landscape
      ? "ComparisonVideoV2Landscape"
      : "ComparisonVideoV2";

  // calculateMetadata in remotion/index.tsx scales V2 duration with stat count,
  // so we let selectComposition return the right durationInFrames directly.
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps,
  });

  console.log(
    `Mode: ${xlMode ? "XL vertical" : landscape ? "V2 Landscape 1920x1080" : "V2 Vertical 1080x1920"} — ${(composition.durationInFrames / composition.fps).toFixed(1)}s`
  );

  console.log(
    `Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`
  );
  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps,
    crf: 16,
    x264Preset: "slow",
    chromiumOptions: {
      enableMultiProcessOnLinux: true,
    },
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

  console.log(`Done in ${duration}s — ${fileSize} MB`);
  console.log(`Video saved to: ${outputPath}`);
  console.log(`Accessible at: /videos/${slug}.mp4`);
} catch (err) {
  console.error(`\nRender failed: ${err.message}`);
  if (err instanceof ComparisonIncompleteError) {
    console.error(
      `Fix the comparison row first; refusing to render with placeholder defaults.`
    );
  }
  exitCode = 1;
} finally {
  await disconnectPrisma();
}

process.exit(exitCode);

/**
 * Daily Video Pipeline
 *
 * 1. Fetches comparison pages from the website that don't have videos yet
 * 2. Scrapes data from each page
 * 3. Generates video data JSON
 * 4. Renders video with Remotion
 * 5. Uploads to YouTube with title + description
 * 6. Saves record of uploaded videos
 *
 * Usage:
 *   node scripts/daily-video-pipeline.mjs              # Run full pipeline (5 videos)
 *   node scripts/daily-video-pipeline.mjs --count 10   # Render 10 videos
 *   node scripts/daily-video-pipeline.mjs --dry-run    # Generate videos without uploading
 *   node scripts/daily-video-pipeline.mjs --slug bmw-vs-mercedes-benz  # Single slug
 *
 * Env vars needed:
 *   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 *   (or run scripts/youtube-auth.mjs first)
 */

import { google } from "googleapis";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const REMOTION_DIR = path.join(ROOT_DIR, "remotion");
const DATA_DIR = path.join(REMOTION_DIR, "data");
const OUTPUT_DIR = path.join(ROOT_DIR, "Videos For Website");
const PUBLIC_VIDEO_DIR = path.join(ROOT_DIR, "public/videos");
const UPLOAD_LOG = path.join(ROOT_DIR, "src/data/video-uploads.json");

// Ensure dirs exist
[OUTPUT_DIR, PUBLIC_VIDEO_DIR, DATA_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ---------------------------------------------------------------------------
// Parse args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const singleSlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const countIdx = args.indexOf("--count");
const count = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) : 5;

// ---------------------------------------------------------------------------
// Load upload log (tracks what's already been uploaded)
// ---------------------------------------------------------------------------

function loadUploadLog() {
  if (fs.existsSync(UPLOAD_LOG)) {
    return JSON.parse(fs.readFileSync(UPLOAD_LOG, "utf-8"));
  }
  return { uploads: [] };
}

function saveUploadLog(log) {
  fs.writeFileSync(UPLOAD_LOG, JSON.stringify(log, null, 2));
}

// ---------------------------------------------------------------------------
// 1. Fetch comparison slugs from sitemap
// ---------------------------------------------------------------------------

async function fetchComparisonSlugs() {
  console.log("Fetching available comparison slugs...");
  try {
    const res = await fetch("https://www.aversusb.net/api/video-pipeline/slugs");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const slugs = data.slugs || [];
    console.log(`Found ${slugs.length} comparison pages`);
    return slugs;
  } catch (err) {
    console.error("Failed to fetch slugs:", err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. Scrape a comparison page for video data
// ---------------------------------------------------------------------------

/**
 * Fetch comparison data. Strategy:
 * 1. Check if a hand-crafted JSON exists in remotion/data/
 * 2. Try internal API (for Vercel/production with DB)
 * 3. Fall back to scraping the page meta + generating via Tavily/AI enrichment
 */
async function scrapeComparisonPage(slug) {
  console.log(`  Fetching data for: ${slug}`);

  // Strategy 1: Pre-existing data file (hand-crafted or previously generated)
  const existingDataPath = path.join(DATA_DIR, `${slug}.json`);
  if (fs.existsSync(existingDataPath)) {
    const existing = JSON.parse(fs.readFileSync(existingDataPath, "utf-8"));
    // Only use it if it has real data (not fallback)
    if (existing.keyDifferences?.length > 0 && existing.keyDifferences[0].label !== "Overall Rating") {
      console.log("  Using existing data file");
      return existing;
    }
  }

  // Strategy 2: Fetch page and use Tavily to enrich the data
  const entityA = titleCase(slug.split("-vs-")[0]?.replace(/-/g, " ") || "Entity A");
  const entityB = titleCase(slug.split("-vs-")[1]?.replace(/-/g, " ") || "Entity B");
  const category = guessCategory(slug);

  // Fetch meta description from the actual page
  let shortAnswer = `A detailed comparison of ${entityA} vs ${entityB}.`;
  try {
    const res = await fetch(`https://www.aversusb.net/compare/${slug}`, { signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const metaDesc = html.match(/<meta name="description" content="([^"]+)"/i);
    if (metaDesc) shortAnswer = metaDesc[1].trim().slice(0, 220);
  } catch {}

  // Strategy 3: Use Tavily API to get real comparison data
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (tavilyKey) {
    console.log("  Enriching with Tavily...");
    try {
      const tavilyRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `${entityA} vs ${entityB} comparison stats differences 2026`,
          search_depth: "basic",
          max_results: 3,
        }),
      });
      const tavilyData = await tavilyRes.json();
      const context = tavilyData.results?.map((r) => r.content).join("\n\n") || "";

      if (context.length > 100) {
        // Use Claude to extract structured comparison data from search results
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        if (anthropicKey) {
          console.log("  Generating structured data with Claude...");
          const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": anthropicKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1500,
              messages: [{
                role: "user",
                content: `Based on this research about ${entityA} vs ${entityB}, generate a JSON comparison. Return ONLY valid JSON, no markdown.

Research:
${context.slice(0, 3000)}

JSON format:
{
  "shortAnswer": "2-3 sentence summary (max 200 chars)",
  "keyDifferences": [{"label": "...", "entityAValue": "...", "entityBValue": "...", "winner": "a"|"b"|"tie"}],
  "stats": [{"label": "...", "valueA": "...", "valueB": "...", "winner": "a"|"b"|"tie"}],
  "prosA": ["..."], "consA": ["..."],
  "prosB": ["..."], "consB": ["..."],
  "verdict": "2-3 sentences"
}

Rules: 4-5 key differences, 6-8 stats, 3-4 pros each, 2-3 cons each. Use real data from the research.`,
              }],
            }),
          });

          const aiData = await aiRes.json();
          const aiText = aiData.content?.[0]?.text || "";
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              title: `${entityA} vs ${entityB}`,
              entityA, entityB, category, slug,
              shortAnswer: parsed.shortAnswer || shortAnswer,
              keyDifferences: parsed.keyDifferences || [],
              stats: parsed.stats || [],
              prosA: parsed.prosA || [],
              consA: parsed.consA || [],
              prosB: parsed.prosB || [],
              consB: parsed.consB || [],
              verdict: parsed.verdict || "",
            };
          }
        }
      }
    } catch (err) {
      console.log(`  Tavily/AI enrichment failed: ${err.message}`);
    }
  }

  // Fallback: basic data from slug
  console.log("  Using basic fallback data");
  return {
    title: `${entityA} vs ${entityB}`, entityA, entityB, category, slug, shortAnswer,
    keyDifferences: [
      { label: "Overall Rating", entityAValue: "Strong", entityBValue: "Strong", winner: "tie" },
      { label: "Popularity", entityAValue: "High", entityBValue: "High", winner: "tie" },
      { label: "Value", entityAValue: "Competitive", entityBValue: "Competitive", winner: "tie" },
    ],
    stats: [
      { label: "Overall Score", valueA: "8/10", valueB: "8/10", winner: "tie" },
      { label: "Popularity", valueA: "High", valueB: "High", winner: "tie" },
      { label: "User Satisfaction", valueA: "Good", valueB: "Good", winner: "tie" },
    ],
    prosA: [`Strong choice in ${category.toLowerCase()}`, "Good value", "Popular"],
    consA: ["Some trade-offs", "Room for improvement"],
    prosB: [`Strong choice in ${category.toLowerCase()}`, "Competitive features", "Trusted"],
    consB: ["Some trade-offs", "Room for improvement"],
    verdict: `Both ${entityA} and ${entityB} are solid choices. Your pick depends on your priorities.`,
  };
}

function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function guessCategory(slug) {
  const categories = {
    Automotive: ["bmw", "mercedes", "tesla", "ford", "toyota", "honda", "audi", "porsche", "model-3", "model-y"],
    Sports: ["messi", "ronaldo", "lebron", "jordan", "nba", "nfl", "fifa", "boxing", "ufc"],
    Technology: ["iphone", "samsung", "pixel", "macbook", "laptop", "gpu", "cpu", "android", "windows", "mac"],
    Gaming: ["ps5", "xbox", "nintendo", "switch", "pc-gaming", "steam"],
    Countries: ["usa", "china", "japan", "germany", "france", "india", "brazil", "uk", "canada", "australia", "russia", "korea"],
    Health: ["tylenol", "advil", "vitamin", "protein", "supplement", "medicine"],
    "Health & Fitness": ["yoga", "pilates", "crossfit", "gym", "running", "cycling"],
    Travel: ["airbnb", "booking", "hotel", "airline", "expedia"],
    Finance: ["bitcoin", "ethereum", "stock", "crypto", "bank", "invest"],
    Software: ["slack", "teams", "zoom", "notion", "trello", "jira"],
  };
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some((k) => slug.toLowerCase().includes(k))) return cat;
  }
  return "General";
}

function buildKeyDifferencesFromTitle(entityA, entityB, category) {
  return [
    { label: "Overall Rating", entityAValue: "Strong", entityBValue: "Strong", winner: "tie" },
    { label: "Popularity", entityAValue: "High", entityBValue: "High", winner: "tie" },
    { label: "Value", entityAValue: "Competitive", entityBValue: "Competitive", winner: "tie" },
  ];
}

function buildStatsFromCategory(entityA, entityB, category) {
  return [
    { label: "Overall Score", valueA: "8/10", valueB: "8/10", winner: "tie" },
    { label: "Popularity", valueA: "High", valueB: "High", winner: "tie" },
    { label: "User Satisfaction", valueA: "Good", valueB: "Good", winner: "tie" },
  ];
}

// ---------------------------------------------------------------------------
// 3. Generate YouTube metadata
// ---------------------------------------------------------------------------

function generateYouTubeMetadata(data) {
  const { entityA, entityB, category, shortAnswer } = data;

  const title = `${entityA} vs ${entityB} — Full Comparison 2026`;

  const hashtags = [
    `#${entityA.toLowerCase().replace(/\s+/g, "")}`,
    `#${entityB.toLowerCase().replace(/\s+/g, "")}`,
    `#${category.toLowerCase().replace(/\s+/g, "")}`,
    "#comparison",
    "#versus",
  ].join(" ");

  const description = `${shortAnswer}\n\n${hashtags}`;

  return { title: title.slice(0, 100), description };
}

// ---------------------------------------------------------------------------
// 4. Render video with Remotion
// ---------------------------------------------------------------------------

let bundledUrl = null;

async function renderVideo(slug, data) {
  // Save data file
  const dataPath = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  // Bundle once, reuse for all renders
  if (!bundledUrl) {
    console.log("  Bundling Remotion project (one-time)...");
    bundledUrl = await bundle({
      entryPoint: path.join(REMOTION_DIR, "index.tsx"),
      webpackOverride: (config) => config,
    });
  }

  const FPS = 30;
  // V2 durations: intro 4 + quick answer 5 + key diffs 8 + full comparison 9 + pros/cons 8 + verdict 6 = 40s
  const totalFrames = FPS * 4 + FPS * 5 + FPS * 8 + FPS * 9 + FPS * 8 + FPS * 6;

  const composition = await selectComposition({
    serveUrl: bundledUrl,
    id: "ComparisonVideoV2",
    inputProps: data,
  });
  composition.durationInFrames = totalFrames;

  // Render to Videos For Website folder
  const videoTitle = `${data.entityA} vs ${data.entityB}`;
  const outputPath = path.join(OUTPUT_DIR, `${videoTitle}.mp4`);
  const publicPath = path.join(PUBLIC_VIDEO_DIR, `${slug}.mp4`);

  console.log(`  Rendering: ${videoTitle} (${totalFrames} frames)...`);
  await renderMedia({
    composition,
    serveUrl: bundledUrl,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: data,
    chromiumOptions: { enableMultiProcessOnLinux: true },
  });

  // Also copy to public/videos for website embedding
  fs.copyFileSync(outputPath, publicPath);

  const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`  Rendered: ${fileSize} MB → ${outputPath}`);

  return outputPath;
}

// ---------------------------------------------------------------------------
// 5. Upload to YouTube
// ---------------------------------------------------------------------------

async function uploadToYouTube(videoPath, metadata) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.log("  SKIP UPLOAD: YouTube credentials not configured.");
    console.log("  Run: node scripts/youtube-auth.mjs");
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  console.log(`  Uploading to YouTube: ${metadata.title}`);

  const res = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        categoryId: "22", // People & Blogs
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = res.data.id;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`  Uploaded: ${videoUrl}`);

  return { videoId, videoUrl };
}

// ---------------------------------------------------------------------------
// Main Pipeline
// ---------------------------------------------------------------------------

async function main() {
  console.log("========================================");
  console.log("  Daily Video Pipeline");
  console.log(`  Mode: ${dryRun ? "DRY RUN (no upload)" : "FULL (render + upload)"}`);
  console.log(`  Count: ${singleSlug ? `single (${singleSlug})` : count}`);
  console.log("========================================\n");

  const log = loadUploadLog();
  // Only count slugs with successful YouTube uploads as "already done"
  const uploadedSlugs = new Set(
    log.uploads.filter((u) => u.youtubeVideoId).map((u) => u.slug)
  );

  // Get slugs to process
  let slugs;
  if (singleSlug) {
    slugs = [singleSlug];
  } else {
    const allSlugs = await fetchComparisonSlugs();
    // Filter out already-uploaded slugs
    const newSlugs = allSlugs.filter((s) => !uploadedSlugs.has(s));
    console.log(`${newSlugs.length} comparisons without videos\n`);
    // Pick random selection
    const shuffled = newSlugs.sort(() => Math.random() - 0.5);
    slugs = shuffled.slice(0, count);
  }

  if (slugs.length === 0) {
    console.log("No new comparisons to process. Done!");
    return;
  }

  console.log(`Processing ${slugs.length} comparisons:\n`);

  const results = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`\n[${i + 1}/${slugs.length}] ${slug}`);
    console.log("-".repeat(50));

    // Scrape
    const data = await scrapeComparisonPage(slug);
    if (!data) {
      console.log("  Skipped (scrape failed)");
      continue;
    }

    // Render
    const videoPath = await renderVideo(slug, data);

    // YouTube metadata
    const metadata = generateYouTubeMetadata(data);

    // Upload
    let uploadResult = null;
    if (!dryRun) {
      try {
        uploadResult = await uploadToYouTube(videoPath, metadata);
      } catch (err) {
        console.log(`  Upload failed: ${err.message}`);
      }
    } else {
      console.log("  Dry run — skipping upload");
    }

    // Log result
    const entry = {
      slug,
      title: data.title,
      entityA: data.entityA,
      entityB: data.entityB,
      category: data.category,
      videoFile: path.basename(videoPath),
      youtubeTitle: metadata.title,
      youtubeDescription: metadata.description,
      youtubeVideoId: uploadResult?.videoId || null,
      youtubeUrl: uploadResult?.videoUrl || null,
      uploadedAt: new Date().toISOString(),
    };

    log.uploads.push(entry);
    saveUploadLog(log);
    results.push(entry);

    console.log(`  Done!`);
  }

  // Summary
  console.log("\n========================================");
  console.log("  PIPELINE COMPLETE");
  console.log("========================================");
  console.log(`  Videos rendered: ${results.length}`);
  console.log(`  Videos uploaded: ${results.filter((r) => r.youtubeVideoId).length}`);
  console.log(`  Output folder: ${OUTPUT_DIR}`);
  console.log(`  Upload log: ${UPLOAD_LOG}`);
  console.log("========================================\n");

  // Print table
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.title}`);
    console.log(`   File: ${r.videoFile}`);
    console.log(`   YT Title: ${r.youtubeTitle}`);
    if (r.youtubeUrl) console.log(`   YT URL: ${r.youtubeUrl}`);
    console.log("");
  });
}

main().catch((err) => {
  console.error("Pipeline error:", err);
  process.exit(1);
});

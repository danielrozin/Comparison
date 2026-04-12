/**
 * Upload already-rendered videos to YouTube.
 * Reads data from remotion/data/ and video from public/videos/.
 *
 * Usage: node scripts/upload-existing.mjs <slug> [<slug>...]
 */

import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "remotion/data");
const VIDEO_DIR = path.join(ROOT_DIR, "public/videos");
const UPLOAD_LOG = path.join(ROOT_DIR, "Videos For Website", "upload-log.json");

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error("Usage: node scripts/upload-existing.mjs <slug> [<slug>...]");
  process.exit(1);
}

const clientId = process.env.YOUTUBE_CLIENT_ID;
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  console.error("Missing YouTube credentials in env vars");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });
const youtube = google.youtube({ version: "v3", auth: oauth2Client });

function loadLog() {
  if (fs.existsSync(UPLOAD_LOG)) return JSON.parse(fs.readFileSync(UPLOAD_LOG, "utf-8"));
  return { uploads: [] };
}
function saveLog(log) {
  fs.writeFileSync(UPLOAD_LOG, JSON.stringify(log, null, 2));
}

function generateMetadata(data) {
  const { entityA, entityB, category, shortAnswer } = data;
  const title = `${entityA} vs ${entityB} — Full Comparison 2026`;
  const hashtags = [
    `#${entityA.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    `#${entityB.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    `#${category.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    "#comparison",
    "#versus",
    "#shorts",
  ].join(" ");
  const description = `${shortAnswer}\n\n${hashtags}`;
  return { title: title.slice(0, 100), description };
}

const log = loadLog();

for (const slug of slugs) {
  console.log(`\n=== ${slug} ===`);

  const dataPath = path.join(DATA_DIR, `${slug}.json`);
  const videoPath = path.join(VIDEO_DIR, `${slug}.mp4`);

  if (!fs.existsSync(dataPath)) {
    console.error(`  Missing data: ${dataPath}`);
    continue;
  }
  if (!fs.existsSync(videoPath)) {
    console.error(`  Missing video: ${videoPath}`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const metadata = generateMetadata(data);
  const fileSize = (fs.statSync(videoPath).size / 1024 / 1024).toFixed(2);

  console.log(`  Uploading ${fileSize} MB: ${metadata.title}`);

  try {
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          categoryId: "22",
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false,
        },
      },
      media: { body: fs.createReadStream(videoPath) },
    });

    const videoId = res.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`  Uploaded: ${videoUrl}`);

    log.uploads.push({
      slug,
      title: data.title,
      entityA: data.entityA,
      entityB: data.entityB,
      category: data.category,
      videoFile: `${slug}.mp4`,
      youtubeTitle: metadata.title,
      youtubeDescription: metadata.description,
      youtubeVideoId: videoId,
      youtubeUrl: videoUrl,
      uploadedAt: new Date().toISOString(),
    });
    saveLog(log);
  } catch (err) {
    console.error(`  Upload failed: ${err.message}`);
  }
}

console.log("\nDone.");

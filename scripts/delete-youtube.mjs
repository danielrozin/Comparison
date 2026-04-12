/**
 * Delete YouTube videos by video ID.
 * Usage: node scripts/delete-youtube.mjs <videoId> [<videoId>...]
 */

import { google } from "googleapis";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("Usage: node scripts/delete-youtube.mjs <videoId> [<videoId>...]");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth: oauth2Client });

for (const id of ids) {
  try {
    await youtube.videos.delete({ id });
    console.log(`Deleted: ${id}`);
  } catch (err) {
    console.error(`Failed to delete ${id}: ${err.message}`);
  }
}

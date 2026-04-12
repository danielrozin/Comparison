/**
 * One-time YouTube OAuth2 setup.
 *
 * SETUP STEPS:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client ID (type: Desktop App)
 * 3. Download the JSON and save as scripts/google-credentials.json
 * 4. Enable "YouTube Data API v3" in your Google Cloud project
 * 5. Run: node scripts/youtube-auth.mjs
 * 6. It will open a browser — sign in with your YouTube account
 * 7. The refresh token will be saved to scripts/youtube-token.json
 * 8. Add YOUTUBE_REFRESH_TOKEN to your .env
 */

import { google } from "googleapis";
import http from "http";
import open from "open";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = path.join(__dirname, "google-credentials.json");
const TOKEN_PATH = path.join(__dirname, "youtube-token.json");

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("Missing google-credentials.json!");
  console.error("Download it from: https://console.cloud.google.com/apis/credentials");
  console.error(`Save it to: ${CREDENTIALS_PATH}`);
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_id, client_secret } = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  "http://localhost:3333/oauth2callback"
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
  prompt: "consent",
});

// Start local server to catch the callback
const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/oauth2callback")) return;

  const url = new URL(req.url, "http://localhost:3333");
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("No code received. Try again.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log("\nTokens saved to:", TOKEN_PATH);
    console.log("\nAdd this to your .env file:");
    console.log(`YOUTUBE_CLIENT_ID=${client_id}`);
    console.log(`YOUTUBE_CLIENT_SECRET=${client_secret}`);
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);

    res.end("YouTube authorization successful! You can close this tab.");
  } catch (err) {
    console.error("Error getting token:", err.message);
    res.end("Error: " + err.message);
  }

  server.close();
});

server.listen(3333, () => {
  console.log("Opening browser for YouTube authorization...");
  console.log("If it doesn't open, visit:", authUrl);
  open(authUrl).catch(() => {});
});

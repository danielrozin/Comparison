import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal adapter config so Cloudflare Workers Builds can run
// `npx opennextjs-cloudflare build`. Prod traffic still deploys via Vercel;
// cache bindings can be added later (ROO-19 follow-up).
export default defineCloudflareConfig({});

import { getRedis } from "../src/lib/services/redis";
async function main() {
  const redis = getRedis();
  if (!redis) { console.log("No Redis configured (KV_REST_API_URL/TOKEN absent) — nothing to bust."); return; }
  for (const slug of ["china-economy-vs-united-states", "messi-vs-ronaldo"]) {
    const key = `comparison:${slug}`;
    const before = await redis.get(key);
    const n = await redis.del(key);
    console.log(`del ${key} -> ${n} (was ${before ? "cached" : "absent"})`);
  }
}
main().catch(e=>{console.error(e);process.exit(1);});

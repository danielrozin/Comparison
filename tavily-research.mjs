import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const TAVILY_KEY = process.env.TAVILY_API_KEY

async function search(query) {
  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: TAVILY_KEY, query, search_depth: 'basic', max_results: 3 })
  })
  const data = await resp.json()
  return data.results?.map(r => `[${r.title}] ${r.content?.substring(0, 300)}`).join('\n\n') || 'no results'
}

const queries = [
  'MacBook Pro 14 M5 2026 vs MacBook Pro 16 M3 specs performance',
  'Tidal vs Spotify 2026 comparison audio quality pricing',
  'Webflow vs Squarespace 2026 pricing features comparison',
  'Home Depot vs Lowes 2026 revenue market share',
  'Neymar injury 2025 2026 current status Al-Hilal Santos',
  'Mbappe Real Madrid 2025 2026 statistics goals'
]

for (const q of queries) {
  console.log(`\n=== ${q} ===`)
  console.log(await search(q))
}

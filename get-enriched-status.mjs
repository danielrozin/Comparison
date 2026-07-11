import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

async function main() {
  // Get all pages with impressions > 0, looking at enrichment status
  const results = await prisma.comparison.findMany({
    where: { searchImpressions: { gt: 0 } },
    select: {
      slug: true,
      title: true,
      searchImpressions: true,
      isHumanReviewed: true,
      content: true
    },
    orderBy: { searchImpressions: 'desc' },
    take: 80
  })
  
  // Filter to only canonical (non-thin) pages
  const canonicalSlugs = results
    .filter(r => {
      // A canonical page has a short slug without year-suffixes or keyword-stuffed slugs
      const isVariant = /\d{4}/.test(r.slug) && r.slug !== 'ps5-vs-xbox-series-x'
      return !isVariant
    })
    .map((r, _i) => r)
  
  console.log('\n=== ALL PAGES WITH IMPRESSIONS (top 80) ===')
  results.forEach((r, i) => {
    const hasAnalysis = r.content && typeof r.content === 'object' && 'expertAnalysis' in r.content
    const enrichedBy = r.content?.enrichedBy || 'none'
    console.log(`${i+1}. [${hasAnalysis ? 'DONE-' + enrichedBy : 'TODO'}] ${r.slug} — ${r.searchImpressions}`)
  })
  
  console.log('\n=== NOT YET ENRICHED (first 30) ===')
  const notEnriched = results.filter(r => {
    const hasAnalysis = r.content && typeof r.content === 'object' && 'expertAnalysis' in r.content
    return !hasAnalysis
  })
  notEnriched.slice(0, 30).forEach((r, i) => {
    console.log(`${i+1}. ${r.slug} — ${r.searchImpressions}`)
  })
  
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env.local') })

const prisma = new PrismaClient()

async function main() {
  const results = await prisma.comparison.findMany({
    where: { 
      searchImpressions: { gte: 75, lte: 102 }
    },
    select: {
      slug: true,
      title: true,
      searchImpressions: true,
      content: true
    },
    orderBy: { searchImpressions: 'desc' },
    take: 80
  })
  
  const notEnriched = results.filter(r => {
    if (!r.content) return true
    if (typeof r.content !== 'object') return true
    if (Array.isArray(r.content)) return true
    const hasEnrichment = 'analysis' in r.content || 'expertAnalysis' in r.content || 'enrichedAt' in r.content
    return !hasEnrichment
  })
  
  console.log(`Total found: ${notEnriched.length}`)
  notEnriched.slice(0, 15).forEach((r, i) => {
    const isArr = Array.isArray(r.content)
    console.log(`${i+1}. ${r.slug} — ${r.searchImpressions} (${isArr ? 'array-content' : r.content ? 'obj-no-analysis' : 'null'})`)
  })
  
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

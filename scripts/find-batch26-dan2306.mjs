import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

// Count total pages above certain impressions thresholds to find rank 251-260
const total = await prisma.comparison.count({ where: { searchImpressions: { gt: 0 } } })
console.log(`Total pages with impressions: ${total}`)

// Get pages ordered by impressions desc to find ranks 251-260
const pages = await prisma.comparison.findMany({
  where: { searchImpressions: { gt: 0 } },
  orderBy: [{ searchImpressions: 'desc' }, { slug: 'asc' }],
  select: { id: true, slug: true, searchImpressions: true, content: true },
  skip: 250,
  take: 10,
})

console.log('\nPages ranked 251-260 by GSC impressions:')
let rank = 251
for (const p of pages) {
  const hasExpert = p.content?.expertAnalysis ? `${p.content.expertAnalysis.length}chars` : 'MISSING'
  const sources = Array.isArray(p.content?.sources) ? p.content.sources.length : 0
  const enrichedBy = p.content?.enrichedBy || 'NONE'
  console.log(`${rank} - ${p.slug} (${p.searchImpressions} imp) | expert: ${hasExpert} | sources: ${sources} | enrichedBy: ${enrichedBy}`)
  rank++
}

await prisma.$disconnect()

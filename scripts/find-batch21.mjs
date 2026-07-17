import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

// Get all enriched comparisons ordered by impressions desc, skip first 200, take next 10
const allRanked = await prisma.comparison.findMany({
  where: { searchImpressions: { gt: 0 } },
  orderBy: { searchImpressions: 'desc' },
  select: { slug: true, searchImpressions: true, content: true },
})

const ranked201to210 = allRanked.slice(200, 210)

ranked201to210.forEach((p, i) => {
  const hasAnalysis = p.content && typeof p.content === 'object' && !Array.isArray(p.content) && 'enrichedAt' in p.content
  const faqCount = '?'
  console.log(`${201 + i} - ${p.slug} (${p.searchImpressions} impressions) — ${hasAnalysis ? 'HAS_ANALYSIS' : 'needs analysis'}`)
})

console.log('\nTotal with impressions:', allRanked.length)
await prisma.$disconnect()

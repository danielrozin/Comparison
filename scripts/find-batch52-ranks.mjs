import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local'), override: true })
const prisma = new PrismaClient()

// Get pages ranked 499-515 to see exact range for 501-510
const pages = await prisma.comparison.findMany({
  where: {
    searchImpressions: { gt: 0 },
    status: 'published'
  },
  select: {
    slug: true,
    searchImpressions: true,
    content: true,
  },
  orderBy: { searchImpressions: 'desc' },
  skip: 498,
  take: 20,
})

console.log('Pages ranked 499-518 by GSC impressions:')
pages.forEach((p, i) => {
  const rank = 499 + i
  const hasEnrichment = p.content && typeof p.content === 'object' && !Array.isArray(p.content) &&
    ('analysis' in p.content || 'expertAnalysis' in p.content || 'enrichedAt' in p.content)
  const enrichedBy = p.content?.enrichedBy || ''
  console.log(`  ${rank}. ${p.slug} (${p.searchImpressions} impressions) - enriched: ${hasEnrichment}${enrichedBy ? ' (' + enrichedBy + ')' : ''}`)
})
await prisma.$disconnect()

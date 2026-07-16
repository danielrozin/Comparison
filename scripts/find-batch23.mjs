import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()
// Find pages with impressions 200-322 that haven't been enriched yet (no content or content without enrichmentVersion)
const pages = await prisma.comparison.findMany({
  where: { searchImpressions: { gte: 200, lte: 322 } },
  orderBy: { searchImpressions: 'desc' },
  take: 20,
  select: { slug: true, searchImpressions: true, content: true }
})
pages.forEach(p => {
  const c = p.content
  const enriched = c && typeof c === 'object' && c.enrichmentVersion ? c.enrichmentVersion : 'NOT_ENRICHED'
  console.log(p.searchImpressions, enriched, p.slug)
})
console.log('Total:', pages.length)
await prisma.$disconnect()

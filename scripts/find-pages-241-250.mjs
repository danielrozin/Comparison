import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local'), override: true })

const prisma = new PrismaClient()

const rows = await prisma.comparison.findMany({
  where: { searchImpressions: { gt: 0 } },
  orderBy: { searchImpressions: 'desc' },
  select: { slug: true, searchImpressions: true, content: true, title: true },
  take: 260
})

// Pages 241-250 are indices 240-249 (0-indexed)
const batch = rows.slice(240, 250)

console.log('Pages 241-250 by GSC impressions:')
batch.forEach((r, i) => {
  const c = r.content
  const isEnriched = c && typeof c === 'object' && !Array.isArray(c) && ('enrichedAt' in c || 'analysis' in c || 'expertAnalysis' in c)
  const enrichedBy = isEnriched && typeof c === 'object' ? (c.enrichedBy || 'unknown') : null
  console.log(`${240 + i + 1} - ${r.slug} (${r.searchImpressions} impressions) — ${isEnriched ? 'prev: ' + enrichedBy : 'first enrichment'}`)
})

await prisma.$disconnect()

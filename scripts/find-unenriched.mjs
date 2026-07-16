import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const prisma = new PrismaClient()

const rows = await prisma.comparison.findMany({
  where: { searchImpressions: { gt: 0 } },
  orderBy: { searchImpressions: 'desc' },
  select: { slug: true, searchImpressions: true, content: true, title: true },
  take: 500
})

const unenriched = rows.filter(r => {
  const c = r.content
  if (!c || Array.isArray(c)) return true
  if (typeof c === 'object' && !('enrichedAt' in c) && !('analysis' in c) && !('expertAnalysis' in c)) return true
  return false
})

console.log(`Total unenriched pages with impressions: ${unenriched.length}`)
console.log('Top 30 by impressions:')
unenriched.slice(0, 30).forEach(r => {
  console.log(`${r.searchImpressions} - ${r.slug}`)
})

await prisma.$disconnect()

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local'), override: true })

const prisma = new PrismaClient()

async function main() {
  const comparisons = await prisma.comparison.findMany({
    select: {
      slug: true,
      content: true,
      searchImpressions: true,
      viewCount: true,
    },
    orderBy: { searchImpressions: 'desc' },
    skip: 560,
    take: 10,
  })

  console.log('Pages ranked 561-570 by searchImpressions:')
  comparisons.forEach((c, i) => {
    const content = c.content
    const isEnriched = content && typeof content === 'object' && !Array.isArray(content) &&
      ('expertAnalysis' in content || 'enrichedBy' in content)
    const enrichedBy = isEnriched && content.enrichedBy ? content.enrichedBy : (isEnriched ? 'YES' : 'NO')
    console.log(`${561+i}. ${c.slug} (${c.searchImpressions} impressions) [enriched: ${enrichedBy}]`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())

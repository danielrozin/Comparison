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
      status: true,
    },
    where: { searchImpressions: { gt: 0 } },
    orderBy: [{ searchImpressions: 'desc' }, { slug: 'asc' }],
    skip: 580,
    take: 10,
  })

  console.log('Pages ranked 581-590 by searchImpressions:')
  comparisons.forEach((c, i) => {
    const content = c.content
    const isEnriched = content && typeof content === 'object' && !Array.isArray(content) &&
      ('expertAnalysis' in content || 'enrichedBy' in content)
    const enrichedBy = isEnriched && content.enrichedBy ? content.enrichedBy : (isEnriched ? 'YES' : 'NO')
    console.log(`${581+i}. ${c.slug} (${c.searchImpressions} impressions) [status:${c.status}, enriched:${enrichedBy}]`)
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())

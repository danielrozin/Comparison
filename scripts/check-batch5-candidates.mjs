import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '..', '.env.local'), override: true })

const prisma = new PrismaClient()

const CANDIDATES = [
  'macbook-pro-14-vs-16-inch',
  'toyota-rav4-vs-honda-cr-v',
  'webflow-vs-squarespace',
  'apple-vs-samsung',
  'lebron-vs-jordan',
  'credit-card-vs-debit-card',
  'google-pixel-vs-iphone',
  'dyson-vs-shark-vacuum',
  'birkenstock-vs-crocs',
  'paris-vs-london-population',
]

async function main() {
  for (const slug of CANDIDATES) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: {
        slug: true, title: true, searchImpressions: true,
        isHumanReviewed: true, content: true,
        shortAnswer: true, keyDifferences: true, verdict: true,
        entities: { select: { entity: { select: { name: true } }, position: true }, orderBy: { position: 'asc' } }
      }
    })
    if (!r) { console.log(`NOT FOUND: ${slug}`); continue }
    const hasAnalysis = r.content && typeof r.content === 'object' && 'expertAnalysis' in r.content
    const entityNames = r.entities.map(e => e.entity.name).join(' vs ')
    console.log(`\n✓ ${r.slug} (${r.searchImpressions} impressions)`)
    console.log(`  Title: ${r.title}`)
    console.log(`  Entities: ${entityNames}`)
    console.log(`  Reviewed: ${r.isHumanReviewed}, hasAnalysis: ${hasAnalysis}`)
    console.log(`  ShortAnswer: ${r.shortAnswer?.substring(0, 120) || 'none'}`)
    if (r.verdict) console.log(`  Verdict: ${r.verdict?.substring(0, 120)}`)
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

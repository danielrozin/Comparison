import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

const CANDIDATES = [
  'macbook-pro-14-vs-16-inch',
  'subaru-outback-vs-toyota-rav4',
  'neymar-vs-mbappe',
  'phd-vs-masters-degree',
  'lionel-messi-vs-pele',
  'tidal-vs-spotify',
  'home-depot-vs-lowes',
  'firefox-vs-safari',
  'toyota-rav4-vs-honda-cr-v',
  'webflow-vs-squarespace'
]

async function main() {
  for (const slug of CANDIDATES) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: {
        slug: true,
        title: true,
        searchImpressions: true,
        isHumanReviewed: true,
        content: true,
        entityA: true,
        entityB: true,
        shortAnswer: true
      }
    })
    if (!r) {
      console.log(`NOT FOUND: ${slug}`)
      continue
    }
    const hasAnalysis = r.content && typeof r.content === 'object' && 'expertAnalysis' in r.content
    console.log(`\n--- ${r.slug} ---`)
    console.log(`Title: ${r.title}`)
    console.log(`Entities: ${r.entityA} vs ${r.entityB}`)
    console.log(`Impressions: ${r.searchImpressions}`)
    console.log(`Reviewed: ${r.isHumanReviewed}, hasAnalysis: ${hasAnalysis}`)
    console.log(`ShortAnswer (first 100 chars): ${r.shortAnswer?.substring(0, 100) || 'none'}`)
  }
  
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

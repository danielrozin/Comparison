import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

const SLUGS = ['revolut-vs-wise', 'target-vs-walmart', 'ufc-vs-boxing']

async function main() {
  for (const slug of SLUGS) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: { slug: true, content: true }
    })
    if (!r) continue
    const c = r.content
    console.log(`\n=== ${slug} ===`)
    if (c?.analysis) {
      const words = c.analysis.split(/\s+/).length
      console.log(`analysis field: ${words} words`)
      console.log(`preview: ${c.analysis.slice(0, 200)}...`)
    }
    if (c?.citations) {
      console.log(`citations: ${JSON.stringify(c.citations).slice(0, 200)}`)
    }
  }
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })

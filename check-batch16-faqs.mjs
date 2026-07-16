import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env.local'), override: true })

const prisma = new PrismaClient()

const SLUGS = [
  'revolut-vs-wise',
  'target-vs-walmart',
  'ufc-vs-boxing',
  'macbook-air-m3-vs-macbook-air-m4'
]

async function main() {
  for (const slug of SLUGS) {
    const r = await prisma.comparison.findUnique({
      where: { slug },
      select: {
        slug: true,
        content: true,
        faqs: { select: { question: true, answer: true } }
      }
    })
    if (!r) { console.log(`NOT FOUND: ${slug}`); continue }
    const content = r.content
    console.log(`\n=== ${slug} ===`)
    console.log(`Content keys: ${content ? Object.keys(content).join(', ') : 'null'}`)
    r.faqs.forEach((f, i) => {
      console.log(`  FAQ ${i+1}: ${f.question.slice(0,80)}`)
      console.log(`    A: ${f.answer.slice(0,80)}...`)
    })
  }
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })

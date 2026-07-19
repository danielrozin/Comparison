import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local'), override: true })
const prisma = new PrismaClient()

const slugs = ['wix-vs-wordpress', 'acorns-vs-robinhood', 'capture-one-vs-lightroom', 'framer-vs-wordpress', 'galaxy-buds-vs-sony']
for (const slug of slugs) {
  const c = await prisma.comparison.findUnique({ where: {slug}, select: {slug:true, content:true} })
  const keys = c?.content ? Object.keys(c.content) : []
  const hasExpert = keys.includes('expertAnalysis')
  console.log(slug + ': expertAnalysis=' + hasExpert + ' | keys=' + keys.slice(0,6).join(', '))
}
await prisma.$disconnect()

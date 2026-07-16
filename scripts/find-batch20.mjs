import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()
const pages = await prisma.comparison.findMany({
  where: { searchImpressions: { gte: 108, lte: 112 } },
  orderBy: { searchImpressions: 'desc' },
  select: { slug: true, searchImpressions: true, content: true }
})
pages.forEach(p => console.log(p.searchImpressions, p.slug, p.content ? 'HAS_CONTENT' : 'EMPTY'))
console.log('Total:', pages.length)
await prisma.$disconnect()

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()

const pages = await prisma.comparison.findMany({
  where: { searchImpressions: { gte: 30, lte: 60 } },
  select: { slug: true, searchImpressions: true, content: true },
  orderBy: { searchImpressions: 'desc' },
})

const unenriched = pages.filter(p => {
  if (!p.content) return true
  if (Array.isArray(p.content)) return true
  if (typeof p.content === 'object' && !('enrichedAt' in p.content)) return true
  return false
})

unenriched.slice(0, 20).forEach(p => console.log(p.searchImpressions, p.slug))
await prisma.$disconnect()

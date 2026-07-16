import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })
const prisma = new PrismaClient()
const pages = await prisma.comparison.findMany({
  where: { searchImpressions: { gte: 60, lte: 76 } },
  select: { slug: true, searchImpressions: true },
  orderBy: { searchImpressions: 'desc' },
  take: 30
})
pages.forEach(p => console.log(p.searchImpressions, p.slug))
await prisma.$disconnect()

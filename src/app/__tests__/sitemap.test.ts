import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/services/mock-data', () => ({
  getAllMockSlugs: vi.fn().mockReturnValue(['messi-vs-ronaldo', 'python-vs-javascript']),
  getMockComparison: vi.fn().mockImplementation((slug: string) => {
    if (slug === 'messi-vs-ronaldo') {
      return {
        slug: 'messi-vs-ronaldo',
        title: 'Messi vs Ronaldo',
        category: 'sports',
        entities: [
          { slug: 'messi', name: 'Messi' },
          { slug: 'ronaldo', name: 'Ronaldo' },
        ],
        metadata: { updatedAt: '2026-01-15T00:00:00Z' },
      }
    }
    if (slug === 'python-vs-javascript') {
      return {
        slug: 'python-vs-javascript',
        title: 'Python vs JavaScript',
        category: 'technology',
        entities: [
          { slug: 'python', name: 'Python' },
          { slug: 'javascript', name: 'JavaScript' },
        ],
        metadata: { updatedAt: '2026-02-01T00:00:00Z' },
      }
    }
    return null
  }),
}))

vi.mock('@/lib/utils/constants', () => ({
  CATEGORIES: [
    { slug: 'sports', name: 'Sports' },
    { slug: 'technology', name: 'Technology' },
  ],
  CATEGORY_SUBCATEGORIES: {
    sports: [{ slug: 'football', name: 'Football' }],
    technology: [{ slug: 'programming', name: 'Programming' }],
  },
}))

vi.mock('@/lib/services/blog-generator', () => ({
  listBlogArticles: vi.fn().mockResolvedValue({
    articles: [
      { slug: 'best-comparisons-2026', updatedAt: '2026-03-01T00:00:00Z' },
    ],
  }),
}))

vi.mock('@/lib/services/review-service', () => ({
  getReviewCategories: vi.fn().mockResolvedValue([
    { slug: 'software', name: 'Software' },
  ]),
  getReviewedEntities: vi.fn().mockResolvedValue({
    entities: [
      { slug: 'python', reviewAggregation: { lastAggregatedAt: '2026-03-15T00:00:00Z' } },
    ],
  }),
}))

import sitemap, { generateSitemaps } from '../sitemap'

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateSitemaps', () => {
    it('returns 5 sitemap indices', async () => {
      const sitemaps = await generateSitemaps()
      expect(sitemaps).toHaveLength(5)
      expect(sitemaps.map(s => s.id)).toEqual([0, 1, 2, 3, 4])
    })
  })

  describe('sitemap index 0 - static + category pages', () => {
    it('includes static pages with correct URLs', async () => {
      const entries = await sitemap({ id: 0 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net')
      expect(urls).toContain('https://www.aversusb.net/trending')
      expect(urls).toContain('https://www.aversusb.net/search')
      expect(urls).toContain('https://www.aversusb.net/privacy')
      expect(urls).toContain('https://www.aversusb.net/terms')
    })

    it('includes category pages', async () => {
      const entries = await sitemap({ id: 0 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net/category/sports')
      expect(urls).toContain('https://www.aversusb.net/category/technology')
      expect(urls).toContain('https://www.aversusb.net/compare/sports')
      expect(urls).toContain('https://www.aversusb.net/compare/technology')
    })

    it('includes subcategory pages', async () => {
      const entries = await sitemap({ id: 0 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net/category/sports/football')
      expect(urls).toContain('https://www.aversusb.net/category/technology/programming')
    })

    it('sets correct priorities', async () => {
      const entries = await sitemap({ id: 0 })
      const homepage = entries.find(e => e.url === 'https://www.aversusb.net')
      expect(homepage!.priority).toBe(1.0)

      const privacy = entries.find(e => e.url === 'https://www.aversusb.net/privacy')
      expect(privacy!.priority).toBe(0.2)
    })
  })

  describe('sitemap index 1 - comparison pages', () => {
    it('includes all comparison slugs', async () => {
      const entries = await sitemap({ id: 1 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net/compare/messi-vs-ronaldo')
      expect(urls).toContain('https://www.aversusb.net/compare/python-vs-javascript')
      expect(entries).toHaveLength(2)
    })

    it('uses comparison updatedAt as lastModified', async () => {
      const entries = await sitemap({ id: 1 })
      const messi = entries.find(e => e.url!.includes('messi'))
      expect(messi!.lastModified).toBe('2026-01-15T00:00:00Z')
    })
  })

  describe('sitemap index 2 - entity + alternatives pages', () => {
    it('includes entity and alternatives pages', async () => {
      const entries = await sitemap({ id: 2 })
      const urls = entries.map(e => e.url)

      expect(urls.some(u => u!.includes('/entity/messi'))).toBe(true)
      expect(urls.some(u => u!.includes('/entity/python'))).toBe(true)
      expect(urls.some(u => u!.includes('/alternatives/messi'))).toBe(true)
      expect(urls.some(u => u!.includes('/alternatives/python'))).toBe(true)
    })
  })

  describe('sitemap index 3 - blog pages', () => {
    it('includes blog listing and article pages', async () => {
      const entries = await sitemap({ id: 3 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net/blog')
      expect(urls).toContain('https://www.aversusb.net/blog/best-comparisons-2026')
    })
  })

  describe('sitemap index 4 - review pages', () => {
    it('includes review category and entity pages', async () => {
      const entries = await sitemap({ id: 4 })
      const urls = entries.map(e => e.url)

      expect(urls).toContain('https://www.aversusb.net/reviews/category/software')
      expect(urls).toContain('https://www.aversusb.net/reviews/python')
    })
  })

  describe('invalid sitemap index', () => {
    it('returns empty array for unknown index', async () => {
      const entries = await sitemap({ id: 99 })
      expect(entries).toEqual([])
    })
  })
})

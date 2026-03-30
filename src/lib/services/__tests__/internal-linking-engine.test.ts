import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing the module
vi.mock('@/lib/services/redis', () => ({
  getRedis: () => null, // no redis in tests
}))

vi.mock('@/lib/db/prisma', () => ({
  getPrisma: () => null, // no prisma in tests — forces mock-data path
}))

// Mock mock-data module
const mockComparisons = new Map<string, {
  slug: string
  title: string
  category: string
  entities: { slug: string }[]
  metadata: { viewCount: number }
}>()

mockComparisons.set('messi-vs-ronaldo', {
  slug: 'messi-vs-ronaldo',
  title: 'Messi vs Ronaldo',
  category: 'sports',
  entities: [{ slug: 'messi' }, { slug: 'ronaldo' }],
  metadata: { viewCount: 50000 },
})

mockComparisons.set('messi-vs-haaland', {
  slug: 'messi-vs-haaland',
  title: 'Messi vs Haaland',
  category: 'sports',
  entities: [{ slug: 'messi' }, { slug: 'haaland' }],
  metadata: { viewCount: 20000 },
})

mockComparisons.set('iphone-vs-samsung', {
  slug: 'iphone-vs-samsung',
  title: 'iPhone vs Samsung',
  category: 'technology',
  entities: [{ slug: 'iphone' }, { slug: 'samsung' }],
  metadata: { viewCount: 80000 },
})

mockComparisons.set('nike-vs-adidas', {
  slug: 'nike-vs-adidas',
  title: 'Nike vs Adidas',
  category: 'brands',
  entities: [{ slug: 'nike' }, { slug: 'adidas' }],
  metadata: { viewCount: 30000 },
})

mockComparisons.set('apple-vs-microsoft', {
  slug: 'apple-vs-microsoft',
  title: 'Apple vs Microsoft',
  category: 'companies',
  entities: [{ slug: 'apple' }, { slug: 'microsoft' }],
  metadata: { viewCount: 60000 },
})

mockComparisons.set('lebron-vs-jordan', {
  slug: 'lebron-vs-jordan',
  title: 'LeBron vs Jordan',
  category: 'celebrities',
  entities: [{ slug: 'lebron' }, { slug: 'jordan' }],
  metadata: { viewCount: 40000 },
})

vi.mock('@/lib/services/mock-data', () => ({
  getMockComparison: (slug: string) => mockComparisons.get(slug) || null,
  getAllMockSlugs: () => Array.from(mockComparisons.keys()),
}))

import { getLinkedComparisons, type LinkingEngineInput } from '../internal-linking-engine'

describe('Internal Linking Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns results only with positive signal scores (view boost alone counts)', async () => {
    const input: LinkingEngineInput = {
      comparisonId: 'test-id',
      slug: 'unknown-vs-unknown',
      category: 'nonexistent',
      entitySlugs: ['no-match-1', 'no-match-2'],
    }

    const results = await getLinkedComparisons(input, 5)
    // Even with no entity/category match, view boost alone generates a positive score
    // All results should have score > 0 (from viewCount boost)
    for (const r of results) {
      expect(r.score).toBeGreaterThan(0)
    }
  })

  it('excludes the current comparison from results', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 10)
    const slugs = results.map((r) => r.slug)
    expect(slugs).not.toContain('messi-vs-ronaldo')
  })

  it('scores entity overlap highest', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 10)
    // messi-vs-haaland shares 'messi' entity — should rank high
    const messiHaaland = results.find((r) => r.slug === 'messi-vs-haaland')
    expect(messiHaaland).toBeDefined()
    expect(messiHaaland!.signals).toContain('entity_overlap')
    // It should be ranked first (entity overlap + same category)
    expect(results[0].slug).toBe('messi-vs-haaland')
  })

  it('includes same-category matches', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 10)
    // messi-vs-haaland is same category (sports)
    const messiHaaland = results.find((r) => r.slug === 'messi-vs-haaland')
    expect(messiHaaland).toBeDefined()
    expect(messiHaaland!.signals).toContain('same_category')
  })

  it('includes related-category matches', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 10)
    // celebrities is related to sports
    const lebronJordan = results.find((r) => r.slug === 'lebron-vs-jordan')
    expect(lebronJordan).toBeDefined()
    expect(lebronJordan!.signals).toContain('related_category')
  })

  it('respects the limit parameter', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  it('sorts results by score descending', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'messi-vs-ronaldo',
      category: 'sports',
      entitySlugs: ['messi', 'ronaldo'],
    }

    const results = await getLinkedComparisons(input, 10)
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
    }
  })

  it('handles null category gracefully', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'test-comparison',
      category: null,
      entitySlugs: ['messi'],
    }

    const results = await getLinkedComparisons(input, 10)
    // Should still find entity overlap matches
    const hasEntityOverlap = results.some((r) => r.signals.includes('entity_overlap'))
    expect(hasEntityOverlap).toBe(true)
  })

  it('handles empty entitySlugs', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'test-comparison',
      category: 'technology',
      entitySlugs: [],
    }

    const results = await getLinkedComparisons(input, 10)
    // Should still find category-based matches
    const techResults = results.filter(
      (r) => r.signals.includes('same_category') || r.signals.includes('related_category')
    )
    expect(techResults.length).toBeGreaterThan(0)
  })

  it('includes view boost in scores', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'test-comparison',
      category: 'technology',
      entitySlugs: [],
    }

    const results = await getLinkedComparisons(input, 10)
    // iphone-vs-samsung has 80000 views — should have a view boost
    const iphone = results.find((r) => r.slug === 'iphone-vs-samsung')
    expect(iphone).toBeDefined()
    // Score should be > WEIGHT_SAME_CATEGORY (20) due to view boost
    expect(iphone!.score).toBeGreaterThan(20)
  })

  it('technology category relates to products, companies', async () => {
    const input: LinkingEngineInput = {
      comparisonId: '1',
      slug: 'iphone-vs-samsung',
      category: 'technology',
      entitySlugs: ['iphone', 'samsung'],
    }

    const results = await getLinkedComparisons(input, 10)
    const categories = results.map((r) => r.category)
    // Should include brands (related to technology via products→brands)
    // and companies (directly related)
    expect(categories).toContain('companies')
  })
})

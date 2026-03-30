import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies before importing
vi.mock('@/lib/services/redis', () => ({
  getRedis: () => null,
}))

vi.mock('@/lib/db/prisma', () => ({
  getPrisma: () => null,
}))

vi.mock('@/lib/services/internal-linking-engine', () => ({
  getLinkedComparisons: vi.fn().mockResolvedValue([]),
}))

import {
  getComparisonBySlug,
  searchComparisons,
  getComparisonsByCategory,
  getTrendingComparisons,
  getLatestComparisons,
  getComparisonSlugsExisting,
  incrementViewCount,
} from '../comparison-service'
import { getAllMockSlugs } from '../mock-data'

describe('Comparison Service (mock-data fallback)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getComparisonBySlug', () => {
    it('returns comparison data for a valid slug', async () => {
      const result = await getComparisonBySlug('messi-vs-ronaldo')
      expect(result).not.toBeNull()
      expect(result!.slug).toBe('messi-vs-ronaldo')
      expect(result!.title).toBe('Messi vs Ronaldo')
    })

    it('returns null for a non-existent slug', async () => {
      const result = await getComparisonBySlug('nonexistent-slug-xyz')
      expect(result).toBeNull()
    })

    it('includes entities array with correct structure', async () => {
      const result = await getComparisonBySlug('messi-vs-ronaldo')
      expect(result!.entities).toHaveLength(2)
      expect(result!.entities[0]).toHaveProperty('slug')
      expect(result!.entities[0]).toHaveProperty('name')
      expect(result!.entities[0]).toHaveProperty('pros')
      expect(result!.entities[0]).toHaveProperty('cons')
    })

    it('includes metadata with viewCount', async () => {
      const result = await getComparisonBySlug('messi-vs-ronaldo')
      expect(result!.metadata).toHaveProperty('viewCount')
      expect(result!.metadata.viewCount).toBeGreaterThan(0)
    })

    it('includes keyDifferences array', async () => {
      const result = await getComparisonBySlug('messi-vs-ronaldo')
      expect(result!.keyDifferences).toBeDefined()
      expect(Array.isArray(result!.keyDifferences)).toBe(true)
      expect(result!.keyDifferences.length).toBeGreaterThan(0)
    })

    it('includes FAQs', async () => {
      const result = await getComparisonBySlug('messi-vs-ronaldo')
      expect(result!.faqs).toBeDefined()
      expect(result!.faqs.length).toBeGreaterThan(0)
      expect(result!.faqs[0]).toHaveProperty('question')
      expect(result!.faqs[0]).toHaveProperty('answer')
    })
  })

  describe('searchComparisons', () => {
    it('returns results matching query', async () => {
      const results = await searchComparisons('messi', 10)
      expect(results.length).toBeGreaterThan(0)
      const slugs = results.map((r) => r.slug)
      expect(slugs.some((s) => s.includes('messi'))).toBe(true)
    })

    it('returns empty array for no matches', async () => {
      const results = await searchComparisons('zzzznonexistentquery', 10)
      expect(results).toHaveLength(0)
    })

    it('respects limit parameter', async () => {
      const results = await searchComparisons('vs', 2)
      expect(results.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getComparisonsByCategory', () => {
    it('returns comparisons for a valid category', async () => {
      const result = await getComparisonsByCategory('sports')
      expect(result.comparisons.length).toBeGreaterThan(0)
      expect(result.total).toBeGreaterThan(0)
    })

    it('returns empty for a non-existent category', async () => {
      const result = await getComparisonsByCategory('nonexistent-category-xyz')
      expect(result.comparisons).toHaveLength(0)
    })
  })

  describe('getTrendingComparisons', () => {
    it('returns trending comparisons', async () => {
      const results = await getTrendingComparisons(5)
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]).toHaveProperty('slug')
      expect(results[0]).toHaveProperty('title')
    })

    it('respects limit parameter', async () => {
      const results = await getTrendingComparisons(2)
      expect(results.length).toBeLessThanOrEqual(2)
    })
  })

  describe('getLatestComparisons', () => {
    it('returns latest comparisons', async () => {
      const results = await getLatestComparisons(5)
      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('getComparisonSlugsExisting', () => {
    it('filters and returns existing slugs', async () => {
      const slugs = await getComparisonSlugsExisting(['messi-vs-ronaldo', 'nonexistent-xyz'])
      expect(slugs).toContain('messi-vs-ronaldo')
      expect(slugs).not.toContain('nonexistent-xyz')
    })

    it('returns empty array for empty input', async () => {
      const slugs = await getComparisonSlugsExisting([])
      expect(slugs).toHaveLength(0)
    })

    it('returns all valid slugs from mock data', async () => {
      const allSlugs = getAllMockSlugs()
      const existing = await getComparisonSlugsExisting(allSlugs)
      expect(existing.length).toBe(allSlugs.length)
    })
  })

  describe('incrementViewCount', () => {
    it('does not throw for any comparison ID', async () => {
      await expect(incrementViewCount('comp-1')).resolves.not.toThrow()
    })

    it('does not throw for non-existent ID', async () => {
      await expect(incrementViewCount('non-existent')).resolves.not.toThrow()
    })
  })
})

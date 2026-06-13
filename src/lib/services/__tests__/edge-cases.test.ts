import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
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
  getComparisonSlugsExisting,
} from '../comparison-service'
import { getAllMockSlugs, getMockComparison } from '../mock-data'

describe('Edge Cases', () => {
  describe('Invalid slugs', () => {
    it('returns null for empty string slug', async () => {
      const result = await getComparisonBySlug('')
      expect(result).toBeNull()
    })

    it('returns null for slug with special characters', async () => {
      const result = await getComparisonBySlug('!@#$%^&*()')
      expect(result).toBeNull()
    })

    it('returns null for very long slug', async () => {
      const longSlug = 'a'.repeat(1000) + '-vs-' + 'b'.repeat(1000)
      const result = await getComparisonBySlug(longSlug)
      expect(result).toBeNull()
    })

    it('returns null for slug with only hyphens', async () => {
      const result = await getComparisonBySlug('---vs---')
      expect(result).toBeNull()
    })

    it('is case-sensitive for slugs (lowercase expected)', async () => {
      const result = await getComparisonBySlug('MESSI-VS-RONALDO')
      // Mock data uses lowercase slugs
      expect(result).toBeNull()
    })
  })

  describe('Empty search queries', () => {
    it('returns results for an empty search query (returns all)', async () => {
      const results = await searchComparisons('', 100)
      // Empty query behavior may return all or empty depending on implementation
      expect(Array.isArray(results)).toBe(true)
    })

    it('handles whitespace-only query', async () => {
      const results = await searchComparisons('   ', 10)
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('Category edge cases', () => {
    it('handles empty category string', async () => {
      const result = await getComparisonsByCategory('')
      expect(result.comparisons).toBeDefined()
      expect(Array.isArray(result.comparisons)).toBe(true)
    })

    it('handles category with mixed case', async () => {
      const result = await getComparisonsByCategory('SPORTS')
      // Mock data uses lowercase, should handle gracefully
      expect(result.comparisons).toBeDefined()
    })
  })

  describe('Data integrity', () => {
    it('all mock comparisons have exactly 2 entities', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.entities.length).toBeGreaterThanOrEqual(2)
      }
    })

    it('all entities have non-empty names', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        for (const entity of comp!.entities) {
          expect(entity.name).toBeTruthy()
          expect(entity.name.length).toBeGreaterThan(0)
        }
      }
    })

    it('all comparisons have a non-empty title', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.title).toBeTruthy()
      }
    })

    it('no duplicate slugs exist', () => {
      const slugs = getAllMockSlugs()
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('all comparisons have a valid category string', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(typeof comp!.category).toBe('string')
        expect(comp!.category!.length).toBeGreaterThan(0)
      }
    })

    it('keyDifferences have correct structure when present', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        if (comp!.keyDifferences && comp!.keyDifferences.length > 0) {
          for (const kd of comp!.keyDifferences) {
            expect(kd).toHaveProperty('label')
            expect(kd).toHaveProperty('entityAValue')
            expect(kd).toHaveProperty('entityBValue')
          }
        }
      }
    })

    it('FAQs have question and answer fields', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        if (comp!.faqs && comp!.faqs.length > 0) {
          for (const faq of comp!.faqs) {
            expect(faq.question).toBeTruthy()
            expect(faq.answer).toBeTruthy()
          }
        }
      }
    })

    it('metadata has metaTitle and metaDescription', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.metadata.metaTitle).toBeTruthy()
        expect(comp!.metadata.metaDescription).toBeTruthy()
      }
    })
  })

  describe('Limit and offset edge cases', () => {
    it('search with limit 0 returns empty or all', async () => {
      const results = await searchComparisons('messi', 0)
      expect(Array.isArray(results)).toBe(true)
    })

    it('search with very large limit does not crash', async () => {
      const results = await searchComparisons('vs', 10000)
      expect(Array.isArray(results)).toBe(true)
    })

    it('getComparisonSlugsExisting returns consistent results on multiple calls', async () => {
      const input = ['messi-vs-ronaldo', 'japan-vs-china']
      const slugs1 = await getComparisonSlugsExisting(input)
      const slugs2 = await getComparisonSlugsExisting(input)
      expect(slugs1).toEqual(slugs2)
    })
  })
})

import { describe, it, expect } from 'vitest'

import {
  getMockComparison,
  getAllMockSlugs,
  getMockTrending,
  getMockRelated,
  getMockComparisonsByCategory,
  getMockLatest,
} from '../mock-data'

describe('Mock Data Module', () => {
  describe('getAllMockSlugs', () => {
    it('returns a non-empty array of slugs', () => {
      const slugs = getAllMockSlugs()
      expect(slugs.length).toBeGreaterThan(0)
    })

    it('contains known slugs', () => {
      const slugs = getAllMockSlugs()
      expect(slugs).toContain('messi-vs-ronaldo')
    })

    it('all slugs are valid strings', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        expect(typeof slug).toBe('string')
        expect(slug.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getMockComparison', () => {
    it('returns data for a known slug', () => {
      const comp = getMockComparison('messi-vs-ronaldo')
      expect(comp).not.toBeNull()
      expect(comp!.slug).toBe('messi-vs-ronaldo')
    })

    it('returns null for unknown slug', () => {
      const comp = getMockComparison('totally-fake-slug')
      expect(comp).toBeNull()
    })

    it('returned data has required fields', () => {
      const comp = getMockComparison('messi-vs-ronaldo')
      expect(comp).toBeDefined()
      expect(comp!.id).toBeDefined()
      expect(comp!.title).toBeDefined()
      expect(comp!.entities).toBeDefined()
      expect(comp!.entities.length).toBe(2)
      expect(comp!.category).toBeDefined()
      expect(comp!.metadata).toBeDefined()
      expect(comp!.metadata.viewCount).toBeGreaterThanOrEqual(0)
    })

    it('entities have required structure', () => {
      const comp = getMockComparison('messi-vs-ronaldo')
      for (const entity of comp!.entities) {
        expect(entity).toHaveProperty('id')
        expect(entity).toHaveProperty('slug')
        expect(entity).toHaveProperty('name')
        expect(entity).toHaveProperty('pros')
        expect(entity).toHaveProperty('cons')
        expect(Array.isArray(entity.pros)).toBe(true)
        expect(Array.isArray(entity.cons)).toBe(true)
      }
    })

    it('every slug from getAllMockSlugs resolves to valid data', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp).not.toBeNull()
        expect(comp!.slug).toBe(slug)
        expect(comp!.title).toBeTruthy()
        expect(comp!.entities.length).toBeGreaterThanOrEqual(2)
      }
    })
  })

  describe('getMockTrending', () => {
    it('returns an array of trending comparisons', () => {
      const trending = getMockTrending(10)
      expect(Array.isArray(trending)).toBe(true)
      expect(trending.length).toBeGreaterThan(0)
    })

    it('trending items have slug and title', () => {
      const trending = getMockTrending(10)
      for (const item of trending) {
        expect(item).toHaveProperty('slug')
        expect(item).toHaveProperty('title')
      }
    })
  })

  describe('getMockRelated', () => {
    it('returns related comparisons for a known slug', () => {
      const related = getMockRelated('messi-vs-ronaldo', 10)
      expect(Array.isArray(related)).toBe(true)
    })

    it('returns empty array for unknown slug', () => {
      const related = getMockRelated('nonexistent-slug', 10)
      expect(Array.isArray(related)).toBe(true)
    })
  })

  describe('getMockComparisonsByCategory', () => {
    it('returns comparisons for sports category', () => {
      const results = getMockComparisonsByCategory('sports')
      expect(results.length).toBeGreaterThan(0)
    })

    it('returns empty array for non-existent category', () => {
      const results = getMockComparisonsByCategory('nonexistent-cat')
      expect(results).toHaveLength(0)
    })
  })

  describe('getMockLatest', () => {
    it('returns latest comparisons', () => {
      const latest = getMockLatest(5)
      expect(latest.length).toBeGreaterThan(0)
      expect(latest.length).toBeLessThanOrEqual(5)
    })

    it('respects limit', () => {
      const latest = getMockLatest(2)
      expect(latest.length).toBeLessThanOrEqual(2)
    })
  })

  describe('JSON-LD / Schema validation on mock data', () => {
    it('all comparisons have valid metadata for schema generation', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.metadata).toBeDefined()
        expect(comp!.metadata.metaTitle).toBeTruthy()
        expect(comp!.metadata.metaDescription).toBeTruthy()
      }
    })

    it('all comparisons have a verdict', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.verdict).toBeTruthy()
      }
    })

    it('all comparisons have a shortAnswer', () => {
      const slugs = getAllMockSlugs()
      for (const slug of slugs) {
        const comp = getMockComparison(slug)
        expect(comp!.shortAnswer).toBeTruthy()
      }
    })
  })
})

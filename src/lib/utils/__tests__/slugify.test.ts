import { describe, it, expect } from 'vitest'
import { slugify, comparisonSlug, parseComparisonSlug } from '../slugify'

describe('slugify', () => {
  it('converts text to lowercase hyphenated slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('  Messi vs Ronaldo  ')).toBe('messi-vs-ronaldo')
  })

  it('removes special characters', () => {
    expect(slugify('iPhone 16 Pro!')).toBe('iphone-16-pro')
    expect(slugify('C++ vs C#')).toBe('c-vs-c')
  })

  it('handles diacritics via NFD normalization', () => {
    expect(slugify('café')).toBe('cafe')
    expect(slugify('über')).toBe('uber')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('a---b')).toBe('a-b')
    expect(slugify('hello   world')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('-hello-')).toBe('hello')
    expect(slugify('  -hello-  ')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})

describe('comparisonSlug', () => {
  it('creates alphabetically sorted comparison slug', () => {
    expect(comparisonSlug('Ronaldo', 'Messi')).toBe('messi-vs-ronaldo')
    expect(comparisonSlug('Messi', 'Ronaldo')).toBe('messi-vs-ronaldo')
  })

  it('handles identical inputs deterministically', () => {
    const slug1 = comparisonSlug('Apple', 'Google')
    const slug2 = comparisonSlug('Google', 'Apple')
    expect(slug1).toBe(slug2)
  })
})

describe('parseComparisonSlug', () => {
  it('parses a valid comparison slug', () => {
    const result = parseComparisonSlug('messi-vs-ronaldo')
    expect(result).toEqual({ entityA: 'messi', entityB: 'ronaldo' })
  })

  it('handles multi-word entity slugs', () => {
    const result = parseComparisonSlug('iphone-16-vs-samsung-galaxy-s25')
    expect(result).toEqual({ entityA: 'iphone-16', entityB: 'samsung-galaxy-s25' })
  })

  it('returns null for invalid slugs', () => {
    expect(parseComparisonSlug('no-versus-here')).toBeNull()
    expect(parseComparisonSlug('')).toBeNull()
    expect(parseComparisonSlug('single')).toBeNull()
  })
})

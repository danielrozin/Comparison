import { describe, it, expect } from 'vitest'

import { classifyComparison } from '../categorizer'

describe('Categorizer (classifyComparison)', () => {
  it('classifies soccer players correctly', () => {
    const result = classifyComparison('Messi', 'Ronaldo')
    expect(result.category).toBe('sports')
    expect(result.subcategory).toContain('Soccer')
    expect(result.tags).toContain('soccer')
  })

  it('classifies basketball players correctly', () => {
    const result = classifyComparison('LeBron', 'Jordan')
    expect(result.category).toBe('sports')
    expect(result.tags).toContain('basketball')
  })

  it('classifies smartphones correctly', () => {
    const result = classifyComparison('iPhone 15', 'Samsung Galaxy S24')
    expect(result.category).toBe('technology')
    expect(result.tags).toContain('phones')
  })

  it('classifies AI tools correctly', () => {
    const result = classifyComparison('ChatGPT', 'Claude')
    expect(result.category).toBe('technology')
    expect(result.tags).toContain('ai')
  })

  it('returns a fallback for unknown entities', () => {
    const result = classifyComparison('FakeThingXYZ', 'AnotherFakeABC')
    expect(result.category).toBeDefined()
    expect(typeof result.category).toBe('string')
    expect(result.subcategory).toBeDefined()
    expect(Array.isArray(result.tags)).toBe(true)
  })

  it('classification result always has the correct shape', () => {
    const result = classifyComparison('anything', 'else')
    expect(result).toHaveProperty('category')
    expect(result).toHaveProperty('subcategory')
    expect(result).toHaveProperty('tags')
  })

  it('classifies programming languages', () => {
    const result = classifyComparison('Python', 'JavaScript')
    expect(result.category).toBe('technology')
    expect(result.tags).toContain('programming')
  })

  it('classifies gaming consoles', () => {
    const result = classifyComparison('PS5', 'Xbox')
    expect(result.category).toBe('technology')
    expect(result.tags).toContain('gaming')
  })
})

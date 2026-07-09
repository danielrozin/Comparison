// DAN-1800 — quality gate calibration tests (spam-update recovery, lever #3).
//
// The gate must REJECT thin/filler generations (the "scaled content abuse"
// footprint Google's June 2026 Spam Update downranked) while PASSING genuine,
// data-rich comparisons. These tests pin both ends so future prompt/threshold
// changes can't silently start minting thin pages again — or start rejecting
// real ones.

import { describe, it, expect } from 'vitest'
import {
  assessComparisonQuality,
  isFillerValue,
  isSubstantiveValue,
} from '../comparison-quality'

describe('filler / substantive value classification', () => {
  it('flags bare generic adjectives and empty values as filler', () => {
    for (const v of ['', '-', 'N/A', 'Good', 'Varies', 'Yes', 'High', 'Similar', 'Standard']) {
      expect(isFillerValue(v)).toBe(true)
      expect(isSubstantiveValue(v)).toBe(false)
    }
  })

  it('treats numbers and specific phrases as substantive', () => {
    for (const v of ['$1,299', '6.7-inch OLED', '120Hz refresh rate', 'A17 Pro chip', '4500mAh']) {
      expect(isFillerValue(v)).toBe(false)
      expect(isSubstantiveValue(v)).toBe(true)
    }
  })
})

// A genuine, data-rich 2-way comparison.
const richComparison = {
  slug: 'iphone-16-pro-vs-galaxy-s24-ultra',
  shortAnswer:
    'The iPhone 16 Pro leads on sustained performance and video, while the Galaxy S24 Ultra wins on display size, S Pen, and zoom range.',
  verdict:
    'Choose the iPhone 16 Pro for the best video and ecosystem; choose the Galaxy S24 Ultra if you want the biggest screen, the S Pen, and 100x zoom. Both are flagship-tier and will last years.',
  keyDifferences: [
    { label: 'Display', entityAValue: '6.3-inch OLED', entityBValue: '6.8-inch AMOLED', winner: 'b' },
    { label: 'Chipset', entityAValue: 'A18 Pro', entityBValue: 'Snapdragon 8 Gen 3', winner: 'a' },
    { label: 'Battery', entityAValue: '3582 mAh', entityBValue: '5000 mAh', winner: 'b' },
    { label: 'Starting price', entityAValue: '$999', entityBValue: '$1,299', winner: 'a' },
  ],
  attributes: [
    { name: 'Weight', values: [{ valueNumber: 199 }, { valueNumber: 232 }] },
    { name: 'Refresh rate', values: [{ valueText: '120Hz ProMotion' }, { valueText: '120Hz LTPO' }] },
    { name: 'Zoom', values: [{ valueText: '5x optical' }, { valueText: '100x Space Zoom' }] },
    { name: 'Storage base', values: [{ valueNumber: 128 }, { valueNumber: 256 }] },
    { name: 'RAM', values: [{ valueNumber: 8 }, { valueNumber: 12 }] },
  ],
  entities: [
    { name: 'iPhone 16 Pro', pros: ['Best video', 'Long support'], cons: ['Pricey storage'] },
    { name: 'Galaxy S24 Ultra', pros: ['S Pen', 'Huge screen'], cons: ['Large and heavy'] },
  ],
  citationStats: { sourceCount: 3 },
}

// A thin, template-filler page of the kind the spam update targeted.
const thinComparison = {
  slug: 'thing-a-vs-thing-b',
  shortAnswer: 'They are similar.',
  verdict: 'It depends.',
  keyDifferences: [
    { label: 'Quality', entityAValue: 'Good', entityBValue: 'Good', winner: 'tie' },
    { label: 'Value', entityAValue: 'High', entityBValue: 'High', winner: 'tie' },
    { label: 'Overall', entityAValue: 'Varies', entityBValue: 'Varies', winner: 'tie' },
  ],
  attributes: [
    { name: 'Rating', values: [{ valueText: 'Good' }, { valueText: 'Good' }] },
    { name: 'Popularity', values: [{ valueText: 'High' }, { valueText: 'Medium' }] },
  ],
  entities: [
    { name: 'Thing A', pros: ['Nice'], cons: [] },
    { name: 'Thing B', pros: ['Nice'], cons: [] },
  ],
  citationStats: { sourceCount: 0 },
}

describe('assessComparisonQuality', () => {
  it('passes a genuine, data-rich comparison', () => {
    const result = assessComparisonQuality(richComparison)
    expect(result.pass).toBe(true)
    expect(result.metrics.substantiveKeyDifferences).toBeGreaterThanOrEqual(3)
    expect(result.metrics.substantiveAttributes).toBeGreaterThanOrEqual(4)
    expect(result.score).toBeGreaterThanOrEqual(45)
  })

  it('rejects a thin filler comparison with reasons', () => {
    const result = assessComparisonQuality(thinComparison)
    expect(result.pass).toBe(false)
    expect(result.reasons.length).toBeGreaterThan(0)
    expect(result.metrics.substantiveAttributes).toBeLessThan(4)
  })

  it('rejects a comparison whose sides are identical (no real contrast)', () => {
    const noContrast = {
      ...richComparison,
      keyDifferences: richComparison.keyDifferences.map((kd) => ({
        ...kd,
        entityBValue: kd.entityAValue,
      })),
    }
    const result = assessComparisonQuality(noContrast)
    // Identical A/B values across every row → no substantive key differences.
    expect(result.metrics.substantiveKeyDifferences).toBe(0)
    expect(result.pass).toBe(false)
  })

  it('supports N-way key-difference shape (values[] array)', () => {
    const nway = {
      ...richComparison,
      keyDifferences: [
        { label: 'Display', values: ['6.3-inch OLED', '6.8-inch AMOLED', '6.7-inch OLED'] },
        { label: 'Chipset', values: ['A18 Pro', 'Snapdragon 8 Gen 3', 'Tensor G4'] },
        { label: 'Price', values: ['$999', '$1,299', '$799'] },
      ],
    }
    const result = assessComparisonQuality(nway)
    expect(result.metrics.substantiveKeyDifferences).toBe(3)
  })
})

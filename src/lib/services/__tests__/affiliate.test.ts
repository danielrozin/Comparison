/**
 * DAN-1053: digital/streaming/software entities must NOT receive an Amazon
 * /s?k= search CTA (dead links, ~0% conversion, Associates policy risk).
 * Physical products must keep their Amazon eligibility (no regression).
 */
import { describe, it, expect } from 'vitest'
import { isDigitalEntity } from '../affiliate'
import type { ComparisonEntityData } from '@/types'

function entity(name: string, entityType = 'product'): ComparisonEntityData {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    shortDesc: null,
    imageUrl: null,
    entityType,
    position: 0,
    pros: [],
    cons: [],
    bestFor: null,
  }
}

describe('isDigitalEntity — digital entities are suppressed (DAN-1053)', () => {
  const digital = [
    // Acceptance pages
    'Spotify',
    'Apple Music',
    'Netflix',
    'Max (formerly HBO Max)',
    'Google Chrome',
    'Firefox',
    // Streaming / music
    'Hulu',
    'Disney+',
    'YouTube Music',
    'Tidal',
    // Browsers
    'Safari',
    'Microsoft Edge',
    'Brave',
    // Operating systems
    'Windows 11',
    'macOS',
    'Linux',
    'Android',
    'iOS',
    // SaaS / free / OSS
    'Notion',
    'Slack',
    'Figma',
    'WordPress',
    'VS Code',
    'ChatGPT',
    'NordVPN',
  ]

  it.each(digital)('classifies "%s" as digital', (name) => {
    expect(isDigitalEntity(entity(name))).toBe(true)
  })

  it('respects an explicit digital entityType regardless of name', () => {
    expect(isDigitalEntity(entity('Acme Stream', 'streaming_service'))).toBe(true)
    expect(isDigitalEntity(entity('Acme Cloud', 'saas'))).toBe(true)
  })
})

describe('isDigitalEntity — physical products keep eligibility (no regression)', () => {
  const physical = [
    'iPhone 15 Pro Max', // the bare /max/ pattern must NOT catch this
    'Samsung Galaxy S24',
    'Google Pixel 9',
    'MacBook Pro',
    'Chromebook', // contains "chrome" but is buyable hardware
    'PlayStation 5',
    'Xbox Series X',
    'Dyson V15',
    'KitchenAid Stand Mixer',
    'Tesla Model 3',
    'Sony WH-1000XM5',
    'Nike Air Max', // "Air Max" sneaker — must not hit the streaming "Max"
  ]

  it.each(physical)('classifies "%s" as NOT digital', (name) => {
    expect(isDigitalEntity(entity(name))).toBe(false)
  })
})

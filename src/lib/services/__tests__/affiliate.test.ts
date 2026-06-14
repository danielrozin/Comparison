/**
 * DAN-1053: digital/streaming/software entities must NOT receive an Amazon
 * /s?k= search CTA (dead links, ~0% conversion, Associates policy risk).
 * Physical products must keep their Amazon eligibility (no regression).
 */
import { describe, it, expect } from 'vitest'
import { isDigitalEntity, resolveBrandHomepage } from '../affiliate'
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

/**
 * DAN-1140: the non-Amazon fallback CTA for high-value digital brands
 * (VPN/SaaS/streaming/AI) must point at the brand's official homepage, NOT
 * leak the click to a Google SERP for $0.
 */
describe('resolveBrandHomepage — digital brands resolve to their homepage (DAN-1140)', () => {
  const cases: Array<[string, string]> = [
    ['NordVPN', 'https://nordvpn.com'],
    ['ExpressVPN', 'https://www.expressvpn.com'],
    ['Surfshark', 'https://surfshark.com'],
    ['ChatGPT', 'https://chatgpt.com'],
    ['Claude', 'https://claude.ai'],
    ['Notion', 'https://www.notion.so'],
    ['Evernote', 'https://evernote.com'],
    ['Spotify', 'https://www.spotify.com'],
    ['Apple Music', 'https://music.apple.com'],
    ['YouTube Music', 'https://music.youtube.com'],
    ['Netflix', 'https://www.netflix.com'],
    ['1Password', 'https://1password.com'],
  ]

  it.each(cases)('resolves "%s" → %s', (name, url) => {
    expect(resolveBrandHomepage(name)).toBe(url)
  })

  it('never returns a google.com/search URL for a known brand', () => {
    for (const [name] of cases) {
      const url = resolveBrandHomepage(name)
      expect(url).not.toBeNull()
      expect(url).not.toContain('google.com/search')
    }
  })

  it('returns null for entities with no canonical homepage (Google-search last resort)', () => {
    expect(resolveBrandHomepage('Some Obscure Widget 9000')).toBeNull()
  })
})

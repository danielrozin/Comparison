/**
 * Tests for src/lib/consent.ts — GDPR consent utilities.
 */
import { describe, it, expect } from 'vitest'
import {
  isEuEea,
  getCountryFromHeaders,
  hashIp,
  toGoogleConsentMode,
  defaultConsentForRegion,
  CURRENT_POLICY_VERSION,
  CONSENT_RETENTION_YEARS,
} from '../consent'

describe('isEuEea', () => {
  it('returns true for EU + EEA + UK', () => {
    for (const code of ['DE', 'FR', 'IT', 'IS', 'NO', 'GB']) {
      expect(isEuEea(code)).toBe(true)
    }
  })

  it('returns false for non-EU/EEA and null', () => {
    expect(isEuEea('US')).toBe(false)
    expect(isEuEea('IL')).toBe(false)
    expect(isEuEea(null)).toBe(false)
    expect(isEuEea(undefined)).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isEuEea('de')).toBe(true)
  })
})

describe('getCountryFromHeaders', () => {
  it('reads x-vercel-ip-country', () => {
    expect(getCountryFromHeaders(new Headers({ 'x-vercel-ip-country': 'US' }))).toBe('US')
    expect(getCountryFromHeaders(new Headers())).toBe(null)
  })
})

describe('hashIp', () => {
  it('returns a 32-char hex string and never contains the raw IP', () => {
    const hash = hashIp('203.0.113.7')
    expect(hash).toMatch(/^[a-f0-9]{32}$/)
    expect(hash).not.toContain('203')
    expect(hash).not.toContain('113')
  })

  it('is deterministic for a given input + salt', () => {
    expect(hashIp('10.0.0.1')).toBe(hashIp('10.0.0.1'))
  })

  it('produces a different hash when CONSENT_IP_SALT changes', () => {
    const before = process.env.CONSENT_IP_SALT
    delete process.env.CONSENT_IP_SALT
    const unsalted = hashIp('203.0.113.7')
    process.env.CONSENT_IP_SALT = 'unit-test-salt'
    const salted = hashIp('203.0.113.7')
    if (before === undefined) delete process.env.CONSENT_IP_SALT
    else process.env.CONSENT_IP_SALT = before
    expect(salted).not.toBe(unsalted)
  })
})

describe('toGoogleConsentMode', () => {
  it('granted when categories allow it', () => {
    const mode = toGoogleConsentMode({
      necessary: true, analytics: true, marketing: true, functional: true,
    })
    expect(mode).toEqual({
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  })

  it('marketing=false denies all ad_* signals', () => {
    const mode = toGoogleConsentMode({
      necessary: true, analytics: true, marketing: false, functional: true,
    })
    expect(mode.analytics_storage).toBe('granted')
    expect(mode.ad_storage).toBe('denied')
    expect(mode.ad_user_data).toBe('denied')
    expect(mode.ad_personalization).toBe('denied')
  })
})

describe('defaultConsentForRegion', () => {
  it('grants all for non-EU', () => {
    expect(defaultConsentForRegion(false)).toEqual({
      necessary: true, analytics: true, marketing: true, functional: true,
    })
  })

  it('denies non-necessary for EU', () => {
    expect(defaultConsentForRegion(true)).toEqual({
      necessary: true, analytics: false, marketing: false, functional: false,
    })
  })
})

describe('constants', () => {
  it('CURRENT_POLICY_VERSION is non-empty', () => {
    expect(CURRENT_POLICY_VERSION).toBeTruthy()
  })
  it('CONSENT_RETENTION_YEARS is 3', () => {
    expect(CONSENT_RETENTION_YEARS).toBe(3)
  })
})

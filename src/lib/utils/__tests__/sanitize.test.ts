import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  stripHtml,
  escapeHtml,
  sanitizeSearchQuery,
  sanitizeSlug,
  sanitizeText,
  sanitizeEmail,
  sanitizeErrorMessage,
} from '../sanitize'

describe('sanitize utilities', () => {
  describe('stripHtml', () => {
    it('removes HTML tags', () => {
      expect(stripHtml('<b>bold</b>')).toBe('bold')
      expect(stripHtml('<script>alert("xss")</script>')).toBe('alert("xss")')
      expect(stripHtml('no tags')).toBe('no tags')
    })

    it('handles nested tags', () => {
      expect(stripHtml('<div><p>hello</p></div>')).toBe('hello')
    })

    it('handles self-closing tags', () => {
      expect(stripHtml('before<br/>after')).toBe('beforeafter')
    })
  })

  describe('escapeHtml', () => {
    it('escapes special HTML characters', () => {
      expect(escapeHtml('&')).toBe('&amp;')
      expect(escapeHtml('<')).toBe('&lt;')
      expect(escapeHtml('>')).toBe('&gt;')
      expect(escapeHtml('"')).toBe('&quot;')
      expect(escapeHtml("'")).toBe('&#x27;')
    })

    it('escapes a full XSS payload', () => {
      const payload = '<script>alert("xss")</script>'
      const escaped = escapeHtml(payload)
      expect(escaped).not.toContain('<')
      expect(escaped).not.toContain('>')
      expect(escaped).toContain('&lt;script&gt;')
    })
  })

  describe('sanitizeSearchQuery', () => {
    it('strips HTML and trims', () => {
      expect(sanitizeSearchQuery('  <b>messi</b> vs ronaldo  ')).toBe('messi vs ronaldo')
    })

    it('limits length', () => {
      const long = 'a'.repeat(300)
      expect(sanitizeSearchQuery(long).length).toBe(200)
    })

    it('respects custom maxLength', () => {
      expect(sanitizeSearchQuery('hello world', 5)).toBe('hello')
    })
  })

  describe('sanitizeSlug', () => {
    it('lowercases and strips invalid chars', () => {
      expect(sanitizeSlug('Hello-World')).toBe('hello-world')
      expect(sanitizeSlug('some slug!')).toBe('someslug')
    })

    it('keeps hyphens and alphanumeric', () => {
      expect(sanitizeSlug('messi-vs-ronaldo')).toBe('messi-vs-ronaldo')
    })

    it('limits length', () => {
      const long = 'a'.repeat(300)
      expect(sanitizeSlug(long).length).toBe(200)
    })
  })

  describe('sanitizeText', () => {
    it('strips HTML, trims, and limits length', () => {
      expect(sanitizeText('  <p>Hello</p>  ')).toBe('Hello')
    })

    it('respects custom maxLength', () => {
      expect(sanitizeText('abcdefgh', 5)).toBe('abcde')
    })
  })

  describe('sanitizeEmail', () => {
    it('normalizes valid emails', () => {
      expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com')
      expect(sanitizeEmail('  user@domain.org  ')).toBe('user@domain.org')
    })

    it('returns null for invalid emails', () => {
      expect(sanitizeEmail('notanemail')).toBeNull()
      expect(sanitizeEmail('@missing.com')).toBeNull()
      expect(sanitizeEmail('no spaces@domain.com')).toBeNull()
    })
  })

  describe('sanitizeErrorMessage', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('returns full message in development', () => {
      process.env.NODE_ENV = 'development'
      const err = new Error('Detailed error with /path/to/file.ts')
      expect(sanitizeErrorMessage(err)).toBe('Detailed error with /path/to/file.ts')
    })

    it('returns safe message in production for unknown errors', () => {
      process.env.NODE_ENV = 'production'
      const err = new Error('Internal DB connection failed at /app/db.ts:42')
      expect(sanitizeErrorMessage(err)).toBe('An unexpected error occurred')
    })

    it('allows known safe error patterns in production', () => {
      process.env.NODE_ENV = 'production'
      expect(sanitizeErrorMessage(new Error('Invalid input format'))).toBe('Invalid input format')
      expect(sanitizeErrorMessage(new Error('Not found'))).toBe('Not found')
      expect(sanitizeErrorMessage(new Error('Rate limit exceeded'))).toBe('Rate limit exceeded')
    })
  })
})

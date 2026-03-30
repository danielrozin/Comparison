import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock api-key-service
vi.mock('@/lib/services/api-key-service', () => ({
  checkRateLimit: vi.fn(),
  incrementUsage: vi.fn().mockResolvedValue(undefined),
  API_TIERS: {
    free: { name: 'Free', dailyLimit: 100, price: 0 },
    pro: { name: 'Pro', dailyLimit: 10000, price: 9900 },
    enterprise: { name: 'Enterprise', dailyLimit: Infinity, price: 49900 },
  },
}))

import { withApiKey } from '../api-middleware'
import { checkRateLimit } from '../api-key-service'

const mockedCheckRateLimit = vi.mocked(checkRateLimit)

function createRequest(headers: Record<string, string> = {}, url = 'http://localhost/api/test') {
  return new NextRequest(url, { headers })
}

describe('API Middleware (withApiKey)', () => {
  const mockHandler = vi.fn().mockImplementation(async () =>
    NextResponse.json({ ok: true })
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when no API key is provided', async () => {
    const req = createRequest()
    const res = await withApiKey(req, mockHandler)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('API key required')
  })

  it('extracts API key from X-API-Key header', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      apiKeyId: 'key-1',
      tier: 'free',
      remaining: 99,
      limit: 100,
    })

    const req = createRequest({ 'x-api-key': 'avsb_test123' })
    await withApiKey(req, mockHandler)
    expect(mockedCheckRateLimit).toHaveBeenCalledWith('avsb_test123')
    expect(mockHandler).toHaveBeenCalled()
  })

  it('extracts API key from Authorization Bearer header', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      apiKeyId: 'key-2',
      tier: 'pro',
      remaining: 9999,
      limit: 10000,
    })

    const req = createRequest({ authorization: 'Bearer avsb_bearer123' })
    await withApiKey(req, mockHandler)
    expect(mockedCheckRateLimit).toHaveBeenCalledWith('avsb_bearer123')
  })

  it('extracts API key from query param', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      apiKeyId: 'key-3',
      tier: 'free',
      remaining: 50,
      limit: 100,
    })

    const req = createRequest({}, 'http://localhost/api/test?api_key=avsb_query123')
    await withApiKey(req, mockHandler)
    expect(mockedCheckRateLimit).toHaveBeenCalledWith('avsb_query123')
  })

  it('returns 429 when rate limited', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      apiKeyId: 'key-1',
      error: 'rate limit exceeded',
      limit: 100,
    })

    const req = createRequest({ 'x-api-key': 'avsb_limited' })
    const res = await withApiKey(req, mockHandler)
    expect(res.status).toBe(429)
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid key', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: false,
      error: 'Invalid API key',
    })

    const req = createRequest({ 'x-api-key': 'invalid-key' })
    const res = await withApiKey(req, mockHandler)
    expect(res.status).toBe(401)
  })

  it('adds rate limit headers on success', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      apiKeyId: 'key-1',
      tier: 'free',
      remaining: 50,
      limit: 100,
    })

    const req = createRequest({ 'x-api-key': 'avsb_test' })
    const res = await withApiKey(req, mockHandler)
    expect(res.headers.get('X-RateLimit-Limit')).toBe('100')
    expect(res.headers.get('X-RateLimit-Remaining')).toBeDefined()
  })

  it('adds CORS headers', async () => {
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      apiKeyId: 'key-1',
      tier: 'free',
      remaining: 50,
      limit: 100,
    })

    const req = createRequest({ 'x-api-key': 'avsb_test' })
    const res = await withApiKey(req, mockHandler)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })
})

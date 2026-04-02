import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock analytics
vi.mock('@/lib/utils/analytics', () => ({
  trackNewsletterSignup: vi.fn(),
}))

import { NewsletterSignup } from '../engagement/NewsletterSignup'

describe('NewsletterSignup', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch = vi.fn()
    global.fetch = mockFetch as unknown as typeof fetch
  })

  it('renders card variant with email input and subscribe button', () => {
    render(<NewsletterSignup source="test" />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe free/i })).toBeInTheDocument()
    expect(screen.getByText(/get the best comparisons/i)).toBeInTheDocument()
  })

  it('renders inline variant', () => {
    render(<NewsletterSignup source="test" variant="inline" />)
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows success message after successful subscription', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, pendingConfirmation: true }),
    })

    render(<NewsletterSignup source="test" />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    })
  })

  it('shows already-subscribed message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, alreadySubscribed: true }),
    })

    render(<NewsletterSignup source="test" />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'existing@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  it('shows error message on failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    render(<NewsletterSignup source="test" />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('sends correct request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    render(<NewsletterSignup source="comparison-page" referrerSlug="messi-vs-ronaldo" />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'user@test.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@test.com',
          source: 'comparison-page',
          referrerSlug: 'messi-vs-ronaldo',
          categories: undefined,
        }),
      })
    })
  })

  it('shows category picker when showCategories is true', () => {
    render(<NewsletterSignup source="test" showCategories />)
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Sports')).toBeInTheDocument()
  })

  it('toggles category selection', () => {
    render(<NewsletterSignup source="test" showCategories />)
    const techButton = screen.getByText('Technology')

    fireEvent.click(techButton)
    expect(techButton.className).toContain('bg-primary-600')

    fireEvent.click(techButton)
    expect(techButton.className).not.toContain('bg-primary-600')
  })

  it('disables button while loading', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // never resolves

    render(<NewsletterSignup source="test" />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.textContent).toContain('Subscribing')
    })
  })
})

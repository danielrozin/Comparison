import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock analytics
vi.mock('@/lib/utils/analytics', () => ({
  trackComparisonSearch: vi.fn(),
}))

// Mock fetch for popular comparisons
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({
    comparisons: [
      { slug: 'messi-vs-ronaldo', title: 'Messi vs Ronaldo', category: 'sports' },
    ],
  }),
}) as unknown as typeof fetch

import { SearchBox } from '../home/SearchBox'

describe('SearchBox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the search input and compare button', () => {
    render(<SearchBox />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument()
  })

  it('navigates to comparison page for "A vs B" input', async () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Messi vs Ronaldo' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/compare/')
    )
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('messi')
    )
  })

  it('navigates to search page for non-comparison queries', () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'best smartphones' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockPush).toHaveBeenCalledWith('/search?q=best%20smartphones')
  })

  it('does not navigate on empty input', () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')
    fireEvent.submit(input.closest('form')!)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows popular comparisons on focus', async () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')

    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Popular right now')).toBeInTheDocument()
    })
  })

  it('handles "compare A to B" format', () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'compare Python to JavaScript' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/compare/'))
  })

  it('handles "difference between A and B" format', () => {
    render(<SearchBox />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'difference between cats and dogs' } })
    fireEvent.submit(input.closest('form')!)

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/compare/'))
  })
})

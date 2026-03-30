import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import ErrorPage from '../error'
import GlobalErrorPage from '../global-error'

describe('Error Boundary (error.tsx)', () => {
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  function createError(message: string, digest?: string) {
    const err = new Error(message) as Error & { digest?: string }
    if (digest) err.digest = digest
    return err
  }

  it('renders the error message heading', () => {
    render(<ErrorPage error={createError('Test error')} reset={mockReset} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a descriptive paragraph', () => {
    render(<ErrorPage error={createError('Test error')} reset={mockReset} />)
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
  })

  it('shows error digest when available', () => {
    render(<ErrorPage error={createError('fail', 'abc-123')} reset={mockReset} />)
    expect(screen.getByText(/Error ID: abc-123/)).toBeInTheDocument()
  })

  it('does not show error digest when absent', () => {
    render(<ErrorPage error={createError('fail')} reset={mockReset} />)
    expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument()
  })

  it('calls reset when "Try again" is clicked', () => {
    render(<ErrorPage error={createError('fail')} reset={mockReset} />)
    fireEvent.click(screen.getByText('Try again'))
    expect(mockReset).toHaveBeenCalledOnce()
  })

  it('renders a "Go home" link pointing to /', () => {
    render(<ErrorPage error={createError('fail')} reset={mockReset} />)
    const link = screen.getByText('Go home')
    expect(link).toHaveAttribute('href', '/')
  })

  it('logs the error to console', () => {
    const err = createError('Test error')
    render(<ErrorPage error={err} reset={mockReset} />)
    expect(console.error).toHaveBeenCalledWith('Page error:', err)
  })
})

describe('Global Error Boundary (global-error.tsx)', () => {
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  function createError(message: string, digest?: string) {
    const err = new Error(message) as Error & { digest?: string }
    if (digest) err.digest = digest
    return err
  }

  it('renders the heading', () => {
    render(<GlobalErrorPage error={createError('Global failure')} reset={mockReset} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows error digest when available', () => {
    render(<GlobalErrorPage error={createError('fail', 'global-xyz')} reset={mockReset} />)
    expect(screen.getByText(/Error ID: global-xyz/)).toBeInTheDocument()
  })

  it('does not show error digest when absent', () => {
    render(<GlobalErrorPage error={createError('fail')} reset={mockReset} />)
    expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument()
  })

  it('calls reset on "Try again" click', () => {
    render(<GlobalErrorPage error={createError('fail')} reset={mockReset} />)
    fireEvent.click(screen.getByText('Try again'))
    expect(mockReset).toHaveBeenCalledOnce()
  })

  it('has a "Go home" link', () => {
    render(<GlobalErrorPage error={createError('fail')} reset={mockReset} />)
    const link = screen.getByText('Go home')
    expect(link).toHaveAttribute('href', '/')
  })

  it('logs the global error to console', () => {
    const err = createError('Global failure')
    render(<GlobalErrorPage error={err} reset={mockReset} />)
    expect(console.error).toHaveBeenCalledWith('Global error:', err)
  })
})

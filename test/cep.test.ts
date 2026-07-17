import { describe, expect, it } from 'vitest'
import { formatCep, isValidCep } from '../src/cep'

describe('isValidCep', () => {
  it('accepts valid CEPs', () => {
    expect(isValidCep('01310100')).toBe(true)
    expect(isValidCep('01310-100')).toBe(true)
    expect(isValidCep(' 01310-100 ')).toBe(true)
  })

  it('rejects invalid CEPs', () => {
    expect(isValidCep('')).toBe(false)
    expect(isValidCep('0131010')).toBe(false)
    expect(isValidCep('013101000')).toBe(false)
    expect(isValidCep('01310_100')).toBe(false)
    expect(isValidCep('abcde-fgh')).toBe(false)
  })
})

describe('formatCep', () => {
  it('formats a full CEP', () => {
    expect(formatCep('01310100')).toBe('01310-100')
    expect(formatCep('01310-100')).toBe('01310-100')
  })

  it('formats partial input progressively', () => {
    expect(formatCep('01310')).toBe('01310')
    expect(formatCep('013101')).toBe('01310-1')
  })

  it('truncates extra digits', () => {
    expect(formatCep('013101009')).toBe('01310-100')
  })
})

import { describe, expect, it } from 'vitest'
import { formatPhone, isValidPhone } from '../src/phone'

describe('isValidPhone', () => {
  it('accepts valid mobile numbers', () => {
    expect(isValidPhone('11987654321')).toBe(true)
    expect(isValidPhone('(11) 98765-4321')).toBe(true)
    expect(isValidPhone('+55 11 98765-4321')).toBe(true)
  })

  it('accepts valid landline numbers', () => {
    expect(isValidPhone('1134567890')).toBe(true)
    expect(isValidPhone('(21) 2345-6789)')).toBe(true)
    expect(isValidPhone('+55 31 3456-7890')).toBe(true)
  })

  it('rejects unassigned area codes', () => {
    expect(isValidPhone('(10) 98765-4321')).toBe(false)
    expect(isValidPhone('(20) 98765-4321')).toBe(false)
    expect(isValidPhone('(90) 98765-4321')).toBe(false)
  })

  it('rejects wrong lengths and prefixes', () => {
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone('119876543')).toBe(false)
    expect(isValidPhone('11887654321')).toBe(false) // 11 digits without the 9 prefix
    expect(isValidPhone('1198765432')).toBe(false) // landline cannot start with 9
    expect(isValidPhone('1114567890')).toBe(false) // landline cannot start with 1
  })

  it('filters by type', () => {
    expect(isValidPhone('11987654321', { type: 'mobile' })).toBe(true)
    expect(isValidPhone('11987654321', { type: 'landline' })).toBe(false)
    expect(isValidPhone('1134567890', { type: 'landline' })).toBe(true)
    expect(isValidPhone('1134567890', { type: 'mobile' })).toBe(false)
  })
})

describe('formatPhone', () => {
  it('formats mobile and landline numbers', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
    expect(formatPhone('1134567890')).toBe('(11) 3456-7890')
  })

  it('strips the country code', () => {
    expect(formatPhone('+5511987654321')).toBe('(11) 98765-4321')
    expect(formatPhone('551134567890')).toBe('(11) 3456-7890')
  })

  it('returns cleaned digits when the length matches neither format', () => {
    expect(formatPhone('119876')).toBe('119876')
  })
})

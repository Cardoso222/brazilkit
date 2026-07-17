import { describe, expect, it } from 'vitest'
import { formatCpf, generateCpf, isValidCpf } from '../src/cpf'

describe('isValidCpf', () => {
  it('accepts valid CPFs', () => {
    expect(isValidCpf('11144477735')).toBe(true)
    expect(isValidCpf('111.444.777-35')).toBe(true)
    expect(isValidCpf('  111.444.777-35  ')).toBe(true)
  })

  it('rejects wrong check digits', () => {
    expect(isValidCpf('11144477736')).toBe(false)
    expect(isValidCpf('11144477734')).toBe(false)
  })

  it('rejects repeated-digit sequences', () => {
    for (let digit = 0; digit <= 9; digit++) {
      expect(isValidCpf(String(digit).repeat(11))).toBe(false)
    }
  })

  it('rejects wrong lengths and garbage', () => {
    expect(isValidCpf('')).toBe(false)
    expect(isValidCpf('123')).toBe(false)
    expect(isValidCpf('111444777350')).toBe(false)
    expect(isValidCpf('abcdefghijk')).toBe(false)
  })
})

describe('formatCpf', () => {
  it('formats a full CPF', () => {
    expect(formatCpf('11144477735')).toBe('111.444.777-35')
    expect(formatCpf('111.444.777-35')).toBe('111.444.777-35')
  })

  it('formats partial input progressively', () => {
    expect(formatCpf('111')).toBe('111')
    expect(formatCpf('1114')).toBe('111.4')
    expect(formatCpf('1114447')).toBe('111.444.7')
    expect(formatCpf('111444777')).toBe('111.444.777')
    expect(formatCpf('1114447773')).toBe('111.444.777-3')
  })

  it('truncates extra digits', () => {
    expect(formatCpf('111444777359999')).toBe('111.444.777-35')
  })
})

describe('generateCpf', () => {
  it('generates valid CPFs', () => {
    for (let i = 0; i < 1000; i++) {
      expect(isValidCpf(generateCpf())).toBe(true)
    }
  })

  it('generates formatted CPFs on demand', () => {
    const cpf = generateCpf({ formatted: true })
    expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    expect(isValidCpf(cpf)).toBe(true)
  })
})

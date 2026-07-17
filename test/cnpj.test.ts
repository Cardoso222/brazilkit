import { describe, expect, it } from 'vitest'
import { formatCnpj, generateCnpj, isValidCnpj } from '../src/cnpj'

describe('isValidCnpj', () => {
  it('accepts valid numeric CNPJs', () => {
    expect(isValidCnpj('11222333000181')).toBe(true)
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
  })

  it('accepts valid alphanumeric CNPJs (new format)', () => {
    // Official example from the Receita Federal / SERPRO spec.
    expect(isValidCnpj('12ABC34501DE35')).toBe(true)
    expect(isValidCnpj('12.ABC.345/01DE-35')).toBe(true)
    expect(isValidCnpj('12abc34501de35')).toBe(true)
  })

  it('rejects wrong check digits', () => {
    expect(isValidCnpj('11222333000182')).toBe(false)
    expect(isValidCnpj('12ABC34501DE36')).toBe(false)
  })

  it('rejects alphanumeric check digits', () => {
    expect(isValidCnpj('12ABC34501DEA5')).toBe(false)
  })

  it('rejects repeated sequences, wrong lengths and garbage', () => {
    expect(isValidCnpj('11111111111111')).toBe(false)
    expect(isValidCnpj('')).toBe(false)
    expect(isValidCnpj('112223330001')).toBe(false)
    expect(isValidCnpj('11222333000181000')).toBe(false)
  })
})

describe('formatCnpj', () => {
  it('formats numeric and alphanumeric CNPJs', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81')
    expect(formatCnpj('12ABC34501DE35')).toBe('12.ABC.345/01DE-35')
    expect(formatCnpj('12abc34501de35')).toBe('12.ABC.345/01DE-35')
  })

  it('formats partial input progressively', () => {
    expect(formatCnpj('11')).toBe('11')
    expect(formatCnpj('112')).toBe('11.2')
    expect(formatCnpj('112223')).toBe('11.222.3')
    expect(formatCnpj('112223330')).toBe('11.222.333/0')
    expect(formatCnpj('1122233300018')).toBe('11.222.333/0001-8')
  })
})

describe('generateCnpj', () => {
  it('generates valid numeric CNPJs', () => {
    for (let i = 0; i < 1000; i++) {
      const cnpj = generateCnpj()
      expect(cnpj).toMatch(/^\d{14}$/)
      expect(isValidCnpj(cnpj)).toBe(true)
    }
  })

  it('generates valid alphanumeric CNPJs', () => {
    for (let i = 0; i < 1000; i++) {
      const cnpj = generateCnpj({ alphanumeric: true })
      expect(cnpj).toMatch(/^[0-9A-Z]{12}\d{2}$/)
      expect(isValidCnpj(cnpj)).toBe(true)
    }
  })

  it('generates formatted CNPJs on demand', () => {
    const cnpj = generateCnpj({ formatted: true })
    expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    expect(isValidCnpj(cnpj)).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { generatePixCode, isValidPixCode, parsePixCode } from '../src/pix'

// Static QR example from the Banco Central BR Code manual.
const BCB_EXAMPLE =
  '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D'

describe('generatePixCode', () => {
  it('generates a code that round-trips through parsePixCode', () => {
    const code = generatePixCode({
      key: 'paulo@example.com',
      merchantName: 'Paulo Henrique',
      merchantCity: 'SAO PAULO',
      amount: 42.5,
      txid: 'PEDIDO123',
      description: 'Pedido 123',
    })
    const parsed = parsePixCode(code)
    expect(parsed.key).toBe('paulo@example.com')
    expect(parsed.merchantName).toBe('Paulo Henrique')
    expect(parsed.merchantCity).toBe('SAO PAULO')
    expect(parsed.amount).toBe(42.5)
    expect(parsed.txid).toBe('PEDIDO123')
    expect(parsed.description).toBe('Pedido 123')
  })

  it('omits amount and defaults txid to ***', () => {
    const code = generatePixCode({
      key: '11144477735',
      merchantName: 'Fulano de Tal',
      merchantCity: 'BRASILIA',
    })
    const parsed = parsePixCode(code)
    expect(parsed.amount).toBeUndefined()
    expect(parsed.txid).toBe('***')
  })

  it('formats the amount with two decimals', () => {
    const code = generatePixCode({
      key: 'k',
      merchantName: 'N',
      merchantCity: 'C',
      amount: 10,
    })
    expect(code).toContain('540510.00')
  })

  it('validates inputs', () => {
    const base = { key: 'k', merchantName: 'N', merchantCity: 'C' }
    expect(() => generatePixCode({ ...base, key: '' })).toThrow(TypeError)
    expect(() => generatePixCode({ ...base, merchantName: 'x'.repeat(26) })).toThrow(RangeError)
    expect(() => generatePixCode({ ...base, merchantCity: 'x'.repeat(16) })).toThrow(RangeError)
    expect(() => generatePixCode({ ...base, amount: -1 })).toThrow(RangeError)
    expect(() => generatePixCode({ ...base, amount: Number.NaN })).toThrow(RangeError)
    expect(() => generatePixCode({ ...base, txid: 'não válido' })).toThrow(RangeError)
    expect(() => generatePixCode({ ...base, txid: 'x'.repeat(26) })).toThrow(RangeError)
  })
})

describe('parsePixCode', () => {
  it('parses the Banco Central reference example', () => {
    const parsed = parsePixCode(BCB_EXAMPLE)
    expect(parsed.key).toBe('123e4567-e12b-12d1-a456-426655440000')
    expect(parsed.merchantName).toBe('Fulano de Tal')
    expect(parsed.merchantCity).toBe('BRASILIA')
    expect(parsed.amount).toBeUndefined()
    expect(parsed.txid).toBe('***')
  })

  it('rejects a tampered payload (CRC mismatch)', () => {
    const tampered = BCB_EXAMPLE.replace('Fulano', 'Beltra')
    expect(() => parsePixCode(tampered)).toThrow(/CRC mismatch/)
  })

  it('rejects payloads without a CRC field', () => {
    expect(() => parsePixCode('000201')).toThrow(/missing CRC/)
    expect(() => parsePixCode('')).toThrow(/missing CRC/)
  })

  it('rejects non-Pix EMV payloads', () => {
    // Valid TLV + CRC, but the merchant account GUI is not br.gov.bcb.pix.
    const payload = '000201' + '26180014not.a.pix.guix' + '6304'
    const notPix = payload + referenceCrc16(payload)
    expect(() => parsePixCode(notPix)).toThrow(/GUI not found/)
  })
})

// Independent CRC-16/CCITT-FALSE implementation used to cross-check the
// library. Verified against the standard test vector below.
function referenceCrc16(payload: string): string {
  let crc = 0xffff
  for (const char of payload) {
    crc ^= char.charCodeAt(0) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

describe('crc16 reference', () => {
  it('matches the standard CCITT-FALSE test vector', () => {
    expect(referenceCrc16('123456789')).toBe('29B1')
  })

  it('matches the CRC in the Banco Central example', () => {
    expect(referenceCrc16(BCB_EXAMPLE.slice(0, -4))).toBe(BCB_EXAMPLE.slice(-4))
  })
})

describe('isValidPixCode', () => {
  it('returns true for valid codes', () => {
    expect(isValidPixCode(BCB_EXAMPLE)).toBe(true)
  })

  it('returns false for invalid codes', () => {
    expect(isValidPixCode('')).toBe(false)
    expect(isValidPixCode('hello world')).toBe(false)
    expect(isValidPixCode(BCB_EXAMPLE.slice(0, -1))).toBe(false)
  })
})

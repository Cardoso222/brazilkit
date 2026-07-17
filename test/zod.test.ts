import { describe, expect, it } from 'vitest'
import {
  cepSchema,
  cnpjSchema,
  cpfOrCnpjSchema,
  cpfSchema,
  phoneSchema,
  pixCodeSchema,
} from '../src/zod'

describe('zod schemas', () => {
  it('cpfSchema', () => {
    expect(cpfSchema.safeParse('111.444.777-35').success).toBe(true)
    expect(cpfSchema.safeParse('111.444.777-36').success).toBe(false)
    expect(cpfSchema.safeParse(11144477735).success).toBe(false)
  })

  it('cnpjSchema', () => {
    expect(cnpjSchema.safeParse('11.222.333/0001-81').success).toBe(true)
    expect(cnpjSchema.safeParse('12ABC34501DE35').success).toBe(true)
    expect(cnpjSchema.safeParse('11.222.333/0001-82').success).toBe(false)
  })

  it('cpfOrCnpjSchema', () => {
    expect(cpfOrCnpjSchema.safeParse('11144477735').success).toBe(true)
    expect(cpfOrCnpjSchema.safeParse('11222333000181').success).toBe(true)
    expect(cpfOrCnpjSchema.safeParse('123').success).toBe(false)
  })

  it('cepSchema', () => {
    expect(cepSchema.safeParse('01310-100').success).toBe(true)
    expect(cepSchema.safeParse('1310-100').success).toBe(false)
  })

  it('phoneSchema', () => {
    expect(phoneSchema.safeParse('(11) 98765-4321').success).toBe(true)
    expect(phoneSchema.safeParse('(10) 98765-4321').success).toBe(false)
  })

  it('pixCodeSchema', () => {
    expect(pixCodeSchema.safeParse('not a pix code').success).toBe(false)
  })
})

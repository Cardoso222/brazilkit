import { z } from 'zod'
import { isValidCpf } from './cpf'
import { isValidCnpj } from './cnpj'
import { isValidCep } from './cep'
import { isValidPhone } from './phone'
import { isValidPixCode } from './pix'

/** Zod schema that accepts a valid CPF, with or without punctuation. */
export const cpfSchema = z.string().refine(isValidCpf, { message: 'Invalid CPF' })

/** Zod schema that accepts a valid CNPJ (numeric or alphanumeric). */
export const cnpjSchema = z.string().refine(isValidCnpj, { message: 'Invalid CNPJ' })

/** Zod schema that accepts a valid CEP. */
export const cepSchema = z.string().refine(isValidCep, { message: 'Invalid CEP' })

/** Zod schema that accepts a valid Brazilian phone number. */
export const phoneSchema = z.string().refine((value) => isValidPhone(value), {
  message: 'Invalid phone number',
})

/** Zod schema that accepts a valid CPF or CNPJ, useful for mixed documents. */
export const cpfOrCnpjSchema = z
  .string()
  .refine((value) => isValidCpf(value) || isValidCnpj(value), {
    message: 'Invalid CPF or CNPJ',
  })

/** Zod schema that accepts a well-formed Pix "copia e cola" code. */
export const pixCodeSchema = z.string().refine(isValidPixCode, {
  message: 'Invalid Pix code',
})

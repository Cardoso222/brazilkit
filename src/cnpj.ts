const CNPJ_LENGTH = 14
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function stripCnpj(value: string): string {
  return value.replace(/[.\-/\s]/g, '').toUpperCase()
}

// Per the Receita Federal spec for alphanumeric CNPJs, each character
// contributes its ASCII code minus 48 ('0' -> 0, 'A' -> 17, 'Z' -> 42).
function charValue(char: string): number {
  return char.charCodeAt(0) - 48
}

function checkDigit(chars: string, weights: number[]): number {
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += charValue(chars[i]!) * weights[i]!
  }
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

/**
 * Validates a CNPJ, with or without punctuation.
 *
 * Supports both the legacy numeric format and the new alphanumeric format
 * (12 alphanumeric characters followed by 2 numeric check digits).
 */
export function isValidCnpj(cnpj: string): boolean {
  if (typeof cnpj !== 'string') return false
  const chars = stripCnpj(cnpj)
  if (!/^[0-9A-Z]{12}\d{2}$/.test(chars)) return false
  if (/^(.)\1{13}$/.test(chars)) return false

  return (
    Number(chars[12]) === checkDigit(chars, FIRST_WEIGHTS) &&
    Number(chars[13]) === checkDigit(chars, SECOND_WEIGHTS)
  )
}

/**
 * Formats a CNPJ as `00.000.000/0000-00`, including alphanumeric CNPJs.
 *
 * Applies the mask progressively, so partial input is also formatted.
 */
export function formatCnpj(cnpj: string): string {
  const chars = cnpj
    .replace(/[^0-9A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, CNPJ_LENGTH)
  return chars
    .replace(/^(.{2})(.)/, '$1.$2')
    .replace(/^(.{2})\.(.{3})(.)/, '$1.$2.$3')
    .replace(/^(.{2})\.(.{3})\.(.{3})(.)/, '$1.$2.$3/$4')
    .replace(/\/(.{4})(.{1,2})$/, '/$1-$2')
}

export interface GenerateCnpjOptions {
  /** Returns the CNPJ already formatted as `00.000.000/0000-00`. Default: `false`. */
  formatted?: boolean
  /** Generates the new alphanumeric format. Default: `false`. */
  alphanumeric?: boolean
}

/**
 * Generates a random valid CNPJ. Intended for tests and database seeding.
 */
export function generateCnpj(options: GenerateCnpjOptions = {}): string {
  const alphabet = options.alphanumeric ? ALPHANUMERIC : '0123456789'
  let cnpj: string
  do {
    let base = ''
    for (let i = 0; i < 12; i++) {
      base += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    const first = checkDigit(base, FIRST_WEIGHTS)
    const second = checkDigit(base + String(first), SECOND_WEIGHTS)
    cnpj = base + String(first) + String(second)
  } while (!isValidCnpj(cnpj))
  return options.formatted ? formatCnpj(cnpj) : cnpj
}

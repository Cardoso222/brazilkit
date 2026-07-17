/**
 * Validates a CEP: 8 digits, with or without the dash (`01310-100` or `01310100`).
 *
 * CEPs have no check digit, so validation is structural only.
 */
export function isValidCep(cep: string): boolean {
  if (typeof cep !== 'string') return false
  return /^\d{5}-?\d{3}$/.test(cep.trim())
}

/**
 * Formats a CEP as `00000-000`.
 *
 * Applies the mask progressively, so partial input is also formatted.
 */
export function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, '').slice(0, 8)
  return digits.replace(/^(\d{5})(\d)/, '$1-$2')
}

const CPF_LENGTH = 11

function stripCpf(value: string): string {
  return value.replace(/\D/g, '')
}

function checkDigit(digits: number[]): number {
  const factor = digits.length + 1
  const sum = digits.reduce((acc, digit, index) => acc + digit * (factor - index), 0)
  return ((sum * 10) % 11) % 10
}

/**
 * Validates a CPF, with or without punctuation.
 *
 * Rejects known-invalid sequences (all repeated digits) and wrong check digits.
 */
export function isValidCpf(cpf: string): boolean {
  if (typeof cpf !== 'string') return false
  const digits = stripCpf(cpf)
  if (digits.length !== CPF_LENGTH) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  const numbers = [...digits].map(Number)
  return (
    numbers[9] === checkDigit(numbers.slice(0, 9)) &&
    numbers[10] === checkDigit(numbers.slice(0, 10))
  )
}

/**
 * Formats a CPF as `000.000.000-00`.
 *
 * Applies the mask progressively, so partial input is also formatted.
 * Useful for input masks: `formatCpf('1114447')` returns `'111.444.7'`.
 */
export function formatCpf(cpf: string): string {
  const digits = stripCpf(cpf).slice(0, CPF_LENGTH)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2')
}

export interface GenerateCpfOptions {
  /** Returns the CPF already formatted as `000.000.000-00`. Default: `false`. */
  formatted?: boolean
}

/**
 * Generates a random valid CPF. Intended for tests and database seeding.
 */
export function generateCpf(options: GenerateCpfOptions = {}): string {
  let cpf: string
  do {
    const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
    const first = checkDigit(base)
    const second = checkDigit([...base, first])
    cpf = [...base, first, second].join('')
  } while (!isValidCpf(cpf))
  return options.formatted ? formatCpf(cpf) : cpf
}

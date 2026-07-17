// Area codes currently assigned by Anatel.
const VALID_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
])

function stripPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  // Drop the +55 country code when present.
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2)
  }
  return digits
}

export interface PhoneValidationOptions {
  /** Restricts validation to a single type. Default: accepts both. */
  type?: 'mobile' | 'landline'
}

/**
 * Validates a Brazilian phone number, with or without punctuation and the
 * `+55` country code.
 *
 * Mobile: 11 digits, third digit `9` (e.g. `(11) 98765-4321`).
 * Landline: 10 digits, third digit 2 to 5 (e.g. `(11) 3456-7890`).
 * The area code must be assigned by Anatel.
 */
export function isValidPhone(phone: string, options: PhoneValidationOptions = {}): boolean {
  if (typeof phone !== 'string') return false
  const digits = stripPhone(phone)
  if (!VALID_DDDS.has(digits.slice(0, 2))) return false

  const isMobile = digits.length === 11 && digits[2] === '9'
  const isLandline = digits.length === 10 && /[2-5]/.test(digits[2] ?? '')

  if (options.type === 'mobile') return isMobile
  if (options.type === 'landline') return isLandline
  return isMobile || isLandline
}

/**
 * Formats a Brazilian phone number as `(11) 98765-4321` (mobile) or
 * `(11) 3456-7890` (landline). Strips the `+55` country code when present.
 *
 * Returns the cleaned digits unchanged when the length matches neither format.
 */
export function formatPhone(phone: string): string {
  const digits = stripPhone(phone)
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  }
  return digits
}

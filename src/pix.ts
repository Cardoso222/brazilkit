// Pix "copia e cola" codes follow the EMV Merchant Presented Mode (MPM)
// TLV format: 2-digit ID + 2-digit length + value, ending with a CRC-16 field.

const PIX_GUI = 'br.gov.bcb.pix'

// CRC-16/CCITT-FALSE: polynomial 0x1021, initial value 0xFFFF, as required
// by the EMV MPM spec (field 63).
function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function emv(id: string, value: string): string {
  if (value.length > 99) {
    throw new RangeError(`Pix field ${id} exceeds 99 characters`)
  }
  return id + String(value.length).padStart(2, '0') + value
}

function parseTlv(payload: string): Record<string, string> {
  const fields: Record<string, string> = {}
  let index = 0
  while (index < payload.length) {
    const id = payload.slice(index, index + 2)
    const rawLength = payload.slice(index + 2, index + 4)
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(rawLength)) {
      throw new SyntaxError('Malformed Pix code: invalid TLV structure')
    }
    const length = Number(rawLength)
    const value = payload.slice(index + 4, index + 4 + length)
    if (value.length !== length) {
      throw new SyntaxError('Malformed Pix code: field length overflows payload')
    }
    fields[id] = value
    index += 4 + length
  }
  return fields
}

export interface GeneratePixCodeParams {
  /** Pix key: CPF, CNPJ, email, phone (`+5511...`) or random key (UUID). */
  key: string
  /** Receiver name, up to 25 characters. */
  merchantName: string
  /** Receiver city, up to 15 characters. */
  merchantCity: string
  /** Amount in BRL. Omit to let the payer type the amount. */
  amount?: number
  /** Transaction id, up to 25 alphanumeric characters. Default: `***`. */
  txid?: string
  /** Free-text description shown to the payer. */
  description?: string
}

/**
 * Generates a static Pix "copia e cola" code (EMV BR Code), ready to be
 * rendered as a QR code or pasted into a banking app.
 */
export function generatePixCode(params: GeneratePixCodeParams): string {
  const { key, merchantName, merchantCity, amount, txid, description } = params

  if (!key) throw new TypeError('Pix key is required')
  if (!merchantName || merchantName.length > 25) {
    throw new RangeError('merchantName is required and must have at most 25 characters')
  }
  if (!merchantCity || merchantCity.length > 15) {
    throw new RangeError('merchantCity is required and must have at most 15 characters')
  }
  if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) {
    throw new RangeError('amount must be a positive number')
  }
  if (txid !== undefined && !/^[A-Za-z0-9]{1,25}$/.test(txid)) {
    throw new RangeError('txid must have 1 to 25 alphanumeric characters')
  }

  const account =
    emv('00', PIX_GUI) + emv('01', key) + (description ? emv('02', description) : '')

  let payload =
    emv('00', '01') +
    emv('26', account) +
    emv('52', '0000') +
    emv('53', '986') +
    (amount !== undefined ? emv('54', amount.toFixed(2)) : '') +
    emv('58', 'BR') +
    emv('59', merchantName) +
    emv('60', merchantCity) +
    emv('62', emv('05', txid ?? '***'))

  payload += '6304'
  return payload + crc16(payload)
}

export interface ParsedPixCode {
  /** Pix key, present in static codes. */
  key?: string
  /** Payload URL, present in dynamic codes. */
  url?: string
  merchantName?: string
  merchantCity?: string
  amount?: number
  txid?: string
  description?: string
  /** Raw top-level TLV fields, for anything not covered above. */
  fields: Record<string, string>
}

/**
 * Parses and validates a Pix "copia e cola" code.
 *
 * Verifies the CRC-16 checksum and the TLV structure, then extracts the
 * common fields. Throws `SyntaxError` on malformed or corrupted codes.
 */
export function parsePixCode(code: string): ParsedPixCode {
  if (typeof code !== 'string') {
    throw new TypeError('Pix code must be a string')
  }
  const payload = code.trim()
  if (payload.length < 8 || payload.slice(-8, -4) !== '6304') {
    throw new SyntaxError('Malformed Pix code: missing CRC field')
  }
  if (payload.slice(-4).toUpperCase() !== crc16(payload.slice(0, -4))) {
    throw new SyntaxError('Invalid Pix code: CRC mismatch')
  }

  const fields = parseTlv(payload)
  const account = fields['26'] ? parseTlv(fields['26']) : {}
  const additional = fields['62'] ? parseTlv(fields['62']) : {}

  if (account['00']?.toLowerCase() !== PIX_GUI) {
    throw new SyntaxError('Not a Pix code: br.gov.bcb.pix GUI not found')
  }

  const result: ParsedPixCode = { fields }
  if (account['01'] !== undefined) result.key = account['01']
  if (account['25'] !== undefined) result.url = account['25']
  if (account['02'] !== undefined) result.description = account['02']
  if (fields['59'] !== undefined) result.merchantName = fields['59']
  if (fields['60'] !== undefined) result.merchantCity = fields['60']
  if (fields['54'] !== undefined) result.amount = Number(fields['54'])
  if (additional['05'] !== undefined) result.txid = additional['05']
  return result
}

/**
 * Returns `true` when the string is a well-formed Pix code with a valid CRC.
 */
export function isValidPixCode(code: string): boolean {
  try {
    parsePixCode(code)
    return true
  } catch {
    return false
  }
}

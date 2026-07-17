# brazilkit

> Brazilian data validation, formatting and generation. Zero dependencies, tree-shakeable, TypeScript-first.

[Documentação em português](./README.pt-BR.md)

CPF, CNPJ (including the new **alphanumeric format**), CEP, phone numbers and **Pix codes** (BR Code EMV), plus ready-to-use [Zod](https://github.com/colinhacks/zod) schemas.

## Why brazilkit

| | brazilkit | cpf-cnpj-validator | @brazilian-utils | validation-br |
|---|---|---|---|---|
| Zero runtime dependencies | ✅ | ❌ | ✅ | ✅ |
| Tree-shakeable per-module entry points | ✅ | ❌ | ❌ | ❌ |
| Alphanumeric CNPJ (new format) | ✅ | ❌ | ❌ | ❌ |
| Pix code generate + parse | ✅ | ❌ | ❌ | ❌ |
| Zod schemas | ✅ | ❌ | ❌ | ❌ |
| Valid document generators for tests | ✅ | ❌ | ✅ | ❌ |

## Install

```sh
npm install brazilkit
```

## Usage

```ts
import { isValidCpf, formatCnpj, generatePixCode } from 'brazilkit'

isValidCpf('111.444.777-35') // true
formatCnpj('12ABC34501DE35') // '12.ABC.345/01DE-35'
```

Or import only what you need (each module is a separate entry point):

```ts
import { isValidCpf } from 'brazilkit/cpf'
```

### CPF

```ts
import { isValidCpf, formatCpf, generateCpf } from 'brazilkit/cpf'

isValidCpf('11144477735') // true
formatCpf('11144477735') // '111.444.777-35'
formatCpf('1114447') // '111.444.7' (progressive, works as an input mask)
generateCpf() // '39053344705' (valid, for tests/seeds)
generateCpf({ formatted: true }) // '390.533.447-05'
```

### CNPJ (alphanumeric-ready)

The Receita Federal is rolling out alphanumeric CNPJs. `brazilkit` validates, formats and generates both formats:

```ts
import { isValidCnpj, formatCnpj, generateCnpj } from 'brazilkit/cnpj'

isValidCnpj('11.222.333/0001-81') // true (legacy numeric)
isValidCnpj('12.ABC.345/01DE-35') // true (new alphanumeric)
generateCnpj({ alphanumeric: true }) // 'A1B2C3D4E5F612' style, valid check digits
```

### Pix (BR Code)

Generate and parse static Pix "copia e cola" codes, with CRC-16 verification:

```ts
import { generatePixCode, parsePixCode, isValidPixCode } from 'brazilkit/pix'

const code = generatePixCode({
  key: 'paulo@example.com',
  merchantName: 'Paulo Henrique',
  merchantCity: 'SAO PAULO',
  amount: 42.5,
  txid: 'ORDER123',
})
// '00020126...6304XXXX' — render as QR code or paste in a banking app

parsePixCode(code)
// { key: 'paulo@example.com', merchantName: 'Paulo Henrique', amount: 42.5, ... }
// Throws SyntaxError on tampered/corrupted codes (CRC mismatch).
```

### CEP and phone

```ts
import { isValidCep, formatCep } from 'brazilkit/cep'
import { isValidPhone, formatPhone } from 'brazilkit/phone'

isValidCep('01310-100') // true
formatCep('01310100') // '01310-100'
isValidPhone('+55 11 98765-4321') // true (checks Anatel area codes)
isValidPhone('11 3456-7890', { type: 'landline' }) // true
formatPhone('5511987654321') // '(11) 98765-4321'
```

### Zod schemas

Zod is an optional peer dependency, isolated in its own entry point. The core library stays dependency-free:

```ts
import { z } from 'zod'
import { cpfSchema, cnpjSchema, cpfOrCnpjSchema, pixCodeSchema } from 'brazilkit/zod'

const customerSchema = z.object({
  document: cpfOrCnpjSchema,
  zipCode: cepSchema,
})
```

## API

Every function is documented with JSDoc; hover in your editor for details.

- `brazilkit/cpf`: `isValidCpf`, `formatCpf`, `generateCpf`
- `brazilkit/cnpj`: `isValidCnpj`, `formatCnpj`, `generateCnpj`
- `brazilkit/cep`: `isValidCep`, `formatCep`
- `brazilkit/phone`: `isValidPhone`, `formatPhone`
- `brazilkit/pix`: `generatePixCode`, `parsePixCode`, `isValidPixCode`
- `brazilkit/zod`: `cpfSchema`, `cnpjSchema`, `cpfOrCnpjSchema`, `cepSchema`, `phoneSchema`, `pixCodeSchema`

## Roadmap

Planned for upcoming releases (contributions welcome, check the issues):

- Boleto digitable line validation
- CNH and RENAVAM
- Mercosul license plates
- IBGE states and municipalities

## License

MIT

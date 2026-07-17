# brazilkit

> Validação, formatação e geração de dados brasileiros. Zero dependências, tree-shakeable, TypeScript.

[![CI](https://github.com/Cardoso222/brazilkit/actions/workflows/ci.yml/badge.svg)](https://github.com/Cardoso222/brazilkit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/brazilkit)](https://www.npmjs.com/package/brazilkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/brazilkit)](https://bundlephobia.com/package/brazilkit)

[English documentation](./README.md)

CPF, CNPJ (incluindo o novo **formato alfanumérico**), CEP, telefone e **código Pix** (BR Code EMV), com schemas [Zod](https://github.com/colinhacks/zod) prontos.

## Por que brazilkit

| | brazilkit | cpf-cnpj-validator | @brazilian-utils | validation-br |
|---|---|---|---|---|
| Zero dependências de runtime | ✅ | ❌ | ✅ | ✅ |
| Tree-shaking por módulo | ✅ | ❌ | ❌ | ❌ |
| CNPJ alfanumérico (novo formato) | ✅ | ❌ | ❌ | ❌ |
| Pix: gerar e parsear código | ✅ | ❌ | ❌ | ❌ |
| Schemas Zod | ✅ | ❌ | ❌ | ❌ |
| Geradores de documentos pra testes | ✅ | ❌ | ✅ | ❌ |

## Instalação

```sh
npm install brazilkit
```

## Uso

```ts
import { isValidCpf, formatCnpj, generatePixCode } from 'brazilkit'

isValidCpf('111.444.777-35') // true
formatCnpj('12ABC34501DE35') // '12.ABC.345/01DE-35'
```

Ou importe só o que precisa (cada módulo é um entry point separado):

```ts
import { isValidCpf } from 'brazilkit/cpf'
```

O seu CNPJ vai continuar validando quando os alfanuméricos entrarem em circulação? Com `brazilkit`, sim:

```ts
import { isValidCnpj } from 'brazilkit/cnpj'

isValidCnpj('11.222.333/0001-81') // true (formato numérico atual)
isValidCnpj('12.ABC.345/01DE-35') // true (novo formato alfanumérico)
```

Gere e parseie Pix "copia e cola" com verificação de CRC:

```ts
import { generatePixCode, parsePixCode } from 'brazilkit/pix'

const code = generatePixCode({
  key: 'paulo@example.com',
  merchantName: 'Paulo Henrique',
  merchantCity: 'SAO PAULO',
  amount: 42.5,
})
parsePixCode(code) // { key, merchantName, amount, ... }
```

A documentação completa da API está no [README em inglês](./README.md#api). Todas as funções têm JSDoc; passe o mouse no editor.

## Licença

MIT

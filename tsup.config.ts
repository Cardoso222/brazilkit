import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cpf: 'src/cpf.ts',
    cnpj: 'src/cnpj.ts',
    cep: 'src/cep.ts',
    phone: 'src/phone.ts',
    pix: 'src/pix.ts',
    zod: 'src/zod.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['zod'],
})

# Contributing

Contributions are welcome. Issues labeled `help wanted` are good starting points.

## Setup

```sh
git clone https://github.com/Cardoso222/brazilkit.git
cd brazilkit
npm install
npm test
```

## Guidelines

- Zero runtime dependencies is a hard rule for the core. Integrations with third-party libraries (like Zod) go in their own entry point as optional peer dependencies.
- Every function needs tests, including at least one officially documented example when the format has a government spec (Receita Federal, Banco Central, Anatel).
- Keep each module independent and small. New data types get a new entry point in `tsup.config.ts` and `package.json#exports`.
- Public functions need JSDoc in English.
- Before opening a PR: `npm run typecheck && npm test && npm run build`.

## Commit messages

Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

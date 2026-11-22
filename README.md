# bin-lookup

**Offline BIN/IIN lookup for card network, issuing bank and country — zero dependencies, works everywhere JavaScript runs.**

[![npm version](https://img.shields.io/npm/v/@lifeofcapo/bin-lookup.svg)](https://www.npmjs.com/package/@lifeofcapo/bin-lookup)
[![npm downloads](https://img.shields.io/npm/dm/@lifeofcapo/bin-lookup.svg)](https://www.npmjs.com/package/@lifeofcapo/bin-lookup)
[![license](https://img.shields.io/npm/l/@lifeofcapo/bin-lookup.svg)](./packages/bin-lookup/LICENSE)
[![CI](https://github.com/lifeofcapo/bin-lookup/actions/workflows/ci.yml/badge.svg)](https://github.com/lifeofcapo/bin-lookup/actions/workflows/ci.yml)

**[Live demo & docs →](https://lifeofcapo.github.io/bin-lookup/)**

```ts
import { lookup } from "@lifeofcapo/bin-lookup";

lookup("4111 1111 1111 1111");
// { scheme: "visa", bank: null, country: null, luhnValid: true, ... }
```

## What it does

Give it a card number or a bare 6/8-digit BIN, get back:

- **Card network** — Visa, Mastercard, Mir, Amex, Discover, JCB, UnionPay, Maestro, Diners.
- **Issuing bank & country** — from a merged, ~22,500-range open dataset.
- **Luhn checksum validation** of the full card number.

No API key. No network request. No server. Everything runs synchronously, in-process.

## Why this exists

- **Actually zero dependencies.** The published package has none — not "zero runtime deps but ships a 40 MB SQLite file," just a plain, binary-searchable JSON table.
- **Works everywhere.** Node.js, CommonJS, a plain `<script>` tag with no bundler, React, Vue, Angular, TypeScript — [full per-platform docs](https://lifeofcapo.github.io/bin-lookup/#docs) for every one of them, with runnable examples.
- **Honest about accuracy, on purpose.** Network detection is pattern-based against each scheme's public spec, so it's always reliable. Bank/country come from open community data (`binlist/data` + `banks-db`, merged, with meaningfully better Mir/Russia/CIS coverage than either alone) — and the docs say plainly where that data can't help, instead of pretending otherwise. The official ISO IIN registry isn't public; no tool, free or paid, can promise 100% bank-level coverage.
- **A real interactive demo, not just a README example.** Live card-lookup widget, English/Russian UI, SEO'd, with the same docs embedded on the page.

## Monorepo layout

```
packages/bin-lookup/   the npm package — source, tests, bundled dataset, build scripts
apps/demo/             React + Vite demo & docs site, deployed to GitHub Pages
```

## Development

```bash
git clone https://github.com/lifeofcapo/bin-lookup.git
cd bin-lookup
npm install

npm run build -w packages/bin-lookup
npm test -w packages/bin-lookup
npm run dev:demo
```

See [`packages/bin-lookup/README.md`](./packages/bin-lookup/README.md) for the full API reference, platform-specific usage, and how the bundled dataset is built and updated from its two open sources.

## Contributing

Pull requests are welcome — bug fixes, additional scheme patterns, merging in more open BIN datasets, more platform docs, demo/UI improvements, translations. For anything bigger than a small fix, please open an issue first so we're aligned before you put in the work.

If you're contributing a data fix, it belongs upstream in [`binlist/data`](https://github.com/binlist/data) or [`banks-db`](https://github.com/ramoona/banks-db) first, then pulled in here via the build script — that way the fix benefits everyone using those projects, not just this package.

## License

MIT for the code — see [LICENSE](./packages/bin-lookup/LICENSE). Bundled BIN/bank/country data is derived from [`binlist/data`](https://github.com/binlist/data) and [`banks-db`](https://github.com/ramoona/banks-db) (CC-BY-4.0).

# bin-lookup

Offline, zero-dependency BIN/IIN lookup for JavaScript and TypeScript. Given
a card number or a bare 6/8-digit BIN, get back:

- **Card network** (Visa, Mastercard, Mir, Amex, Discover, JCB, UnionPay, Maestro, Diners) — detected from each network's publicly published number-range specification.
- **Issuing bank** and **country**, when available in the bundled open dataset.
- **Luhn checksum validation** of the full card number.

No API key, no network request, works everywhere JS runs — Node.js,
CommonJS, the browser (incl. plain `<script>` tags with no bundler), React,
Vue, Angular, TypeScript.

**[Live demo →](https://lifeofcapo.github.io/bin-lookup/)**

```bash
npm install bin-lookup
```

```ts
import { lookup } from "bin-lookup";

lookup("4111 1111 1111 1111");
// {
//   input: "4111111111111111",
//   bin: "41111111",
//   luhnValid: true,
//   scheme: "visa",
//   schemeSource: "pattern",
//   country: null,
//   bank: null,
//   cardType: null,
//   matched: false
// }
```

## Usage by platform

- [Node.js](./docs/node.md)
- [CommonJS](./docs/commonjs.md)
- [TypeScript](./docs/typescript.md)
- [Browser / CDN (no build step)](./docs/browser-cdn.md)
- [React](./docs/react.md)
- [Vue](./docs/vue.md)
- [Angular](./docs/angular.md)

## Why `scheme` and `bank` have different confidence levels

This is the honest part, worth reading before you rely on this in production:

- **`scheme`** (the network) is always reliable when it resolves. Visa,
  Mastercard, Mir, Amex and friends publish their number ranges publicly, so
  detecting the network is pure, deterministic pattern matching
  (`schemeSource: "pattern"`), independent of any database.
- **`bank` / `country`** come from a bundled table merged from two open,
  crowd-maintained datasets: [`binlist/data`](https://github.com/binlist/data)
  (broad global coverage, CC-BY-style open data) and
  [`banks-db`](https://github.com/ramoona/banks-db) (CC-BY-4.0, much stronger
  coverage of Russian/CIS banks and the Mir network, which `binlist/data`
  barely covers). **The official ISO/IEC 7812 IIN registry is not public** —
  it is licensed only to banks, processors and card networks — so _no_ BIN
  tool, free or paid, can guarantee complete, authoritative bank-level
  coverage. Even combined, these two sources don't cover every issued BIN
  range (new ranges are assigned continuously and not all of them reach any
  open dataset). Treat `bank`/`country` as "best available community data",
  not as a verified bank record. `matched: false` means "no bank-level data
  for this BIN", not "invalid card".

## API

### `lookup(input: string): LookupResult`

Strips non-digit characters, matches against the bundled range table (8-digit
IIN first, falling back to 6-digit), and separately detects the network by
pattern. Never throws; unmatched fields come back `null`.

### `isValidCardNumber(input: string): boolean`

`true` only if the input has at least 12 digits and passes the Luhn
checksum. This checks _structure_, not whether the card is real or active.

### `isLuhnValid(digits: string): boolean`

The raw Luhn algorithm (ISO/IEC 7812-1 Annex B), if you want to run it on
something that isn't a full card number.

### `detectScheme(digits: string): CardScheme | null`

Network detection only, no range-table lookup.

See [`docs/typescript.md`](./docs/typescript.md) for the full exported type
list.

## Updating the bundled data

The shipped dataset is built by `scripts/build-data.mjs` from two sources:

1. `binlist/data`'s `ranges.csv` (global coverage, incl. type/prepaid detail).
2. `banks-db`'s per-bank JSON files (stronger RU/CIS/Mir coverage), merged in
   without overwriting any overlapping `binlist/data` range.

```bash
curl -L -o scripts/ranges.raw.csv \
  https://raw.githubusercontent.com/binlist/data/master/ranges.csv

npm pack banks-db --pack-destination /tmp
tar -xzf /tmp/banks-db-*.tgz -C /tmp
rm -rf scripts/banks-db-src && cp -r /tmp/package/banks scripts/banks-db-src

npm run build:data
npm run build
```

## License

MIT for the code. Bundled BIN/bank/country data is derived from
[`binlist/data`](https://github.com/binlist/data) and
[`banks-db`](https://github.com/ramoona/banks-db) (CC-BY-4.0) — see those
projects for their data licenses and how to contribute corrections upstream.

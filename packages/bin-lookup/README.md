# bin-lookup

Offline, zero-dependency BIN/IIN lookup for JavaScript and TypeScript. Given
a card number or a bare 6/8-digit BIN, get back:

- **Card network** (Visa, Mastercard, Mir, Amex, Discover, JCB, UnionPay, Maestro, Diners) — detected from each network's publicly published number-range specification.
- **Issuing bank** and **country**, when available in the bundled open dataset.
- **Luhn checksum validation** of the full card number.

No API key, no network request, works in Node.js, the browser, React, Vue,
anywhere JS runs.

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

## Why `scheme` and `bank` have different confidence levels

This is the honest part, worth reading before you rely on this in production:

- **`scheme`** (the network) is always reliable when it resolves. Visa,
  Mastercard, Mir, Amex and friends publish their number ranges publicly, so
  detecting the network is pure, deterministic pattern matching
  (`schemeSource: "pattern"`), independent of any database.
- **`bank` / `country`** come from a bundled, pre-built table based on the
  open, crowd-maintained [`binlist/data`](https://github.com/binlist/data)
  dataset. **The official ISO/IEC 7812 IIN registry is not public** — it is
  licensed only to banks, processors and card networks — so *no* BIN tool,
  free or paid, can guarantee complete, authoritative bank-level coverage.
  Treat `bank`/`country` as "best available community data", not as a
  verified bank record. `matched: false` means "no bank-level data for this
  BIN", not "invalid card".

## API

### `lookup(input: string): LookupResult`

Strips non-digit characters, matches against the bundled range table (8-digit
IIN first, falling back to 6-digit), and separately detects the network by
pattern. Never throws; unmatched fields come back `null`.

### `isValidCardNumber(input: string): boolean`

`true` only if the input has at least 12 digits and passes the Luhn
checksum. This checks *structure*, not whether the card is real or active.

### `isLuhnValid(digits: string): boolean`

The raw Luhn algorithm (ISO/IEC 7812-1 Annex B), if you want to run it on
something that isn't a full card number.

### `detectScheme(digits: string): CardScheme | null`

Network detection only, no range-table lookup.

## Updating the bundled data

The shipped dataset is generated from `binlist/data`'s `ranges.csv` via
`scripts/build-data.mjs`, which compiles the human-editable CSV into the
compact, binary-searchable `src/data/ranges.json` actually shipped in the
package:

```bash
curl -L -o scripts/ranges.raw.csv \
  https://raw.githubusercontent.com/binlist/data/master/ranges.csv
npm run build:data
npm run build
```

## License

MIT for the code. Bundled BIN/bank/country data is derived from
[`binlist/data`](https://github.com/binlist/data) — see that project for its
data license and how to contribute corrections upstream.

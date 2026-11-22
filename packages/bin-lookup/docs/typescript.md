# TypeScript

Types ship with the package — no `@types/bin-lookup` needed.

```ts
import {
  lookup,
  type LookupResult,
  type CardScheme,
} from "@lifeofcapo/bin-lookup";

const result: LookupResult = lookup("4111111111111111");

if (result.scheme) {
  const scheme: CardScheme | string = result.scheme;
  console.log(scheme);
}
```

## Exported types

- `LookupResult` — the shape returned by `lookup()`.
- `BinRange` — one row of the internal range table (exported for advanced use, e.g. building custom tooling on top of the dataset).
- `CardScheme` — union of the known network names (`"visa" | "mastercard" | "amex" | "mir" | ...`). `lookup().scheme` is typed `CardScheme | string | null` because the underlying dataset can in principle contain a network name the union doesn't enumerate yet.
- `CardType` — `"credit" | "debit" | "prepaid" | "charge"`.

`strict` mode is fully supported; the package itself is built with
`strict: true` and no `any` in its public surface.

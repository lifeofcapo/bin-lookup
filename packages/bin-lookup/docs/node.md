# Node.js

```bash
npm install bin-lookup
```

Works with native ESM (recommended, `"type": "module"` or a `.mjs` file):

```js
import { lookup } from "bin-lookup";

console.log(lookup("4111111111111111"));
```

If you need CommonJS instead, see [`commonjs.md`](./commonjs.md) — the same
package exposes a `require()`-compatible build automatically, no extra
install step needed.

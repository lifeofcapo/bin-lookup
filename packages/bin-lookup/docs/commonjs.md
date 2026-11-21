# CommonJS

No extra configuration needed — the package publishes both an ESM and a
CommonJS build, and Node resolves the right one automatically from
`require()`:

```js
const { lookup, isValidCardNumber } = require("bin-lookup");

const result = lookup("4111111111111111");
console.log(result.scheme); // "visa"
```

This works in plain `.js` files in a project without `"type": "module"` in
`package.json`, and in any CommonJS-only toolchain (older Jest configs,
ts-node with `module: "commonjs"`, etc.).

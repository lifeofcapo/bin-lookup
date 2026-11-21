# Browser / CDN (no build step)

No bundler, no `npm install` — just a `<script>` tag. The package publishes a
UMD/IIFE build that registers a `window.BinLookup` global.

```html
<script src="https://unpkg.com/bin-lookup@0.1.0/dist/index.global.js"></script>
<script>
  const result = BinLookup.lookup("4111111111111111");
  console.log(result.scheme); // "visa"
</script>
```

Or via jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/bin-lookup@0.1.0/dist/index.global.js"></script>
```

Pin the version (`@0.1.0` above) in production — dropping the version falls
back to "latest", which can change under you.

## ES module, straight from a CDN

If your page already uses `<script type="module">`, you can import the ESM
build directly without any global variable:

```html
<script type="module">
  import { lookup } from "https://esm.sh/bin-lookup@0.1.0";
  console.log(lookup("4111111111111111"));
</script>
```

Both approaches are fully client-side: no server, no API key, no network
request made by the library itself.

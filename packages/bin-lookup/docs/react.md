# React

Plain function call — `lookup()` is synchronous and has no side effects, so
it fits naturally into a `useMemo`:

```tsx
import { useMemo, useState } from "react";
import { lookup } from "@lifeofcapo/bin-lookup";

function CardLookup() {
  const [value, setValue] = useState("");

  const result = useMemo(() => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 6 ? lookup(value) : null;
  }, [value]);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      {result && (
        <p>
          {result.scheme ?? "unknown"} · {result.bank ?? "unknown bank"}
        </p>
      )}
    </div>
  );
}
```

No `useEffect` needed — there is nothing asynchronous to wait for, so
computing the result during render (via `useMemo`, to avoid recomputing on
every keystroke-unrelated re-render) is the correct approach, not an
anti-pattern.

This is exactly how the project's own [GitHub Pages demo](https://lifeofcapo.github.io/bin-lookup/) is built — see `apps/demo/src/App.tsx` in the repo for a complete example with debounced formatting and i18n.

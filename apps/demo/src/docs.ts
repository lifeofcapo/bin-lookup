export interface DocSection {
  heading: string;
  body?: string;
  code?: string;
  lang?: string;
}

export interface DocPage {
  id: string;
  label: string;
  sections: DocSection[];
}

export const DOC_PAGES: DocPage[] = [
  {
    id: "node",
    label: "Node.js",
    sections: [
      {
        heading: "Install",
        code: "npm install bin-lookup",
        lang: "bash",
      },
      {
        heading: "Usage (ESM)",
        body: 'Works with native ESM — a project with "type": "module" in package.json, or a .mjs file.',
        code: `import { lookup } from "bin-lookup";\n\nconsole.log(lookup("4111111111111111"));`,
        lang: "js",
      },
      {
        heading: "CommonJS",
        body: "Need require() instead? See the CommonJS tab — the same package exposes a require()-compatible build automatically, no extra install.",
      },
    ],
  },
  {
    id: "commonjs",
    label: "CommonJS",
    sections: [
      {
        heading: "No extra configuration needed",
        body: "The package publishes both an ESM and a CommonJS build. Node resolves the right one automatically from require().",
        code: `const { lookup, isValidCardNumber } = require("bin-lookup");\n\nconst result = lookup("4111111111111111");\nconsole.log(result.scheme); // "visa"`,
        lang: "js",
      },
      {
        heading: "Where this matters",
        body: 'Plain .js files without "type": "module" in package.json, older Jest configs, ts-node with module: "commonjs", and any CommonJS-only toolchain.',
      },
    ],
  },
  {
    id: "typescript",
    label: "TypeScript",
    sections: [
      {
        heading: "Types ship with the package",
        body: "No @types/bin-lookup needed.",
        code: `import { lookup, type LookupResult, type CardScheme } from "bin-lookup";\n\nconst result: LookupResult = lookup("4111111111111111");\n\nif (result.scheme) {\n  const scheme: CardScheme | string = result.scheme;\n  console.log(scheme);\n}`,
        lang: "ts",
      },
      {
        heading: "Exported types",
        body: 'LookupResult — the shape returned by lookup(). BinRange — one row of the internal range table. CardScheme — union of known network names ("visa" | "mastercard" | "amex" | "mir" | ...); typed as CardScheme | string since the dataset can in principle contain a network not yet in the union. CardType — "credit" | "debit" | "prepaid" | "charge". Built with strict: true, no any in the public surface.',
      },
    ],
  },
  {
    id: "browser-cdn",
    label: "Browser / CDN",
    sections: [
      {
        heading: "No bundler, no npm install",
        body: "A plain <script> tag. The package publishes a UMD/IIFE build that registers a window.BinLookup global.",
        code: `<script src="https://unpkg.com/bin-lookup@0.2.0/dist/index.global.js"></script>\n<script>\n  const result = BinLookup.lookup("4111111111111111");\n  console.log(result.scheme); // "visa"\n</script>`,
        lang: "html",
      },
      {
        heading: "Or via jsDelivr",
        code: `<script src="https://cdn.jsdelivr.net/npm/bin-lookup@0.2.0/dist/index.global.js"></script>`,
        lang: "html",
      },
      {
        heading: "ES module, straight from a CDN",
        body: 'If your page already uses <script type="module">, import the ESM build directly — no global variable needed.',
        code: `<script type="module">\n  import { lookup } from "https://esm.sh/bin-lookup@0.2.0";\n  console.log(lookup("4111111111111111"));\n</script>`,
        lang: "html",
      },
      {
        heading: "Pin the version",
        body: 'Always pin the version (@0.2.0 above) in production — dropping it falls back to "latest", which can change under you.',
      },
    ],
  },
  {
    id: "react",
    label: "React",
    sections: [
      {
        heading: "A plain, synchronous call",
        body: "lookup() has no side effects, so it fits naturally into a useMemo. No useEffect needed — there's nothing asynchronous to wait for.",
        code: `import { useMemo, useState } from "react";\nimport { lookup } from "bin-lookup";\n\nfunction CardLookup() {\n  const [value, setValue] = useState("");\n\n  const result = useMemo(() => {\n    const digits = value.replace(/\\D/g, "");\n    return digits.length >= 6 ? lookup(value) : null;\n  }, [value]);\n\n  return (\n    <div>\n      <input value={value} onChange={(e) => setValue(e.target.value)} />\n      {result && (\n        <p>{result.scheme ?? "unknown"} · {result.bank ?? "unknown bank"}</p>\n      )}\n    </div>\n  );\n}`,
        lang: "tsx",
      },
      {
        heading: "This is exactly how this page is built",
        body: "This demo's own App.tsx (in the repo under apps/demo/src) is a complete real-world example, including i18n and the receipt-style result layout.",
      },
    ],
  },
  {
    id: "vue",
    label: "Vue",
    sections: [
      {
        heading: "Composition API",
        code: `<script setup lang="ts">\nimport { ref, computed } from "vue";\nimport { lookup } from "bin-lookup";\n\nconst value = ref("");\n\nconst result = computed(() => {\n  const digits = value.value.replace(/\\D/g, "");\n  return digits.length >= 6 ? lookup(value.value) : null;\n});\n</script>\n\n<template>\n  <input v-model="value" />\n  <p v-if="result">{{ result.scheme ?? "unknown" }} · {{ result.bank ?? "unknown bank" }}</p>\n</template>`,
        lang: "vue",
      },
      {
        heading: "Options API",
        code: `<script>\nimport { lookup } from "bin-lookup";\n\nexport default {\n  data() {\n    return { value: "" };\n  },\n  computed: {\n    result() {\n      const digits = this.value.replace(/\\D/g, "");\n      return digits.length >= 6 ? lookup(this.value) : null;\n    },\n  },\n};\n</script>`,
        lang: "vue",
      },
      {
        heading: "Nothing Vue-specific to configure",
        body: "lookup() is a pure, synchronous function — no plugin, no app.use(...).",
      },
    ],
  },
  {
    id: "angular",
    label: "Angular",
    sections: [
      {
        heading: "Call it directly from a component",
        body: "No service or module to register — the function has no state and no dependencies.",
        code: `import { Component } from "@angular/core";\nimport { lookup, type LookupResult } from "bin-lookup";\n\n@Component({\n  selector: "app-card-lookup",\n  standalone: true,\n  template: \`\n    <input [(ngModel)]="value" (ngModelChange)="onChange($event)" />\n    <p *ngIf="result">{{ result.scheme ?? "unknown" }} · {{ result.bank ?? "unknown bank" }}</p>\n  \`,\n})\nexport class CardLookupComponent {\n  value = "";\n  result: LookupResult | null = null;\n\n  onChange(value: string) {\n    const digits = value.replace(/\\D/g, "");\n    this.result = digits.length >= 6 ? lookup(value) : null;\n  }\n}`,
        lang: "ts",
      },
      {
        heading: "If you prefer a service wrapper",
        body: "Not required, but if your style guide wants external calls behind an injectable service:",
        code: `import { Injectable } from "@angular/core";\nimport { lookup, type LookupResult } from "bin-lookup";\n\n@Injectable({ providedIn: "root" })\nexport class BinLookupService {\n  lookup(input: string): LookupResult {\n    return lookup(input);\n  }\n}`,
        lang: "ts",
      },
    ],
  },
];

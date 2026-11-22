# bin-lookup (monorepo)

- `packages/bin-lookup` — the npm package. See [its README](packages/bin-lookup/README.md) for API docs, usage, and an honest note on data accuracy.
- `apps/demo` — a small React + Vite demo, deployed to GitHub Pages via `.github/workflows/deploy-demo.yml`.

## Setup

```bash
npm install          # installs both workspaces
npm run build         # builds packages/bin-lookup
npm test              # runs the package's unit tests
npm run dev:demo       # runs the Vite demo locally
```

## Updating the bundled BIN data

```bash
curl -L -o packages/bin-lookup/scripts/ranges.raw.csv \
  https://raw.githubusercontent.com/binlist/data/master/ranges.csv
npm run build:data
npm run build
```

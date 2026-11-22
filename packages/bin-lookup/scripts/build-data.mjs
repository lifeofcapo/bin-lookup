// Converts the open, crowd-maintained binlist/data CSV (CC-BY-4.0 style open
// data, see https://github.com/binlist/data) into the compact ranges.json
// consumed by the package at runtime.
//
// Usage:
//   1. Download the latest source CSV:
//        curl -L -o scripts/ranges.raw.csv \
//          https://raw.githubusercontent.com/binlist/data/master/ranges.csv
//   2. node scripts/build-data.mjs
//
// This keeps the *data source* (CSV, easy for humans/PRs to diff) separate
// from the *shipped artifact* (ranges.json, compact, binary-searchable).

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "ranges.raw.csv");
const BANKS_DB_DIR = join(__dirname, "banks-db-src");
const OUT = join(__dirname, "..", "src", "data", "ranges.json");

/** Minimal CSV line parser that understands double-quoted fields with
 * embedded commas (the only quoting style used in binlist/data). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      if (text[i - 1] !== "\r") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
    } else if (c === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const SCHEME_MAP = {
  visa: "visa",
  mastercard: "mastercard",
  amex: "amex",
  "american express": "amex",
  diners: "diners",
  discover: "discover",
  jcb: "jcb",
  unionpay: "unionpay",
  maestro: "maestro",
  mir: "mir",
};

function normalizeScheme(raw) {
  if (!raw) return undefined;
  const key = raw.trim().toLowerCase();
  return SCHEME_MAP[key] ?? (key || undefined);
}

function normalizeType(type, prepaid) {
  if (prepaid && prepaid.trim().toLowerCase() === "true") return "prepaid";
  const t = (type ?? "").trim().toLowerCase();
  if (t === "credit" || t === "debit" || t === "charge card" || t === "charge")
    return t === "charge card" ? "charge" : t;
  return undefined;
}

/**
 * Walks the banks-db source tree (one JSON file per bank, grouped in
 * per-country folders: banks-db-src/<country>/<bank>.json) and turns each
 * bank's `prefixes` array into range entries.
 *
 * banks-db (npm, CC-BY-4.0, https://github.com/ramoona/banks-db) is a
 * community-maintained dataset with much stronger coverage of
 * Mir/Russia/CIS banks than binlist/data, which is overwhelmingly
 * US/western-focused. We merge it in as a second source rather than relying
 * on it alone, since binlist/data has broader global + scheme-type/prepaid
 * coverage for everything else.
 *
 * Note: scheme/network is intentionally left unset here. banks-db does not
 * store it per-prefix either (it derives it from the same kind of public
 * pattern matching this package already does in scheme.ts), so `lookup()`
 * falls back to its own `detectScheme()` for these entries, which is
 * exactly as reliable.
 */
function collectBanksDbRanges() {
  let files;
  try {
    files = readdirSync(BANKS_DB_DIR);
  } catch {
    console.warn(
      `No banks-db source found at ${BANKS_DB_DIR}, skipping merge.`,
    );
    return [];
  }

  const ranges = [];
  for (const entry of files) {
    const countryDir = join(BANKS_DB_DIR, entry);
    if (!statSync(countryDir).isDirectory()) continue;

    for (const file of readdirSync(countryDir)) {
      if (!file.endsWith(".json")) continue;
      const bank = JSON.parse(readFileSync(join(countryDir, file), "utf8"));
      const country = (bank.country ?? "").toUpperCase() || undefined;
      const bankName = bank.engTitle || bank.name || undefined;

      for (const prefix of bank.prefixes ?? []) {
        const digits = String(prefix);
        if (digits.length === 6) {
          ranges.push({
            low: Number(digits),
            high: Number(digits),
            length: 6,
            country,
            bank: bankName,
          });
        } else if (digits.length === 5) {
          // A 5-digit prefix stands for the whole 6-digit sub-range under it
          // (e.g. 42276 covers 422760-422769), per banks-db's own convention.
          const low = Number(digits) * 10;
          ranges.push({
            low,
            high: low + 9,
            length: 6,
            country,
            bank: bankName,
          });
        }
      }
    }
  }
  return ranges;
}

function main() {
  const raw = readFileSync(SRC, "utf8");
  const rows = parseCsv(raw);
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

  const ranges = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length < 2) continue;
    const start = (row[idx.iin_start] ?? "").trim();
    if (!/^\d{6}(\d{2})?$/.test(start)) continue; // only clean 6 or 8 digit IINs

    const end = (row[idx.iin_end] ?? "").trim();
    const length = start.length;
    const low = Number(start);
    const high = end && /^\d+$/.test(end) ? Number(end) : low;

    const entry = {
      low,
      high,
      length,
      scheme: normalizeScheme(row[idx.scheme]),
      country: (row[idx.country] ?? "").trim() || undefined,
      bank: (row[idx.bank_name] ?? "").trim() || undefined,
      type: normalizeType(row[idx.type], row[idx.prepaid]),
    };

    // Drop undefined keys to keep the JSON small.
    for (const k of Object.keys(entry)) {
      if (entry[k] === undefined) delete entry[k];
    }
    ranges.push(entry);
  }

  const banksDbRanges = collectBanksDbRanges();
  const merged = mergeRanges(ranges, banksDbRanges);

  merged.sort((a, b) => a.length - b.length || a.low - b.low);

  writeFileSync(OUT, JSON.stringify(merged));
  console.log(
    `Wrote ${merged.length} ranges to ${OUT} ` +
      `(${ranges.length} from binlist/data, ${merged.length - ranges.length} added from banks-db, ` +
      `${banksDbRanges.length - (merged.length - ranges.length)} banks-db entries skipped as overlapping)`,
  );
}

/**
 * Merges `additions` into `base`, skipping any addition whose [low, high]
 * interval overlaps an existing range of the same length. `base` (binlist/data)
 * wins on conflicts since it carries scheme/type/prepaid detail that
 * banks-db entries don't.
 */
function mergeRanges(base, additions) {
  const byLength = {
    6: base.filter((r) => r.length === 6).sort((a, b) => a.low - b.low),
    8: base.filter((r) => r.length === 8).sort((a, b) => a.low - b.low),
  };

  function overlaps(arr, low, high) {
    let lo = 0;
    let hi = arr.length - 1;
    let idx = arr.length;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid].low >= low) {
        idx = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    for (const i of [idx - 1, idx]) {
      if (i >= 0 && i < arr.length) {
        const r = arr[i];
        if (low <= r.high && high >= r.low) return true;
      }
    }
    return false;
  }

  for (const add of additions) {
    const arr = byLength[add.length];
    if (!arr) continue;
    if (overlaps(arr, add.low, add.high)) continue;
    let insertAt = arr.findIndex((r) => r.low > add.low);
    if (insertAt === -1) insertAt = arr.length;
    arr.splice(insertAt, 0, add);
  }

  return [...byLength[6], ...byLength[8]];
}

main();

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

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "ranges.raw.csv");
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

  ranges.sort((a, b) => a.length - b.length || a.low - b.low);

  writeFileSync(OUT, JSON.stringify(ranges));
  console.log(`Wrote ${ranges.length} ranges to ${OUT}`);
}

main();

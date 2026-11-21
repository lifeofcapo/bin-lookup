import rawRanges from "./data/ranges.json" with { type: "json" };
import { isLuhnValid } from "./luhn.js";
import { detectScheme } from "./scheme.js";
import type { BinRange, LookupResult, CardScheme, CardType } from "./types.js";

export type { BinRange, LookupResult, CardScheme, CardType } from "./types.js";
export { isLuhnValid } from "./luhn.js";
export { detectScheme } from "./scheme.js";

const RANGES = rawRanges as unknown as BinRange[];

// Ranges are pre-sorted (length asc, then low asc) by scripts/build-data.mjs.
// Split once into two binary-searchable arrays, 6-digit and 8-digit IINs.
const BY_LENGTH: Record<6 | 8, BinRange[]> = { 6: [], 8: [] };
for (const r of RANGES) BY_LENGTH[r.length].push(r);

function findRange(digits: string, length: 6 | 8): BinRange | undefined {
  if (digits.length < length) return undefined;
  const n = Number(digits.slice(0, length));
  const arr = BY_LENGTH[length];
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const r = arr[mid];
    if (n < r.low) hi = mid - 1;
    else if (n > r.high) lo = mid + 1;
    else return r;
  }
  return undefined;
}

/** Keeps only digits, dropping spaces, dashes, etc. that users commonly type. */
function onlyDigits(input: string): string {
  return input.replace(/\D/g, "");
}

/**
 * Looks up a card number or bare BIN/IIN against the bundled range table and
 * public network patterns. Fully offline, synchronous, no network calls.
 *
 * Accuracy notes:
 * - `scheme` is reliable: it comes from publicly documented network ranges.
 * - `bank` / `country` come from a crowd-maintained open dataset
 *   (binlist/data). The *official* ISO IIN registry is not public, so no
 *   BIN tool - free or paid - can guarantee 100% bank-level accuracy.
 *   Treat `bank`/`country` as "best available", not authoritative.
 */
export function lookup(input: string): LookupResult {
  const digits = onlyDigits(input);

  // Prefer the more specific 8-digit IIN match, fall back to classic 6-digit.
  const range = findRange(digits, 8) ?? findRange(digits, 6);

  const patternScheme = detectScheme(digits);
  const scheme = range?.scheme ?? patternScheme ?? null;
  const schemeSource: LookupResult["schemeSource"] = range?.scheme
    ? "range"
    : patternScheme
      ? "pattern"
      : null;

  const bin = digits.slice(0, range?.length ?? (digits.length >= 8 ? 8 : 6));

  return {
    input: digits,
    bin,
    luhnValid: digits.length >= 12 ? isLuhnValid(digits) : null,
    scheme,
    schemeSource,
    country: range?.country ?? null,
    bank: range?.bank ?? null,
    cardType: range?.type ?? null,
    matched: Boolean(range),
  };
}

/** Convenience helper: true only if the full PAN passes the Luhn checksum. */
export function isValidCardNumber(input: string): boolean {
  const digits = onlyDigits(input);
  return digits.length >= 12 && isLuhnValid(digits);
}

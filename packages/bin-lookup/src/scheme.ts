import type { CardScheme } from "./types.js";

/**
 * Card network (scheme) prefix ranges, as published by the networks
 * themselves (Visa, Mastercard, etc.) in their public BIN/IIN technical
 * specifications. Unlike bank-level attribution, this layer needs no
 * licensed registry: it is pure pattern matching on publicly documented
 * number ranges, so it is always available even for BINs absent from the
 * range dataset.
 *
 * Ranges are checked longest-prefix-first so more specific bands (e.g.
 * Discover's 6-digit co-brand range) win over broader ones.
 */
interface SchemePattern {
  scheme: CardScheme;
  prefixLen: number;
  min: number;
  max: number;
}

const SCHEME_PATTERNS: SchemePattern[] = [
  // 6-digit bands first (most specific)
  { scheme: "discover", prefixLen: 6, min: 622126, max: 622925 },

  // 4-digit bands
  { scheme: "mir", prefixLen: 4, min: 2200, max: 2204 },
  { scheme: "mastercard", prefixLen: 4, min: 2221, max: 2720 },
  { scheme: "discover", prefixLen: 4, min: 6011, max: 6011 },
  { scheme: "jcb", prefixLen: 4, min: 3528, max: 3589 },

  // 3-digit bands
  { scheme: "diners", prefixLen: 3, min: 300, max: 305 },
  { scheme: "discover", prefixLen: 3, min: 644, max: 649 },

  // 2-digit bands
  { scheme: "mastercard", prefixLen: 2, min: 51, max: 55 },
  { scheme: "amex", prefixLen: 2, min: 34, max: 34 },
  { scheme: "amex", prefixLen: 2, min: 37, max: 37 },
  { scheme: "diners", prefixLen: 2, min: 36, max: 36 },
  { scheme: "diners", prefixLen: 2, min: 38, max: 39 },
  { scheme: "discover", prefixLen: 2, min: 65, max: 65 },
  { scheme: "unionpay", prefixLen: 2, min: 62, max: 62 },
  { scheme: "maestro", prefixLen: 2, min: 50, max: 50 },
  { scheme: "maestro", prefixLen: 2, min: 56, max: 58 },

  // 1-digit bands (broadest, checked last)
  { scheme: "visa", prefixLen: 1, min: 4, max: 4 },
];

/**
 * Detects a card network purely from digit patterns (no lookup table).
 * Returns null if nothing matches a known public scheme range.
 */
export function detectScheme(digits: string): CardScheme | null {
  for (const p of SCHEME_PATTERNS) {
    if (digits.length < p.prefixLen) continue;
    const prefix = Number(digits.slice(0, p.prefixLen));
    if (prefix >= p.min && prefix <= p.max) return p.scheme;
  }
  return null;
}

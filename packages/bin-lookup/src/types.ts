export type CardScheme =
  | "visa"
  | "mastercard"
  | "amex"
  | "diners"
  | "discover"
  | "jcb"
  | "unionpay"
  | "maestro"
  | "mir";

export type CardType = "credit" | "debit" | "prepaid" | "charge";

/** One row of the compiled, binary-searchable BIN range table. */
export interface BinRange {
  /** Lowest BIN/IIN in the range (as an integer). */
  low: number;
  /** Highest BIN/IIN in the range, inclusive (equals `low` for a single BIN). */
  high: number;
  /** Digit-length of this IIN range: 6 or 8, per ISO/IEC 7812-1. */
  length: 6 | 8;
  scheme?: CardScheme | string;
  /** ISO 3166-1 alpha-2 country code of the issuing bank, when known. */
  country?: string;
  bank?: string;
  type?: CardType;
}

export interface LookupResult {
  /** The input, digits only. */
  input: string;
  /** The BIN/IIN prefix actually used for the match (6 or 8 digits). */
  bin: string;
  /**
   * Luhn checksum result for the full input, when the input is long enough
   * to be a plausible full card number (>= 12 digits). `null` when the
   * input is too short to check (e.g. a bare 6-digit BIN).
   */
  luhnValid: boolean | null;
  /** Card network/scheme, or null if neither range data nor pattern matched. */
  scheme: CardScheme | string | null;
  /** Where the scheme came from: the range dataset, or a public network pattern. */
  schemeSource: "range" | "pattern" | null;
  /** ISO 3166-1 alpha-2 country code, when the range dataset has it. */
  country: string | null;
  /** Issuing bank name, when the range dataset has it. */
  bank: string | null;
  cardType: CardType | null;
  /** Whether a range-table match (bank/country) was found at all. */
  matched: boolean;
}

/**
 * Luhn checksum, as defined in ISO/IEC 7812-1 Annex B. Validates that a
 * digit string is *structurally* consistent with being a real PAN - it does
 * NOT verify that the card exists, is active, or belongs to anyone.
 */
export function isLuhnValid(digits: string): boolean {
  if (!/^\d+$/.test(digits) || digits.length < 2) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

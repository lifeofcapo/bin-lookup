import { test } from "node:test";
import assert from "node:assert/strict";
import { lookup, isValidCardNumber, isLuhnValid, detectScheme } from "./index.js";

test("Luhn: valid public test numbers pass", () => {
  assert.equal(isLuhnValid("4111111111111111"), true);
  assert.equal(isLuhnValid("5555555555554444"), true);
  assert.equal(isLuhnValid("378282246310005"), true);
});

test("Luhn: a single flipped digit fails", () => {
  assert.equal(isLuhnValid("4111111111111112"), false);
});

test("isValidCardNumber rejects short input", () => {
  assert.equal(isValidCardNumber("4111"), false);
});

test("detectScheme: Visa by leading 4", () => {
  assert.equal(detectScheme("4111111111111111"), "visa");
});

test("detectScheme: Mastercard 51-55 band", () => {
  assert.equal(detectScheme("5555555555554444"), "mastercard");
});

test("detectScheme: Mastercard 2221-2720 band", () => {
  assert.equal(detectScheme("2223000048400011"), "mastercard");
});

test("detectScheme: Mir 2200-2204 band", () => {
  assert.equal(detectScheme("2200123456789012"), "mir");
});

test("detectScheme: Amex 34/37", () => {
  assert.equal(detectScheme("378282246310005"), "amex");
});

test("detectScheme: unknown prefix returns null", () => {
  assert.equal(detectScheme("0000001234567890"), null);
});

test("lookup: known BIN from the range dataset resolves bank + country", () => {
  const result = lookup("341142");
  assert.equal(result.matched, true);
  assert.equal(result.scheme, "amex");
  assert.equal(result.schemeSource, "range");
  assert.equal(result.country, "US");
  assert.equal(result.bank, "AMERICAN EXPRESS");
});

test("lookup: unknown BIN still resolves scheme by pattern, no bank", () => {
  const result = lookup("4111111111111111");
  assert.equal(result.scheme, "visa");
  assert.equal(result.schemeSource, "pattern");
  assert.equal(result.bank, null);
  assert.equal(result.luhnValid, true);
});

test("lookup: formatted input with spaces/dashes is handled", () => {
  const result = lookup("3411 42");
  assert.equal(result.bin, "341142");
});

test("lookup: short bare BIN gets luhnValid = null (not checkable)", () => {
  const result = lookup("427229");
  assert.equal(result.luhnValid, null);
});

// Character pools for password generation.
export const LOWER = "abcdefghijklmnopqrstuvwxyz";
export const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const DIGITS = "0123456789";
export const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";

/**
 * Visually confusable characters, removed when "exclude look-alikes" is on:
 * 0 / O / o and 1 / l / I. On by default for passwords.
 */
export const AMBIGUOUS = new Set("0Oo1lI".split(""));

/** Random-separator pool for the passphrase "Numbers and symbols" option. */
export const SEPARATOR_SYMBOLS = "0123456789!@#$%&*";

export function stripAmbiguous(pool: string): string {
  return pool
    .split("")
    .filter((c) => !AMBIGUOUS.has(c))
    .join("");
}

// Cryptographically-secure randomness helpers built on the Web Crypto API.
// `globalThis.crypto` is always present in extension pages.
const webcrypto = (globalThis as unknown as { crypto: Crypto }).crypto;

/** n cryptographically-secure random bytes. */
export function randomBytes(n: number): Uint8Array {
  return webcrypto.getRandomValues(new Uint8Array(n));
}

/**
 * Uniform random integer in [0, maxExclusive) via rejection sampling.
 * Rejection avoids the modulo bias a naive `bytes % n` would introduce.
 */
export function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error("randomInt: maxExclusive must be a positive integer");
  }
  if (maxExclusive === 1) return 0;
  const bytesNeeded = Math.ceil(Math.log2(maxExclusive) / 8);
  const maxValue = 256 ** bytesNeeded;
  // Largest multiple of the range that fits in `bytesNeeded` bytes; anything
  // at or above it is rejected so every residue is equally likely.
  const limit = maxValue - (maxValue % maxExclusive);
  const buf = new Uint8Array(bytesNeeded);
  for (;;) {
    webcrypto.getRandomValues(buf);
    let val = 0;
    for (let i = 0; i < bytesNeeded; i++) val = val * 256 + buf[i];
    if (val < limit) return val % maxExclusive;
  }
}

/** Uniform random element of a non-empty array. */
export function randomPick<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("randomPick: empty array");
  return arr[randomInt(arr.length)];
}

/** In-place Fisher-Yates shuffle; returns the same array for chaining. */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

import type { PasswordOptions } from "./password";
import { passwordPoolSize } from "./password";
import type { PassphraseOptions } from "./passphrase";
import { isRandomSeparator, separatorPoolSize } from "./passphrase";
import { WORDS } from "./wordlist";
import { DIGITS } from "./charsets";

export type StrengthLabel =
  "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";

export interface Strength {
  bits: number;
  label: StrengthLabel;
  score: number; // 0..1, for the meter width
  crackTime: string;
}

export function passwordEntropyBits(opts: PasswordOptions): number {
  const pool = passwordPoolSize(opts);
  const len = Number.isFinite(opts.length)
    ? Math.max(0, Math.floor(opts.length))
    : 0;
  return pool > 1 ? len * Math.log2(pool) : 0;
}

export function passphraseEntropyBits(opts: PassphraseOptions): number {
  const count = Number.isFinite(opts.words)
    ? Math.max(0, Math.floor(opts.words))
    : 0;
  let bits = count * Math.log2(WORDS.length);
  if (opts.numbers) bits += count * Math.log2(DIGITS.length);
  if (isRandomSeparator(opts.separator) && count > 1) {
    bits += (count - 1) * Math.log2(separatorPoolSize(opts.separator));
  }
  return bits;
}

const LABELS: { max: number; label: StrengthLabel }[] = [
  { max: 28, label: "Very weak" },
  { max: 36, label: "Weak" },
  { max: 60, label: "Fair" },
  { max: 128, label: "Strong" },
  { max: Infinity, label: "Very strong" },
];

function labelFor(bits: number): StrengthLabel {
  const hit = LABELS.find((l) => bits < l.max);
  return hit ? hit.label : "Very strong";
}

// Order-of-magnitude offline attacker rate (fast-hash / GPU), guesses/second.
const GUESSES_PER_SEC = 1e10;

function humanTime(seconds: number): string {
  if (seconds < 1) return "instantly";
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;
  if (seconds < minute) return `${Math.round(seconds)} seconds`;
  if (seconds < hour) return `${Math.round(seconds / minute)} minutes`;
  if (seconds < day) return `${Math.round(seconds / hour)} hours`;
  if (seconds < year) return `${Math.round(seconds / day)} days`;
  const years = seconds / year;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1e3) return "centuries";
  if (years < 1e6) return "thousands of years";
  if (years < 1e9) return "millions of years";
  return "billions of years";
}

export function strengthFromBits(bits: number): Strength {
  // A broken/non-finite entropy must never read as strong.
  if (!Number.isFinite(bits) || bits <= 0) {
    return { bits: 0, label: "Very weak", score: 0, crackTime: "instantly" };
  }
  // Average guesses to crack is half the keyspace.
  const seconds = Math.pow(2, bits) / 2 / GUESSES_PER_SEC;
  return {
    bits,
    label: labelFor(bits),
    score: Math.max(0, Math.min(1, bits / 128)),
    crackTime: humanTime(seconds),
  };
}

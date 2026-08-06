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

/**
 * Label thresholds in bits, ascending; the last entry is open-ended.
 *
 * The UI deliberately reports entropy rather than a crack time. A time figure
 * would have to assume a guess rate, but the real rate is set by how the target
 * service hashes the secret and spans some eight orders of magnitude - roughly
 * 1e4/s against bcrypt at work factor 12, upwards of 1e12/s against unsalted
 * MD5 on GPUs. A generator cannot know where its output will be used, so any
 * single number would be made up, and would rot as hardware improves. Bits are
 * a property of the secret itself, need no assumptions, and never saturate.
 */
/** Bits at which a secret becomes "Very strong" - also where the bar fills. */
export const VERY_STRONG_BITS = 95;

const LABELS: { max: number; label: StrengthLabel }[] = [
  { max: 30, label: "Very weak" },
  { max: 55, label: "Weak" },
  { max: 75, label: "Fair" },
  { max: VERY_STRONG_BITS, label: "Strong" },
  { max: Infinity, label: "Very strong" },
];

function labelFor(bits: number): StrengthLabel {
  const hit = LABELS.find((l) => bits < l.max);
  return hit ? hit.label : "Very strong";
}

export function strengthFromBits(bits: number): Strength {
  // A broken/non-finite entropy must never read as strong.
  if (!Number.isFinite(bits) || bits <= 0) {
    return { bits: 0, label: "Very weak", score: 0 };
  }
  return {
    bits,
    // A full bar means exactly "Very strong", so bar and label never disagree.
    // Above that the bar pins while the reported bits keep climbing.
    label: labelFor(bits),
    score: Math.max(0, Math.min(1, bits / VERY_STRONG_BITS)),
  };
}

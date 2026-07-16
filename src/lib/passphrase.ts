import { WORDS } from "./wordlist";
import { DIGITS, SEPARATOR_SYMBOLS } from "./charsets";
import { randomPick, randomInt } from "./random";

export type SeparatorKind = "-" | " " | "." | "," | "_" | "123" | "!&%";

export interface PassphraseOptions {
  words: number;
  capitalize: boolean;
  numbers: boolean;
  separator: SeparatorKind;
}

export const PASSPHRASE_WORDS_MIN = 2;
export const PASSPHRASE_WORDS_MAX = 10;

export const SEPARATOR_OPTIONS: { value: SeparatorKind; label: string }[] = [
  { value: "-", label: "Hyphens" },
  { value: " ", label: "Spaces" },
  { value: ".", label: "Periods" },
  { value: ",", label: "Commas" },
  { value: "_", label: "Underscores" },
  { value: "123", label: "Numbers" },
  { value: "!&%", label: "Numbers and symbols" },
];

// The two "random" separators draw a fresh char per gap instead of a literal.
const RANDOM_SEPARATORS: Record<string, string> = {
  "123": DIGITS,
  "!&%": SEPARATOR_SYMBOLS,
};

export function isRandomSeparator(sep: SeparatorKind): boolean {
  // hasOwnProperty.call, not `in`, so inherited keys (toString, …) never match.
  return Object.prototype.hasOwnProperty.call(RANDOM_SEPARATORS, sep);
}

/** Char pool size backing a separator (1 for a fixed literal). */
export function separatorPoolSize(sep: SeparatorKind): number {
  return isRandomSeparator(sep) ? RANDOM_SEPARATORS[sep].length : 1;
}

/** One separator instance: a literal, or a fresh random char for random kinds. */
function separatorChar(sep: SeparatorKind): string {
  if (!isRandomSeparator(sep)) return sep;
  return randomPick(RANDOM_SEPARATORS[sep].split(""));
}

function capitalizeWord(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function generatePassphrase(opts: PassphraseOptions): string {
  const count = Number.isFinite(opts.words)
    ? Math.max(1, Math.floor(opts.words))
    : PASSPHRASE_WORDS_MIN;
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    let w = randomPick(WORDS);
    if (opts.capitalize) w = capitalizeWord(w);
    if (opts.numbers) w += DIGITS.charAt(randomInt(DIGITS.length));
    parts.push(w);
  }
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) {
    out += separatorChar(opts.separator) + parts[i];
  }
  return out;
}

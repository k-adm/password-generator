import { LOWER, UPPER, DIGITS, SYMBOLS, stripAmbiguous } from "./charsets";
import { randomPick, shuffle } from "./random";

export interface PasswordOptions {
  length: number;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}

export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 64;

/** Enabled character classes; lowercase is always the base so the pool is
 *  never empty even if the user unticks everything. */
function classesFor(opts: PasswordOptions): string[] {
  const raw = [LOWER];
  if (opts.upper) raw.push(UPPER);
  if (opts.numbers) raw.push(DIGITS);
  if (opts.symbols) raw.push(SYMBOLS);
  return opts.excludeSimilar
    ? raw.map(stripAmbiguous).filter((c) => c.length > 0)
    : raw;
}

export function passwordPoolSize(opts: PasswordOptions): number {
  return classesFor(opts).reduce((n, c) => n + c.length, 0);
}

export function generatePassword(opts: PasswordOptions): string {
  const classes = classesFor(opts);
  const poolArr = classes.join("").split("");
  const len = Number.isFinite(opts.length)
    ? Math.max(1, Math.floor(opts.length))
    : PASSWORD_LENGTH_MIN;
  const chars: string[] = [];
  // Guarantee at least one char from every enabled class when there is room.
  if (classes.length <= len) {
    for (const cls of classes) chars.push(randomPick(cls.split("")));
  }
  while (chars.length < len) chars.push(randomPick(poolArr));
  return shuffle(chars).join("");
}

import type { PasswordOptions } from "./password";
import { PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX } from "./password";
import type { PassphraseOptions, SeparatorKind } from "./passphrase";
import {
  PASSPHRASE_WORDS_MIN,
  PASSPHRASE_WORDS_MAX,
  SEPARATOR_OPTIONS,
} from "./passphrase";

export type Mode = "password" | "passphrase";

export interface Settings {
  mode: Mode;
  password: PasswordOptions;
  passphrase: PassphraseOptions;
}

export const STORAGE_KEY = "pg:settings";

export const DEFAULT_SETTINGS: Settings = {
  mode: "password",
  password: {
    length: 16,
    upper: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true, // hard requirement: on by default
  },
  passphrase: {
    words: 5,
    capitalize: true,
    numbers: true,
    separator: "-",
  },
};

function clampInt(
  v: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = typeof v === "number" ? Math.round(v) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/** Merge unknown stored data with defaults, clamping/validating every field. */
export function normalizeSettings(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings>;
  const d = DEFAULT_SETTINGS;
  const pw = (r.password ?? {}) as Partial<PasswordOptions>;
  const pp = (r.passphrase ?? {}) as Partial<PassphraseOptions>;
  const sepValid = SEPARATOR_OPTIONS.some((o) => o.value === pp.separator);
  return {
    mode: r.mode === "passphrase" ? "passphrase" : "password",
    password: {
      length: clampInt(
        pw.length,
        PASSWORD_LENGTH_MIN,
        PASSWORD_LENGTH_MAX,
        d.password.length,
      ),
      upper: bool(pw.upper, d.password.upper),
      numbers: bool(pw.numbers, d.password.numbers),
      symbols: bool(pw.symbols, d.password.symbols),
      excludeSimilar: bool(pw.excludeSimilar, d.password.excludeSimilar),
    },
    passphrase: {
      words: clampInt(
        pp.words,
        PASSPHRASE_WORDS_MIN,
        PASSPHRASE_WORDS_MAX,
        d.passphrase.words,
      ),
      capitalize: bool(pp.capitalize, d.passphrase.capitalize),
      numbers: bool(pp.numbers, d.passphrase.numbers),
      separator: sepValid
        ? (pp.separator as SeparatorKind)
        : d.passphrase.separator,
    },
  };
}

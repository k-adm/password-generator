import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// `globalThis.crypto` is always present in extension pages and the service
// worker; typed explicitly to avoid the DOM vs @types/node `crypto` conflict.
const webcrypto = (globalThis as unknown as { crypto: Crypto }).crypto;

/** Unique id for new accounts. */
export function uuid(): string {
  return webcrypto.randomUUID();
}

/** Copy text to the clipboard from an extension page (must run on a user gesture).
 *  No auto-clear: a password/passphrase is meant to be pasted, so we keep it on
 *  the clipboard until the user (or the OS) replaces it. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

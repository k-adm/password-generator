import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  normalizeSettings,
} from "@/lib/settings";

const hasChromeStorage =
  typeof chrome !== "undefined" && !!chrome.storage?.local;

async function readRaw() {
  if (!hasChromeStorage) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }
  const res = await chrome.storage.local.get(STORAGE_KEY);
  return res[STORAGE_KEY] ?? null;
}

// Best-effort persistence; in-memory state stays authoritative if it fails.
function writeRaw(value) {
  try {
    if (!hasChromeStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return;
    }
    Promise.resolve(chrome.storage.local.set({ [STORAGE_KEY]: value })).catch(
      () => {},
    );
  } catch {
    /* quota / private mode / context invalidated - ignore */
  }
}

/**
 * Generator settings, persisted to chrome.storage.local and kept in sync
 * across the popup and options page. Theme is handled separately by next-themes.
 */
export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  // Mirror of the latest settings so `update` can compute the next value and
  // persist it outside the state updater (keeps the reducer pure).
  const settingsRef = useRef(settings);

  const apply = useCallback((next) => {
    settingsRef.current = next;
    setSettings(next);
  }, []);

  useEffect(() => {
    let alive = true;
    readRaw()
      .then((raw) => {
        if (alive) apply(normalizeSettings(raw));
      })
      .catch(() => {
        if (alive) apply(DEFAULT_SETTINGS);
      })
      .finally(() => {
        if (alive) setReady(true);
      });

    if (!hasChromeStorage || !chrome.storage.onChanged) {
      return () => {
        alive = false;
      };
    }
    const listener = (changes, area) => {
      if (area !== "local" || !changes[STORAGE_KEY]) return;
      const incoming = normalizeSettings(changes[STORAGE_KEY].newValue);
      // Ignore the echo of our own write; only apply real cross-surface changes.
      if (JSON.stringify(incoming) === JSON.stringify(settingsRef.current))
        return;
      apply(incoming);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      alive = false;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [apply]);

  const update = useCallback(
    (patch) => {
      const prev = settingsRef.current;
      const next =
        typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      apply(next);
      writeRaw(next);
    },
    [apply],
  );

  const updatePassword = useCallback(
    (patch) =>
      update((prev) => ({ ...prev, password: { ...prev.password, ...patch } })),
    [update],
  );
  const updatePassphrase = useCallback(
    (patch) =>
      update((prev) => ({
        ...prev,
        passphrase: { ...prev.passphrase, ...patch },
      })),
    [update],
  );
  const setMode = useCallback((mode) => update({ mode }), [update]);

  return { settings, ready, update, updatePassword, updatePassphrase, setMode };
}

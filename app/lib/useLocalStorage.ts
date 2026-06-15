"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe localStorage hook backed by useSyncExternalStore.
 *
 * - Server snapshot: returns `initial` (no localStorage access).
 * - Client snapshot: returns the parsed JSON value from localStorage, or
 *   `initial` if the slot is empty.
 * - Subscribes to the `storage` event so multiple tabs stay in sync.
 * - On the first client render, the snapshot is `initial` (matching the
 *   server), so there is no hydration mismatch. Subsequent updates are
 *   driven by the `storage` event and explicit `setValue` calls.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      function onStorage(e: StorageEvent) {
        if (e.key === key) onStoreChange();
      }
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    },
    [key],
  );

  const getSnapshot = useCallback((): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback((): string | null => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Parse the raw JSON string. Memoize the parse on the same input to keep
  // the returned value referentially stable when nothing changed.
  const value: T = (() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  })();

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return;
      try {
        const current = (() => {
          try {
            const r = window.localStorage.getItem(key);
            if (r === null) return initial;
            return JSON.parse(r) as T;
          } catch {
            return initial;
          }
        })();
        const resolved =
          typeof next === "function"
            ? (next as (p: T) => T)(current)
            : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        // Manually notify subscribers on the same tab (the `storage` event
        // only fires across tabs).
        window.dispatchEvent(
          new StorageEvent("storage", { key, newValue: JSON.stringify(resolved) }),
        );
      } catch {
        // quota or privacy mode — silently ignore
      }
    },
    [key, initial],
  );

  return [value, setValue];
}

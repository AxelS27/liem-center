'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Shared pinned-products state for the profile showcase. The pin action lives in the library;
 * the showcase lives on the profile. Until the backend stores this per user, we keep the choice
 * in localStorage so both pages stay in sync within the browser. App-level shared hook (not owned
 * by a single feature) per AGENTS.md "shared data goes through an app-level layer".
 */
const STORAGE_KEY = 'liem.pinnedProducts';
const DEFAULT_PINNED = ['liem-monorepo', 'liem-ai-plugin', 'liem-ui-kit'];
export const MAX_PINNED = 6;
const CHANGE_EVENT = 'liem:pinned-change';

function readStore(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : DEFAULT_PINNED;
  } catch {
    return DEFAULT_PINNED;
  }
}

export function usePinnedProducts() {
  // Start from the default so server and first client render match; hydrate from storage after.
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);

  useEffect(() => {
    setPinned(readStore());

    const sync = () => setPinned(readStore());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = readStore();
    const next = current.includes(slug)
      ? current.filter((value) => value !== slug)
      : current.length >= MAX_PINNED
        ? current
        : [...current, slug];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures (private mode, etc.).
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
    setPinned(next);
  }, []);

  return {
    pinned,
    toggle,
    isPinned: (slug: string) => pinned.includes(slug),
    isFull: pinned.length >= MAX_PINNED,
  };
}

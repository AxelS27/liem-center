'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Browser cart store for the frontend build. Items are product slugs kept in localStorage so the
 * product page, the nav cart badge, and the checkout page stay in sync. Replaced by a real cart
 * (server/session) once the backend lands. App-level shared hook per AGENTS.md.
 */
const STORAGE_KEY = 'liem.cart';
const CHANGE_EVENT = 'liem:cart-change';

function readStore(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStore(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCart() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(readStore());

    const sync = () => setItems(readStore());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((slug: string) => {
    const current = readStore();

    if (!current.includes(slug)) {
      const next = [...current, slug];
      writeStore(next);
      setItems(next);
    }
  }, []);

  const remove = useCallback((slug: string) => {
    const next = readStore().filter((value) => value !== slug);
    writeStore(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    writeStore([]);
    setItems([]);
  }, []);

  return {
    items,
    count: items.length,
    has: (slug: string) => items.includes(slug),
    add,
    remove,
    clear,
  };
}

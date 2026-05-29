import type { Locale } from './config';

const dictionaries = {
  en: () => import('./locales/en.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]() as Promise<Dictionary>;
}

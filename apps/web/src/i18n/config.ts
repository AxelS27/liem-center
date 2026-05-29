// Ship ONE language first (English). To add a language later, add its code
// here, register a loader in dictionaries.ts, and add a name to localeNames.
// Only then move pages under app/[lang]/... and add the middleware + switcher.
export const locales = ['en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

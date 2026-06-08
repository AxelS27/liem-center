'use client';

import { cn } from '@repo/ui';
import { useState } from 'react';

/**
 * Placeholder header controls. These render the theme and language switcher UI but are NOT wired
 * to real theming (next-themes) or i18n yet — they only hold local state for now. Replace with the
 * real implementations when dark mode and localization are built.
 */

type Language = { code: string; label: string };

const languages: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
];

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const [active, setActive] = useState(languages[0]);

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground group-hover:text-foreground"
      >
        <GlobeIcon />
        <span className="hidden md:inline">{active?.label}</span>
        <ChevronIcon />
      </button>
      <div className="absolute right-0 top-full z-20 hidden pt-2 group-hover:block group-focus-within:block">
        <div className="w-44 rounded-md border border-border bg-background p-1 shadow-sm">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => setActive(language)}
              className={cn(
                'flex w-full items-center rounded-sm px-3 py-2 text-left text-sm transition-colors',
                active?.code === language.code
                  ? 'bg-secondary font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
    </svg>
  );
}

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title="Theme"
      className="flex h-8 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
    >
      {dark ? <MoonIcon /> : <SunIcon />}
      <span className="hidden md:inline">{dark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

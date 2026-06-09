'use client';

import { buttonVariants, cn } from '@repo/ui';
import type { UserProfile } from '@repo/types';
import { useState } from 'react';

import { authedRequest } from '@/services/client-api';

const countries = [
  'Indonesia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Australia',
  'Japan',
  'South Korea',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Netherlands',
  'Brazil',
  'Other',
];

const fieldClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * Profile tab form. Loads the current profile and persists changes via PATCH /users/me.
 */
export function ProfileSettingsForm({ profile }: { profile: UserProfile }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [country, setCountry] = useState(profile.country ?? '');
  const [countryPublic, setCountryPublic] = useState(profile.countryPublic);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      await authedRequest('/users/me', {
        body: JSON.stringify({
          bio: bio.trim() || null,
          country: country || null,
          countryPublic,
          displayName: displayName.trim(),
          username: username.trim(),
        }),
        method: 'PATCH',
      });
      setMessage({ text: 'Profile saved.', tone: 'ok' });
    } catch {
      setMessage({
        text: 'Could not save. Check that your username is valid and not already taken.',
        tone: 'error',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={save} className="grid max-w-xl gap-5">
      <label className="grid gap-2 text-sm font-medium text-foreground">
        Display name
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Username
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={fieldClass}
        />
        <span className="text-xs font-normal text-muted-foreground">
          Your public profile is /u/{username || 'username'}
        </span>
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Country <span className="font-normal text-muted-foreground">(optional)</span>
        <select value={country} onChange={(event) => setCountry(event.target.value)} className={fieldClass}>
          <option value="">Not set</option>
          {countries.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={countryPublic}
          onChange={(event) => setCountryPublic(event.target.checked)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Show my country on my public profile
      </label>

      <label className="grid gap-2 text-sm font-medium text-foreground">
        Bio
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
          placeholder="A short line about you"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </label>

      {message ? (
        <p
          className={cn(
            'rounded-md border px-3 py-2 text-sm',
            message.tone === 'ok'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive',
          )}
        >
          {message.text}
        </p>
      ) : null}

      <div>
        <button type="submit" disabled={pending} className={cn(buttonVariants())}>
          {pending ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

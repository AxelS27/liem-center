'use client';

import { buttonVariants, cn } from '@repo/ui';
import { useState } from 'react';

import { GitHubIcon, GoogleIcon } from '@/components/shared/provider-icons';

type TabKey = 'profile' | 'accounts' | 'notifications' | 'security';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'accounts', label: 'Connected accounts' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'security', label: 'Security' },
];

const fieldClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

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

function Field({ label, hint, ...props }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <input className={fieldClass} {...props} />
      {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Toggle({ label, description, defaultOn }: { label: string; description: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((value) => !value)}
        className={cn(
          'relative h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          on ? 'bg-primary' : 'bg-secondary',
        )}
      >
        <span
          className={cn(
            'absolute top-1 h-4 w-4 rounded-full bg-background transition-transform',
            on ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}

function AccountRow({
  icon,
  name,
  status,
  connected,
}: {
  icon: React.ReactNode;
  name: string;
  status: string;
  connected: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{status}</p>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: connected ? 'outline' : 'primary', size: 'sm' }))}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

export function SettingsView() {
  const [tab, setTab] = useState<TabKey>('profile');

  return (
    <div>
      <div role="tablist" aria-label="Settings sections" className="flex flex-wrap gap-6 border-b border-border">
        {tabs.map((item) => {
          const isActive = item.key === tab;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.key)}
              className={cn(
                '-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="pt-8">
        {tab === 'profile' ? (
          <div className="grid max-w-xl gap-5">
            <Field label="Display name" defaultValue="Farrell Axel" />
            <Field label="Username" defaultValue="farrellaxel" hint="Your public profile is /u/farrellaxel" />
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Country <span className="font-normal text-muted-foreground">(optional)</span>
              <select defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-muted-foreground">
                Hidden on your public profile unless you choose to show it.
              </span>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Bio
              <textarea
                rows={4}
                placeholder="A short line about you"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <div>
              <button type="button" className={cn(buttonVariants())}>
                Save changes
              </button>
            </div>
          </div>
        ) : null}

        {tab === 'accounts' ? (
          <div className="max-w-xl divide-y divide-border border-y border-border">
            <AccountRow icon={<GoogleIcon className="h-4 w-4" />} name="Google" status="Connected" connected />
            <AccountRow
              icon={<GitHubIcon className="h-4 w-4" />}
              name="GitHub"
              status="Not connected. Required to activate GitHub products."
              connected={false}
            />
          </div>
        ) : null}

        {tab === 'notifications' ? (
          <div className="max-w-xl">
            <p className="rounded-md border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              These control optional email only. Important emails always send, and in-app
              notifications are never muted.
            </p>
            <div className="mt-2 divide-y divide-border">
              <Toggle label="Product updates" description="New versions of products you own." defaultOn />
              <Toggle label="Sales" description="Seasonal sales and limited campaigns." defaultOn />
              <Toggle label="Announcements" description="New Liem product releases." defaultOn />
              <Toggle label="Wishlist alerts" description="When a wishlisted product goes on sale." defaultOn={false} />
            </div>
          </div>
        ) : null}

        {tab === 'security' ? (
          <div className="grid max-w-xl gap-8">
            <div className="grid gap-5">
              <h2 className="text-sm font-semibold text-foreground">Change password</h2>
              <Field label="Current password" type="password" autoComplete="current-password" />
              <Field label="New password" type="password" autoComplete="new-password" hint="At least 8 characters." />
              <div>
                <button type="button" className={cn(buttonVariants())}>
                  Update password
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">Active sessions</h2>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                <li className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground">Chrome on Windows</span>
                  <span className="text-xs text-muted-foreground">This device</span>
                </li>
                <li className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground">Safari on iPhone</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </li>
              </ul>
              <button type="button" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
                Log out all other devices
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

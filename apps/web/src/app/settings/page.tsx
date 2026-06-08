import type { Metadata } from 'next';

import { SettingsView } from '@/features/settings';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium text-muted-foreground">Account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Settings
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        Manage your profile, connected accounts, notification preferences, and security.
      </p>

      <div className="mt-10">
        <SettingsView />
      </div>
    </section>
  );
}

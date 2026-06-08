import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { isAdminEmail } from '@/config/admin';
import { getProfile, PinnedShowcase } from '@/features/profile';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const profile = getProfile();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {profile.initial}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {profile.displayName}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-primary px-2 py-0.5 font-medium text-primary-foreground">
                {isAdmin ? 'Admin' : `${profile.tier} Member`}
              </span>
              {profile.founderNumber ? (
                <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                  Founder #{String(profile.founderNumber).padStart(4, '0')}
                </span>
              ) : null}
              <span className="text-muted-foreground">Joined {profile.joined}</span>
            </div>
          </div>
        </div>
        <a href="/settings" className={cn(buttonVariants({ variant: 'outline' }))}>
          Edit profile
        </a>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-5 text-center">
            <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {profile.nextTier ? (
        <div className="mt-10">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{profile.tier}</span>
            <span className="text-muted-foreground">{profile.tierProgressPercent}% to {profile.nextTier}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${profile.tierProgressPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <h2 className="text-sm font-semibold text-foreground">Badges</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.badges.map((badge) => (
            <li
              key={badge.code}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {badge.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-foreground">Pinned products</h2>
          <a
            href="/library"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View library
          </a>
        </div>
        <div className="mt-4">
          <PinnedShowcase />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-sm font-semibold text-foreground">Activity</h2>
        <ol className="mt-4 space-y-4 border-l border-border pl-5">
          {profile.activity.map((event) => (
            <li key={event.id} className="relative">
              <span
                className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-border"
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">{event.text}</p>
              <p className="text-xs text-muted-foreground">{event.date}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

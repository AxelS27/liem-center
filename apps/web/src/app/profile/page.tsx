import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { isAdminEmail } from '@/config/admin';
import { getProfileInitial, PinnedShowcase } from '@/features/profile';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getLibrary, getMyProfile } from '@/services/api';

export const metadata: Metadata = {
  title: 'Profile',
};

function getTierProgress(lifetimeSpendIdr: number) {
  const next = 10_000_000;

  return Math.min(100, Math.round((lifetimeSpendIdr / next) * 100));
}

export default async function ProfilePage() {
  const [profile, entitlements] = await Promise.all([getMyProfile(), getLibrary()]);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);
  const tierProgress = getTierProgress(profile.lifetimeSpendIdr);
  const ownedProducts = entitlements.map((entitlement) => ({
    ...entitlement.product,
    dependencies: [],
    requires: [],
    updatedAt: profile.createdAt,
    overview: [],
    features: [],
    howToUse: [],
    changelog: [],
    roadmap: [],
    reviews: [],
  }));

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {getProfileInitial(profile)}
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
              <span className="text-muted-foreground">Joined {profile.createdAt}</span>
            </div>
          </div>
        </div>
        <a href="/settings" className={cn(buttonVariants({ variant: 'outline' }))}>
          Edit profile
        </a>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {[
          { label: 'Owned', value: entitlements.length },
          {
            label: 'Purchased',
            value: entitlements.filter((item) => item.source === 'purchase').length,
          },
          {
            label: 'Claimed',
            value: entitlements.filter((item) => item.source === 'free_claim').length,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-5 text-center">
            <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium capitalize text-foreground">{profile.tier}</span>
          <span className="text-muted-foreground">{tierProgress}% to Legendary</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${tierProgress}%` }} />
        </div>
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
          <PinnedShowcase ownedProducts={ownedProducts} />
        </div>
      </div>
    </section>
  );
}

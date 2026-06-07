import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <PlaceholderPage
      eyebrow="Account"
      title="Sign in"
      description="Auth runs through Supabase Auth. Build the real sign-in form here. A product would also give auth routes a focused auth layout instead of the marketing shell (see docs/engineering/FRONTEND.md)."
      action={
        <a href="/signup" className={cn(buttonVariants())}>
          Create an account
        </a>
      }
    />
  );
}

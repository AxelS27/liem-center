import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';

import { PlaceholderPage } from '@/components/shared/placeholder-page';

export const metadata: Metadata = {
  title: 'Get started',
};

export default function SignUpPage() {
  return (
    <PlaceholderPage
      eyebrow="Account"
      title="Create your account"
      description="Auth runs through Supabase Auth. Build the real sign-up form here. A product would also give auth routes a focused auth layout instead of the marketing shell (see docs/engineering/FRONTEND.md)."
      action={
        <a href="/signin" className={cn(buttonVariants({ variant: 'outline' }))}>
          I already have an account
        </a>
      }
    />
  );
}

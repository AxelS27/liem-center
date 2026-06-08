import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminNav } from '@/features/admin';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
      </div>

      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8">{children}</div>
    </section>
  );
}

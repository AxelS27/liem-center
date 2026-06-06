import { buttonVariants, cn } from '@repo/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { PreviewCarousel } from '@/components/shared/preview-carousel';

export const metadata: Metadata = {
  title: 'Home',
};

/*
 * This landing page is a WIRING EXAMPLE, not a layout to clone. It exists to demonstrate the
 * configured stack: typography, tokens, anchored nav with active state, a client carousel
 * island, section rhythm, and a real footer. When building an actual product, design the page
 * from docs/UI_UX.md and the product brief - do not reskin this composition. See docs/FRONTEND.md.
 */

// Brand marks are official single-path logos (simple-icons), rendered monochrome so the row
// reads as a calm "built with" strip, not a colorful logo wall.
const stack: { name: string; path: string }[] = [
  {
    name: 'Next.js',
    path: 'M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z',
  },
  {
    name: 'Hono',
    path: 'M12.445.002a45.529 45.529 0 0 0-5.252 8.146 8.595 8.595 0 0 1-.555-.53 27.796 27.796 0 0 0-1.205-1.542 8.762 8.762 0 0 0-1.251 2.12 20.743 20.743 0 0 0-1.448 5.88 8.867 8.867 0 0 0 .338 3.468c1.312 3.48 3.794 5.593 7.445 6.337 3.055.438 5.755-.333 8.097-2.312 2.677-2.59 3.359-5.634 2.047-9.132a33.287 33.287 0 0 0-2.988-5.59A91.34 91.34 0 0 0 12.615.053a.216.216 0 0 0-.17-.051Zm-.336 3.906a50.93 50.93 0 0 1 4.794 6.552c.448.767.817 1.57 1.108 2.41.606 2.386-.044 4.354-1.951 5.904-1.845 1.298-3.87 1.683-6.072 1.156-2.376-.737-3.75-2.335-4.121-4.794a5.107 5.107 0 0 1 .242-2.266c.358-.908.79-1.774 1.3-2.601l1.446-2.121a397.33 397.33 0 0 0 3.254-4.24Z',
  },
  {
    name: 'Supabase',
    path: 'M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z',
  },
  {
    name: 'Tailwind CSS',
    path: 'M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z',
  },
  {
    name: 'TypeScript',
    path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
  },
  {
    name: 'Turborepo',
    path: 'M11.9906 4.1957c-4.2998 0-7.7981 3.501-7.7981 7.8043s3.4983 7.8043 7.7981 7.8043c4.2999 0 7.7982-3.501 7.7982-7.8043s-3.4983-7.8043-7.7982-7.8043m0 11.843c-2.229 0-4.0356-1.8079-4.0356-4.0387s1.8065-4.0387 4.0356-4.0387S16.0262 9.7692 16.0262 12s-1.8065 4.0388-4.0356 4.0388m.6534-13.1249V0C18.9726.3386 24 5.5822 24 12s-5.0274 11.66-11.356 12v-2.9139c4.7167-.3372 8.4516-4.2814 8.4516-9.0861s-3.735-8.749-8.4516-9.0861M5.113 17.9586c-1.2502-1.4446-2.0562-3.2845-2.2-5.3046H0c.151 2.8266 1.2808 5.3917 3.051 7.3668l2.0606-2.0622zM11.3372 24v-2.9139c-2.02-.1439-3.8584-.949-5.3019-2.2018l-2.0606 2.0623c1.975 1.773 4.538 2.9022 7.361 3.0534z',
  },
];

const features: { title: string; detail: string; icon: ReactNode }[] = [
  {
    title: 'Typed end to end',
    detail: 'Shared Zod contracts in packages/types keep the web and server from drifting.',
    icon: (
      <>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </>
    ),
  },
  {
    title: 'Clean boundaries',
    detail: 'Apps stay thin, packages stay shared, and imports cannot cross the lines by accident.',
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Design pre-wired',
    detail: 'Tailwind tokens, shadcn, and a retuned reference button ship configured, not generic.',
    icon: (
      <>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </>
    ),
  },
  {
    title: 'Fast by default',
    detail: 'Turborepo caching, server components, and small client islands out of the box.',
    icon: (
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    ),
  },
];

const foundations = [
  { title: 'Plan first', detail: 'Settle scope and structure before the first screen.' },
  { title: 'Stay consistent', detail: 'Every new page reuses the same system and patterns.' },
  { title: 'Ship focused', detail: 'Launch with one clear next step for the user.' },
];

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/*
       * Centered hero, contained to a marketing measure so sparse content reads as a composed
       * page. The headline and CTAs sit in the first viewport while the preview below peeks
       * above the fold to invite scrolling.
       */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-20 text-center sm:pt-28">
        <p className="text-sm font-medium text-muted-foreground">Product starter</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          A starter that keeps agents aligned from spec to ship.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Liem gives every new product a clear plan, a consistent interface, and a focused path
          from first idea to first release.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/features" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
            Explore features
          </a>
          <a
            href="/pricing"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
          >
            View pricing
          </a>
        </div>
      </section>

      {/* Product preview carousel: rotating screenshots in a contained 16:9 frame. */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-16 sm:pt-20">
        <PreviewCarousel />
      </section>

      {/* Stack strip: quiet reassurance that the tooling is familiar, not a logo wall. */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 sm:pt-20">
        <p className="text-center text-sm text-muted-foreground">Built on tools you already know</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-medium text-foreground/70">
          {stack.map((tool) => (
            <li key={tool.name} className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                <path d={tool.path} />
              </svg>
              <span>{tool.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Features: an open grid, hierarchy from spacing and type, not bordered cards. */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything wired, nothing generic
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            The starter makes the decisions once, so each product builds features instead of
            boilerplate.
          </p>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                <FeatureIcon>{feature.icon}</FeatureIcon>
              </div>
              <h3 className="mt-5 font-medium text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles: a banded section for rhythm, the page is not one flat white scroll. */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              One system, from the first route onward
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              The starter sets the conventions so every page stays consistent as the product
              grows, instead of drifting screen by screen.
            </p>
          </div>
          <dl className="mt-14 grid gap-10 text-left sm:grid-cols-3">
            {foundations.map((item) => (
              <div key={item.title}>
                <dt className="font-medium text-foreground">{item.title}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing CTA: a high-contrast band so the page ends on a clear next step. */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="rounded-2xl bg-foreground px-8 py-14 text-center text-background sm:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Start your next product on a foundation that holds.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-background/70">
            Scaffold once, then build features with the conventions already in place.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className={cn(buttonVariants({ variant: 'inverse', size: 'lg' }), 'w-full sm:w-auto')}
            >
              Get started
            </a>
            <a
              href="/features"
              className={cn(buttonVariants({ variant: 'inverseOutline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              See features
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

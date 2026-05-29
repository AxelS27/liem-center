# Frontend

> Stack: Next.js (App Router) · React · TypeScript · Tailwind · Supabase.
> Open this for any `apps/web` work. Goal: ship something that feels **professionally designed and human-made - not a generic AI site** (but still modern and sharp).

## Design Craft (read first)

The default failure mode of AI-built UIs is "generic." Don't ship that. The goal is a real product made by humans: calm, intentional, production-ready. Prioritize clarity, restraint, consistency, usability, and readability over decoration.

**Two tests to keep applying:** if a screen could be any AI demo, it is not done. If an element exists only to look "cool", it should not exist. Every visual element needs a reason.

**Target vibe:** a real product company website designed by experienced frontend engineers and product designers. It should feel structured, editorial, balanced, calm, professional, trustworthy, scalable, and production-ready.

### Forbidden patterns (the AI tells)

Do not use:
- Default violet/indigo gradients, glassmorphism, glow, or blur as decoration.
- Random horizontal dividers or decorative separators with no functional purpose.
- Emoji as UI/section markers, or excessive uppercase micro-labels.
- Cinematic or floating decorative text; fake futuristic styling.
- Decorative dual-colored headlines, split-color phrases, or mixed heading colors without a system.
- Decorative numbering like [01], [02].
- Random serif-italic fonts dropped in "for contrast".
- Untouched shadcn defaults (looks like every other demo).
- Symmetric filler card grids and centered-everything landing pages.
- Oversized hero sections, excessive empty space, or layouts where every section is perfectly centered.
- Floating UI elements, random cards, badges, and panels that do not carry real information.
- Fake dashboard aesthetics, Dribbble-style visual overload, experimental layouts with no UX purpose.
- Fade-in-on-everything motion, gratuitous parallax, constantly moving elements.
- Generic portfolio aesthetics: tiny centered labels, decorative rules, large type paired with thin filler copy, and vague skill cards.

### Do instead

- **Have an identity.** Commit to a real palette, a deliberate type scale, and a consistent spacing rhythm as design tokens, not Tailwind defaults sprinkled ad-hoc.
- **Customize components.** shadcn/ui is a starting point, not the look. Tune radius, weight, density, and color so it does not read as "default shadcn."
- **Keep typography stable.** One or two font families at most. No random font mixing, no decorative or serif-italic-for-aesthetics switches. Build hierarchy with spacing, weight, and size.
- **Lay out with structure.** Use a proper responsive grid, strong alignment, and clear section flow. Whitespace should create hierarchy; it should not become dead empty space.
- **Use asymmetry intentionally.** Avoid centering every section. A page can feel balanced while using offset columns, editorial rhythm, and varied section density.
- **Earn every effect.** Subtle, fast motion that supports usability. No heavy animation libs for a hover, no cinematic transitions. Users should notice smoothness, not the animation.
- **Respect hierarchy and whitespace.** One clear focal point per screen, intentional alignment, generous spacing. Polish over decoration.
- **Accessibility is craft.** Real focus states, sufficient contrast, keyboard paths. Pros do this, and it reads as human.

### Layout Checks

- Every section must answer: what is this for, what should the user notice, and what comes next?
- Cards must contain meaningful information or actions. If a card exists only to fill a grid, remove it.
- Keep borders, shadows, corner radius, and hover states restrained and consistent.
- Test mobile and desktop for stable spacing, readable line lengths, and no awkward empty zones.
- Prefer real product references and mature design systems over AI-generated landing page patterns.

## App Structure & Page Flow

A first-time visitor lands on a real **landing page**, not a login wall. This is the single most common AI mistake: given a PRD, agents wire `/` straight to `/signin`. Don't.

- **`/` is a public landing page.** It explains the product and links to sign in / get started. Never auto-redirect an unauthenticated visitor from `/` to the auth pages.
- **Auth pages** (`/signin`, `/signup`) are reachable *from* the landing page, not forced before it.
- **The app itself** (dashboard, account, anything user-specific) lives behind auth. **Only these protected routes** redirect to sign in when the visitor is signed out.

Every page ships with navigation chrome. There are two layouts:

- **Public layout** wraps the landing page and other marketing/public routes: a **navbar** (logo, primary links, sign in / get started) and a **footer** (product links, legal, copyright) on every page.
- **App layout** wraps signed-in routes: a persistent shell (top bar or sidebar) with the user menu and primary app navigation.

**Do not ship a page with no navigation.** A bare screen with no navbar and no footer is the AI tell that there was no real information architecture behind it.

## Theming & Color

All color lives in **one file**: `apps/web/src/styles/globals.css`. It is the single source of truth, so retheming or adding a brand is a one file change.

- Colors are **semantic CSS custom properties** (`--background`, `--primary`, `--muted`, ...), not raw values scattered through components.
- **Ship one theme first.** The active theme is defined in `:root` (light by default). A dark theme (`.dark`) is provided commented out in `globals.css`; enable it only when the product actually needs dark mode. Do not generate both on day one.
- Because every theme uses the **same token names** with different values, adding a second theme later never touches a component.
- Components reference **tokens only** (`bg-background`, `text-foreground`, `border-border`). Never hardcode hex, and never use raw palette classes like `bg-zinc-900`.
- One `--radius` knob controls roundness across the UI.

Wiring (done once, when the app is scaffolded):

1. Import `globals.css` in the root layout.
2. In `tailwind.config.ts`, set `darkMode: 'class'` and map the tokens to Tailwind colors:

   ```ts
   theme: {
     extend: {
       colors: {
         background: 'hsl(var(--background))',
         foreground: 'hsl(var(--foreground))',
         border: 'hsl(var(--border))',
         primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
         // same pattern for secondary, muted, accent, destructive, card, popover
       },
       borderRadius: {
         lg: 'var(--radius)',
         md: 'calc(var(--radius) - 2px)',
         sm: 'calc(var(--radius) - 4px)',
       },
     },
   }
   ```

3. **Only when you add a second theme:** uncomment the `.dark` block in `globals.css`, then toggle by adding or removing `class="dark"` on `<html>`. Use `next-themes` (`<ThemeProvider attribute="class">`) for system plus manual switching. A single-theme app skips this step entirely, do not add `next-themes` for one theme.

To rebrand: edit the token values in `:root` in `globals.css`. That is the only file you touch.

## Content & Copy

- All user facing copy is in **clear, standard English**.
- Use **conventional, well known terms** for features. Do not invent names or jargon for things that already have a common name (a "Sign in" button is "Sign in", not a coined word).
- **No em dash** in UI copy or content. Use a comma, a period, a plain hyphen, or rephrase. Keep punctuation clean and standard.
- **Minimize emoji** and skip decorative symbols. Use an emoji only when it carries real meaning, never as decoration or a section marker.
- Avoid AI-sounding marketing language, fake technical terminology, and meme-style writing. Keep wording concise, natural, and familiar.
- Avoid generic phrases such as "crafting digital experiences", "building with passion", "clarity and purpose", and "innovative solutions".
- Do not use placeholder content, fake feature names, or invented labels when normal product language would be clearer.

## Internationalization (i18n)

**Ship one language first: English.** Don't generate `en` + `id` (or any second language) on day one. But still centralize text from the start, so adding a language later is a one-file job instead of a rewrite.

- Text lives in `apps/web/src/i18n/locales/<locale>.json`, one file per language. Day one, that is just `en.json`.
- **English (`en`) is the default and the source of truth.** No hardcoded strings in components, even in a single-language app.
- Components read text through the dictionary, typed from `en.json`, so a missing or renamed key becomes a type error. With one locale you pass `defaultLocale` directly, no `[lang]` route needed:

  ```tsx
  import { getDictionary } from '@/i18n/dictionaries';
  import { defaultLocale } from '@/i18n/config';

  export default async function Page() {
    const t = await getDictionary(defaultLocale);
    return <h1>{t.app.tagline}</h1>;
  }
  ```

- **Format, don't concatenate.** Numbers, currency, and dates come from `Intl`, never string building. IDR has no decimal places, so `Rp 1.294,5` is a bug: `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(1294.5)` gives the correct `Rp 1.295`. Same for dates via `Intl.DateTimeFormat`.
- Keep each full phrase as one key. Do not build sentences by concatenating translated fragments, since other languages order words differently.

**Adding a language later** (only when you actually need it):

1. Copy `en.json` to the new locale (e.g. `id.json`), translate the values, keep the keys identical.
2. Register it in `config.ts` (`locales`, `localeNames`) and add its loader in `dictionaries.ts`.
3. Move pages under `app/[lang]/...` and read the locale from `params.lang`.
4. Add a small middleware (redirect `/` to the default locale, optionally honor `Accept-Language`) and a switcher that links to the current path under the other locale.

A single-locale app needs none of step 3 or 4.

## Rendering Strategy

- **Server Components by default.** Reach for `'use client'` only when you actually need interactivity, browser APIs, local state, animation, or realtime.
- Don't make a whole page client-side for one interactive widget - push the client boundary down to the smallest leaf.

## Data Fetching

- Fetch on the **server** whenever possible; keep client-side fetching minimal.
- No duplicate server + client requests for the same data.
- Use streaming / progressive rendering where it improves perceived speed.
- Use `loading.tsx` with designed **skeletons** (not bare spinners).

## Code Splitting

- Lazy-load heavy / non-critical features: charts, editors, maps, modals, media viewers, admin tools.
- Don't pull large libraries into the initial bundle unless they're needed above the fold.

## Performance

Optimize for, in order: (1) fast initial load, (2) responsive interactions, (3) smooth navigation, (4) minimal hydration, (5) small bundle.

Avoid: unnecessary client state, deeply nested providers, excessive re-renders, animation libs everywhere, heavy deps for simple tasks.

## Images

- Use `next/image` for anything non-trivial; lazy-load below-the-fold media.
- Compress assets, no oversized files, and set dimensions to avoid layout shift.

## States, Errors & Responsiveness

Design every state, not just the happy path. A screen that only handles "data loaded successfully" is half-built.

**Empty states.** When there is no data yet (no transactions, no budgets, no reports, empty search results), show a calm screen with a one-line explanation of what goes here and a clear action button to add the first item. Never a blank area or a raw "no data" string.

**Error states.** Handle failed network requests, invalid form input, missing data, server errors, and empty filter/search results. Rules:
- Plain language, no stack traces, codes, or jargon. Say what happened and what to do next.
- Give a way forward: a retry button, a link back, or a fix-the-input hint.
- Validate forms **inline**, next to the field, as the user goes. Don't dump every error at the top after submit.

**Loading states.** Use `loading.tsx` with designed **skeletons** that mirror the real layout, not bare spinners. Transitions stay subtle and fast.

**Responsive behavior: adapt, don't shrink.** Layout should change behavior across breakpoints, not just scale down.
- Sidebar collapses to a drawer or bottom nav on mobile; the navbar becomes a menu.
- Multi-column card grids stack to one column; tables become cards or scroll deliberately, never overflow the viewport.
- Charts re-flow to fit; touch targets stay at least ~44px.
- Avoid the tells: a squeezed desktop layout, tiny tap targets, and tables that overflow the screen.
- Test every breakpoint mobile to desktop.

## Production Mindset

Build for **stable, scalable, maintainable, production-ready** frontend delivery. Not experimental, not overengineered.

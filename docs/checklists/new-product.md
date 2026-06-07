# New Product Checklist

> Complete this before writing a single line of feature code.
> This template is already scaffolded — use this list to initialize a real product on top of it.

---

## Step 1 — Fill the Product Docs (in order)

```
□ docs/PRD.md            — product scope, users, problem, non-goals
□ docs/FEATURES.md       — feature modules and what each one does
□ docs/ARCHITECTURE.md   — update module map if the product adds new domains
□ docs/UI_UX.md          — fill from user's design brief and selected references
                            (palette, typeface, layout model, nav model, routes)
□ docs/REFERENCES.md     — add 2–5 real reference sites for the product vertical
□ docs/verticals/*.md    — read the matching playbook if the product has a known vertical
                            (ECOMMERCE.md, etc.)
□ docs/API.md            — define endpoints before building them
□ docs/BACKEND.md        — update if the product adds custom backend rules
□ docs/DATABASE.md       — define schema, RLS rules, storage buckets
□ docs/PAYMENTS.md       — fill only if the product takes payments (Midtrans)
□ docs/PROGRESS.md       — generate from FEATURES.md + UI_UX.md; this is the build map
```

---

## Step 2 — Environment Setup

```
□ Copy .env.example to .env and fill all required variables
□ Confirm Supabase project is created and URL + anon key are set
□ Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are in .env
□ Confirm SUPABASE_SERVICE_ROLE_KEY is in .env (server-only, never expose to browser)
□ If payments: NEXT_PUBLIC_MIDTRANS_CLIENT_KEY and MIDTRANS_SERVER_KEY in .env
□ If large AI: HUGGINGFACE_TOKEN in .env (server-only)
□ Run pnpm install and confirm no errors
□ Run pnpm dev and confirm both apps start
```

---

## Step 3 — Design System Init

```
□ Palette committed in apps/web/src/styles/globals.css
    □ :root block has all semantic tokens with deliberate product values
    □ Palette is NOT a default AI rotation (no violet/indigo, forest+cream, muted sage,
      dark-purple SaaS, teal-on-near-black, flat beige). See docs/FRONTEND.md.
    □ One accent color. Semantic colors (success, warning, destructive) are separate.
□ Typeface wired in apps/web/src/app/layout.tsx via next/font
    □ Font variable bound to --font-sans in the html className
    □ tailwind.config.ts maps font-sans to var(--font-sans)
    □ globals.css body has font-family: var(--font-sans)
□ --radius token set in globals.css to match product's roundness feel
□ prefers-reduced-motion rule exists in globals.css:
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
```

---

## Step 4 — Navigation & Routes

```
□ Primary nav links all go to real pages/routes (no same-page anchor jumps in the primary navbar)
□ Every primary nav item has an active state (aria-current="page" + visible style)
□ Mobile and desktop nav show the same active state
□ Nav is sticky (sticky top-0) with a visible surface treatment (token background + border)
□ Public, auth, and app contexts cross-link correctly:
    □ Public nav → sign in / get started
    □ App nav → clear path back to public/product home
    □ Auth nav → back to landing, and sign in ↔ sign up
□ 404 page exists and is designed (not a bare Next.js default)
□ All primary routes listed in docs/UI_UX.md exist as pages
```

---

## Step 5 — UI Primitives Check

Before building any feature, verify the shared primitives in packages/ui work for this product:

```
□ Button — all variants use the product palette (read the variant classes). Verify:
    □ primary, secondary, ghost, destructive variants
    □ All sizes (sm, md, lg)
    □ Loading state (spinner replaces text, width locked)
    □ Disabled state (50% opacity, not-allowed cursor)
    □ Focus ring visible on keyboard navigation
□ Inputs — confirm shadcn Input works with product tokens (border, focus ring, error state)
□ Skeleton — shimmer animation defined; shape matches content for at least one screen
□ Empty state — EmptyState or PlaceholderPage component exists
□ Toasts — toast/notification system exists (sonner or shadcn)
□ Icons — lucide-react available via packages/ui; no new icon library added
```

---

## Step 6 — Database & Backend Init (if applicable)

```
□ Supabase project schema matches docs/DATABASE.md data model
□ Row Level Security enabled on every table
□ Initial migration committed to supabase/migrations/
□ packages/types/src/database.types.ts generated (pnpm db:types)
□ apps/server health check route responds at GET /health
□ All route prefixes and response shapes match docs/API.md
□ Zod schemas in packages/types validate all inputs/outputs
□ Service role key is never referenced in apps/web code
```

---

## Step 7 — Pre-Feature Validation

```
□ pnpm dev runs without errors
□ pnpm lint passes
□ pnpm typecheck passes
□ Landing page (/) is a real product landing page, not the starter wiring example
□ Landing page hero is not card-wrapped and has no min-h-screen/oversized top padding that would push it below the fold
□ No hard mid-screen section dividers (read page.tsx: no border-t/border-b band with large blank padding sitting between sections)
□ Footer has visible treatment (border-t, surface, brand, links, copyright)
□ Every route listed in docs/UI_UX.md compiles and loads without error (pnpm build)
□ No page shows the starter "WIRING EXAMPLE" content
□ pnpm verify passes
```

---

**Only after all boxes above are checked: start building features from docs/PROGRESS.md.**

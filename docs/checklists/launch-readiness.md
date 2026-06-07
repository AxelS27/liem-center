# Launch Readiness Checklist

> Complete this before going live.
> Every unchecked box is a known risk you are accepting.

---

## Functionality

```
□ All features work end-to-end in the production build (pnpm build passes)
□ All critical user journeys tested (E2E or manual walkthrough)
□ All forms validate inline and show field-level errors
□ All error states display with plain language (no stack traces or "error 503" to users)
□ All empty states display with an icon + explanation + action
□ Loading states (skeletons) appear on slow connections
□ Pagination, search, and filters work correctly
□ Authentication flow works: sign in, sign out, session expiry, protected route redirect
□ Protected routes redirect unauthenticated users to sign in
□ Sign in / sign up / forgot password all work end-to-end
□ 404 page is designed (not the bare Next.js default)
□ No route returns a blank screen or unhandled error
```

---

## Performance

```
□ Lighthouse Performance score ≥ 90 on the landing page
□ First Contentful Paint < 1.5s on a 4G connection
□ Largest Contentful Paint < 2.5s on a 4G connection
□ Cumulative Layout Shift < 0.1 (no element jumping on load)
□ No console.log statements in production code
□ No console errors in the production build
□ Images use next/image with correct sizes prop and no layout shift
□ Images are WebP or optimized; no oversized source files
□ Font loaded via next/font (no external CDN round-trip, no FOIT)
□ Heavy/non-critical components are lazy-loaded (React.lazy / dynamic import)
□ List pages with > 100 items use virtualization (@tanstack/virtual)
□ pnpm audit shows no CRITICAL or HIGH vulnerabilities
```

---

## Security

```
□ No hardcoded API keys, passwords, or secrets in source code
□ .env is git-ignored; only .env.example is committed
□ All environment variables are set in the production deployment platform
□ SUPABASE_SERVICE_ROLE_KEY is only referenced in apps/server, never in apps/web
□ Supabase Row Level Security is enabled on every table
□ All user inputs are validated with Zod at the route handler level before any logic runs
□ dangerouslySetInnerHTML is not used without DOMPurify sanitization
□ External URLs from user input are validated for safe protocols
□ HTTPS is enforced (no HTTP fallback)
□ If payments: Midtrans webhook verified by signature hash, not Bearer auth (see docs/PAYMENTS.md)
```

---

## UI Quality

```
□ No page looks AI-generic. Passes the "could this be any AI demo" test — if yes, redesign
□ Palette is deliberate and product-specific (not violet/indigo, forest+cream, muted sage, etc.)
□ A real typeface is wired via next/font and bound to --font-sans
□ Brand/logo in navbar is a real approved asset or the template icon, not an invented mark
□ Every interactive component has all required states (hover, focus, active, loading, disabled, error)
□ All animations ≤ 800ms. No transitions on layout properties (width, height, top, left)
□ prefers-reduced-motion rule is active in globals.css
□ No page is "card soup" — hierarchy comes from type/spacing/bands before cards
□ No paper-prototype feel — no pale bordered rectangles carrying the entire design
□ Hero fits the first viewport at ~720px desktop height
□ Primary navbar is sticky with a visible surface treatment
□ Footer has a visible treatment on every route (border-t, brand, links, copyright)
□ All primary nav links go to real pages (no same-page anchor jumps in primary nav)
□ Active nav link has aria-current="page" and a visible active state on desktop and mobile
□ Empty, loading, and error states are designed for every data-driven view
□ No public page exposes implementation details (Supabase, Midtrans, Hono names, API latency, etc.)
□ No public/customer page shows audience-mismatched data (admin KPIs, seller stats, etc.)
□ Rendered and self-reviewed at mobile, 1366x768, 1440x900, and 1920x1080
```

---

## Accessibility

```
□ Lighthouse Accessibility score ≥ 90
□ All images have alt text (empty string for purely decorative images)
□ All form inputs have associated <label> elements (htmlFor)
□ Color is never the only way information is communicated (always paired with text or icon)
□ Touch targets ≥ 44×44px on mobile
□ All modals/dialogs trap focus and can be dismissed with Escape
□ Focus rings are visible on every interactive element (keyboard tab test)
□ Dynamic content changes use aria-live where appropriate (toasts, status messages)
□ aria-current="page" is set on active nav links
□ No user-scalable=no in viewport meta (never disable pinch-to-zoom)
□ Page title updates on navigation (next/head or metadata API)
```

---

## Cross-Browser & Device

```
□ Chrome (latest) — desktop
□ Firefox (latest) — desktop
□ Safari (latest) — desktop and iOS
□ Chrome — Android mobile (375px viewport)
□ No horizontal scroll on any viewport width (check at 375px)
□ Touch targets work on mobile
□ Dark mode (if implemented) works across all browsers
□ System prefers-color-scheme respected (if dark mode is implemented)
```

---

## Docs & Config

```
□ docs/PROGRESS.md is current (all shipped features marked done)
□ docs/DECISIONS.md has entries for all major architectural choices made
□ docs/API.md matches the actual implemented endpoints
□ docs/DATABASE.md data model catalog matches the actual schema
□ .env.example has all required variables documented with comments
□ README (or HOW_TO_USE_THIS_TEMPLATE.md) is accurate for the product
```

---

## Deployment

```
□ Production environment variables are set in the deployment platform
□ Database migrations have run against the production Supabase project
□ pnpm build succeeds with no errors
□ pnpm verify passes
□ A rollback path is documented (previous deploy or git ref)
□ Post-deployment smoke test completed on the live URL
```

---

**Every unchecked box is a known defect. Do not call it "minor" — fix it or document the accepted risk.**

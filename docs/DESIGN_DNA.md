# Design DNA

> Read this before any UI work. Short on purpose.
> Detailed rules → `docs/FRONTEND.md`. Product-specific direction → `docs/UI_UX.md`.

**Build on the default starter — do not start from scratch.**

The existing code in `apps/web/` is the foundation. Extend and adapt it; do not replace it
with a fresh generation. The layout structure, section rhythm, component patterns, token
wiring, and nav/footer shell are already correct — they are the starting point, not a
reference to look at and then ignore.

What you change per product:
- `globals.css` — swap the accent/brand color. Keep background white.
- `app/page.tsx` — replace content, sections, and copy to fit the product. Keep the
  open-band composition unless `docs/UI_UX.md` explicitly calls for a different layout.
- `components/shared/site-header.tsx` — update nav links and logo to match the product.
- `components/shared/site-footer.tsx` — update links and brand name.

What you do not change without a clear reason from `docs/UI_UX.md`:
- The white background and neutral surface tokens
- The sticky nav with surface treatment
- The open-band section pattern (hero, features, CTA band, footer)
- The `next/font` + `--font-sans` wiring
- The footer structure

If it could be from any AI demo site, it is not done.

---

## Palette

- All color from tokens in `globals.css` — never raw hex, never raw Tailwind palette classes
- **Background stays white.** `--background` must stay near-white and neutral — `0 0% 100%`
  or a very slight cool/neutral tint. Never warm, never cream, never beige. The clean white
  surface is the foundation of the starter's feel; warming it is the #1 way to break it.
- **What you change = the accent/brand color** (`--primary`, `--brand`, `--ring`). Surfaces,
  backgrounds, borders, and muted tones stay in the neutral white/gray family.
- **Forbidden feels** (current AI rotation — not a complete blocklist):
  - warm cream / beige background (`--background` with any warmth)
  - violet / indigo gradient
  - warm orange + cream
  - forest green + cream editorial
  - muted sage
  - dark-purple "SaaS" gradient
  - teal on near-black
- One accent color. Semantic colors (success, warning, destructive) are separate from brand

## Typeface

- Wire a modern sans via `next/font` → `--font-sans` → `font-sans` in Tailwind
- Leaving it unset = browser serif fallback = instant AI tell
- Max 3 weights: **400** (body) · **500 or 600** (medium) · **700** (bold)
- Hierarchy from size and weight, not decorative font switches

## Composition — the most violated rule

The starter uses **open sections as the default**. Cards earn their place.

| Context | Use |
|---|---|
| Hero, marketing sections, feature grids, promo bands | Open bands — no card wrapper |
| Product listings, data panels, dialogs, repeated items | Cards are appropriate |
| Stats / KPI strips on public pages | Only if they help the user's decision |

**Hard stops:**
- Hero content must not be wrapped in a card or panel
- Every section boxed in `bg-card border border-border rounded-lg` = card soup = fail
- Pale bordered rectangles are not a design system

## Navigation

- `sticky top-0` with visible surface: `bg-background border-b border-border backdrop-blur`
- Route-aware active state + `aria-current="page"` on every nav
- Mobile and desktop nav must show the same active link

## First viewport

- Hero headline + copy + CTA visible without scrolling at ~720px desktop height
- Navbar must not push hero below the fold
- Achieve by restraining padding — not by forcing `min-h-screen` (lint blocks it)

## Footer

- `border-t border-border` + brand + link columns + copyright line
- Not two faint lines of muted text floating at the bottom of the page

## Spacing

4px grid only — valid: `4 8 12 16 20 24 32 40 48 64 80 96px`
Arbitrary values like `p-[10px]` `gap-[14px]` `mt-[22px]` are violations.

## Interactions

- Every interactive element needs: hover (150ms) · focus ring (2px accent + 2px offset) · active (scale 0.98)
- Loading → skeleton matching content shape, not a spinner
- Animate `transform` and `opacity` only — never `width` `height` `top` `left`
- Max 800ms on any animation. Always respect `prefers-reduced-motion`

## Copy

- Plain English, specific, conventional terms
- No em dash, no decorative emoji, no AI-marketing filler
- No lorem ipsum, no "Feature Title", no "User Name" in rendered UI

---

## Self-check before calling done

Render the page, then check:

```
[ ] Checked at: mobile (375px), 1366×768, 1440×900, 1920×1080
[ ] Page does not look like it could be from any AI demo site
[ ] Palette is deliberate — not one of the forbidden feels above
[ ] Hero fits first viewport, not card-wrapped
[ ] Nav is sticky, has surface, active state visible
[ ] Footer has real structure — not floating muted text
[ ] No card soup — most sections are open bands
[ ] All interactive elements have hover/focus/active states
[ ] pnpm verify passes
[ ] pnpm lint passes (catches min-h-screen, raw hex, palette classes)
```

A green lint does not mean the UI looks human-made. The render check is the real gate.
